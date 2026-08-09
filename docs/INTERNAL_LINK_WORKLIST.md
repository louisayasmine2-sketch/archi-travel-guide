# Internal link worklist

<!-- audit:ignore -->
Measured 2026-08-09 against the content stores. Re-measure after any batch of
new articles — the counts move as soon as anything is published.
<!-- /audit:ignore -->

## What was measured, and what was not

Counted: **in-content internal links** — the `[label](/path)` links inside
article section bodies. These are the links search engines weight most, because
they sit in prose with surrounding context. FAQ answers are excluded: they
render as plain text, so a markdown link there is not a link at all.

Not counted: links from templates. Every article gets three from the "Keep
reading" module, every Siena cluster guide is listed in the cluster sidebar of
every other cluster guide, and everything appears in `/blog` and the sitemap.
**A page showing 0 below is not orphaned** — it is contextually unsupported,
which is a weaker but real problem.

Across 70 pages the median is 3 inbound in-content links. The distribution is
the issue, not the total.

## Already fixed structurally

"Keep reading" used to be `articles.filter(same region or category).slice(0, 3)`
— array order, which meant the handful of guides sitting early in `articles.js`
took nearly every recommendation on the site. Measured on the built site:

| | Distinct articles recommended | Most slots taken by one article |
| --- | --- | --- |
| Before | 20 | 25 of 156 |
| After | 40 | 9 of 156 |

`frontend/src/lib/relatedArticles.js` keeps the same topical constraint but
breaks ties toward the least-linked candidate, so the module now feeds the
starved pages instead of the popular ones. No article prose was touched.

That covers discovery. It does **not** replace a contextual link written into a
sentence by someone who knows why the two articles belong together.

## Pass one, done 2026-08-09

Twenty-one contextual links added by hand, one paragraph at a time. Pages with
zero in-content inbound links dropped from **10 to 2**, and the two remaining
are scheduled articles deliberately skipped (see below). Total in-content
internal links across the site: 388 → 409.

Three of those paragraphs were closing filler rather than prose — "explore
deeper with our dedicated Siena guides", "see our full Siena guide for
interactive maps" — sentences that promised a link and delivered none. They
were replaced with specific ones.

Two defects surfaced while doing it, both now fixed:

- `FAQAccordion` renders answers as **plain text**. A markdown link in an FAQ
  reaches the reader as literal brackets and a crawler as nothing. One had
  shipped, in `siena-3-day-itinerary`. Links belong in section bodies only.
- Two American spellings (`Prioritize`, `Travelers`) in
  `best-things-to-do-in-siena`, against the British-English house rule. Fixed
  in the sentences being edited; **the rest of the corpus is unaudited for
  this** — neither scanner checks spelling.

### Deliberately not linked: scheduled articles

Five targets are written but not yet published, and `Article.jsx` does not
filter links the way the cluster template does — a link to one 404s until its
publish date passes. They were skipped rather than shipped broken:

`rome-to-siena-train-bus-2026` · `via-francigena-day-walk-siena` ·
`what-to-buy-in-tuscany-souvenirs` · `italy-beach-rules-2026` ·
`tuscany-on-screen-film-locations-2026`

Older articles already link to some of these, which is why the link checker
reports them as informational. Link them in the pass after they publish.

## Still needs a hand-written contextual link

Ordered by commercial intent first, then by how starved the page is. `$` marks
a page that carries a booking hand-off, so an inbound link there has a revenue
path attached.

Per `CLAUDE.md` §7 this is article-by-article work, never a regex sweep. Add the
link where the sentence genuinely calls for it, or leave it alone.

| Inbound | Page | Partners | Obvious source articles |
| --- | --- | --- | --- |
| 1 | `$` /siena-day-trip-from-florence | omio, getyourguide | florence-or-siena-which-to-visit |
| 1 | `$` /siena-walking-tour | getyourguide, viator | one-day-in-siena, piazza-del-campo-guide |
| 1 | `$` /blog/val-dorcia-or-chianti-which-to-visit-2026 | omio, getyourguide | best-day-trips-from-siena, tuscany-wine-harvest |
| 1 | `$` /blog/puccini-festival-torre-del-lago-2026… | getyourguide, viator | siena-in-september-2026 |
| 1 | /where-to-eat-in-siena | — | best-restaurants-siena-italy, one-day-in-siena |
| 1 | /blog/best-restaurants-siena-italy | — | where-to-eat-in-siena, siena-2-day-itinerary |
| 2 | `$` /one-day-in-siena | booking, getyourguide | best-things-to-do-in-siena, siena-day-trip-from-florence |
| 2 | `$` /blog/best-hotels-in-siena | booking | siena-hotel-vs-apartment-guide, italy-hotels-no-ac-2026 |
| 2 | `$` /blog/best-day-trips-from-siena | omio, getyourguide | siena-day-trips-without-a-car, siena-3-day-itinerary |
| 2 | `$` /blog/siena-ferragosto-and-palio-week | booking, getyourguide | siena-with-kids, siena-in-september-2026 |
| 2 | `$` /blog/siena-tours-and-classes-to-book-first | getyourguide, viator | siena-walking-tour, siena-2-day-itinerary |
| 2 | `$` /blog/siena-weather-and-what-to-pack | airalo | summer-packing-list-for-tuscany-and-florence |
| 2 | `$` /siena-contrade-guide | getyourguide, viator | siena-walking-tour, best-things-to-do-in-siena |
| 2 | `$` /siena-cathedral-guide | getyourguide, viator | one-day-in-siena, siena-2-day-itinerary |
| 2 | `$` /blog/italy-hotels-no-ac-2026 | booking | tuscany-in-august-2026, where-to-stay-in-siena |
| 2 | `$` /blog/hidden-gems-around-siena-tuscany-2026 | getyourguide, viator | best-day-trips-from-siena, val-dorcia-day-trip |
| 2 | `$` /blog/siena-or-san-gimignano-day-trip-2026 | omio, getyourguide | san-gimignano-day-trip-from-siena, best-day-trips-from-siena |
| 2 | `$` /blog/best-things-to-do-in-florence | getyourguide, viator | florence-or-siena-which-to-visit, avoid-crowds-in-florence-july-2026 |
| 2 | `$` /blog/florence-tourist-rules-2026 | getyourguide, viator | best-things-to-do-in-florence, avoid-crowds-in-florence-july-2026 |
| 2 | `$` /blog/best-day-trips-from-florence-to-siena-2026 | omio, trainline | florence-or-siena-which-to-visit, best-things-to-do-in-florence |
| 2 | `$` /blog/summer-packing-list-for-tuscany-and-florence-2026 | airalo | tuscany-in-august-2026, florence-summer-heat-survival-tips |
| 2 | /blog/common-mistakes-siena | — | best-things-to-do-in-siena, siena-2-day-itinerary |
| 2 | /blog/siena-travel-cost-2026 | — | where-to-stay-in-siena, siena-2-day-itinerary |
| 2 | /blog/florence-travel-budget-guide | — | how-much-siena-trip-costs, florence-or-siena-which-to-visit |

The "obvious source articles" column is a starting point, not an instruction —
open the source article and check the link earns its place in the sentence.

## How to re-measure

The counts above came from parsing the content stores with
`tools/content_store.py` and `collect_internal_links` from
`tools/check_links_and_images.py`. Neither scanner reports link distribution
today; if this becomes routine, it belongs in a third read-only tool rather
than as an edit to either of those two.
