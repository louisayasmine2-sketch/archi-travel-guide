# Internal link worklist

<!-- audit:ignore -->
Measured 2026-08-09 against the content stores. Re-measure after any batch of
new articles — the counts move as soon as anything is published.
<!-- /audit:ignore -->

## What was measured, and what was not

Counted: **in-content internal links** — the `[label](/path)` links inside
article bodies and FAQ answers. These are the links search engines weight most,
because they sit in prose with surrounding context.

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

## Still needs a hand-written contextual link

Ordered by commercial intent first, then by how starved the page is. `$` marks
a page that carries a booking hand-off, so an inbound link there has a revenue
path attached.

Per `CLAUDE.md` §7 this is article-by-article work, never a regex sweep. Add the
link where the sentence genuinely calls for it, or leave it alone.

| Inbound | Page | Partners | Obvious source articles |
| --- | --- | --- | --- |
| 0 | `$` /siena-day-trip-from-florence | omio, getyourguide | florence-or-siena-which-to-visit, best-day-trips-from-florence-to-siena |
| 0 | `$` /one-day-in-siena | booking, getyourguide | siena-2-day-itinerary, siena-3-day-itinerary, best-things-to-do-in-siena |
| 0 | `$` /siena-walking-tour | getyourguide, viator | best-things-to-do-in-siena, one-day-in-siena, piazza-del-campo-guide |
| 0 | `$` /blog/val-dorcia-or-chianti-which-to-visit-2026 | omio, getyourguide | val-dorcia-day-trip-from-siena, best-day-trips-from-siena |
| 0 | `$` /blog/siena-weather-and-what-to-pack | airalo | tuscany-packing-checklist, best-time-to-visit-tuscany |
| 0 | `$` /blog/puccini-festival-torre-del-lago-2026… | getyourguide, viator | tuscany-in-august-2026, tuscany-on-screen-film-locations |
| 1 | `$` /blog/best-hotels-in-siena | booking | where-to-stay-in-siena, siena-hotel-vs-apartment-guide |
| 1 | `$` /blog/best-siena-hotels-with-parking | booking, omio | siena-parking-and-transfer-guide, siena-ztl-fines-how-to-avoid |
| 1 | `$` /blog/siena-tours-and-classes-to-book-first | getyourguide, viator | best-things-to-do-in-siena, siena-walking-tour |
| 1 | `$` /blog/best-day-trips-from-siena | omio, getyourguide | siena-day-trips-without-a-car, san-gimignano-day-trip-from-siena |
| 1 | `$` /blog/siena-ferragosto-and-palio-week | booking, getyourguide | palio-di-siena-guide, tuscany-in-august-2026 |
| 1 | `$` /blog/7-day-tuscany-itinerary-independent-travellers-2026… | booking, getyourguide | siena-3-day-itinerary, best-day-trips-from-siena |
| 1 | `$` /siena-contrade-guide | getyourguide, viator | palio-di-siena-guide, siena-walking-tour |
| 0 | /blog/rome-to-siena-train-bus-2026 | — | florence-to-siena-by-train-or-bus, siena-from-florence-airport-transfer |
| 0 | /blog/best-restaurants-siena-italy | — | where-to-eat-in-siena, tuscany-food-guide |
| 0 | /blog/via-francigena-day-walk-siena | — | hidden-gems-around-siena, siena-walking-tour |
| 0 | /where-to-eat-in-siena | — | best-restaurants-siena-italy, one-day-in-siena |
| 1 | /blog/siena-travel-cost-2026 | — | how-much-siena-trip-costs, where-to-stay-in-siena |
| 1 | /blog/florence-travel-budget-guide | — | how-much-siena-trip-costs, best-things-to-do-in-florence |
| 1 | /blog/common-mistakes-siena | — | best-things-to-do-in-siena, siena-ztl-fines-how-to-avoid |
| 1 | /blog/what-to-buy-in-tuscany-souvenirs | — | tuscany-food-guide, tuscan-food-calendar |
| 1 | /blog/italy-beach-rules-2026 | — | tuscany-in-august-2026, best-time-to-visit-tuscany |
| 1 | /blog/tuscany-on-screen-film-locations-2026 | — | hidden-gems-around-siena, val-dorcia-day-trip-from-siena |

The "obvious source articles" column is a starting point, not an instruction —
open the source article and check the link earns its place in the sentence.

## How to re-measure

The counts above came from parsing the content stores with
`tools/content_store.py` and `collect_internal_links` from
`tools/check_links_and_images.py`. Neither scanner reports link distribution
today; if this becomes routine, it belongs in a third read-only tool rather
than as an edit to either of those two.
