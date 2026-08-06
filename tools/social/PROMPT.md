# Production prompt — social fact-card batch (frozen conventions)

You are running headless inside the archi-travel-guide repo to prepare a
social fact-card batch. Your ONLY deliverables are two file writes:

1. `tools/social/weeks/<WEEK>.json` — the batch facts file (schema below).
2. `tools/social/queue.json` — same file with statuses updated: every fact
   you used moves from `"candidate"` to `"used"` with `"usedIn": "<WEEK>"`.

Do not touch any other file. Do not run shell commands. Rendering,
verification, commit and push are handled by the runner after you exit.

The runner appends a `MODE` block at the end of this prompt telling you
whether this is a WEEKLY batch (7 packages) or a DAILY promo (1 package for
an article that went live today), plus the week id and posting dates.

## Absolute editorial policy (from CLAUDE.md — non-negotiable)

- Every figure you put on a card is **copied verbatim** from `tools/social/queue.json`
  candidates or the content stores in `frontend/src/data/`. You never invent,
  round, convert, update, or "improve" a number, time, date, or fee.
- Each fact's `sourceQuote` must be a **verbatim contiguous quote** (sentence
  or sentences, unaltered) from its `sourceStore` file. verify.js rejects
  paraphrase — the run fails and the human gets an error instead of a batch.
- Every fact carries the **original check date** from the store (`checked`).
  Never restamp with today's date.
- Banned phrases, never in any field: "reports vary between", "sometimes
  available", "typically around", "some sources say", "appears to offer".
- **Departure counts always state direction** (per RECONCILE.md): "six
  departure times from Florence", "eight departures back from Siena" — never
  a bare "N departures on Sunday". This applies to figureLabel, detail,
  captions, alt text, Pinterest copy and voice-overs alike.
- British English throughout: centre, prioritise, licence (noun).
- Lead with what the fact solves for a traveller about to spend money or
  time; the caveat is as important as the recommendation.

## Selection rules

- Read `tools/social/queue.json`. Choose from `"status": "candidate"` entries
  only. Never reuse a fact whose status is `"used"`, and avoid picking a
  candidate that restates the same figure/topic as a fact used in the
  previous two weeks (check `usedIn`).
- WEEKLY: pick 7 candidates with topic variety (transport, money, tickets,
  parking, timing…). Order them day 1–7 so time-sensitive facts land before
  the day they matter (the W32 batch put the Sunday-timetable card on
  Saturday deliberately — keep that instinct).
- DAILY promo: the MODE block names the article that went live today. Pick
  the single strongest candidate whose sourceStore/targetPath belongs to that
  article; if none exists in the queue, harvest nothing — write a week file
  with an empty `facts` array and leave queue.json untouched; the runner
  treats that as a clean no-op.
- If fewer than 7 usable candidates exist for a weekly batch, use as many as
  there are — never pad with invented or stale facts.

## Output schema — `tools/social/weeks/<WEEK>.json`

Copy `site` verbatim from `tools/social/facts.json` (brand block, UTM
pattern). Then:

```json
{
  "site": { … copied verbatim … },
  "weekLabel": "Week N (<WEEK> batch)",
  "weekNotes": ["<1-3 posting-order notes like the W32 Saturday note>"],
  "facts": [
    {
      "id": "<kebab-slug>",
      "day": 1,
      "date": "YYYY-MM-DD",
      "weekday": "Monday",
      "checked": "<original check date, copied from the store>",
      "sourceStore": "<store filename, e.g. florenceToSienaGuide.json>",
      "sourceQuote": "<verbatim quote from that store>",
      "targetPath": "/blog/… or /… (site-relative, no tracking params)",
      "hook": "<card headline, one line>",
      "figure": "<the single large figure on the card, e.g. €9.90>",
      "figureLabel": "<one line under the figure>",
      "detail": "<one supporting line, may carry the caveat>",
      "copy": {
        "caption": "<Instagram/Facebook caption, 3 short paragraphs max, ends by pointing to the link>",
        "hashtags": ["#Siena", "…6-8 total"],
        "alt": "<full alt text describing the card: background, headline, figure, footer with check date and affittacameregliarchi.com>",
        "pinterestTitle": "<max 100 chars, year included>",
        "pinterestDescription": "<max 500 chars, figure + check date + tap-through>",
        "voiceover": "<30-45 s script, 85-110 words, numbers spelled out, ends with 'affittacameregliarchi dot com'>"
      }
    }
  ]
}
```

Voice and structure must match the W32 batch — read `tools/social/facts.json`
and one W32 package under `social-output/2026-W32/` before writing, and match
their tone: dry, specific, caveat-forward, no exclamation marks, no emoji.

Card template placeholders are filled from hook/figure/figureLabel/detail/
checked — keep hook ≤ 60 chars, figure ≤ 12 chars, figureLabel ≤ 90 chars,
detail ≤ 140 chars so the card does not overflow.

UTM: the runner-built links are `{baseUrl}{targetPath}?utm_source={platform}&utm_medium=social&utm_campaign=factcards` — never put UTM parameters inside `targetPath` yourself.

When both files are written, print a one-line summary per package
(`dayN-id — figure — target`) and stop. Do not commit, push, render, or
message anyone.
