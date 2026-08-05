# Reconciliation: 131R Sunday departure counts — 8 vs 6

**Date:** 5 August 2026
**Question:** The W32 social card says **eight** Sunday 131R departures; site content says **six**. Which is right?
**Answer:** Both. They count different directions. No published figure was wrong; one wording has been tightened.

## Source re-checked

Autolinee Toscane 131R summer timetable PDF, header **"Valido dal 27.07.2026"**, downloaded fresh on 5 August 2026 from the official line page ([at-bus.it, linea 131R](https://www.at-bus.it/it/linee-e-orari/regionali-131r) → "Scarica gli orari in formato pdf", hosted at `https://rd-sftp-data.s3.eu-west-1.amazonaws.com/autolineeToscane/IVU/OUTPUT/TIMETABLES_SUMMER/R/131R.pdf`). Text was extracted programmatically from the PDF's content streams with positions, so the counts below are read from the actual timetable columns, not from a summary.

## What the timetable says for Sundays and public holidays (Festivo)

**Florence → Siena (from Firenze Autostazione):** 7 trip columns at 6 distinct departure times.

| Departure | Trip number(s) |
|---|---|
| 09:10 | 79126 **and** 79127 — two coaches, same minute, slightly different intermediate timings, both arrive Via Tozzi 10:25 |
| 14:10 | 79128 |
| 15:10 | 79129 |
| 17:20 | 79130 |
| 18:10 | 82951 |
| 19:10 | 82964 |

The 09:10→14:10 gap is confirmed. The VALIDITÀ and NOTE rows are empty for every Festivo column, so no trip is date-restricted within the period.

**Siena → Florence (from Siena Via Tozzi):** 8 trips at 8 distinct times — 11:10, 14:10, 16:10, 16:40, 17:40, 17:50, 18:10, **19:10** (last). The weekday page confirms the last weekday departure at **20:45**.

## Definitions, and where each number lives

- **8 = Sunday departures *back*, Siena → Florence.** Used by the W32 day-4 card (`social-output/2026-W32/day4-sunday-timetable/`, all assets), `tools/social/facts.json` (`sunday-timetable`), and the body of the live guide `florence-to-siena-by-train-or-bus` (`frontend/src/data/florenceToSienaGuide.json`). **Correct as published** — every asset already says "back"/"leaves Siena", and the 19:10/20:45 last-bus pair is confirmed.
- **6 = Sunday departure *times outbound*, Florence → Siena.** Lives only in the quick-answer comparison table of the same guide ("only six departures from Florence"). Strictly, the timetable shows **seven coaches at six departure times**, because two coaches share the 09:10 slot. Correct in substance, now worded precisely.

Contrary to the premise that prompted this check: the live **travel-cost** article (`siena-travel-cost-2026`) and the article scheduled for **13 August** (`siena-day-trip-or-overnight`, branch `content/siena-day-trip-or-overnight`) do **not** state a departure count in either direction. They cite only the Sunday 09:10→14:10 gap and the 19:10 vs 20:45 last departures — both confirmed above, so neither article needs a change.

## What was changed

Nothing numeric was wrong, so no figure was corrected. One clarity fix in `frontend/src/data/florenceToSienaGuide.json`:

- Quick-answer frequency cell now reads "**only six departure times from Florence** (seven coaches — two share the 09:10 slot) … and **eight departures back from Siena**, the last at 19:10 (checked 5 Aug 2026)" — both directions now sit side by side with their definitions, so the site and the social card can no longer be read as contradicting each other.
- `factChecked`/`dateModified` bumped to 5 August 2026, and the disclosure note records the 5 August PDF re-count.

The W32 card assets are untouched: their claim was verified correct and they already carry the honest "Checked 3 August 2026" stamp.

## Guardrail for future cards and articles

When citing the 131R Sunday service, always state the direction with the count: *six departure times out (seven coaches), eight departures back, last back at 19:10.* A bare "N departures on Sunday" is ambiguous and produced this false alarm.
