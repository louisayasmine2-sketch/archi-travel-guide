# Internal link worklist

<!-- audit:ignore -->
Measured 2026-09-21 against the content stores (105 routed pages). Re-measure
after any batch of new articles — the counts move as soon as anything is
published. An earlier version of this file lived on a branch that never
reached main; this one starts from the current corpus.
<!-- /audit:ignore -->

## What is measured, and what is not

Counted: **in-content internal links** — the `[label](/path)` links inside
article section bodies. These are the links search engines weight most,
because they sit in prose with surrounding context. FAQ answers are excluded:
`FAQAccordion` renders them as plain text, so a markdown link there is not a
link at all.

Not counted: template links — "Keep reading", the Siena cluster sidebar,
`/blog`, the sitemap. **A page showing 0 is not orphaned**; it is contextually
unsupported, which is a weaker but real problem.

## Pass of 2026-09-21

Before: median 5 inbound links, 2 pages at zero, 16 at two or fewer.
After: median 6, **0 at zero**, 11 at two or fewer. Total in-content links
837 → 858.

Seventeen paragraphs edited by hand, each link written where the sentence
already called for it. Two of them replaced closing filler that promised a
link and delivered none ("explore deeper with our dedicated Siena guides",
"see our full Siena guide for interactive maps"). Per `CLAUDE.md` §7 this is
article-by-article work; nothing here was a search-and-replace.

One claim added about the Puccini festival guide — the 5 September end date
and 21:15 curtain — was re-checked against that article before shipping.

## Still two or fewer

`$` marks a page carrying a live commission link (`/go/viator`,
`/go/discovercars*`), so an inbound link there has a revenue path attached.
All twelve live-link pages except one are already above this line.

| Inbound | Page | Obvious source articles |
| --- | --- | --- |
| 1 | /blog/bottini-di-siena-underground-aqueduct | siena-walking-tour, santa-maria-della-scala-siena, best-things-to-do-in-siena |
| 1 | /blog/lucca-comics-and-games-2026-tuscany-guide | tuscany-in-october-2026, tuscany-in-november-2026 |
| 1 | /blog/tuscany-in-march-2027 | tuscany-in-february-2027, siena-weather-and-what-to-pack |
| 1 | /siena-day-trip-from-florence | florence-or-siena-which-to-visit-2026, siena-day-trip-or-overnight-2026 |
| 2 | /blog/best-day-trips-from-siena | siena-3-day-itinerary, siena-day-trips-without-a-car |
| 2 | /blog/common-mistakes-siena | best-things-to-do-in-siena, siena-2-day-itinerary |
| 2 | /blog/hidden-gems-around-siena-tuscany-2026 | best-day-trips-from-siena, val-dorcia-day-trip-from-siena-2026 |
| 2 | /blog/italy-hotels-no-ac-2026 | where-to-stay-in-siena, siena-hotel-vs-apartment-guide |
| 2 | `$` /blog/quantum-of-solace-siena-filming-locations | piazza-del-campo-guide, palio-di-siena-guide |
| 2 | /blog/siena-tours-and-classes-to-book-first | siena-2-day-itinerary, siena-walking-tour |
| 2 | /blog/siena-weather-and-what-to-pack | siena-in-september-2026, summer-packing-list-for-tuscany-and-florence-2026 |

The source column is a starting point, not an instruction — open the source
article and check the link earns its place in the sentence, or leave it.

## How to re-measure

Parse the stores with `tools/content_store.py` and count
`collect_internal_links` from `tools/check_links_and_images.py` per target
route, section bodies only. Neither scanner reports distribution; if this
becomes routine, it belongs in its own read-only tool.
