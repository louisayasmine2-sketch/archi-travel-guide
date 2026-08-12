"""Read-only editorial audit over the content stores (CLAUDE.md section 6).

Checks, per article:
  banned_phrase             — hedge phrasing banned by the editorial standard
  meta_description_length   — meta description outside 110-155 characters
  missing_faq_schema        — FAQ-style content but an empty faqs array, so the
                              page template will not emit FAQPage JSON-LD
                              (templates emit it automatically when faqs is
                              non-empty — see Article.jsx and the guide pages)
  no_images                 — article ships with no hero and no in-body image
  links_without_disclosure  — a page carrying a LIVE commission link (its
                              /go/ destination in _redirects has real tracking
                              parameters) with no affiliate disclosure. A real
                              violation, not the pre-approval worklist.
  disclosure_without_links  — an affiliate disclosure on a page whose /go/
                              links all point at untracked destinations, i.e.
                              claiming a commercial relationship we do not
                              have (a trust failure in the other direction)
  pending_without_independence_note
                            — a page linking only to still-pending programmes
                              (untracked redirects) and saying nothing about
                              the relationship. Informational: the standard
                              asks for an independence note while approval is
                              pending.

Which programmes are live is derived from frontend/public/_redirects, never
hardcoded here, so approval landing anywhere flips these checks automatically.

This script never writes to content. If it reports something, fix the content.
Run with:  python tools/audit_content.py  [--json]
"""

import argparse
import json
import re
import sys

from content_store import REPO_ROOT, load_all

BANNED_PHRASES = [
    "reports vary between",
    "sometimes available",
    "typically around",
    "some sources say",
    "appears to offer",
]

META_MIN, META_MAX = 110, 155

_FAQ_HEADING = re.compile(r"(^|\n)#{0,4}\s*(faq|frequently asked question)", re.IGNORECASE)
_GO_LINK = re.compile(r"/go/[a-z0-9-]+", re.IGNORECASE)

# Query parameters that mean a redirect earns commission. Same vocabulary as
# tools/check_links_and_images.py's tracking check.
_TRACKING_PARAMS = ("a_aid", "pid", "mcid", "tag", "aid", "affiliate_id", "partner", "ref")
REDIRECTS_FILE = REPO_ROOT / "frontend" / "public" / "_redirects"


def live_go_slugs():
    """/go/ slugs whose destination carries commission tracking — read from
    _redirects, the only place that knows whether money is actually flowing."""
    live = set()
    if not REDIRECTS_FILE.is_file():
        return live
    for line in REDIRECTS_FILE.read_text(encoding="utf-8").splitlines():
        parts = line.strip().split()
        if len(parts) < 2 or not parts[0].startswith("/go/") or parts[0].startswith("#"):
            continue
        query = parts[1].split("?", 1)[1] if "?" in parts[1] else ""
        keys = {kv.split("=", 1)[0].lower() for kv in query.split("&") if kv}
        if keys & set(_TRACKING_PARAMS):
            live.add(parts[0])
    return live


_INDEPENDENCE = re.compile(
    r"(no (commercial|affiliate) relationship"
    r"|earn nothing"
    r"|not an affiliate"
    r"|no commission)",
    re.IGNORECASE,
)
_DISCLOSURE = re.compile(
    r"(affiliate (link|programme|program|partnership)"
    r"|we (may )?earn (a )?commission"
    r"|earns? (us )?a commission"
    r"|at no (extra )?cost to you)",
    re.IGNORECASE,
)


def audit(article, live_slugs=frozenset()):
    findings = []
    lower = article.text.lower()

    for phrase in BANNED_PHRASES:
        count = lower.count(phrase)
        if count:
            findings.append(("banned_phrase", f'"{phrase}" x{count}'))

    if article.meta is None:
        findings.append(("meta_description_length", "no meta description found"))
    else:
        n = len(article.meta)
        if not (META_MIN <= n <= META_MAX):
            findings.append(("meta_description_length", f"{n} chars (target {META_MIN}-{META_MAX})"))

    if article.faq_count == 0 and _FAQ_HEADING.search(article.text):
        findings.append(("missing_faq_schema", "FAQ-style heading in body but faqs array is empty — no FAQPage JSON-LD will ship"))

    if not article.hero_image and not article.image_refs:
        findings.append(("no_images", "no hero image and no in-body images"))

    # Disclosure follows reality: what matters is whether the /go/ links on
    # this page actually earn commission today, not whether they exist.
    go_links = {s.lower() for s in _GO_LINK.findall(article.text)}
    live_here = sorted(go_links & set(live_slugs))
    has_disclosure = bool(_DISCLOSURE.search(article.text))
    if live_here and not has_disclosure:
        findings.append((
            "links_without_disclosure",
            f"live commission link(s) {', '.join(live_here)} but no disclosure",
        ))
    if has_disclosure and not live_here:
        findings.append((
            "disclosure_without_links",
            "affiliate disclosure present but no live commission link on the page",
        ))
    if go_links and not live_here and not _INDEPENDENCE.search(article.text):
        findings.append((
            "pending_without_independence_note",
            f"links to still-pending programme(s) {', '.join(sorted(go_links))} with no independence note",
        ))

    return findings


# The two renderers each hardcode the set of slugs that get rel="sponsored"
# (they cannot import from each other: one is a React page, the other a
# dependency-free build script). Both must equal the live set in _redirects —
# a programme approved in _redirects but missed here ships paid links as
# nofollow, which breaks Google's link-scheme rules silently.
SPONSORED_SET_FILES = (
    REPO_ROOT / "frontend" / "src" / "pages" / "Article.jsx",
    REPO_ROOT / "frontend" / "scripts" / "generate-static-html.js",
)
_SPONSORED_BLOCK = re.compile(r"SPONSORED_GO_SLUGS\s*=\s*new Set\(\[(.*?)\]\)", re.S)


def sponsored_sync_findings(live_slugs):
    findings = []
    for path in SPONSORED_SET_FILES:
        if not path.is_file():
            continue
        block = _SPONSORED_BLOCK.search(path.read_text(encoding="utf-8"))
        rel = str(path.relative_to(REPO_ROOT))
        if not block:
            findings.append(("sponsored_set_missing", f"{rel} declares no SPONSORED_GO_SLUGS set"))
            continue
        declared = {s.lower() for s in _GO_LINK.findall(block.group(1))}
        for slug in sorted(live_slugs - declared):
            findings.append((
                "sponsored_rel_missing",
                f"{rel}: {slug} earns commission in _redirects but is not marked sponsored",
            ))
        for slug in sorted(declared - set(live_slugs)):
            findings.append((
                "sponsored_rel_unearned",
                f"{rel}: {slug} is marked sponsored but its redirect carries no tracking",
            ))
    return findings


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    args = parser.parse_args()

    live_slugs = live_go_slugs()
    articles = load_all()
    report = []
    sponsored = sponsored_sync_findings(live_slugs)
    if sponsored:
        report.append({
            "store": "config",
            "article": "rel=sponsored sync (_redirects vs renderers)",
            "findings": [{"check": c, "detail": d} for c, d in sponsored],
        })
    for art in articles:
        findings = audit(art, live_slugs)
        if findings:
            report.append({
                "store": art.store,
                "article": art.ident,
                "findings": [{"check": c, "detail": d} for c, d in findings],
            })

    if args.json:
        print(json.dumps({
            "articles_scanned": len(articles),
            "live_go_slugs": sorted(live_slugs),
            "flagged": report,
        }, indent=2))
    else:
        print(f"Scanned {len(articles)} articles across the content stores.")
        print(f"Live commission programmes (from _redirects): "
              f"{', '.join(sorted(live_slugs)) or 'none'}\n")
        if not report:
            print("No findings.")
        for entry in report:
            print(f"[{entry['store']}] {entry['article']}")
            for f in entry["findings"]:
                print(f"  - {f['check']}: {f['detail']}")
            print()

    # An independence note is advisory while a programme is pending; every
    # other finding — including an undisclosed live commission link — fails.
    dirty = any(
        f["check"] != "pending_without_independence_note"
        for entry in report
        for f in entry["findings"]
    )
    sys.exit(1 if dirty else 0)


if __name__ == "__main__":
    main()
