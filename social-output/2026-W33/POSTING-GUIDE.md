# Posting guide — Week 2 (2026-W33 batch)

Positioning line (approved): **"Every number dated & checked against official sources"**

Every figure on these cards is copied verbatim from the site's content stores,
with its original check date. No new claims were made for this batch.

| Day | Date | Package | Platforms | Card files |
|---|---|---|---|---|
| 3 | Wednesday 2026-08-12 | day3-75-minutes-the-131r-bus-runs-about-75 | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |
| 5 | Friday 2026-08-14 | day5-eur1980-as-a-day-trip-by-bus | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |

## Notes

- Short batch by design: after the W32 cards, only two queue candidates carried a figure or topic not already shown last week — the rest restate the €9.90/€16.00 fares, the €11.90 airport total, the Sunday timetable or parking. Two cards, no padding.
- Nothing on days 1–2: the W33 dates overlap the W32 tail — W32's tourist-tax and Torre del Mangia cards are dated Monday 10 and Tuesday 11 August. W33 starts Wednesday 12 August to avoid double-posting.
- The day-trip budget card runs Friday 14 August so it lands ahead of weekend day-trippers. Sunday 16 August is a Palio date and the queue holds no Palio candidate — worth a targeted harvest before W34.
- Each package folder contains: both PNGs (plus their source HTML), `caption.md`
  (caption + hashtags + per-platform UTM links), `alt-text.txt`, `pinterest.md`
  (title, description, destination link), and `voiceover.md` (30–45 s script).
- Always use the link matching the platform you are posting on — the
  `utm_source` differs. Instagram: put the link in bio; the caption says so.
- Add alt text from `alt-text.txt` when the platform supports it (Instagram,
  Facebook and Pinterest all do).
- To regenerate everything: `cd tools/social && npm install &&`
  `npx playwright install chromium && node render.js && node packages.js`.

## Target articles and check dates

- **day3-75-minutes-the-131r-bus-runs-about-75** → https://affittacameregliarchi.com/florence-to-siena-by-train-or-bus (figures checked 3 August 2026)
- **day5-eur1980-as-a-day-trip-by-bus** → https://affittacameregliarchi.com/blog/siena-travel-cost-2026 (figures checked 3 August 2026)
