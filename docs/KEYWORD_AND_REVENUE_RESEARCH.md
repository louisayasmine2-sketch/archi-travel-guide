# Keyword & revenue research — August 2026

<!-- audit:ignore -->
Scope note, read first. This pack was produced in a network-restricted
session. **It contains no search volumes, no difficulty scores and no ranking
positions**, because those cannot be obtained here and inventing them would be
worse than omitting them. Everything below is derived from the repository's own
data — 69 published articles, their keyword fields, the internal link graph,
`_redirects`, and the affiliate worklist — and is therefore checkable by anyone
who re-runs the same analysis. Section 6 lists exactly what still needs an
external tool, and who can close it.
<!-- /audit:ignore -->

---

## 1. What the site already targets

62 of 69 published articles carry a `primaryKeyword`. Grouped:

| Theme | Articles | Note |
|---|---:|---|
| Siena city | 27 | The pillar. Deep and well covered. |
| Seasonal (month guides) | 11 | Nearly complete calendar. |
| Florence | 7 | Growing. |
| Transport | 5 | Small, but holds the site's two strongest pages. |
| Food | 5 | |
| Practical | 5 | |
| **Film & culture** | **2** | `tuscany film locations`, `puccini festival` |

**Seven published articles carry no `primaryKeyword` at all** — they were never
given a target: `florence-to-siena-transport`, `siena-travel-cost-2026`,
`best-restaurants-siena-italy`, `siena-weather-and-what-to-pack`,
`best-things-to-do-in-florence`, `florence-travel-budget-guide`,
`italy-hotels-no-ac-2026`. The first of those is, by internal links, the most
important page on the site.

---

## 2. The Bond question, answered

**The pillar already owns the term.** `tuscany-on-screen-film-locations-2026`
lists `quantum of solace siena` as one of its nine secondary keywords, and its
Bond section is written to rank for exactly that phrase.

So a new page cannot simply "target Bond in Siena" — it would compete with our
own article for the same query. Two workable options:

**Option A — child page, narrower target (recommended).**
The new page takes the *deep* intent the pillar cannot serve at its length, and
the pillar keeps the broad one:

| Page | Primary target | Keeps |
|---|---|---|
| Pillar (existing) | `tuscany film locations` | The Bond section as a summary, linking down |
| New child | `quantum of solace filming locations` | Scene-by-scene, access verdicts, the route |

The pillar's `quantum of solace siena` secondary keyword moves to the child;
the pillar keeps its Bond *section* but stops chasing the phrase.

**Option B — do not write it; strengthen the pillar instead.**
Legitimate, and cheaper. Film & culture is a two-article theme with one
near-orphan pillar (see §3). A second film page inherits that weakness unless
the linking is fixed first.

**Recommendation: Option A, but only after §4 is done.** The Bond page is
worth writing — it is genuinely on-pillar for a Siena site, and set-jetting
intent converts to tours — but shipping it into the current funnel would waste
it, for the reason in the next section.

---

## 3. The finding that matters more than the article

The site's commercial links are attached to the wrong pages.

**Live commission programmes: 4 slugs, 2 programmes.** Viator
(`/go/viator`, `/go/viator-siena-san-gimignano-tour`) and DiscoverCars
(`/go/discovercars`, `/go/discovercars-italy`). Eight other `/go/` rows exist as
placeholders for programmes **not yet applied for** — the worklist rows are
blank, so "pending approval" overstates them.

**Only 5 published pages carry a live commercial link.** All 5 are correctly
disclosed. But look at where the authority sits:

| Page | Inbound links | Commercial intent | Live link? |
|---|---:|---|---|
| `/florence-to-siena-by-train-or-bus` | **22** (most-linked page on the site) | Transport decision | **none** |
| `/blog/where-to-stay-in-siena` | **29** | Accommodation | none (programme not applied for) |
| `/blog/siena-day-trips-without-a-car` | **15** | Day trips, no car → tours | **none** |
| `/blog/val-dorcia-day-trip-from-siena-2026` | **14** | Day trip → tour or car | **none** |
| `/blog/siena-ztl-fines-how-to-avoid` | 17 | Driving | DiscoverCars ✓ |
| `/blog/siena-parking-and-transfer-guide` | 10 | Driving | DiscoverCars ✓ |
| `/blog/san-gimignano-day-trip-from-siena-2026` | 9 | Day trip | Viator ✓ |
| `/blog/siena-tours-and-classes-to-book-first` | **1** | *Literally about what to book* | **none** |
| `/blog/val-dorcia-or-chianti-which-to-visit-2026` | **0** | Day trip | DiscoverCars ✓ |

Read the two extremes together: our **best-linked day-trip page has no way to
convert**, and one page that *does* convert has **zero inbound links from any
published article**. An article explicitly titled around what to book first
carries no booking path at all.

**Three structural leaks, all fixable without writing a word of new prose:**

1. **The most-linked page has no funnel exit.** `FlorenceToSienaGuide.jsx` and
   `SienaDayTripFromFlorence.jsx` do not render `ToolCue` at all, so the site's
   two strongest pages send readers nowhere — not to a tool, not to a booking
   decision. Their categories (`Tuscany Transport`, `Siena Day Trips`) are also
   missing from the `ToolCue` category map.
2. **A converting page is orphaned.** `val-dorcia-or-chianti-which-to-visit-2026`
   holds a live DiscoverCars link and receives no internal links from any
   published article.
3. **The funnel is planner-shaped, not commerce-shaped.** Every `ToolCue`
   destination is a free planning tool. That is right for trust, but it means
   the only commercial paths are the hand-placed body links on 5 pages.

Also worth knowing: **three car-hire articles carrying live DiscoverCars links
are still scheduled** (18, 22 and 25 August). The car-hire money path barely
exists in published content yet — it arrives over the next ten days.

---

## 4. Prioritised worklist, highest revenue impact first

Ordered by expected effect per unit of work. Nothing here requires new
research; every item is a repo change.

1. **Give the two standalone guide pages a funnel exit.** Render `ToolCue` on
   `FlorenceToSienaGuide.jsx` and `SienaDayTripFromFlorence.jsx`, and add their
   categories to the map. Affects the #1 and a top-10 page.
2. **Link the orphaned converting page.** Add contextual links to
   `val-dorcia-or-chianti-which-to-visit-2026` from the Val d'Orcia and Chianti
   articles that already exist.
3. **Put a commercial path on the high-authority day-trip pages** —
   `siena-day-trips-without-a-car` (tours: Viator, live) and
   `val-dorcia-day-trip-from-siena-2026` (car: DiscoverCars, live). Each needs a
   disclosure added in the same edit; the scanner enforces this.
4. **Give the 7 keyword-less articles a `primaryKeyword`**, starting with
   `florence-to-siena-transport` — the site's most-linked page currently has no
   declared target.
5. **Retire or rewrite `MONETIZATION_CHECKLIST.md`.** It documents components
   that no longer exist and instructs adding partner parameters directly into
   article data — which would breach CLAUDE.md §1 and §2 if anyone followed it.
6. **Then write the Bond child page**, per
   `docs/BOND_SIENA_ARTICLE_BRIEF.md`, with the keyword split from §2.

---

## 5. How the Bond page should monetise (when it is written)

Set-jetting readers are planning a *day*, not a purchase — so the honest path
is tours and transport, not hotels.

- **Fits:** Viator (live) for a Siena walking or Palio-season tour;
  DiscoverCars (live) if the piece covers the film's non-Siena Tuscan locations,
  which need a car.
- **Does not fit:** accommodation. Booking.com is not applied for, and a
  hotel pitch on a film-locations page is a mismatch anyway.
- **Placement**, following the convention 10 of 11 monetised articles already
  use: the commercial link sits mid-body inside the section it actually serves,
  or in a terminal "next steps" — never in the opening.
- **Disclosure is mandatory** the moment a live slug appears on the page
  (`links_without_disclosure` fails the run). Conversely, adding a disclosure
  without a live link also fails. The rules are symmetric and the scanner
  enforces both directions.
- **Never** put a tracking parameter in the article. It lives only in
  `_redirects`; `rel="sponsored"` is derived from `SPONSORED_GO_SLUGS`.

---

## 6. What still needs an external tool

These cannot be answered from the repository, and none should be guessed:

- [ ] Search volume and trend for `quantum of solace filming locations`,
      `james bond siena`, `tuscany film locations`, `set jetting italy`.
- [ ] Whether the pillar currently ranks for `quantum of solace siena`, and on
      which page — this decides whether the child page should take the term or
      whether splitting would sacrifice an existing position.
- [ ] SERP shape for the Bond queries: if it is dominated by fan wikis and
      video, the commercial ceiling is low and Option B gets stronger.
- [ ] Real traffic per page, to test §3's assumption that internal links
      correlate with entry traffic here.
- [ ] Which of the eight unapplied programmes are worth applying for, given
      that `where-to-stay-in-siena` (29 inbound, the strongest commercial-intent
      page on the site) has no programme to point at.

Whoever closes these should record the tool, the date and the figure in this
file, and date-stamp it — the same rule the articles follow.
