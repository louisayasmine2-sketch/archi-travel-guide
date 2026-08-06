# Pinterest Standard access — application pack

Everything needed to fill Pinterest's forms, in the order the forms ask for it.
Two submissions use this file: the **Trial access** request when the app is
first connected, and the **Standard access** upgrade afterwards. The use-case
text and the demo video serve both.

Facts about our own setup were checked on **6 August 2026**. Pinterest's review
criteria and timings are theirs, and they change — read the current form text
before pasting anything below into it.

## Why the upgrade is needed

Trial access cannot create public Pins. `POST /v5/pins` against
`api.pinterest.com` returns 403 for a Trial app; pin creation succeeds only
against `api-sandbox.pinterest.com`, whose boards and pins are separate from
production and visible only to the account that created them. So the daily
publisher can be built, tested end to end and left running against the sandbox
today, but the first public pin it creates has to wait for Standard access.

## Application details

**App name:** Archi Travel Guide — fact card publisher

**Website:** https://affittacameregliarchi.com

**Privacy policy:** https://affittacameregliarchi.com/privacy-policy
(live and linked from the site footer; confirmed 6 August 2026)

**Domain verification:** already in place — the `p:domain_verify` meta tag is
installed on the site.

**Redirect URI:** the value in `tools/social/.env` as `PINTEREST_REDIRECT_URI`.
It must match the app's registered URI character for character.

**Scopes requested:** `pins:read`, `pins:write`, `boards:read`, `boards:write`,
`user_accounts:read`. Nothing beyond what one scheduled pin a day needs:
`boards:write` exists only so the helper can create the board it pins to.

**Use case (paste this, trimming to the form's length limit):**

> Archi Travel Guide is an independent travel guide to Siena and Tuscany. We
> publish one image Pin a day to our own Pinterest business account, from our
> own board, linking to our own articles on affittacameregliarchi.com.
>
> The images are fact cards we generate ourselves: a single verified figure —
> a bus fare, a museum opening time, a tourist tax rate — with the date it was
> checked and the official source it came from. Nothing is scraped, bought or
> republished from anyone else. Each card is produced from our published
> articles and passes an automated verification gate that re-checks every
> figure against the article it came from before the card can be published.
>
> The integration is a single scheduled job on our own server. It creates one
> Pin per day with title, description, destination link and alt text, then
> reads the Pin back to confirm it exists. It reads no user data, stores no
> user data, and touches no account other than our own. There is no consumer
> product, no third-party access and no data sharing.

**Traffic estimate:** about 1 Pin created per day, plus 2–3 read calls per Pin
(board lookup and readback). Well inside the published rate limits.

**Data handling:** the only Pinterest data stored is the ID of the Pin we just
created and the ID of our own board, in a local file on our server
(`tools/social/pinterest-state.json`), so the job does not publish the same card
twice. Tokens live in a `.env` file that is not in version control.

## Demo video — shot list

Pinterest asks for a recording that shows the app working, including the OAuth
flow and a real API-created Pin. A phone recording of the screen is fine. Keep
it under two minutes and narrate briefly. Record it once and use it for both
submissions.

1. **The site (10 s).** Open https://affittacameregliarchi.com, scroll one
   article far enough to show a dated, sourced figure. Say what the site is.
2. **The privacy policy (5 s).** Click through to
   https://affittacameregliarchi.com/privacy-policy from the footer.
3. **The card (10 s).** Show one package folder: the
   `card-pin-1000x1500.png` image next to `pinterest.md`, so the reviewer sees
   the title, description and destination link that will be sent.
4. **OAuth (30 s).** Run `node pinterest-auth.js --sandbox` in the terminal.
   Show the authorize URL, open it, sign in, approve the scopes, and show the
   redirect landing with `?code=` in the address bar. Paste it back into the
   terminal and show the "tokens stored" line.
5. **Publish (30 s).** Run
   `node publish-pinterest.js --sandbox --date <a date with a card> --verbose`.
   Show the log: the package it picked, the board, `created pin <id>`, and the
   readback line.
6. **The result (15 s).** Show the created Pin — in the sandbox environment
   during Trial, or on the live board once Standard is granted — with its
   image, description and link.
7. **Close (10 s).** State plainly: one Pin a day, our own content, our own
   account, no user data.

## Submitting the upgrade

1. developers.pinterest.com → **My apps** → the app → **Upgrade**.
2. Confirm the app information (website, privacy policy, redirect URI) and
   upload the demo video.
3. Submit and wait. Pinterest publishes no service-level agreement for this
   review; plan around days, not hours, and do not schedule anything that
   depends on the exact approval date.

## The day approval lands

1. Set `PINTEREST_ACCESS_TIER=standard` in `tools/social/.env` — the publisher
   refuses production until this reads exactly `standard`.
2. Run the production OAuth flow: `node pinterest-auth.js` (no `--sandbox`),
   then `node pinterest-auth.js --create-board`, which creates or finds the
   real board and writes `PINTEREST_BOARD_ID`.
3. Dry-run first: `node publish-pinterest.js --production --dry-run --verbose`.
4. Then one real pin for a single day:
   `node publish-pinterest.js --production --date <today>`.
5. Flip the scheduled job over by setting `PINTEREST_ENV=production` in `.env`.
   The 07:00 WIB cron entry needs no change.
6. Stop scheduling by hand: the manual steps in each `POSTING-GUIDE.md` become
   the fallback rather than the routine.
