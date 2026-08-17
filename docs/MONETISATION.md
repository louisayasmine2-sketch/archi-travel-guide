# Monetisation

<!-- audit:ignore -->
How commercial links actually work in this repo, as of 16 August 2026.
Replaces the root `MONETIZATION_CHECKLIST.md`, which described two components
that no longer exist and gave an instruction that would breach the editorial
standard if anyone followed it — see "What the old checklist got wrong".

Companion documents: `docs/AFFILIATE_APPLICATION_WORKLIST.md` (which
programmes to apply to, owner-side), `docs/UPDATE_TRIGGERS.md` (maintenance
registry), `GSC_INDEXATION_TRACKER.md` (indexing worklist).
<!-- /audit:ignore -->

## The one rule

**A tracking parameter never appears in article content.** It lives in exactly
one file: `frontend/public/_redirects`. Articles link to `/go/{slug}`, and the
redirect decides where that goes and what identifier it carries.

This is not a style preference. It means a programme can be swapped, paused or
corrected in one line without touching a single article, and it means no
article can silently ship someone else's affiliate ID.

## How a commercial link is built

1. **The article** writes an ordinary internal link: `[Compare rental prices
   for Italy on DiscoverCars](/go/discovercars-italy)`.
2. **`frontend/public/_redirects`** maps that slug to a destination, with the
   tracking parameter if the programme is live:

   ```
   /go/discovercars-italy   https://www.discovercars.com/italy-mainland?a_aid=affittacameregliarchi   302
   ```

3. **`SPONSORED_GO_SLUGS`** — hardcoded in both `frontend/src/pages/Article.jsx`
   and `frontend/scripts/generate-static-html.js` — decides the `rel`. A slug in
   that set renders `rel="sponsored noopener noreferrer"`; anything else renders
   `rel="nofollow noopener noreferrer"`.
4. **The article carries a disclosure** in the same edit, in its fact-check or
   terminal note. Not in the opening — the convention every monetised article
   here follows is that the link sits inside the section it serves.

Both renderers hold their own copy of `SPONSORED_GO_SLUGS`, so they can drift.
`tools/audit_content.py` checks both against `_redirects` precisely because an
approval landing in `_redirects` alone would ship paid links as `nofollow`.

## Which programmes are live

Live means the destination in `_redirects` carries a real tracking parameter.
Read the current answer from that file rather than trusting this list — the
scanners do exactly that, and never hardcode it.

| Slug | Programme | State |
|---|---|---|
| `/go/viator`, `/go/viator-siena-san-gimignano-tour` | Viator (`pid`) | live |
| `/go/discovercars`, `/go/discovercars-italy` | DiscoverCars (`a_aid`) | live |
| `/go/booking`, `/go/booking-search` | Booking.com | not applied for |
| `/go/getyourguide` | GetYourGuide | not applied for |
| `/go/trainline`, `/go/omio` | rail/coach | not applied for |
| `/go/airalo` | eSIM | not applied for |
| `/go/safetywing` | insurance | not applied for, referenced nowhere |

The seven unapplied slugs point at each business's plain official site and earn
nothing. Pages carrying only those links take an **independence note**, not a
disclosure — `/travel-deals` is the worked example.

## Disclosure follows reality, in both directions

A disclosure on a page with no live link is as much a trust failure as a live
link with no disclosure. `tools/audit_content.py` enforces both:

- `links_without_disclosure` — a live programme on a page that says nothing.
  Always a real violation; fix it the day it appears.
- `disclosure_without_links` — claiming a commercial relationship we do not
  have.
- `pending_without_independence_note` — advisory, for pages linking only to
  unapplied programmes.

## When an approval lands

A repo-side change of a few minutes, all in one commit:

1. Add the tracking parameter to that slug's destination in `_redirects`.
2. Add the slug to `SPONSORED_GO_SLUGS` in **both** `Article.jsx` and
   `generate-static-html.js`.
3. On every page linking to it, swap the independence note for a disclosure.
4. Run `python tools/audit_content.py` and
   `python tools/check_links_and_images.py`. Both must be clean.

Steps 1 and 2 belong to the same day. An approval applied to `_redirects` alone
means paid links shipping as `nofollow`, which is the worst of both worlds.

## Advertising

**Not implemented.** There is no ad code in this repository: no AdSense script,
no ad slots, no placeholder component. If display advertising is ever added it
is a fresh design decision, not the resumption of something half-built.

## Analytics

All optional, all loading only in production and only after the cookie banner is
accepted (`frontend/src/lib/analytics.js`):

- `REACT_APP_GA_MEASUREMENT_ID` — GA4, injected at build by
  `frontend/scripts/inject-google-analytics.js`
- `REACT_APP_CLARITY_PROJECT_ID` — Microsoft Clarity
- `REACT_APP_AMPLITUDE_API_KEY` — Amplitude

Custom events fire for `contact_submit` and `lead_submit`. Treat behavioural
findings as directional: use them to improve clarity and placement, never to
justify aggressive interstitials.

## What the old checklist got wrong

Recorded so the same instructions are not resurrected from git history:

- It documented `src/components/common/AdPlaceholder.jsx` and
  `src/components/common/AffiliateCard.jsx`. **Neither exists.**
- It described a `monetization.affiliates` array on each Siena article.
  **No such field exists** in the content stores.
- Its "To turn affiliate links on later" step 2 instructed adding *"real `href`
  values (full HTTPS links with your partner parameters)"* directly into
  `TravelDeals.jsx` and article data. **Following that would breach CLAUDE.md §1
  and §2** — it puts tracking identifiers in content and bypasses `/go/`
  entirely. It would also be invisible to the disclosure checks, which key off
  `/go/` slugs.
- Its AdSense section described compliance rules for slots that do not exist,
  which reads as "ads are wired up and merely disabled". They are not.

The mechanism above replaced all of it. Nothing was lost in the retirement
except instructions that were wrong.
