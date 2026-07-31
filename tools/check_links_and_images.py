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
  url_broken / url_error   — every outbound URL is requested and anything that
                             does not answer 2xx/3xx is reported (skipped
                             entirely with --offline). url_broken is a
                             confirmed HTTP failure; url_error means the URL
                             could not be verified from this machine (DNS,
                             TLS, proxy) and must be re-checked, not assumed
                             fine.

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

from content_store import PUBLIC_DIR, load_all

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
        query = urllib.parse.urlsplit(url).query
        params = [k for k, _ in urllib.parse.parse_qsl(query, keep_blank_values=True)]
        bad = [k for k in params if k.lower() in TRACKING_PARAMS or k.lower().startswith(TRACKING_PREFIXES)]
        if bad:
            findings.append(("tracking_param", f"{url} -> {', '.join(sorted(set(bad)))}"))
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
            "url_failures": url_results,
        }, indent=2))
    else:
        print(f"\nScanned {len(articles)} articles; {len(all_urls)} distinct outbound URLs"
              + (" (not verified — --offline)" if args.offline else " verified") + ".\n")
        for entry in report:
            print(f"[{entry['store']}] {entry['article']}")
            for f in entry["findings"]:
                print(f"  - {f['check']}: {f['detail']}")
            print()
        for r in url_results:
            print(f"{r['check']}: {r['url']} ({r['detail']})")
            for user in r["used_by"]:
                print(f"    used by {user}")
        if not report and not url_results:
            print("No findings.")

    sys.exit(1 if (report or url_results) else 0)


if __name__ == "__main__":
    main()
