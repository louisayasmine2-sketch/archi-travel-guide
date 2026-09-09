# Backlinks, phase 2: from link count to traffic

<!-- audit:ignore -->
Owner-side execution document, companion to `docs/BACKLINK_100_TRACKER.md`
(the 100-domain programme) and `docs/PITCH_DRAFTS.md`. Researched by web
search on 9 September 2026 in an environment whose direct page fetches are
blocked: **every site named below comes from search results, not from an
opened page** — open each one before pitching. Nothing here loosens the
earn-only rules in `docs/LINK_EARNING_WORKLIST.md`.
<!-- /audit:ignore -->

## 1. The target, stated honestly

The brief is "100,000 views a day". That is roughly 36 million views a
year — the traffic of a national travel portal. Two things have to be said
plainly before any plan, because a plan built on a wrong premise wastes
the year:

**Backlinks do not create views.** They create rankings. Rankings turn
into views only in proportion to how many people search for the thing
ranked. A page at #1 for every English query about Siena cannot draw more
readers than the number of people searching about Siena. That ceiling is
a number we can measure but must not guess — it lives in Search Console
(Performance → Queries → Impressions). The Performance export has still
not been sent. The **Coverage export (9 September 2026)** has, and it
moves the goalposts before any link is earned: the site averaged **28
impressions a day** over 2 July–4 September, **8 a day** in the last two
weeks of that window, and Google indexes **64 URLs** of the ~120 it should —
61 articles sit in "Excluded by noindex" because they were linked and
crawled while still scheduled. That mechanism is fixed in the repo
(`GSC_INDEXATION_TRACKER.md`, 9 September entry); recovery is a manual
Request-indexing round. **Until indexation recovers, a backlink to an
unindexed page is worth nothing**, so the indexing round comes first and
this document's tiers second. No search-volume figure will be printed
here from memory.

**What 100k/day would actually require** is topical footprint, not link
count: ranking across the head terms of Italy travel as a whole (Rome,
Florence, Venice, the Amalfi coast, Italian trains, ...) with hundreds of
pages each competing against national publishers. That is a content
strategy decision with real editorial-identity costs — this site's trust
comes from being written *from Siena* — and it is yours to make, not one
a backlink plan can quietly imply. Until you make it, the honest target
is: **the largest share of Siena-and-Tuscany search demand this site can
take, measured monthly against the Search Console baseline.**

What phase 2 changes: the programme stops counting links and starts
weighing them. A citation from a page that already ranks for one of our
money queries sends readers who are in-market *today* and passes exactly
the relevance Google rewards. One of those is worth twenty directory
listings. The roster below is ordered by that value.

## 2. Traffic-weighted tiers

### Tier 1 — pages that rank for our money queries (highest value)

Independent pages surfaced by search on 9 September 2026 for the queries
this site is built around. A link or citation from any of them is
relevance plus referral. Pitch one specific, checkable improvement to
*their* page (our dated-fact layer), never "link to us".

| Query family | Ranking independent pages (search-derived, unopened) | Our asset |
|---|---|---|
| Florence to Siena | Along Dusty Roads (day-trip planner), Rome Toolkit (Siena from Florence page), Unseen Italy (Siena by bus guide), Invitation to Tuscany (how to get to Siena), Amoitaly (access/timetable page) | `/florence-to-siena-by-train-or-bus`, `/blog/siena-from-florence-airport-transfer/` |
| Things to do in Siena | Bon Traveler (first-timer guide — already on the worklist), GastroTravelogue, Savoring Italy (Siena complete guide) | `/things-to-do-in-siena`, `/piazza-del-campo-guide`, `/siena-cathedral-guide` |
| Palio di Siena | Guide to Italy (2026 Palio guide), Idealista's English news piece on Palio dates | the Palio dates and contrade coverage; `/siena-contrade-guide` |

Pages on those results that are **not** targets: GetYourGuide and Winalist
(marketplaces), TryTravel and Holafly (commercial content arms — an eSIM
seller's blog linking a guide is a paid conversation we do not open),
Rome2rio and CheckMyBus (aggregators), tour operators selling Palio
packages. Same rule as the cycling channel: commercial operators are
excluded.

A note on siena-cathedral.com, which ranks for "how to get to Siena
Cathedral": it is a single-topic site on our own patch. Read it before
deciding anything — it is either a peer worth knowing or a competitor
worth learning from, and search results cannot tell which.

### Tier 2 — audience carriers (newsletters and Substacks)

A mention in a newsletter with a real subscriber base sends more readers
in one morning than most links send in a year, and the archive page keeps
the link. The Florentine published "The Tuscany Substacks worth reading
now" in January 2026 — that article is the map of this tier.

- Elizabeth Minchilli's newsletter (Italy food and travel; search results
  describe a subscriber base in the tens of thousands — verify on the
  Substack page itself before treating that as a fact)
- Love to Visit Italy (Tuscany-heavy, daily free edition)
- Italy Travel News (English-language Italy news for travellers)
- Anywhere Italy (Peter Benei) and Danielle Oteri's Italy — both run
  Substack recommendation pages, which is how this network cross-links
- Emiko Davies (Tuscany food; a fit only for food-adjacent originals)

Pitch only a genuinely original piece, once, when it publishes: the
bottini, the Bond scene-by-scene, the L'Eroica spectator guide, the 1348
story. A routine guide is not newsletter material and asking wastes the
one email you get.

### Tier 3 — curated listings (low value, near-certain, do once)

- Feedspot's Italy travel and Italy blog lists take free submissions via
  "Submit your blog". **Free listing only** — the paid "featured"
  placement is bought visibility, which is the line we do not cross.
- The vidalingua "Top Italy travel blogs" roundup and similar editorial
  lists: one short note with the two best originals; no follow-up.

### Tier 4 — forums (referral only, never for links)

Fodor's Travel Talk (Tuscany threads are active and long-lived) and
Reddit's Italy travel communities. The rule from the worklist stands: a
genuinely helpful answer that happens to mention our page is
participation; a pasted link is spam. Forum links carry no ranking value
— the readers do.

### Never

- **Wikivoyage**, added to the Wikipedia rule: its external-links policy
  is primary sources only (official tourism and government sites). A
  guide site adding itself is a policy violation editors revert.
- Paid placements of any kind, including "featured" listings and
  sponsored-post offers from commercial travel content sites.

## 3. Timing that matters this month

- **The cycling window is open now.** The L'Eroica guide published on
  2 September; the event is 3–4 October. Tracker rows 5–7 (road.cc,
  BikeTips, Out Of The Box Florence) should go out this week — after
  1 October the peg is dead for a year.
- Palio pages (Tier 1, third row) are best pitched in May, when their
  authors refresh for the July race. Log them now, send in May 2027.
- Florence-to-Siena pages refresh for the autumn timetable change — a
  pitch that carries our dated bus-line check lands best in October.

## 4. How this is measured

The score is no longer "links ÷ 100". Two numbers, both from Search
Console, checked monthly and written into the tracker's dates column:

1. **Impressions** for the Siena/Tuscany query families above — the
   demand ceiling, and whether we are climbing toward it.
2. **Referring domains** (Links → Top linking sites) — which Tier 1 and
   Tier 2 rows actually turned into links.

A month in which impressions rise and clicks rise faster than impressions
is the programme working. A month with new links and flat impressions
means the links are the wrong links.

## 5. What Claude does next, on request

- Draft the Tier 1 pitches against a named page once you have opened it
  and confirmed what it says (the correction has to be real).
- Build the next linkable original on the Bond/bottini pattern for the
  newsletter tier.
- Turn the Search Console export into the real ceiling for §1 and a
  query-by-query priority list for content.
