"""Read-only view of the article publish schedule (the "daily drip").

Lists every article in frontend/src/data/articles.js with its `updated`
(publish) date, split into already-live and scheduled-for-the-future,
relative to today in the site's timezone (+07:00 WIB) — mirroring the
publishedAt filter in articles.js.

This script never writes anything. Run with:  python tools/list_schedule.py
"""

import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ARTICLES = Path(__file__).resolve().parent.parent / "frontend/src/data/articles.js"
SITE_TZ = timezone(timedelta(hours=7))  # +07:00 WIB, per articles.js


def main():
    src = ARTICLES.read_text(encoding="utf-8")
    entries = []
    for m in re.finditer(
        r"\n  A\(\s*\n\s*['\"]([a-z0-9-]+)['\"][\s\S]*?\n\s*['\"](\d{4}-\d{2}-\d{2})['\"],\s*\n\s*(?:\{|\))",
        src,
    ):
        entries.append((m.group(2), m.group(1)))

    if not entries:
        print("No articles parsed — has the A() layout changed?", file=sys.stderr)
        sys.exit(1)

    today = datetime.now(SITE_TZ).strftime("%Y-%m-%d")
    live = sorted(e for e in entries if e[0] <= today)
    scheduled = sorted(e for e in entries if e[0] > today)

    print(f"Today (WIB): {today} — {len(entries)} articles total\n")
    print(f"LIVE ({len(live)}):")
    for d, slug in live:
        print(f"  {d}  {slug}")
    print(f"\nSCHEDULED ({len(scheduled)}):")
    if not scheduled:
        print("  (none — the drip has fully published)")
    for d, slug in scheduled:
        print(f"  {d}  {slug}")

    # Gap check: flag any date in the scheduled range with no article.
    if scheduled:
        first = datetime.strptime(today, "%Y-%m-%d")
        last = datetime.strptime(scheduled[-1][0], "%Y-%m-%d")
        have = {d for d, _ in entries}
        gaps = []
        cur = first + timedelta(days=1)
        while cur <= last:
            s = cur.strftime("%Y-%m-%d")
            if s not in have:
                gaps.append(s)
            cur += timedelta(days=1)
        if gaps:
            print(f"\nGAP DAYS with no new article between now and {scheduled[-1][0]}:")
            for g in gaps:
                print(f"  {g}")


if __name__ == "__main__":
    main()
