# Photo sourcing worklist

<!-- audit:ignore -->
Status: **open**. Prepared 2026-07-31 in a network-restricted session: every
candidate below was found via web search, but the session's egress policy
blocked image downloads and licence-page fetches, so **nothing here has been
downloaded and no licence has been eyeball-verified**. Whoever executes this
list (a person, or a Claude session with open network) must open each source
page, confirm the licence tag on the page itself, download, convert, and fill
the credit rows. Do not shortcut the licence check — the editorial standard
treats undocumented images as licensing exposure.
<!-- /audit:ignore -->

## House technical spec (applies to every slot)

- Format: **WebP**. Hero **1600px** wide, in-body **1200px**, each **< 200KB**.
- Every image gets descriptive alt text (drafted per slot below).
- Record every acquisition in `docs/image-credits.csv` (template rows at the
  bottom of this file) **before** referencing the file from any article.
- Acceptable licences: public domain, CC BY, CC BY-SA (note share-alike
  obligations for crops/derivatives), or Unsplash/Pexels licence. CC BY-NC is
  **not** acceptable (the site is monetised-in-intent).
- Never reference an image from an article until the file exists in
  `frontend/public/images/`.

---

## Part A — New slots wanted by recent articles

### A1. Beach hero — `italy-beach-rules-2026`

The article currently uses an honestly captioned Burano image as a stand-in.
Replace its hero once a real beach photo lands.

| Field | Value |
| --- | --- |
| Target file | `frontend/public/images/tuscany/cala-violina-beach-maremma.webp` |
| Subject wanted | Cala Violina's cove (turquoise water, pine backdrop) or a clean Maremma beach scene |
| Candidate source pages (licence unverified) | Commons: `File:Cala Violina Grosseto Tuscany.jpg` · `File:Spiaggia di cala violina - Scarlino GR.jpg` (both surfaced via search; open the file pages, check the licence tag) |
| Draft alt | "The turquoise cove of Cala Violina backed by pine forest on the Maremma coast" |
| After download | Swap the hero + in-body image of `italy-beach-rules-2026` in `frontend/src/data/articles.js`; keep the Burano image only if a second coastal visual is still wanted |

Optional companion: a Versilia stabilimento row-of-umbrellas shot
(Commons candidate: `File:Passeggiata di viareggio 14.1 bagno bertuccelli.JPG`)
for the stabilimento-explainer section.
Target: `frontend/public/images/tuscany/viareggio-stabilimento-beach.webp`.

### A2. Film-location set — `tuscany-on-screen-film-locations-2026`

The article ships with the existing Val d'Orcia cypress landscape as hero
(honest, but generic). These four would upgrade it to a properly illustrated
location guide. All are *nice-to-have*; the article works without them.

| # | Target file | Subject | Candidate source (licence unverified) | Draft alt |
| --- | --- | --- | --- | --- |
| 1 | `images/tuscany/terrapille-gladiator-road-pienza.webp` | The Terrapille cypress track south of Pienza | Search Commons category for Terrapille/Pienza countryside; multiple files exist under Val d'Orcia categories | "The cypress-lined Terrapille farm road south of Pienza, used in Gladiator's Elysian Fields scene" |
| 2 | `images/tuscany/piazza-grande-montepulciano.webp` | Piazza Grande + Palazzo Comunale (New Moon scene) | Commons category `Piazza Grande of Montepulciano` (17 files listed); e.g. `File:Montepulciano, piazza grande 01.jpg` / `02.jpg` / `File:Montepulciano Piazza Grande.jpg` | "Piazza Grande and the Palazzo Comunale in Montepulciano, filming location for New Moon's Volterra scenes" |
| 3 | `images/tuscany/sant-anna-in-camprena-monastery.webp` | Sant'Anna in Camprena facade or courtyard | Commons category `Sant'Anna in Camprena`: `File:Monastero di Sant'Anna in Camprena, facciata.JPG` · `...cortile.jpg` · `File:Sant'Anna in Camprena.jpg` | "The former monastery of Sant'Anna in Camprena near Pienza, filming location of The English Patient" |
| 4 | `images/siena/piazza-del-campo-bond.webp` | Campo angle suited to the Bond section | Already-owned Campo assets may suffice — check `05-piazza-del-campo-panorama.webp` first before sourcing anything new | — |

---

## Part B — The three photos with no provenance record

These files pre-date this sprint, are used across seven live articles, and
appear in **no** credit file (`docs/image-credits.csv`, `image-attribution.json`,
or any article's photo-credits section). Until resolved they are undocumented
licensing exposure.

| File | Used by (article slugs) |
| --- | --- |
| `images/tuscany/san-gimignano-medieval-towers.webp` | italy-hotels-no-ac-2026 (hero) · 7-day-tuscany-itinerary… · san-gimignano-day-trip-from-siena-2026 (hero + in-body) · siena-or-san-gimignano-day-trip-2026 |
| `images/siena/monteriggioni-walled-village-siena.webp` | hidden-gems-around-siena-tuscany-2026 · san-gimignano-day-trip-from-siena-2026 · tuscany-olive-harvest-olio-nuovo-2026 |
| `images/siena/siena-tuscany-wine-tasting-experience.webp` | hidden-gems-around-siena-tuscany-2026 · val-dorcia-day-trip-from-siena-2026 · san-gimignano-day-trip-from-siena-2026 · tuscany-wine-harvest-vendemmia-2026 |

**Resolution procedure, per file:**

1. Reverse-image-search (Google Lens, TinEye, Bing Visual) the file.
2. **If the original is found** with a compatible licence → add a full row to
   `docs/image-credits.csv` (template below) and, where the licence requires
   attribution, extend the relevant articles' credit noting. Done.
3. **If the original cannot be found or the licence is incompatible** →
   replace the file: source a same-subject substitute (San Gimignano skyline,
   Monteriggioni walls, and wine-tasting scenes are all plentiful on Commons
   and Unsplash), save it **under the same filename** so no article edits are
   needed, and record the new credit row.
4. Either way, note the outcome in this file and close the row.

---

## Credit-row templates (`docs/image-credits.csv` format)

Fill one line per acquired file, matching the existing header:

```csv
article_route,filename,og_filename,source_page,platform,photographer,license,license_url,credit,alt_text,cropped,hero_bytes,og_bytes
/blog/italy-beach-rules-2026,cala-violina-beach-maremma.webp,,<SOURCE_PAGE_URL>,Wikimedia Commons,<AUTHOR>,<LICENSE e.g. CC BY-SA 4.0>,<LICENSE_URL>,"Photo: <AUTHOR> / Wikimedia Commons / <LICENSE>. Cropped/resized.",\"The turquoise cove of Cala Violina backed by pine forest on the Maremma coast\",\"Yes, resized/compressed for web\",,
/blog/tuscany-on-screen-film-locations-2026,piazza-grande-montepulciano.webp,,<SOURCE_PAGE_URL>,Wikimedia Commons,<AUTHOR>,<LICENSE>,<LICENSE_URL>,"Photo: <AUTHOR> / Wikimedia Commons / <LICENSE>. Cropped/resized.",\"Piazza Grande and the Palazzo Comunale in Montepulciano\",\"Yes, resized/compressed for web\",,
```

## Execution checklist (15-minute version, for a session with network)

1. Open each candidate file page → confirm licence tag → download original.
2. Convert: `cwebp -q 82 -resize 1600 0 in.jpg -o out.webp` (hero) /
   `-resize 1200 0` (in-body); confirm `< 200KB`.
3. Place under `frontend/public/images/…` per the target paths above.
4. Fill `docs/image-credits.csv` rows; run `python tools/check_links_and_images.py`.
5. Only then edit `articles.js` image references (beach hero swap, film-set
   additions); run `python tools/audit_content.py`; `yarn sitemap`; commit.
6. Update Part B outcomes and flip this file's status to **done**.
