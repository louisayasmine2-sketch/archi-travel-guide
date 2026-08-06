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

## Pinterest publishing

`publish-pinterest.js` pins the card whose posting-guide row carries today's
date. Every input — `POSTING-GUIDE.md`, `pinterest.md`, `alt-text.txt` and the
pin PNG — is read from `origin/main` with `git show`, never from the working
tree, so only a batch that has passed the human gate can ever be published.
State lives in `pinterest-state.json` (gitignored); a package already recorded
there is skipped, so re-running is safe.

```bash
node publish-pinterest.js --dry-run --verbose   # prints the exact payload
node publish-pinterest.js --date 2026-08-12     # pretend it is that day
node publish-pinterest.js                       # real publish (sandbox default)
```

`ops/run-pinterest.sh` is the scheduled wrapper (07:00 WIB in `ops/crontab`):
lock, `.env`, log file, Telegram on success and on failure. Quiet days send no
message.

### Pinterest app registration

Do this once, on any device. It ends with an App ID and secret in `.env`.

1. Sign in at <https://developers.pinterest.com/> with the Pinterest account
   that owns the boards, and open **My apps → Connect app**.
2. Fill the form. The three parts that get checked:
   - **Use case.** What the app does: publishes our own fact-card images to our
     own business account, one scheduled pin a day, no third-party data.
   - **Privacy policy URL.** Use
     <https://affittacameregliarchi.com/privacy-policy> — live and linked from
     the site footer (confirmed 6 August 2026).
   - **Demo video.** A screen recording of the flow. The shot list is in
     `STANDARD-APPLICATION.md`; the same video serves the Standard upgrade.
   The domain is already verified for Pinterest: the `p:domain_verify` meta tag
   is in place on the site.
3. Trial access is reviewed on working days. When it is approved, open the app
   → **Configure** and copy **App ID** and **App secret** into `tools/social/.env`
   as `PINTEREST_APP_ID` / `PINTEREST_APP_SECRET`.
4. On the same tab, add a **Redirect URI** and put the identical string in
   `.env` as `PINTEREST_REDIRECT_URI`. It never has to resolve to a real page —
   the helper only reads the `?code=` Pinterest appends to it.
5. Authorise and create the sandbox board:

   ```bash
   node pinterest-auth.js --sandbox          # prints a URL, takes the code back
   node pinterest-auth.js --create-board --sandbox
   node pinterest-auth.js --status --sandbox # what .env now holds
   ```

   The Configure tab can also issue a ready-made sandbox token (30 days, no
   refresh token). Pasting it into `.env` as `PINTEREST_ACCESS_TOKEN_SANDBOX`
   skips step 5's first command entirely.
6. Try it for real against the sandbox:

   ```bash
   node publish-pinterest.js --sandbox --date 2026-08-05 --verbose
   ```

   Sandbox pins live at `api-sandbox.pinterest.com`, are separate from
   production, and are visible only to the account that made them.

### Trial vs Standard access

Trial access **cannot create public pins**: `POST /v5/pins` against production
answers 403. Pin creation works only in the sandbox. The publisher enforces
this rather than discovering it at 07:00 — it refuses `PINTEREST_ENV=production`
unless `PINTEREST_ACCESS_TIER=standard` is set in `.env`, which should happen on
the day the upgrade is approved and not before. Until then, `STANDARD-APPLICATION.md`
holds the upgrade application, and the posting guide carries the manual
scheduling steps so pinning can start today by hand.

### Tokens

Access tokens last 30 days. Refresh tokens last 60 days on the continuous
refresh flow and **rotate on every refresh** — the new one replaces the old one
in `.env` automatically. If both lapse, run `node pinterest-auth.js` again.
