# Posting guide — Week 1 (2026-W32 batch)

Positioning line (approved): **"Every number dated & checked against official sources"**

Every figure on these cards is copied verbatim from the site's content stores,
with its original check date. No new claims were made for this batch.

| Day | Date | Package | Platforms | Card files |
|---|---|---|---|---|
| 1 | Wednesday 2026-08-05 | day1-131r-fare-rise | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |
| 2 | Thursday 2026-08-06 | day2-airport-cheapest-route | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |
| 3 | Friday 2026-08-07 | day3-bus-vs-train-arrival | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |
| 4 | Saturday 2026-08-08 | day4-sunday-timetable | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |
| 5 | Sunday 2026-08-09 | day5-parking-free-vs-35 | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |
| 6 | Monday 2026-08-10 | day6-tourist-tax | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |
| 7 | Tuesday 2026-08-11 | day7-torre-del-mangia-same-day | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |

## Notes

- **Day 4 (Saturday) carries the Sunday-timetable card on purpose** — it lands
  the day before people get caught by the Sunday gap.
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

- **day1-131r-fare-rise** → https://affittacameregliarchi.com/florence-to-siena-by-train-or-bus (figures checked 3 August 2026)
- **day2-airport-cheapest-route** → https://affittacameregliarchi.com/blog/siena-from-florence-airport-transfer (figures checked 3 August 2026)
- **day3-bus-vs-train-arrival** → https://affittacameregliarchi.com/florence-to-siena-by-train-or-bus (figures checked 11 July 2026)
- **day4-sunday-timetable** → https://affittacameregliarchi.com/blog/florence-to-siena-transport (figures checked 3 August 2026)
- **day5-parking-free-vs-35** → https://affittacameregliarchi.com/blog/siena-parking-and-transfer-guide (figures checked 22 July 2026)
- **day6-tourist-tax** → https://affittacameregliarchi.com/blog/siena-travel-cost-2026 (figures checked 23 July 2026)
- **day7-torre-del-mangia-same-day** → https://affittacameregliarchi.com/torre-del-mangia-guide (figures checked 11 July 2026)
