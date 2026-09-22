# Indexing request list

<!-- audit:ignore -->
Every canonical URL the site wants indexed (133 on 2026-09-22, taken from the
freshly generated sitemap), ordered by value and cut into Search Console's
daily URL-Inspection quota of about 10. Work one batch per day, top to bottom,
and tick the box. Regenerate the list when the content plan adds pages
(`docs/INDEXING_REQUEST_LIST.md` is a snapshot; the sitemap is the truth).
<!-- /audit:ignore -->

## What this is for, and what it is not

The Pages report's **"Page with redirect"** bucket (123 URLs on 9 September,
113 pending + 10 failed in the validation of 10-15 September) is *not* a list
of pages to get indexed. Every URL in it redirects on purpose - slashless
variants to the slashed canonical, `www.` to the apex, the B&B-era `.html`,
`/en/` and `/it/` paths to their successors. A redirect URL can never pass
validation, and it should not: the page that must be indexed is the *target*.
Do not start a new validation on that bucket; it will fail again by design.

The list below is those targets. Two buckets do matter and should shrink as
this list is worked: **"Excluded by 'noindex' tag"** (61 on 9 September; the
leak was closed in #138) and **"Crawled - currently not indexed"** (10).
Export the URLs of both and cross them off here first - they are the pages
Google already knows about and is holding back.

## How to request (per URL, ~30 seconds)

1. Search Console -> URL Inspection -> paste the URL exactly as written below
   (with the trailing slash).
2. If it says *URL is on Google*: tick it here and move on - no request needed.
3. Otherwise **Request indexing**. Quota is ~10 per day; the button greys out
   when it is spent.
4. Weekly, read the Pages report's top line: *Indexed* should climb toward
   the total below. If a URL stays unindexed two weeks after a request, note
   it in the tracker - that is a quality signal, not a plumbing one.

## Batch 1 - Tier 1 - hubs, pillars, the Siena cluster

- [ ] https://affittacameregliarchi.com/
- [ ] https://affittacameregliarchi.com/siena-travel-guide/
- [ ] https://affittacameregliarchi.com/florence-to-siena-by-train-or-bus/
- [ ] https://affittacameregliarchi.com/where-to-stay-in-siena/
- [ ] https://affittacameregliarchi.com/things-to-do-in-siena/
- [ ] https://affittacameregliarchi.com/tuscany-travel-guide/
- [ ] https://affittacameregliarchi.com/siena/
- [ ] https://affittacameregliarchi.com/florence/
- [ ] https://affittacameregliarchi.com/travel-tools/
- [ ] https://affittacameregliarchi.com/travel-budget-calculator/

## Batch 2 - Tier 1 - hubs, pillars, the Siena cluster

- [ ] https://affittacameregliarchi.com/siena-day-trip-from-florence/
- [ ] https://affittacameregliarchi.com/siena-accommodation-guide/
- [ ] https://affittacameregliarchi.com/siena-itinerary/
- [ ] https://affittacameregliarchi.com/one-day-in-siena/
- [ ] https://affittacameregliarchi.com/piazza-del-campo-guide/
- [ ] https://affittacameregliarchi.com/siena-cathedral-guide/
- [ ] https://affittacameregliarchi.com/torre-del-mangia-guide/
- [ ] https://affittacameregliarchi.com/siena-contrade-guide/
- [ ] https://affittacameregliarchi.com/where-to-eat-in-siena/
- [ ] https://affittacameregliarchi.com/siena-walking-tour/

## Batch 3 - Tier 2 - the money articles

- [ ] https://affittacameregliarchi.com/santa-maria-della-scala-siena/
- [ ] https://affittacameregliarchi.com/blog/siena-ztl-fines-how-to-avoid/  *(published 2026-07-22)*
- [ ] https://affittacameregliarchi.com/blog/siena-parking-and-transfer-guide/  *(published 2026-07-23)*
- [ ] https://affittacameregliarchi.com/blog/best-things-to-do-in-florence/  *(published 2026-08-03)*
- [ ] https://affittacameregliarchi.com/blog/best-hotels-in-siena/  *(published 2026-07-28)*
- [ ] https://affittacameregliarchi.com/blog/palio-di-siena-guide/  *(published 2026-07-28)*
- [ ] https://affittacameregliarchi.com/blog/best-time-to-visit-tuscany/  *(published 2026-08-06)*
- [ ] https://affittacameregliarchi.com/blog/siena-from-florence-airport-transfer/  *(published 2026-08-03)*
- [ ] https://affittacameregliarchi.com/blog/renting-a-car-in-tuscany-2026/  *(published 2026-08-18)*
- [ ] https://affittacameregliarchi.com/blog/rome-to-siena-train-bus-2026/  *(published 2026-08-14)*

## Batch 4 - Tier 2 - the money articles

- [ ] https://affittacameregliarchi.com/blog/siena-day-trips-without-a-car/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/quantum-of-solace-siena-filming-locations/  *(published 2026-08-17)*
- [ ] https://affittacameregliarchi.com/blog/bottini-di-siena-underground-aqueduct/  *(published 2026-08-18)*
- [ ] https://affittacameregliarchi.com/blog/santantimo-abbey-guide/  *(published 2026-09-22)*
- [ ] https://affittacameregliarchi.com/blog/montalcino-guide/  *(published 2026-09-21)*
- [ ] https://affittacameregliarchi.com/blog/montepulciano-guide/  *(published 2026-09-20)*
- [ ] https://affittacameregliarchi.com/blog/pienza-guide/  *(published 2026-09-19)*
- [ ] https://affittacameregliarchi.com/blog/castiglione-dorcia-guide/  *(published 2026-09-18)*
- [ ] https://affittacameregliarchi.com/blog/radicofani-guide/  *(published 2026-09-17)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-white-truffle-season-2026/  *(published 2026-09-16)*

## Batch 5 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/lucca-comics-and-games-2026-tuscany-guide/  *(published 2026-09-15)*
- [ ] https://affittacameregliarchi.com/blog/where-to-eat-siena-day-trips/  *(published 2026-09-14)*
- [ ] https://affittacameregliarchi.com/blog/asciano-guide/  *(published 2026-09-13)*
- [ ] https://affittacameregliarchi.com/blog/san-quirico-dorcia-guide/  *(published 2026-09-12)*
- [ ] https://affittacameregliarchi.com/blog/buonconvento-guide/  *(published 2026-09-11)*
- [ ] https://affittacameregliarchi.com/blog/monteriggioni-guide/  *(published 2026-09-10)*
- [ ] https://affittacameregliarchi.com/blog/crete-senesi-guide/  *(published 2026-09-09)*
- [ ] https://affittacameregliarchi.com/blog/sienese-school-painting-where-to-see/  *(published 2026-09-08)*
- [ ] https://affittacameregliarchi.com/blog/monte-dei-paschi-oldest-bank-siena/  *(published 2026-09-07)*
- [ ] https://affittacameregliarchi.com/blog/saint-catherine-of-siena-places/  *(published 2026-09-06)*

## Batch 6 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/siena-1348-the-year-the-city-stopped/  *(published 2026-09-05)*
- [ ] https://affittacameregliarchi.com/blog/battle-of-montaperti-1260-siena/  *(published 2026-09-04)*
- [ ] https://affittacameregliarchi.com/blog/accademia-tickets-sold-out-florence/  *(published 2026-09-03)*
- [ ] https://affittacameregliarchi.com/blog/leroica-gaiole-in-chianti-2026/  *(published 2026-09-02)*
- [ ] https://affittacameregliarchi.com/blog/uffizi-tickets-sold-out-what-to-do/  *(published 2026-09-01)*
- [ ] https://affittacameregliarchi.com/blog/via-francigena-which-section-to-walk/  *(published 2026-08-31)*
- [ ] https://affittacameregliarchi.com/blog/panzano-in-chianti-cecchini-vino-al-vino/  *(published 2026-08-30)*
- [ ] https://affittacameregliarchi.com/blog/what-to-wear-in-tuscany-in-september/  *(published 2026-08-29)*
- [ ] https://affittacameregliarchi.com/blog/pienza-pecorino-fiera-del-cacio-2026/  *(published 2026-08-28)*
- [ ] https://affittacameregliarchi.com/blog/is-arezzo-worth-visiting-2026/  *(published 2026-08-27)*

## Batch 7 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/bagno-vignoni-bagni-san-filippo-hot-springs/  *(published 2026-08-26)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-without-a-car-2026/  *(published 2026-08-25)*
- [ ] https://affittacameregliarchi.com/blog/montalcino-or-montepulciano-2026/  *(published 2026-08-24)*
- [ ] https://affittacameregliarchi.com/blog/siena-day-trip-or-overnight-2026/  *(published 2026-08-23)*
- [ ] https://affittacameregliarchi.com/blog/rent-a-car-in-florence-or-siena-2026/  *(published 2026-08-22)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-september-2026-festivals-events/  *(published 2026-08-21)*
- [ ] https://affittacameregliarchi.com/blog/giostra-del-saracino-arezzo-2026/  *(published 2026-08-20)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-in-march-2027/  *(published 2026-08-19)*
- [ ] https://affittacameregliarchi.com/blog/via-francigena-day-walk-siena/  *(published 2026-08-17)*
- [ ] https://affittacameregliarchi.com/blog/what-to-buy-in-tuscany-souvenirs/  *(published 2026-08-16)*

## Batch 8 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/tuscan-food-calendar-seasonal-dishes/  *(published 2026-08-15)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-on-screen-film-locations-2026/  *(published 2026-08-13)*
- [ ] https://affittacameregliarchi.com/blog/italy-beach-rules-2026/  *(published 2026-08-12)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-in-february-2027/  *(published 2026-08-11)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-in-january-2027/  *(published 2026-08-10)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-wine-harvest-vendemmia-2026/  *(published 2026-08-09)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-in-december-2026/  *(published 2026-08-09)*
- [ ] https://affittacameregliarchi.com/blog/italy-entry-requirements-ees-etias-2026/  *(published 2026-08-09)*
- [ ] https://affittacameregliarchi.com/blog/italy-transport-strikes-survival-guide-2026/  *(published 2026-08-09)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-in-november-2026/  *(published 2026-08-08)*

## Batch 9 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/val-dorcia-or-chianti-which-to-visit-2026/  *(published 2026-08-07)*
- [ ] https://affittacameregliarchi.com/blog/florence-summer-heat-survival-tips-2026/  *(published 2026-08-06)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-in-october-2026/  *(published 2026-08-06)*
- [ ] https://affittacameregliarchi.com/blog/siena-or-san-gimignano-day-trip-2026/  *(published 2026-08-05)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-olive-harvest-olio-nuovo-2026/  *(published 2026-08-04)*
- [ ] https://affittacameregliarchi.com/blog/siena-travel-cost-2026/  *(published 2026-08-03)*
- [ ] https://affittacameregliarchi.com/blog/florence-or-siena-which-to-visit-2026/  *(published 2026-08-03)*
- [ ] https://affittacameregliarchi.com/blog/siena-in-september-2026/  *(published 2026-08-02)*
- [ ] https://affittacameregliarchi.com/blog/florence-tourist-rules-2026/  *(published 2026-08-01)*
- [ ] https://affittacameregliarchi.com/blog/san-gimignano-day-trip-from-siena-2026/  *(published 2026-07-31)*

## Batch 10 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/tuscany-in-august-2026/  *(published 2026-07-31)*
- [ ] https://affittacameregliarchi.com/blog/siena-ferragosto-and-palio-week/  *(published 2026-07-28)*
- [ ] https://affittacameregliarchi.com/blog/italy-hotels-no-ac-2026/  *(published 2026-07-26)*
- [ ] https://affittacameregliarchi.com/blog/best-siena-hotels-with-parking/  *(published 2026-07-26)*
- [ ] https://affittacameregliarchi.com/blog/best-restaurants-siena-italy/  *(published 2026-07-25)*
- [ ] https://affittacameregliarchi.com/blog/val-dorcia-day-trip-from-siena-2026/  *(published 2026-07-18)*
- [ ] https://affittacameregliarchi.com/blog/avoid-crowds-in-florence-july-2026/  *(published 2026-07-17)*
- [ ] https://affittacameregliarchi.com/blog/venice-day-trip-from-tuscany-2026-access-fee/  *(published 2026-07-17)*
- [ ] https://affittacameregliarchi.com/blog/puccini-festival-torre-del-lago-2026-independent-traveller-guide/  *(published 2026-07-17)*
- [ ] https://affittacameregliarchi.com/blog/best-day-trips-from-florence-to-siena-2026/  *(published 2026-07-17)*

## Batch 11 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/7-day-tuscany-itinerary-independent-travellers-2026-florence-base/  *(published 2026-07-17)*
- [ ] https://affittacameregliarchi.com/blog/summer-packing-list-for-tuscany-and-florence-2026/  *(published 2026-07-17)*
- [ ] https://affittacameregliarchi.com/blog/hidden-gems-around-siena-tuscany-2026/  *(published 2026-07-17)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-packing-checklist/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/best-day-trips-from-siena/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/tuscany-food-guide/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/common-mistakes-siena/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/siena-hotel-vs-apartment-guide/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/siena-with-kids-in-one-day/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/siena-weekend-itinerary-for-couples/  *(published 2026-07-12)*

## Batch 12 - Articles, newest first

- [ ] https://affittacameregliarchi.com/blog/siena-tours-and-classes-to-book-first/  *(published 2026-07-12)*
- [ ] https://affittacameregliarchi.com/blog/where-to-stay-in-siena/  *(published 2026-07-11)*
- [ ] https://affittacameregliarchi.com/blog/siena-2-day-itinerary/  *(published 2026-07-11)*
- [ ] https://affittacameregliarchi.com/blog/siena-3-day-itinerary/  *(published 2026-07-11)*
- [ ] https://affittacameregliarchi.com/blog/how-much-siena-trip-costs/  *(published 2026-07-11)*
- [ ] https://affittacameregliarchi.com/blog/siena-with-kids/  *(published 2026-07-11)*
- [ ] https://affittacameregliarchi.com/blog/florence-travel-budget-guide/  *(published 2026-07-04)*
- [ ] https://affittacameregliarchi.com/blog/siena-weather-and-what-to-pack/  *(published 2026-07-03)*
- [ ] https://affittacameregliarchi.com/blog/
- [ ] https://affittacameregliarchi.com/travel-tools/itinerary-generator/

## Batch 13 - Tools and policy pages

- [ ] https://affittacameregliarchi.com/travel-tools/area-finder/
- [ ] https://affittacameregliarchi.com/travel-tools/packing-checklist/
- [ ] https://affittacameregliarchi.com/travel-tools/best-time-to-visit/
- [ ] https://affittacameregliarchi.com/travel-tools/transport-guide/
- [ ] https://affittacameregliarchi.com/about/
- [ ] https://affittacameregliarchi.com/contact/
- [ ] https://affittacameregliarchi.com/travel-tips/
- [ ] https://affittacameregliarchi.com/editorial-policy/
- [ ] https://affittacameregliarchi.com/privacy-policy/
- [ ] https://affittacameregliarchi.com/cookie-policy/

## Batch 14 - Tools and policy pages

- [ ] https://affittacameregliarchi.com/terms-of-use/
- [ ] https://affittacameregliarchi.com/terms-of-service/
- [ ] https://affittacameregliarchi.com/disclaimer/

## Legacy URLs (do nothing)

The B&B-era paths (`/en/*.html`, `/it/*.html`, `/index-en.html`, `/index.html`,
`www.`) and every slashless variant stay in "Page with redirect" until Google
drops them on its own schedule. They pass their value to the targets above.
No action exists that speeds this up, and none is needed.
