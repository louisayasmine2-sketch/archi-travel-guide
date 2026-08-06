"""Read-only link and image checker over the content stores (CLAUDE.md section 6).

Checks:
  image_missing            — a /images/... reference with no file under
                             frontend/public/ (would render broken on the site)
  hotlinked_image          — an image whose src points at an external host
                             (licensing exposure; banned by the standard)
  tracking_param           — any tracking or affiliate parameter on an outbound
                             URL (aid, tag, ref, utm_*, ...). None may ship
                             unless supplied explicitly in-session.
  direct_commercial_link   — an outbound link straight to a booking platform
                             instead of the /go/{slug} internal redirect
  internal_link_broken     — an internal link in article content that resolves
                             to no real route (not an article, static route,
                             or _redirects entry): it would silently land on
                             the SPA's 404 page
  go_slug_unresolved       — a /go/{slug} reference (in the content stores or
                             in frontend/src) with no matching entry in
                             frontend/public/_redirects; it would silently
                             fall through to the SPA's 404 page
  go_destination_tracking_param — a /go/ destination in _redirects carrying a
                             tracking or affiliate parameter (none may ship
                             unless supplied explicitly in-session)
  url_broken / url_error   — every outbound URL (including /go/ destinations)
                             is requested and anything that does not answer
                             2xx/3xx is reported (skipped entirely with
                             --offline). url_broken is a confirmed HTTP
                             failure; url_error means the URL could not be
                             verified from this machine (DNS, TLS, proxy) and
                             must be re-checked, not assumed fine.
  component_hotlinked_image — an external image URL in a page component,
                             shared component, or data file under
                             frontend/src (the content stores only cover
                             article bodies; 18 Unsplash hotlinks shipped in
                             components before this check existed)
  component_image_missing  — a /images/... reference in frontend/src with no
                             file under frontend/public/

/go/ entries defined but referenced nowhere are listed informationally — a
dead entry is not broken, but it is worth knowing about. Internal links whose
target article exists but is SCHEDULED for a future publish date are also
informational (they resolve the day the target goes live).

This script never writes to content. If it reports something, fix the content.
Run with:  python tools/check_links_and_images.py  [--offline] [--json]
"""

import argparse
import json
import os
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request

import re

from content_store import PUBLIC_DIR, REPO_ROOT, load_all

REDIRECTS_FILE = REPO_ROOT / "frontend" / "public" / "_redirects"
SRC_DIR = REPO_ROOT / "frontend" / "src"
GO_REF = re.compile(r"/go/[a-z0-9-]+")

TRACKING_PARAMS = {
    "aid", "tag", "ref", "ref_", "affiliate_id", "aff", "aff_id", "affid",
    "partner", "partner_id", "camp", "cmpid", "gclid", "fbclid", "mc_cid",
}
TRACKING_PREFIXES = ("utm_",)

# Booking/OTA hosts that must only ever be reached via /go/{slug}.
COMMERCIAL_HOSTS = (
    "booking.com", "hotels.com", "expedia.", "agoda.", "airbnb.", "vrbo.",
    "getyourguide.", "viator.", "tiqets.", "klook.", "civitatis.",
    "omio.", "thetrainline.", "trainline.", "rentalcars.", "discovercars.",
    "kayak.", "skyscanner.", "hostelworld.",
)

BANNED_IMAGE_HOSTS = ("pbs.twimg.com",)

IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg")

# Hosts that only ever serve image files, so a URL pointing at them is an
# image load even when the path carries no file extension (Unsplash-style).
IMAGE_CDN_HOSTS = (
    "images.unsplash.com", "pbs.twimg.com", "upload.wikimedia.org",
    "cf.bstatic.com", "a0.muscache.com", "images.trvl-media.com",
)

# Attribution/credit PAGES about an image — links to these are citations,
# not image loads, even though some paths end in .jpg (commons File: pages).
CREDIT_PAGE_HOSTS = ("commons.wikimedia.org", "unsplash.com", "creativecommons.org")

# Deliberate exceptions: Leaflet map tiles are fetched from the OSM tile
# service by design (attribution rendered on the map); they are not content
# images and cannot be self-hosted.
ALLOWED_EXTERNAL_IMAGE_HOSTS = ("tile.openstreetmap.org",)

TIMEOUT = 20
USER_AGENT = "Mozilla/5.0 (compatible; ArchiContentAudit/1.0; +https://affittacameregliarchi.com)"


def _host(url):
    try:
        return (urllib.parse.urlsplit(url).hostname or "").lower()
    except ValueError:
        return ""


def _is_commercial(host):
    """Entries ending in '.' are brands matched across TLDs ('expedia.' matches
    expedia.com/expedia.co.uk); full domains match exactly or as a subdomain."""
    for entry in COMMERCIAL_HOSTS:
        if entry.endswith("."):
            if host.startswith(entry) or ("." + entry) in ("." + host):
                return True
        elif host == entry or host.endswith("." + entry):
            return True
    return False


def _ssl_context():
    cafile = os.environ.get("REQUESTS_CA_BUNDLE") or os.environ.get("SSL_CERT_FILE")
    return ssl.create_default_context(cafile=cafile)


def check_url(url, ctx):
    """Return (ok, detail). Follows redirects; retries 405/403-on-HEAD with GET."""
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(url, method=method, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
                return True, f"{resp.status}"
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in (403, 405, 501):
                continue  # some servers reject HEAD; verify with GET
            return False, f"HTTP {e.code}"
        except Exception as e:  # DNS, TLS, timeout — unverifiable, still a finding
            if method == "HEAD":
                continue
            return False, f"{type(e).__name__}: {e}"
    return False, "unreachable"


APP_ROUTES_FILE = REPO_ROOT / "frontend" / "src" / "App.js"
SITEMAP_FILE = REPO_ROOT / "frontend" / "public" / "sitemap.xml"
INTERNAL_LINK = re.compile(r"(?:\]\(|href=\")(/(?!go/|images/)[^)\"#?\s]*)")


def _norm(p):
    return p.rstrip("/") or "/"


def load_valid_routes(articles, go_table):
    """Every internal path that actually resolves: router routes and redirect
    targets from App.js, _redirects sources and internal targets, sitemap
    entries, and every article's own route."""
    valid = set()
    if APP_ROUTES_FILE.is_file():
        src = APP_ROUTES_FILE.read_text(encoding="utf-8")
        for m in re.finditer(r'path="([^"*:]+)"', src):
            valid.add(_norm(m.group(1)))
        for m in re.finditer(r'to="([^"]+)"', src):
            valid.add(_norm(m.group(1).split("?")[0]))
    if REDIRECTS_FILE.is_file():
        for line in REDIRECTS_FILE.read_text(encoding="utf-8").splitlines():
            parts = line.strip().split()
            if len(parts) >= 2 and parts[0].startswith("/") and not parts[0].startswith("#"):
                if "*" not in parts[0]:
                    valid.add(_norm(parts[0].split("?")[0]))
                if parts[1].startswith("/") and "*" not in parts[1]:
                    valid.add(_norm(parts[1].split("?")[0]))
    if SITEMAP_FILE.is_file():
        for m in re.finditer(r"<loc>([^<]+)</loc>", SITEMAP_FILE.read_text(encoding="utf-8")):
            path = re.sub(r"^https?://[^/]+", "", m.group(1))
            if path:
                valid.add(_norm(path))
    for art in articles:
        if art.route:
            valid.add(_norm(art.route))
    valid.update(_norm(p) for p in go_table)
    return valid


def collect_internal_links(article):
    return sorted({_norm(m) for m in INTERNAL_LINK.findall(article.text) if len(m) > 1})


def load_go_redirects():
    """slug path -> destination URL, from the /go/ lines in _redirects."""
    table = {}
    if not REDIRECTS_FILE.is_file():
        return table
    for line in REDIRECTS_FILE.read_text(encoding="utf-8").splitlines():
        parts = line.strip().split()
        if parts and not parts[0].startswith("#") and parts[0].startswith("/go/") and len(parts) >= 2:
            table[parts[0]] = parts[1]
    return table


def collect_go_refs(articles):
    """Every /go/{slug} referenced in the content stores or in frontend/src,
    mapped to the places that use it."""
    refs = {}
    for art in articles:
        for ref in set(GO_REF.findall(art.text)):
            refs.setdefault(ref, []).append(f"{art.store}:{art.ident}")
    for path in sorted(SRC_DIR.rglob("*")):
        if path.suffix not in (".js", ".jsx") or not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        for ref in set(GO_REF.findall(text)):
            refs.setdefault(ref, []).append(str(path.relative_to(REPO_ROOT)))
    return refs


STRING_LIT = re.compile(r"""["'`]([^"'`\n]+)["'`]|url\(\s*([^)"'\s]+)\s*\)""")
# articles.js is a content store: its bodies (including commons credit links)
# are already parsed and checked article-by-article via content_store.
COMPONENT_SCAN_EXCLUDE = {SRC_DIR / "data" / "articles.js"}


def _is_image_load(url):
    host = _host(url)
    if any(host == h or host.endswith("." + h) for h in ALLOWED_EXTERNAL_IMAGE_HOSTS):
        return False
    # CDN hosts before credit pages: images.unsplash.com is a load host even
    # though unsplash.com itself only serves credit pages.
    if any(host == h or host.endswith("." + h) for h in IMAGE_CDN_HOSTS):
        return True
    if any(host == h or host.endswith("." + h) for h in CREDIT_PAGE_HOSTS):
        return False
    path = urllib.parse.urlsplit(url).path.lower()
    return path.endswith(IMAGE_EXTS)


def scan_component_images():
    """Image references in frontend/src outside the content stores: external
    image loads are hotlinks; local /images/... paths must exist on disk."""
    findings = []
    for path in sorted(SRC_DIR.rglob("*")):
        if path.suffix not in (".js", ".jsx", ".css", ".json") or not path.is_file():
            continue
        if path in COMPONENT_SCAN_EXCLUDE:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        rel_file = str(path.relative_to(REPO_ROOT))
        seen = set()
        for m in STRING_LIT.finditer(text):
            s = (m.group(1) or m.group(2) or "").strip()
            if not s or s in seen or s.startswith("data:"):
                continue
            seen.add(s)
            if s.startswith(("http://", "https://")):
                if _is_image_load(s):
                    findings.append({
                        "check": "component_hotlinked_image",
                        "detail": s,
                        "used_by": [rel_file],
                    })
            elif s.startswith("/images/"):
                rel = urllib.parse.unquote(s.split("?")[0].split("#")[0]).lstrip("/")
                if not (PUBLIC_DIR / rel).is_file():
                    findings.append({
                        "check": "component_image_missing",
                        "detail": s,
                        "used_by": [rel_file],
                    })
    return findings


def tracking_params_in(url):
    query = urllib.parse.urlsplit(url).query
    params = [k for k, _ in urllib.parse.parse_qsl(query, keep_blank_values=True)]
    return sorted({k for k in params if k.lower() in TRACKING_PARAMS or k.lower().startswith(TRACKING_PREFIXES)})


def static_findings(article):
    findings = []

    for ref in article.image_refs:
        # URL-decode (%20 etc.) before checking on disk
        rel = urllib.parse.unquote(ref).lstrip("/")
        if not (PUBLIC_DIR / rel).is_file():
            findings.append(("image_missing", ref))

    for src in article.external_image_srcs:
        host = _host(src)
        label = " (banned host)" if any(host.endswith(b) for b in BANNED_IMAGE_HOSTS) else ""
        findings.append(("hotlinked_image", src + label))

    for url in article.urls:
        bad = tracking_params_in(url)
        if bad:
            findings.append(("tracking_param", f"{url} -> {', '.join(bad)}"))
        if _is_commercial(_host(url)):
            findings.append(("direct_commercial_link", f"{url} — must go through /go/{{slug}}"))

    return findings


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--offline", action="store_true", help="skip live URL verification")
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    args = parser.parse_args()

    articles = load_all()
    report = []
    all_urls = {}  # url -> [article idents]
    for art in articles:
        findings = static_findings(art)
        for url in art.urls:
            all_urls.setdefault(url, []).append(f"{art.store}:{art.ident}")
        if findings:
            report.append({
                "store": art.store,
                "article": art.ident,
                "findings": [{"check": c, "detail": d} for c, d in findings],
            })

    # /go/ redirect integrity: every referenced slug must resolve, and no
    # destination may carry tracking parameters. Destinations join the
    # outbound-URL verification pass.
    go_table = load_go_redirects()
    go_refs = collect_go_refs(articles)
    go_report = []
    for ref, users in sorted(go_refs.items()):
        if ref not in go_table:
            go_report.append({
                "check": "go_slug_unresolved",
                "detail": f"{ref} has no entry in frontend/public/_redirects",
                "used_by": sorted(set(users)),
            })
    for slug_path, dest in sorted(go_table.items()):
        bad = tracking_params_in(dest)
        if bad:
            go_report.append({
                "check": "go_destination_tracking_param",
                "detail": f"{slug_path} -> {dest} ({', '.join(bad)})",
                "used_by": [],
            })
        all_urls.setdefault(dest, []).append(f"_redirects:{slug_path}")
    go_unused = sorted(p for p in go_table if p not in go_refs)

    # Internal links: every in-content path must resolve to a real route.
    valid_routes = load_valid_routes(articles, go_table)
    scheduled_routes = {_norm(a.route) for a in articles if a.route and not a.published}
    broken_internal = {}   # link -> [users]
    scheduled_internal = {}
    for art in articles:
        user = f"{art.store}:{art.ident}"
        for link in collect_internal_links(art):
            if link in valid_routes:
                if link in scheduled_routes:
                    scheduled_internal.setdefault(link, []).append(user)
                continue
            broken_internal.setdefault(link, []).append(user)
    internal_report = [
        {"check": "internal_link_broken", "detail": f"{link} resolves to no route", "used_by": sorted(set(users))}
        for link, users in sorted(broken_internal.items())
    ]

    component_report = scan_component_images()

    url_results = []
    if not args.offline:
        ctx = _ssl_context()
        for url in sorted(all_urls):
            ok, detail = check_url(url, ctx)
            if not ok:
                url_results.append({
                    "check": "url_broken" if detail.startswith("HTTP") else "url_error",
                    "url": url,
                    "detail": detail,
                    "used_by": sorted(set(all_urls[url])),
                })
            print(f"  {'ok' if ok else 'FAIL':<4} {detail:<24} {url}", file=sys.stderr)

    if args.json:
        print(json.dumps({
            "articles_scanned": len(articles),
            "urls_checked": 0 if args.offline else len(all_urls),
            "flagged": report,
            "go_findings": go_report,
            "go_unused": go_unused,
            "internal_findings": internal_report,
            "component_findings": component_report,
            "internal_scheduled": {k: sorted(set(v)) for k, v in scheduled_internal.items()},
            "url_failures": url_results,
        }, indent=2))
    else:
        print(f"\nScanned {len(articles)} articles; {sum(len(collect_internal_links(a)) for a in articles)} internal links "
              f"against {len(valid_routes)} routes; {len(go_refs)} /go/ references against "
              f"{len(go_table)} redirect entries; {len(all_urls)} distinct outbound URLs"
              + (" (not verified — --offline)" if args.offline else " verified") + ".\n")
        for entry in report:
            print(f"[{entry['store']}] {entry['article']}")
            for f in entry["findings"]:
                print(f"  - {f['check']}: {f['detail']}")
            print()
        for f in go_report:
            print(f"{f['check']}: {f['detail']}")
            for user in f["used_by"]:
                print(f"    used by {user}")
        for f in internal_report:
            print(f"{f['check']}: {f['detail']}")
            for user in f["used_by"]:
                print(f"    used by {user}")
        for f in component_report:
            print(f"{f['check']}: {f['detail']}")
            for user in f["used_by"]:
                print(f"    used by {user}")
        if go_unused:
            print("info — /go/ entries defined but referenced nowhere: " + ", ".join(go_unused))
        for link, users in sorted(scheduled_internal.items()):
            print(f"info — internal link to a SCHEDULED article (resolves at publish): {link} "
                  f"(from {', '.join(sorted(set(users)))})")
        for r in url_results:
            print(f"{r['check']}: {r['url']} ({r['detail']})")
            for user in r["used_by"]:
                print(f"    used by {user}")
        if not report and not go_report and not internal_report and not component_report and not url_results:
            print("No findings.")

    sys.exit(1 if (report or go_report or internal_report or component_report or url_results) else 0)


if __name__ == "__main__":
    main()
