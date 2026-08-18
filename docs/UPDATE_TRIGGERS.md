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
| 1 | **ETIAS revised timeline announced** (eu-LISA board) | after Sep 2026 | travel-europe.europa.eu + EU press release | `italy-entry-requirements-ees-etias-2026` | Quick answer, delay section, timeline, 2 FAQs; remove "no confirmed date" phrasing; new checked-stamp | interim 9 Aug 2026: "until at least 2027" press consensus added; trigger still open for the official date |
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
| 15 | **Florence museum tariff revisions** (a cluster landed across 2025–26: Uffizi concessionaire moved to CoopCulture Oct 2025 with tickets.uffizi.it; Accademia €16→€20 and Palazzo Vecchio €12.50→€18 on 1 Feb 2026; Accademia+Bargello unified 15 Mar 2026; San Marco €8→€11 Sep 2025) | tariffs revise around 1 January / 1 February | uffizi.it, coopculture.it, Comune di Firenze civic-museums notices, Direzione regionale Musei nazionali Toscana | `uffizi-tickets-sold-out-what-to-do`, `florence-travel-budget-guide`, `avoid-crowds-in-florence-july-2026` | Re-check every Florence museum price each February; the Uffizi's advance-costs-more structure and low-season fare are the two most likely to shift | corpus swept 13 Aug 2026 |
| 16 | **OPA SI Pass / San Gimignano Pass price revision** | ~winter each year | operaduomo.siena.it, sangimignanomusei | the OPA pass and the San Gimignano Pass (€15) are quoted across ten-plus articles | Grep `articles.js` **and `sienaContentCluster.json`** for "OPA SI Pass" and "San Gimignano Pass" and update every instance together — these are the site's most-repeated prices, and `/siena-cathedral-guide` is now the canonical page they should all defer to | **FIRED 14 Aug 2026**: the Opera restructured the complex into three routes in March 2026 and repriced. Corpus swept from €14/€16 to €13/€15 across 13 articles in `articles.js` plus `one-day-in-siena`; `siena-cathedral-guide` rebuilt as the canonical page |
| 17 | **L’Eroica 2027 entries open** (Gaiole in Chianti) | ~early December 2026 | eroica.cc registration page | `leroica-gaiole-in-chianti-2026` | The 2026 article is written around a sold-out year. When the 2027 dates and the December registration opening are published, add them to the Quick answer and the entries table, and refresh the "how to get 2027" section into "how to get 2028"; also year-shift the mention in `tuscany-in-october-2026` |  |
| 18 | **Eroica Montalcino / Nova Eroica 2027 dates** | ~winter–spring 2027 | eroica.cc | `leroica-gaiole-in-chianti-2026` | Replace the "2027 dates were not published at our check" line with the real dates |  |
| 19 | **Autolinee Toscane line 127 timetable confirmed** (Siena–Pianella–Gaiole) | next time the operator PDF is reachable | at-bus.it | `leroica-gaiole-in-chianti-2026` | The article deliberately states we could not verify journey time, frequency or Sunday service against the operator. Replace that flagged unknown with the real timetable |  |
| 20 | **Accademia English ticket page corrected to €20** (it still showed €16 at our 14 Aug 2026 check while the Italian page showed €20) | unknown — check with the annual February tariff review | galleriaaccademiafirenze.it, both language versions | `accademia-tickets-sold-out-florence` | Remove the flagged English/Italian price discrepancy from the verification note once the pages agree |  |
| 21 | **Accademia last-admission cut-off settled** (gallery page says 30 min before closing, the March 2026 group announcement says 50) | with any hours revision | galleriaaccademiafirenze.it, bargellomusei.it | `accademia-tickets-sold-out-florence` | Replace the "be in the queue by 17:50" workaround with the real cut-off |  |
| 22 | **2027 free-admission and extraordinary-opening calendars published** (Accademia / Bargello group) | ~winter 2026–27 | galleriaaccademiafirenze.it news, bargellomusei.it | `accademia-tickets-sold-out-florence`, `best-things-to-do-in-florence` | Year-shift the free dates and the Monday/evening opening lists; the October Monday and 30 November dates are 2026-specific and will read as stale in 2027 |  |
| 23 | **Siena Duomo: the 1–15 November 2026 rule conflict resolved** (free winter cathedral entry starts 1 Nov, but the uncovered-floor fares run to 15 Nov, and the Opera does not say which governs) | any tariff-page revision | operaduomo.siena.it | `siena-cathedral-guide`, `tuscany-in-november-2026` | Replace the "budget the uncovered-floor fare, treat free entry as an upside" workaround with the real rule |  |
| 24 | **Siena Duomo: the superseded €14/€16 tariff removed from operaduomo.siena.it** (it was still findable alongside the new €13/€15 at our 14 Aug 2026 check) | unknown | operaduomo.siena.it | `siena-cathedral-guide` | Drop the flagged conflict from the verification note once only one tariff is published |  |
| 25 | **Siena Duomo: child and reduced rates published under the new three-route structure** (the old €3 pass / €6 Gate of Heaven child rates predate the March 2026 restructure and could not be confirmed) | unknown | operaduomo.siena.it | `siena-cathedral-guide`, `best-things-to-do-in-siena`, `siena-with-kids`, `siena-travel-cost-2026` | Replace the "ask at the ticket office" placeholders with the real child rates |  |
| 26 | **Siena Duomo 2027 floor-uncovering calendar** | ~winter 2026–27 | operaduomo.siena.it | `siena-cathedral-guide` and every article citing the 2026 windows | The 27 Jun–31 Jul and 18 Aug–15 Nov 2026 dates are year-specific; overlaps with trigger 2 |  |
| 27 | **Torre del Mangia winter ascent timetable** (we published the summer slot list but could not retrieve the winter one) | check with the 1 November season change | museocivico.comune.siena.it | `torre-del-mangia-guide` | Add the winter ascent times; the winter ticket office closes at 15:15, so the slot list matters more than in summer |  |
| 28 | **Palio-period Museo Civico and Torre del Mangia hours** (the Comune publishes special hours close to each race) | ~June and ~early August each year | comune.siena.it news | `torre-del-mangia-guide`, `palio-di-siena-guide`, `siena-ferragosto-and-palio-week` | Replace the "check the announcements for your day" note with the published hours while they are live |  |
| 29 | **Remaining thin Siena cluster pages** (600–750 words, all fact-checked 11 July 2026) | rolling editorial work | primary sources per page | `siena-contrade-guide`, `where-to-eat-in-siena`, `santa-maria-della-scala-siena`, `piazza-del-campo-guide`, `siena-walking-tour` | Rebuild each as `siena-cathedral-guide` and `torre-del-mangia-guide` were. Note also that `where-to-eat-in-siena` overlaps `best-restaurants-siena-italy` and should be resolved as a cannibalisation question, not a length one |  |
| 30 | **Siena anti-bivouac ordinance expires or is extended** (currently runs to 30 September 2026; bans lying down in public squares and eating on Piazza del Campo, sanctions €50–€480) | **30 September 2026 — imminent** | comune.siena.it ordinances | `piazza-del-campo-guide` | Confirm renewal and update the date, or remove the prohibition if it lapses. This is the page's headline fact, so it must not go stale |  |
| 31 | **Scope of the Campo food ban clarified** (the wording ties it to the area in front of Palazzo Pubblico; we advise treating the whole square as off-limits) and its interaction with authorised events such as the December Mercato nel Campo | with any ordinance revision | comune.siena.it | `piazza-del-campo-guide`, `tuscan-food-calendar-seasonal-dishes` | Replace the two flagged unknowns with the real scope; the food calendar's "market-stall eating on the Campo" line depends on the same answer |  |
| 32 | **Santa Maria della Scala 2026 seasonal schedule confirmed** (the museum revised its hours; we could confirm only the one-hour last-admission rule, the Friday late openings and the Palio-day and Wine&Siena closures) | next schedule publication | santamariadellascala.com | `santa-maria-della-scala-siena` | Publish the seasonal table as fact and remove the "be inside 90 minutes before closing" workaround; confirm whether the Tuesday winter closure survives |  |
| 33 | **Siena municipal museum tariffs** (Museo Civico €10, Torre €10, Santa Maria della Scala €9, combinations €14/€15/€20) | ~winter each year | museocivico.comune.siena.it, santamariadellascala.com | `torre-del-mangia-guide`, `piazza-del-campo-guide`, `santa-maria-della-scala-siena`, `how-much-siena-trip-costs`, `siena-travel-cost-2026` | These now appear across the rebuilt cluster pages and the cost guides — update them together, as with the OPA pass |  |
| 34 | **Protocollo Equino re-signed / horse-welfare record updated** | the Protocollo is re-signed annually; fatality counts change with events | palio.comune.siena.it *Tutela del Cavallo* and *Protocollo Equino*, ENPA/OIPA campaign material, Italian press | `palio-di-siena-guide` | Refresh the measures list and the fatality counts. Still open: an official fatality tally (none found), the exact published age and breed eligibility rules (sources give both "at least five years" and "not under four nor over seven"), and the number of horses at the Pensionario | **FIRED 16 Aug 2026**: welfare section written into `palio-di-siena-guide` with both the Comune's documented measures and the campaigners' counts |
| 35 | **The full list of seven official contrada rivalries** (we confirmed that seven recognised pairs exist and verified several, but did not enumerate all seven from a primary source) | any time palio.comune.siena.it "Rivalità e alleanze" is reachable | palio.comune.siena.it | `siena-contrade-guide` | Replace the partial list with the complete seven and remove the flagged gap |  |
| 36 | **Contrada patron saints, titular feast dates and the baptism rite** (unestablished; the Chiocciola-1949 revival story is widely repeated and unconfirmed) | rolling | comune.siena.it Glossario, individual contrada sites | `siena-contrade-guide` | These govern when each contrada celebrates and baptises — the missing piece that would let the page carry a usable annual calendar |  |
| 37 | **Production deploy freeze, August 2026** — Cloudflare Pages stopped serving new builds (fresh smoke run #232 on 18 Aug failed against corrected expectations, 11h after the last push); articles dated 17–18 Aug never appeared | **OPEN — owner action required**: check the Cloudflare Pages dashboard (failed builds? build limit? GitHub integration disconnected?) and restore deploys | Cloudflare Pages dashboard; issue #108; deploy-smoke runs | the whole site — everything merged since the freeze is not live | Once deploys work again, the new daily 00:05 WIB publish trigger keeps the drip independent of merge cadence, and deploy-smoke auto-closes #108 on recovery |  |
