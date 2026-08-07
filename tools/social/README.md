# Social fact-card generator

Self-contained. Not part of the site build — nothing under `frontend/` reads
this directory or `social-output/`.

Every figure in `facts.json` is copied verbatim from the content stores
(`frontend/src/data/`), with its original check date and a `sourceQuote`
recording where it came from. This tool adds layout and voice, never numbers.
The editorial standard in CLAUDE.md applies to cards exactly as to articles.

## Files

- `facts.json` — the facts: figure, check date, source quote, target article,
  card copy, posting day.
- `template.html` — one card template. Brand tokens are copied by hand from
  `frontend/src/index.css`; if the palette changes there, update here.
- `render.js` — renders each fact to `card-feed-1080x1350.png` (Instagram /
  Facebook) and `card-pin-1000x1500.png` (Pinterest) via headless Chromium,
  plus the filled-in HTML next to each PNG.
- `packages.js` — writes `caption.md`, `alt-text.txt`, `pinterest.md`,
  `voiceover.md` per package, and the weekly `POSTING-GUIDE.md`.

## Usage

```bash
cd tools/social
npm install
npx playwright install chromium
node render.js      # PNGs + HTML → ../../social-output/2026-W32/
node packages.js    # text files + POSTING-GUIDE.md
```

Both scripts accept an output directory as their first argument for future
weeks, e.g. `node render.js ../../social-output/2026-W33`.

## Channel publishers

`publish-telegram-channel.js` and `publish-bluesky.js` (shared plumbing in
`batch.js`) each publish today's card to their channel, once:

```bash
node publish-telegram-channel.js [--dry-run] [--date YYYY-MM-DD] [--verbose]
node publish-bluesky.js          [--dry-run] [--date YYYY-MM-DD] [--verbose]
```

Both read every input — POSTING-GUIDE.md, caption.md, alt-text.txt, the feed
PNG — from `origin/main` with `git show`, never from the working tree, so an
unmerged batch cannot be published. The post link is taken from caption.md
with `utm_source` swapped to the channel; copy is used verbatim (Bluesky drops
trailing paragraphs to fit its 300-grapheme cap, it never rewrites). Each
records what it published in a gitignored `<channel>-state.json` after reading
the post back from the API; re-runs are no-ops, as are days with no card and
missing credentials (`.env.example` documents the keys: `TELEGRAM_CHANNEL_ID`
for the channel — the alarm bot must be one of its admins — and
`BLUESKY_HANDLE` + `BLUESKY_APP_PASSWORD`).

### If Chromium won't launch (missing system libraries, no sudo)

This machine lacks Chromium's system libraries. Without root, download and
extract them locally, then point `LD_LIBRARY_PATH` at the result:

```bash
mkdir -p /tmp/chromelibs/debs && cd /tmp/chromelibs/debs
apt-get download libnspr4 libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 \
  libasound2t64 libatspi2.0-0t64 libdrm2 libxi6
for d in *.deb; do dpkg-deb -x "$d" ..; done
export LD_LIBRARY_PATH=/tmp/chromelibs/usr/lib/x86_64-linux-gnu:/tmp/chromelibs/usr/lib/x86_64-linux-gnu/nss
```

### If rendering is impossible entirely

The filled-in HTML files are written next to each PNG. Open one in any
browser and screenshot at exactly 1080×1350 (feed) or 1000×1500 (pin) at
device scale factor 1 — in Chrome DevTools: toggle device toolbar, set
"Responsive" to those dimensions, DPR 1, then "Capture screenshot".

Google Fonts are loaded from the CDN **at render time only** — the cards ship
as PNGs, so nothing is hotlinked anywhere user-facing.
