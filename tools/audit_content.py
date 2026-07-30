"""Read-only editorial audit over the content stores (CLAUDE.md section 6).

Checks, per article:
  banned_phrase             — hedge phrasing banned by the editorial standard
  meta_description_length   — meta description outside 110-155 characters
  missing_faq_schema        — FAQ-style content but an empty faqs array, so the
                              page template will not emit FAQPage JSON-LD
                              (templates emit it automatically when faqs is
                              non-empty — see Article.jsx and the guide pages)
  no_images                 — article ships with no hero and no in-body image
  links_without_disclosure  — /go/ or rel="sponsored" links on a page with no
                              affiliate disclosure. EXPECTED to fire on every
                              monetised page until affiliate programmes are
                              approved; it is the worklist, not a defect.
  disclosure_without_links  — an affiliate disclosure on a page that has no
                              live affiliate links (a trust failure both ways)

This script never writes to content. If it reports something, fix the content.
Run with:  python tools/audit_content.py  [--json]
"""

import argparse
import json
import re
import sys

from content_store import load_all

BANNED_PHRASES = [
    "reports vary between",
    "sometimes available",
    "typically around",
    "some sources say",
    "appears to offer",
]

META_MIN, META_MAX = 110, 155

_FAQ_HEADING = re.compile(r"(^|\n)#{0,4}\s*(faq|frequently asked question)", re.IGNORECASE)
_AFFILIATE_LINK = re.compile(r"(/go/[a-z0-9-]+|rel=[\"']sponsored[\"'])", re.IGNORECASE)
_DISCLOSURE = re.compile(
    r"(affiliate (link|programme|program|partnership)"
    r"|we (may )?earn (a )?commission"
    r"|earns? (us )?a commission"
    r"|at no (extra )?cost to you)",
    re.IGNORECASE,
)


def audit(article):
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

    has_affiliate_links = bool(_AFFILIATE_LINK.search(article.text))
    has_disclosure = bool(_DISCLOSURE.search(article.text))
    if has_affiliate_links and not has_disclosure:
        findings.append(("links_without_disclosure", "affiliate links present but no disclosure"))
    if has_disclosure and not has_affiliate_links:
        findings.append(("disclosure_without_links", "affiliate disclosure present but no live affiliate links"))

    return findings


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    args = parser.parse_args()

    articles = load_all()
    report = []
    for art in articles:
        findings = audit(art)
        if findings:
            report.append({
                "store": art.store,
                "article": art.ident,
                "findings": [{"check": c, "detail": d} for c, d in findings],
            })

    if args.json:
        print(json.dumps({"articles_scanned": len(articles), "flagged": report}, indent=2))
    else:
        print(f"Scanned {len(articles)} articles across the content stores.\n")
        if not report:
            print("No findings.")
        for entry in report:
            print(f"[{entry['store']}] {entry['article']}")
            for f in entry["findings"]:
                print(f"  - {f['check']}: {f['detail']}")
            print()

    # links_without_disclosure is the expected pre-approval worklist, not a
    # failure state — only other findings make the run "dirty".
    dirty = any(
        f["check"] != "links_without_disclosure"
        for entry in report
        for f in entry["findings"]
    )
    sys.exit(1 if dirty else 0)


if __name__ == "__main__":
    main()
