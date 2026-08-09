# Monetisation

State of play, and the exact procedure for switching commercial links on.

<!-- audit:ignore -->
**Verified against the repo on 2026-08-09.** Earlier versions of this file
described `AdPlaceholder.jsx` and `AffiliateCard.jsx`; neither component exists
any more, and no ad slot renders anywhere on the site. If you are reading this
after further changes, re-check the file list before trusting it.
<!-- /audit:ignore -->

## Where the money is meant to come from

Two streams, in priority order:

1. **Affiliate travel bookings** — accommodation, tours and tickets, transport,
   eSIM. Fits the content: the Siena and Tuscany guides attract readers who are
   about to book something.
2. **Display advertising** — deferred, see below. Not worth the page-weight and
   quality cost at current traffic.

Neither earns anything today. **No affiliate programme has been applied for, no
partner ID exists, and no ad script is loaded.** Everything below is the
plumbing waiting for those two facts to change.

## How the plumbing works

Article prose never contains a commercial link. Partners are resolved from an
article's category and slug at render time, so a programme change touches two
files, not 72 article bodies.

| Piece | File | Job |
| --- | --- | --- |
| Programme switch | `frontend/src/lib/monetisation.js` | `PROGRAMME_STATUS` — `"pending"` or `"live"`. Drives the `rel` attribute and whether the block shows an independence note or a disclosure. |
| Partner registry | `frontend/src/lib/monetisation.js` | The six partners, each with its `/go/` slug, what it solves, and its caveat. No prices — none have been verified. |
| Intent routing | `frontend/src/lib/monetisation.js` | `partnersForArticle()`. Six intent groups, capped at two partners per article. Returns nothing for food, budget and seasonal explainers — those readers are not at a booking decision. |
| Rendered block | `frontend/src/components/common/PartnerCta.jsx` | The end-of-article hand-off, plus the note that tracks reality. |
| Redirect layer | `frontend/public/_redirects` | `/go/{slug}` → destination. The only place a destination URL is written. |
| Click measurement | `frontend/src/lib/analytics.js` | `trackPartnerClick()` — fires `partner_click` with partner, article slug and programme status. |

Rendered on: every `/blog/*` article (`Article.jsx`), every Siena cluster guide
(`SienaContentClusterArticle.jsx`), and `/travel-deals` (its own platform list).

## Turning affiliate links on

Do all four steps on the same day. A half-switch either hides a commercial
relationship or claims one we do not have — both are trust failures under
`CLAUDE.md` §2.

1. Get approved by the partner, and get the real tracking parameter.
2. Add it to the destination in `frontend/public/_redirects`, on the `/go/`
   line for that partner only. Nowhere else.
3. Flip `PROGRAMME_STATUS` to `"live"` in `frontend/src/lib/monetisation.js`.
   `rel` becomes `sponsored` and the independence note becomes a disclosure
   automatically.
4. Fix every page that currently states we have no commercial relationship —
   the list is in the next section. Each one becomes false the moment step 2
   lands.

Then run both scanners in `tools/`. `check_links_and_images.py` reports any
tracking parameter it finds on a `/go/` destination; after go-live that report
is the record of which programmes are live, so read it rather than assuming.

### Claims that must change on go-live day

These say, in the site's own voice, that nothing here is monetised:

- `frontend/src/pages/Home.jsx` — "Nobody pays to be listed / There are no
  affiliate relationships or paid placements."
- `frontend/src/pages/TravelDeals.jsx` — the hero line and the "How we chose
  these" block, both of which state we earn nothing.
- `frontend/src/components/common/PartnerCta.jsx` — handled by the switch, no
  manual edit needed.
- `frontend/src/pages/Legal.jsx` — the editorial policy page.

This list is also registered in `docs/UPDATE_TRIGGERS.md` so it does not rot.

## Display advertising — deferred, and why

Traffic is under 1,000 sessions a month. At that volume AdSense returns a
rounding error while costing page weight, layout stability and the clean
reading experience the guides depend on. It also competes for the same click
the booking hand-off wants.

Revisit when organic traffic is consistently above roughly 10,000 sessions a
month, and check the current entry requirements of the ad networks at that
point rather than trusting a number written here. If ads do go in later:

- Every slot must be labelled "Advertisement".
- Never in the header, mobile menu, or footer navigation.
- Never styled as a button, download link, or navigation element.
- At most one above the fold; two to three inside a long article.
- Update the cookie banner and cookie policy copy for personalised advertising.

## What must never happen

- Inserting an affiliate, tracking or partner ID that was not supplied
  explicitly in that session. An ID copied from documentation sends commission
  to a stranger.
- A disclosure on a page with no live affiliate link, or a live affiliate link
  with no disclosure. Reality in both directions.
- A commercial link written into article prose instead of through `/go/`.
- Stating a price, a discount or an availability claim for a partner. None have
  been verified, and they change constantly.
- Paying for or accepting payment for a recommendation. See `/editorial-policy`.

## What actually moves revenue right now

Not the plumbing — the plumbing is done. The gap is demand:

1. **Indexation.** Both tables in `GSC_INDEXATION_TRACKER.md` are still empty.
   Nothing about monetisation can be judged without knowing which of the 72
   articles Google has indexed and what they rank for.
2. **The newsletter.** Now on the homepage, every article and every cluster
   guide, posting to `/api/newsletter/subscribe`. It is the only audience the
   site owns outright and the only one an algorithm change cannot remove.
3. **Applying to the programmes.** Nothing in this file earns a cent until a
   partner approves the domain. Accommodation and tours fit the existing
   content best; transport and eSIM are secondary.
