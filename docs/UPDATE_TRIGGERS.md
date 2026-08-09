# Update triggers — the editorial maintenance registry

<!-- audit:ignore -->
Every date-stamped claim and every honestly-flagged unknown across the site,
in one place. When one of these external events happens, the listed articles
need the listed edits — usually five minutes each. Without this registry the
site's honesty flags ("dates unpublished at our July 2026 check") silently
rot into staleness; with it, they become scheduled maintenance.

How to use: skim the "expected when" column monthly (or run through it at the
start of any editing session). When a trigger fires, verify against the
primary source named, make the edit, refresh the article's `updated` date and
its in-body "checked" stamp, and tick the row here with the date done.
Slugs refer to `frontend/src/data/articles.js`.
<!-- /audit:ignore -->

## High-value triggers (traffic-moving when they fire)

| # | Trigger event | Expected when | Verify against | Articles to update | What to change | Done |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **ETIAS revised timeline announced** (eu-LISA board) | after Sep 2026 | travel-europe.europa.eu + EU press release | `italy-entry-requirements-ees-etias-2026` | Quick answer, delay section, timeline, 2 FAQs; remove "no confirmed date" phrasing; new checked-stamp |  |
| 2 | **Duomo floor 2027 uncovering calendar published** | winter 2026–27 | operaduomo.siena.it | `siena-in-september-2026`, `tuscany-in-october-2026`, `tuscany-in-november-2026`, `tuscany-in-august-2026`, `florence-or-siena…`, `siena-or-san-gimignano…` | 2026 window references gain the 2027 dates (or a "for 2027 see official calendar" line); OPA prices re-checked |  |
| 3 | **Mercato nel Campo 2026 dates announced** | ~Oct–Nov 2026 | Comune di Siena / visitsiena | `tuscany-in-december-2026` | Replace "first-weekend pattern + unpublished" with the real dates in body + FAQ |  |
| 4 | **Festa dell'Olio San Quirico 2026 dates announced** | ~Oct–Nov 2026 | Comune San Quirico d'Orcia | `tuscany-in-december-2026` | Same treatment as #3 |  |
| 5 | **You, Me & Tuscany streaming release** | unknown (was unverified Jul 2026) | Universal / platform announcements | `tuscany-on-screen-film-locations-2026` | Add platform + date; this is the article's second traffic wave — consider re-promoting |  |
| 6 | **Teatro del Silenzio 2027 dates announced** | ~winter–spring 2027 | teatrodelsilenzio.it | `tuscany-on-screen-film-locations-2026` | Replace "pattern is late July, dates unannounced" with real dates in body + FAQ |  |

## Seasonal-cycle triggers (annual re-verification)

| # | Trigger | Expected when | Verify against | Articles | Change | Done |
| --- | --- | --- | --- | --- | --- | --- |
| 7 | Saldi invernali 2027 start date set | ~Dec 2026 | Regione Toscana announcements | `tuscany-in-january-2027`, `tuscany-in-february-2027` | Replace pattern language with the confirmed date |  |
| 8 | Viareggio Carnival 2027 schedule confirmation | near date (Dec–Jan) | ilcarnevale.com official channels | `tuscany-in-january-2027`, `tuscany-in-february-2027` | Confirm/adjust the parade list we published from the announced calendar |  |
| 9 | Sagra del Tordo 2026 programme published | ~Sep–Oct 2026 | festival/Montalcino official channels | `tuscany-in-october-2026` | Replace "programme unpublished" note with dates |  |
| 10 | Expo Chianti Classico 2027 dates | ~spring 2027 | expochianticlassico.com | `tuscany-wine-harvest-vendemmia-2026`, `siena-in-september-2026`, `val-dorcia-or-chianti…` | Year-shift the event block (or fork a 2027 update) |  |
| 11 | Cala Violina 2027 booking season opens | ~spring 2027 | Comune di Scarlino portal | `italy-beach-rules-2026` | Re-check cap/fee/window; refresh stamps |  |
| 12 | Winter (settembre) timetable change, bus 130/131R | ~Sep 2026 | at-bus.it | `san-gimignano-day-trip-from-siena-2026`, `rome-to-siena-train-bus-2026`, `siena-from-florence-airport-transfer` | Re-check journey times/fares; the fare-refresh PRs (e.g. #37) may already cover parts — check git log first |  |
| 13 | OPA SI Pass / San Gimignano Pass 2027 prices | ~winter 2026–27 | operaduomo.siena.it / sangimignanomusei | all articles citing €16 / €15 | Site-wide price re-check (grep for "€16" / "€15" in articles.js) |  |

## Commercial triggers

| # | Trigger event | Expected when | Verify against | What to change | Done |
| --- | --- | --- | --- | --- | --- |
| 14 | **First affiliate programme approved** | unknown (none applied for as of Aug 2026) | the partner's own dashboard | Same-day switch: tracking parameter into the `/go/` line in `frontend/public/_redirects`, `PROGRAMME_STATUS` to `"live"` in `frontend/src/lib/monetisation.js`, and every "we earn nothing" claim rewritten — `Home.jsx` ("Nobody pays to be listed"), `TravelDeals.jsx` (hero line + "How we chose these"), `Legal.jsx` editorial policy. Full procedure in `MONETIZATION_CHECKLIST.md` |  |

## Standing re-checks (no single trigger)

- **EES queue reports** (`italy-entry-requirements…`, `rome-to-siena…`): the
  "first summer" framing expires naturally — soften after Oct 2026.
- **Florence rules extensions** (`florence-tourist-rules-2026`): the rental
  restrictions were "mid-extension" at writing; check comune news quarterly.
- **Strike landscape** (`italy-transport-strikes…`): franchigia dates are
  stable law, but re-verify the 27 Jul–5 Sep span each spring.
- **Photo work**: see `docs/PHOTO_SOURCING_WORKLIST.md` (status: open).
- **GSC indexation**: see `GSC_INDEXATION_TRACKER.md` batch 2 table.

## Cadence suggestion

First editing session of each month: skim this file top to bottom (5 min),
fire any triggered rows, and re-run `python tools/audit_content.py` after
edits. September 2026's session is the big one: triggers 1, 9 and 12 all
likely fire.

## Added August 2026

| # | Trigger | Expected when | Verify against | Articles | Change | Done |
| --- | --- | --- | --- | --- | --- | --- |
| 14 | Ministry of Health summer heat-bulletin season ends / restarts | bulletins run in summer months each year | salute.gov.it heat pages | `florence-summer-heat-survival-tips-2026`, `tuscany-in-august-2026` | Keep the bollino-rosso reference seasonal; re-verify the bulletin's format each May |  |
