# Main-branch audit — 5 August 2026

Read-only investigation of everything that reached `main` outside the review
loop, all scheduled content through 31 August, and every unmerged workstream
on origin. No fixes were made in this audit. Verdicts: **SAFE** /
**NEEDS REVIEW** / **CONFLICT**.

State at audit time: `origin/main` = `acb8f04` (merge of PR #40, today 12:50 WIB).

---

## 1. PR history since #38

| PR | Merged | Source branch | Contents | Verdict |
|---|---|---|---|---|
| #38 | 2 Aug | `claude/artikel-web-traffic-research-w1077l` | Tuscany on Screen film-locations article (scheduled 13 Aug) — see §2. Same recurring research branch that produced PRs #21/#29/#30/#31. | **SAFE** — content article, went through normal review |
| #39 | 4 Aug | `feat/siena-depth` | Siena destination command centre: verified rules panel, plan strip, map, month cue. | **SAFE** |
| #40 | **today 12:50 WIB** | `social/test-e2e-20260805-115550` | **The social-pipeline E2E TEST branch, which was explicitly not meant to merge.** 99 files, +4,806 lines: the W32 card generator + batch (`tools/social-cards`), the 131R reconciliation fix (RECONCILE.md + guide clarification `76e90ec`), the entire unattended pipeline (`harvest.js`, `verify.js`, `PROMPT.md`, `ops/`), **and the test-run W33 batch** (`tools/social/weeks/2026-W33.json` + `social-output/2026-W33/`, 2 packages) with `queue.json` statuses already flipped to `used`. | **CONFLICT** — three consequences below |

**PR #40 consequences:**

1. **W33 collision armed.** The test batch now sits on main looking canonical.
   The real weekly run (Sunday 9 Aug, 20:00 WIB) guards only on the existence
   of branch `origin/social/2026-W33` — not on the weeks file — so it will
   generate a second, divergent W33 on a fresh branch. Decision needed before
   Sunday: either adopt the test batch as the real W33 (its 2 packages did
   pass `verify.js`) or revert the two batch paths from main.
2. **The pipeline on main is one commit stale.** `c832dd1` (the
   `Edit(path)`-permission fix, found live in E2E) is only on
   `tools/social-pipeline`. A weekly run executed from a `main` checkout
   will fail every time (loudly — the failure path telegrams the error and
   cleans up; nothing publishes). Merging `tools/social-pipeline` closes this.
3. Silver lining: nothing in #40 violates editorial policy — every figure in
   the batch passed the verification gate, and the reconciliation site-fix it
   carried was meant for main anyway (via `tools/social-cards`, which #40
   transitively merged).

## 2. The film-locations article (scheduled 13 Aug)

| Field | Value |
|---|---|
| Slug / path | `tuscany-on-screen-film-locations-2026` → `/blog/tuscany-on-screen-film-locations-2026` |
| Title | Tuscany on Screen: Film Locations You Can Actually Visit (2026) |
| Category / region | Things to do / Tuscany |
| Scheduled (updated) | **2026-08-13** — not yet in `articlesIndex.json`; the daily drip publishes it at the next build on/after that date |
| Introduced by | `bbd1b78` ("Add Tuscany on Screen film-locations article"), PR #38 |
| Hero image | `/images/tuscany/val-dorcia-cypress-trees-landscape.jpg` — **exists on disk** (added in `2d06649` with the 7-day-itinerary photo set) |
| Sections (12) | quick-answer, set-jetting-2026, you-me-tuscany, twilight-montepulciano, bond-in-siena, gladiator-terrapille, english-patient, bocelli-lajatico, the-film-day, location-etiquette, how-we-checked, final-thoughts; 8 FAQs |

**Editorial-policy check:**
- Carries a visible **"How we checked"** block; every claim dated **July 2026**.
- Explicitly *omits* what could not be verified (streaming date, a
  celebrity-winery claim) — the correct behaviour under §1.
- **No external URLs in the body** — so no fabricated-link risk; sources are
  described generically ("production and location reporting", "Tuscan tourism
  and location records") rather than linked. Weaker sourcing style than the
  transport articles, but compliant.
- Disclosure states no affiliate relationship with any named property. ✓

**Collision:** its 13 Aug slot is also claimed by the unmerged
`content/siena-day-trip-or-overnight` article (§4).

**Verdict:** article itself **SAFE**; its publication slot **CONFLICT** (shared date).

## 3. Scheduled articles, 5–31 August

From the content stores (single source of truth; `articlesIndex.json` lags
until each build):

| Date | Article |
|---|---|
| Tue 5 Aug | `/blog/siena-or-san-gimignano-day-trip-2026` (live today) |
| Wed 6 Aug | `/blog/tuscany-in-october-2026` |
| Thu 7 Aug | `/blog/val-dorcia-or-chianti-which-to-visit-2026` |
| Fri 8 Aug | `/blog/tuscany-in-november-2026` |
| Sat 9 Aug | `/blog/tuscany-in-december-2026` |
| Sun 10 Aug | `/blog/tuscany-in-january-2027` |
| Mon 11 Aug | `/blog/tuscany-in-february-2027` |
| Wed 12 Aug | `/blog/italy-beach-rules-2026` |
| Thu 13 Aug | `/blog/tuscany-on-screen-film-locations-2026` **and** (unmerged) `siena-day-trip-or-overnight` — **CONFLICT** |
| 14–31 Aug | **nothing scheduled** |

Flags:
- **13 Aug double slot** — the only hard conflict (§4 for options).
- **The drip dies 14 Aug**, right before the highest-attention window of the
  month (Ferragosto 15 Aug, Palio dell'Assunta 16 Aug). **NEEDS REVIEW**:
  the Palio branches below contain corrections and expansions that would
  naturally fill 14–16 Aug.
- Monthly-guide sequence (Oct→Feb) posting 6–11 Aug is coherent. **SAFE**.
- Social overlay for the same window: W32 cards run through Tue 11 Aug; the
  (test) W33 batch posts Wed 12 + Fri 14 Aug. No same-day article/card topic
  clash. **SAFE**.

## 4. Branch `content/siena-day-trip-or-overnight`

- **State:** 2 commits ahead of main, clean stack: `4248844` (the decision
  guide, ~110 lines of article + inbound links from four live articles) and
  `b190e5b` (sitemap `lastmod` + `llms.txt` entry for it). Author: Zaky Abdul
  Aziz, 3 Aug.
- **Scheduled date:** 13 Aug — **collides** with the film-locations article
  already on main (the drip publishes both the same day; the daily social
  promo job would also have to pick between them).
- **Content quality:** commit message documents zero new facts — built
  entirely from already-verified figures with original check dates (131R
  Sunday gap, 19:10/20:45, fares, OPA SI Pass, tourist tax). Consistent with
  the reconciliation guidance.
- **Re-slotting options (in preference order):**
  1. **14 Aug** — first free date; unbroken daily drip; a day-trip-vs-
     overnight decision guide lands usefully before the Ferragosto weekend.
     Requires editing the one `'2026-08-13'` literal in `4248844` and
     regenerating the `b190e5b` artifacts (sitemap lastmod + llms entry).
  2. 17 Aug — if 14–16 Aug is reserved for Palio/Ferragosto content instead.
  3. Keep 13 Aug and move the film article — not recommended; the film
     article is already on main and re-dating merged content is noisier.

**Verdict:** **CONFLICT** (date collision; content itself fine).

## 5. Other unmerged branches on origin

Note the stack: `expand-palio-articles` ⊂ `palio-seasonal-push` ⊂
`self-host-siena-hero` ⊂ `duplicate-accommodation-urls` ⊂
`decorative-image-hotlinks` — merging the last brings all five.

| Branch | Contents | Verdict |
|---|---|---|
| `claude/artikel-web-traffic-research-w1077l` | 1 commit: `docs/PHOTO_SOURCING_WORKLIST.md` (110 lines, docs only). | **SAFE** |
| `content/august-2026-date-refresh` | Two workstreams in one branch: (a) 4 content commits — avoid-crowds article refreshed to August + slug 301, Venice access-fee update (2026 trial ended 27 Jul), Puccini reframe, all dated late July; (b) **the hidden content/video CI pipeline** — see §6. | **NEEDS REVIEW** — consider splitting (a) from (b) |
| `content/expand-palio-articles` | Expands both Palio articles and **corrects facts that were wrong** — while the wrong versions are live and the Palio is 11 days away. | **NEEDS REVIEW (urgent)** |
| `content/palio-seasonal-push` | Superset: the above + interlinks from the Siena cluster. | **NEEDS REVIEW (urgent)** |
| `content/florence-budget-verified` | **Replaces invented budget figures with verified prices** — meaning the live article currently carries invented figures, a direct §1 violation in production. | **CONFLICT** (live policy violation until merged) |
| `content/venice-access-fee-evergreen` | Evergreen rewrite of the access-fee guide, fixes wrong figures. Overlaps thematically with the venice commit inside `august-2026-date-refresh` — reconcile before merging both. | **NEEDS REVIEW** |
| `content/siena-day-trip-or-overnight` | §4. | **CONFLICT** (date) |
| `fix/decorative-image-hotlinks` | Drops six decorative Unsplash hotlinks + a dead import (top of the stack above). Hotlinks live today violate §3. | **NEEDS REVIEW (urgent)** |
| `fix/duplicate-accommodation-urls` | Collapses three "where to stay in Siena" URLs into one (in the stack). | **NEEDS REVIEW** |
| `fix/self-host-siena-hero` | Self-hosts the Siena hero instead of hotlinking Unsplash (in the stack). | **NEEDS REVIEW (urgent — same §3 class)** |
| `fix/freshness-signals` | Sitemap dynamic lastmod for both long-form guides, schema Article-node fixes. | **SAFE** (mechanical SEO fixes) |
| `fix/smoke-homepage-title` | Aligns the deploy smoke test with the real homepage title. | **SAFE** |
| `tools/social-pipeline` | Only `c832dd1` remains unmerged — the headless-permission fix the pipeline on main is missing (§1.2). | **CONFLICT** until merged |

## 6. Video/film pipeline traces

**Yes — a complete parallel content/video pipeline exists**, entirely on the
unmerged branch `content/august-2026-date-refresh` (authored by Zaky Abdul
Aziz, 29 Jul–2 Aug; nothing on main, nothing in the working tree):

| Piece | What it does |
|---|---|
| `.github/workflows/content-pipeline.yml` | GitHub Actions: **auto-triggers on push to `main` and `content/**` when built blog HTML changes** (plus manual dispatch). Installs `edge-tts`, runs the pipeline, uploads a zip artifact. Reads secret `VSLLM_KEY`. Commented in Indonesian. |
| `scripts/content-pipeline.mjs` | Article → LLM fact extraction → 6-platform content pack + pin text, via **third-party LLM gateway** (default `https://vsllm.com`, model `gpt-5.5`) → SVG/PNG pin → `metricool-draft.csv` + `REVIEW.md`. Claims "nothing auto-uploads; human review is the final gate". |
| `scripts/make-video.mjs` | `vo-en.txt` + `pin.png` → **1080×1920 vertical video** for TikTok/YouTube Shorts: edge-tts voice (en-GB-SoniaNeural) + subtitles + ffmpeg-static. |
| `scripts/social-pack.mjs`, `make-variant.mjs`, `run-all.mjs`, `social-pack-prompt.md` | Social pack generator, pin variants, orchestrator, its prompt. |
| `scripts/audit-gateways.mjs`, `docs/llm-gateways.md`, `docs/brief-audit-gateway.md` | Audits three **grey-market LLM resellers**: `vsllm.com` (✅ 57 models incl. names like "claude-fable-5", "gpt-5.5"), `gorouter.app` (✅ 4 "Claude Opus" models — CI was switched to `claude-opus-4-8` here), `agentrouter.org` (❌ dead, 401). Keys in `.env.local` / GitHub secret. |

**Concerns to weigh (report only, no action taken):**
- **Self-publishing risk:** the workflow triggers on pushes to `main` — and
  also runs on pushes to *that branch itself* (the YAML + path filter exist
  there), consuming gateway credits. Output is a build artifact, not a post —
  the human gate claim appears true — but the trigger surface is broad.
- **Editorial policy:** fact extraction and copy generation through unvetted
  reseller gateways whose model labels cannot be verified sits uneasily next
  to CLAUDE.md §1; the existing `tools/social` pipeline already covers cards
  with a mechanical verification gate. Two parallel social pipelines now
  exist with overlapping purpose and different guarantees.
- **Supply-chain/ToS:** reseller gateways offering "Claude"/"GPT" models are
  of unknown provenance; account/key handling (`VSLLM_KEY` as repo secret)
  deserves a deliberate decision.

**Verdict:** **NEEDS REVIEW** (nothing publishes itself *today* because the
branch is unmerged — but merging it arms an auto-triggering CI pipeline).

## 7. Verdict summary

| # | Finding | Verdict | One-line reason |
|---|---|---|---|
| 1 | PR #38 (film article) | SAFE | Normal reviewed content merge |
| 2 | PR #39 (siena-depth) | SAFE | Normal reviewed feature merge |
| 3 | PR #40 (E2E test branch merged) | **CONFLICT** | Test W33 batch now canonical on main; Sunday's run will produce a divergent duplicate |
| 4 | Pipeline on main missing `c832dd1` | **CONFLICT** | Weekly runs from a main checkout will fail until `tools/social-pipeline` merges |
| 5 | Film-locations article content | SAFE | Dated checks, unverifiable claims omitted, image exists, no external links |
| 6 | 13 Aug double slot (film vs day-trip guide) | **CONFLICT** | Two articles claim one drip slot; re-slot the unmerged one (14 Aug recommended) |
| 7 | Publishing gap 14–31 Aug incl. Ferragosto/Palio | NEEDS REVIEW | Drip ends the day before the month's peak-attention window |
| 8 | Palio fact corrections unmerged (`expand-palio-articles` stack) | NEEDS REVIEW (urgent) | Known-wrong facts live 11 days before the Palio |
| 9 | `florence-budget-verified` unmerged | **CONFLICT** | Live article carries invented figures — §1 violation in production |
| 10 | Unsplash hotlinks live (`decorative-image-hotlinks` stack) | NEEDS REVIEW (urgent) | §3 violation in production until the stack merges |
| 11 | Venice double workstream (evergreen rewrite vs date-refresh commit) | NEEDS REVIEW | Two branches edit the same guide; reconcile before merging either |
| 12 | Hidden content/video CI pipeline (§6) | NEEDS REVIEW | Auto-triggering CI + grey-market LLM gateways; parallel to the sanctioned social pipeline |
| 13 | Remaining branches (`freshness-signals`, `smoke-homepage-title`, photo worklist) | SAFE | Docs and mechanical fixes |

---
*Audit performed read-only on 5 August 2026; repo state `acb8f04`. Sources:
GitHub API PR list, git history across all origin branches, content stores in
`frontend/src/data/`, and file-level inspection of the branches named above.*
