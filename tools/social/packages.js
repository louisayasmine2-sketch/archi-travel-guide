#!/usr/bin/env node
// Writes the per-package text files (caption, alt text, Pinterest copy,
// voice-over script) and the weekly POSTING-GUIDE.md.
// All figures are verbatim from the content stores via facts.json — this
// file adds voice, never numbers.
//
// Usage: node packages.js [outputDir] [factsFile]
//   outputDir  default: ../../social-output/2026-W32
//   factsFile  default: facts.json next to this script (the W32 batch).
// From W33 on, each fact in the facts file carries its own `copy` object
// (caption, hashtags, alt, pinterestTitle, pinterestDescription, voiceover);
// the built-in COPY table below only serves the original W32 batch.

const fs = require('fs');
const path = require('path');

const factsFile = path.resolve(process.argv[3] || path.join(__dirname, 'facts.json'));
const data = JSON.parse(fs.readFileSync(factsFile, 'utf8'));
const PLATFORMS = ['instagram', 'facebook', 'pinterest'];

const link = (fact, platform) =>
  `${data.site.baseUrl}${fact.targetPath}?utm_source=${platform}&${data.site.utm}`;

// Alt text is read aloud by screen readers exactly as written, so no markdown
// token may survive into alt-text.txt. Pinterest caps alt_text at 500 chars;
// over-length copy is an editorial problem — refuse rather than truncate.
const ALT_TEXT_LIMIT = 500;

function plainAltText(id, text) {
  const plain = String(text)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // images → their alt
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → their label
    .replace(/(\*\*|__)([\s\S]*?)\1/g, '$2') // bold
    .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=$|[\s).,;:!?])/gm, '$1$2') // italics
    .replace(/`+([^`]*)`+/g, '$1') // inline code
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // headings
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, '') // list markers
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length > ALT_TEXT_LIMIT) {
    throw new Error(
      `${id}: alt text is ${plain.length} characters after markdown cleanup, ` +
        `over Pinterest's ${ALT_TEXT_LIMIT} limit — shorten the copy, do not truncate it`
    );
  }
  return plain;
}

const COPY = {
  '131r-fare-rise': {
    caption: `The Florence–Siena bus fare just went up.

A 131R ticket now costs €9.90 at the counter or in the operator's app — up from €8.40 at our July check. Buy on board from the driver instead and the same seat costs €16.00.

Full fare tables, timetables and where to buy — link in bio / below.`,
    hashtags: ['#Siena', '#Florence', '#Tuscany', '#ItalyTravel', '#FlorenceToSiena', '#TravelTips', '#TuscanyTravel', '#ItalyBus'],
    alt: 'Fact card on an ivory background. Headline: The Florence–Siena bus fare just went up. Large terracotta figure: €9.90, one-way at the counter or in the app, up from €8.40. Smaller text: buying on board from the driver costs €16.00; the operator\'s fare tables changed between the July and August checks. Footer: Checked 3 August 2026 — official source, affittacameregliarchi.com.',
    pinterestTitle: 'Florence to Siena Bus Fare 2026: Now €9.90 One-Way',
    pinterestDescription: 'The 131R bus fare rose from €8.40 to €9.90 in August 2026 — and buying on board from the driver costs €16.00. Every figure checked against the operator\'s official fare tables on 3 August 2026. Tap through for full fares, timetables and where to buy tickets.',
    voiceover: `If you're taking the bus from Florence to Siena, the fare has just gone up. As of our check on the third of August, a one-way ticket on the 131R costs nine euros ninety when you buy it at the counter or in the operator's app. That's up from eight forty in July. And here's the catch: buy on board from the driver, and the very same journey costs sixteen euros. The fix is simple — buy your ticket before you board. Full fare tables and timetables, every number dated and checked, at affittacameregliarchi dot com.`,
  },
  'airport-cheapest-route': {
    caption: `Florence Airport to Siena for €11.90 — no taxi required.

Tram T2 from outside arrivals into Florence is €2.00; the 131R bus on to Siena is €9.90 at the counter or in the app. Buy the bus ticket from the driver instead and that leg alone jumps to €16.00.

The step-by-step route — link in bio / below.`,
    hashtags: ['#FlorenceAirport', '#Siena', '#Tuscany', '#ItalyTravel', '#BudgetTravel', '#FlorenceToSiena', '#TravelTips'],
    alt: 'Fact card on an ivory background. Headline: Florence Airport to Siena, without a taxi. Large terracotta figure: €11.90, made of tram T2 into Florence at €2.00 plus the 131R bus to Siena at €9.90. Smaller text: the cheapest reliable route; buy at machines or online, as the bus leg from the driver is €16.00. Footer: Checked 3 August 2026 — official source, affittacameregliarchi.com.',
    pinterestTitle: 'Florence Airport to Siena: The €11.90 Route (2026)',
    pinterestDescription: 'Tram T2 into Florence for €2.00, then the 131R bus to Siena for €9.90 — €11.90 in total, both fares checked against official sources on 3 August 2026. The cheapest reliable airport route, and the tariff to avoid: €16.00 if you buy the bus ticket from the driver. Tap for the step-by-step guide.',
    voiceover: `Landing at Florence Airport and heading straight to Siena? You don't need a taxi. The cheapest reliable route costs eleven euros ninety, checked on the third of August. Here's how it works. Tram line T2 leaves from right outside arrivals and takes you into central Florence for two euros. From there, the 131R bus runs to Siena for nine euros ninety — as long as you buy at the machine, the counter, or in the app. Buy from the driver and that leg alone becomes sixteen euros. The full step-by-step route is at affittacameregliarchi dot com.`,
  },
  'bus-vs-train-arrival': {
    caption: `Bus and train don't arrive in the same Siena.

The 131R bus stops beside the old town at Via Tozzi / Piazza Gramsci. The railway station sits about 2 km below the hill — so plan the uphill connection before you commit to the train.

The full comparison, fares and timetables — link in bio / below.`,
    hashtags: ['#Siena', '#Florence', '#Tuscany', '#ItalyTravel', '#FlorenceToSiena', '#DayTrip', '#TravelTips'],
    alt: 'Fact card on an ivory background. Headline: Bus and train don\'t arrive in the same Siena. Large terracotta figure: approximately 2 km, the distance the railway station sits below the hilltop old town. Smaller text: the 131R bus stops beside the centre at Via Tozzi / Piazza Gramsci; for a Piazza del Campo day trip, that decides it. Footer: Checked 11 July 2026 — official source, affittacameregliarchi.com.',
    pinterestTitle: 'Bus or Train to Siena? They Arrive 2 km Apart',
    pinterestDescription: 'The 131R bus from Florence stops beside Siena\'s old town at Via Tozzi / Piazza Gramsci; the railway station sits about 2 km below the hill. For a Piazza del Campo day trip, that difference decides the whole plan. Arrival points, fares and timetables compared — checked against official operators.',
    voiceover: `Here's the thing nobody tells you about getting from Florence to Siena: the bus and the train don't arrive in the same place. The 131R bus drops you at Via Tozzi, beside Piazza Gramsci — right next to the old town. The railway station? It sits about two kilometres below the hill, so arriving by train means planning an uphill connection before your day trip even starts. If Piazza del Campo is the goal, that one fact decides the whole trip. The full bus-versus-train comparison is at affittacameregliarchi dot com.`,
  },
  'sunday-timetable': {
    caption: `Planning a Sunday day trip to Siena? Read this first.

After the 09:10 bus from Florence there's no 131R until 14:10. Sundays and holidays see only eight departures back all day — and the last leaves Siena at 19:10, against 20:45 on weekdays.

The full summer timetable, decoded — link in bio / below.`,
    hashtags: ['#Siena', '#Florence', '#Tuscany', '#ItalyTravel', '#DayTrip', '#FlorenceToSiena', '#TravelPlanning'],
    alt: 'Fact card on an ivory background. Headline: Planning a Sunday day trip to Siena? Large terracotta figure: 09:10 — after this bus there is nothing to Siena until 14:10. Smaller text: only eight 131R departures back on Sundays, the last leaving Siena at 19:10 against 20:45 on weekdays. Footer: Checked 3 August 2026 — official source, affittacameregliarchi.com.',
    pinterestTitle: 'Siena on a Sunday: The 131R Timetable Squeeze (2026)',
    pinterestDescription: 'On Sundays the 131R thins out: after the 09:10 from Florence there is no bus until 14:10, only eight departures run back all day, and the last leaves Siena at 19:10. Summer timetable valid from 27 July 2026, checked 3 August 2026. Tap for the full timetable, decoded.',
    voiceover: `Quick warning if you're planning a Sunday day trip from Florence to Siena. The Sunday timetable is a different animal. After the nine-ten bus from Florence, there is no 131R at all until ten past two in the afternoon — so realistically, a Sunday day trip means catching that nine-ten. Coming back, Sundays and holidays see only eight departures all day, and the last bus leaves Siena at ten past seven in the evening. On weekdays you'd have until quarter to nine. Checked against the official summer timetable on the third of August. Details at affittacameregliarchi dot com.`,
  },
  'parking-free-vs-35': {
    caption: `Parking in Siena: €0 or €35 a day.

The central car parks — Il Campo, Il Duomo, Santa Caterina, San Francesco — charge €35 for a full day. Il Campino, below the Fortezza Medicea, is free and about ten minutes' walk to the Campo. Free spaces fill early in high season.

Every car park, rated and priced — link in bio / below.`,
    hashtags: ['#Siena', '#Tuscany', '#ItalyTravel', '#RoadTrip', '#ItalyByCar', '#TravelTips', '#TuscanyTravel'],
    alt: 'Fact card on an ivory background. Headline: Parking in Siena, zero euros or 35 euros a day. Large terracotta figure: €35, the daily rate at the central car parks. Smaller text: Il Campino, below the Fortezza Medicea, is free and about ten minutes\' walk to Piazza del Campo; free spaces fill early in high season. Footer: Checked 22 July 2026 — official source, affittacameregliarchi.com.',
    pinterestTitle: 'Free Parking in Siena: Il Campino vs the €35 Garages',
    pinterestDescription: 'Siena\'s central car parks charge €35 a day — but Il Campino, directly below the Fortezza Medicea, is free and about ten minutes\' walk from Piazza del Campo. Rates checked against the municipal parking operator on 22 July 2026. Tap for every car park, priced and rated, plus the ZTL rules.',
    voiceover: `Driving to Siena? Here's the parking maths. The central car parks — Il Campo, Il Duomo, Santa Caterina, San Francesco — charge thirty-five euros for a day. But there's a free option most visitors miss: Il Campino, along Viale Vittorio Veneto, directly below the Fortezza Medicea. It's the most used free area in Siena, and about a ten-minute walk to Piazza del Campo. One caveat, straight from our guide: free spaces fill early in high season, so treat them as a bonus, not a plan. Rates checked on the twenty-second of July. Full breakdown at affittacameregliarchi dot com.`,
  },
  'tourist-tax': {
    caption: `Siena's tourist tax, in one line.

€2.00 per person per night in a B&B, apartment or short let; €1.00 in a hostel or campsite. Set by the Comune di Siena and charged on top of the displayed room price.

What a Siena stay actually costs — link in bio / below.`,
    hashtags: ['#Siena', '#Tuscany', '#ItalyTravel', '#TravelBudget', '#ItalyAccommodation', '#TravelTips', '#TuscanyTravel'],
    alt: 'Fact card on an ivory background. Headline: Siena\'s tourist tax, in one line. Large terracotta figure: €2.00 per person per night for B&Bs, apartments and short lets. Smaller text: €1.00 in hostels and campsites; set by the Comune di Siena on top of the displayed room price. Footer: Checked 23 July 2026 — official source, affittacameregliarchi.com.',
    pinterestTitle: 'Siena Tourist Tax 2026: What You Will Actually Pay',
    pinterestDescription: 'Siena charges €2.00 per person per night in B&Bs, apartments and short lets, and €1.00 in hostels and campsites — figures published by the Comune di Siena, checked 23 July 2026. It lands on top of the displayed room price. Tap for the full cost breakdown of a Siena stay.',
    voiceover: `Booking a night in Siena? Budget for the tourist tax, because it lands on top of the room price you see. The numbers, published by the Comune di Siena and checked on the twenty-third of July: two euros per person per night if you're in a B&B, an apartment or a short let, and one euro per person per night in a hostel or campsite. For a couple on a two-night stay in an apartment, that's eight euros at check-in. Small number, but it's the kind you'd rather know before you arrive. The full cost breakdown is at affittacameregliarchi dot com.`,
  },
  'torre-del-mangia-same-day': {
    caption: `You cannot book Torre del Mangia in advance.

Tickets that include the tower are sold for the same day only and are not reservable — that's the official Museo Civico rule. Places are limited, and morning offers the best chance of a slot.

The full climb, ticket rules and what to expect — link in bio / below.`,
    hashtags: ['#Siena', '#TorreDelMangia', '#Tuscany', '#ItalyTravel', '#PiazzaDelCampo', '#TravelTips', '#TuscanyTravel'],
    alt: 'Fact card on an ivory background. Headline: You cannot book Torre del Mangia in advance. Large terracotta text: Same-day — tower tickets are sold on the day only and are not reservable. Smaller text: places are limited and the tower can close in bad weather; morning offers the best chance of a slot. Footer: Checked 11 July 2026 — official source, affittacameregliarchi.com.',
    pinterestTitle: 'Torre del Mangia Tickets: Same-Day Only (2026 Rules)',
    pinterestDescription: 'The official Museo Civico rule: tickets that include Torre del Mangia are sold for the same day and cannot be reserved. Places are limited, the tower can close in bad weather, and morning offers the best chance of a slot. Rules checked 11 July 2026. Tap for the full guide to the climb.',
    voiceover: `Here's a rule that catches a lot of Siena visitors: you cannot book Torre del Mangia in advance. The official Museo Civico page states that tickets including the tower are not reservable — they're sold on the day, for the same day, and places are limited. That means the tower can be gone by the time an afternoon day-tripper arrives. Two things help: go in the morning, which offers the best chance of securing a place, and have a backup, because the tower can also close in bad weather. Rules checked on the eleventh of July. The full guide is at affittacameregliarchi dot com.`,
  },
};

function main() {
  const outRoot = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'social-output', '2026-W32'));
  const facts = [...data.facts].sort((a, b) => a.day - b.day);

  for (const fact of facts) {
    const copy = fact.copy || COPY[fact.id];
    if (!copy) throw new Error(`No copy for fact ${fact.id}`);
    const dir = path.join(outRoot, `day${fact.day}-${fact.id}`);
    fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(dir, 'caption.md'), `# Caption — ${fact.id}

${copy.caption}

## Hashtags

${copy.hashtags.join(' ')}

## Links (use the one matching the platform)

${PLATFORMS.map((p) => `- ${p}: ${link(fact, p)}`).join('\n')}
`);

    fs.writeFileSync(path.join(dir, 'alt-text.txt'), plainAltText(fact.id, copy.alt) + '\n');

    fs.writeFileSync(path.join(dir, 'pinterest.md'), `# Pinterest — ${fact.id}

**Title:** ${copy.pinterestTitle}

**Description:** ${copy.pinterestDescription}

**Destination link:** ${link(fact, 'pinterest')}

**Image:** card-pin-1000x1500.png
`);

    const words = copy.voiceover.split(/\s+/).length;
    fs.writeFileSync(path.join(dir, 'voiceover.md'), `# Voice-over script — ${fact.id}

Target length: 30–45 seconds (${words} words — aim for a measured, unhurried read).

${copy.voiceover}
`);
    console.log('package', path.relative(process.cwd(), dir), `(voiceover ${words} words)`);
  }

  const guide = `# Posting guide — ${data.weekLabel || 'Week 1 (2026-W32 batch)'}

Positioning line (approved): **"Every number dated & checked against official sources"**

Every figure on these cards is copied verbatim from the site's content stores,
with its original check date. No new claims were made for this batch.

| Day | Date | Package | Platforms | Card files |
|---|---|---|---|---|
${facts.map((f) => `| ${f.day} | ${f.weekday} ${f.date} | day${f.day}-${f.id} | Instagram + Facebook (feed PNG), Pinterest (pin PNG) | card-feed-1080x1350.png / card-pin-1000x1500.png |`).join('\n')}

## Notes

${data.weekNotes ? data.weekNotes.map((n) => `- ${n}`).join('\n') : `- **Day 4 (Saturday) carries the Sunday-timetable card on purpose** — it lands
  the day before people get caught by the Sunday gap.`}
- Each package folder contains: both PNGs (plus their source HTML), \`caption.md\`
  (caption + hashtags + per-platform UTM links), \`alt-text.txt\`, \`pinterest.md\`
  (title, description, destination link), and \`voiceover.md\` (30–45 s script).
- Always use the link matching the platform you are posting on — the
  \`utm_source\` differs. Instagram: put the link in bio; the caption says so.
- Add alt text from \`alt-text.txt\` when the platform supports it (Instagram,
  Facebook and Pinterest all do).
- To regenerate everything: \`cd tools/social && npm install &&\`
  \`npx playwright install chromium && node render.js && node packages.js\`.

## Pinterest: scheduling by hand until the API is approved

The API publisher (\`tools/social/publish-pinterest.js\`, 07:00 WIB) can only
post to the sandbox while the app is on Trial access, so Pinterest is posted by
hand in the meantime. Pinterest's own scheduler covers a whole batch: its help
pages state you can schedule a Pin up to 30 days in advance, one Pin at a time,
with up to 10 Pins scheduled for the future (checked 6 August 2026) — enough for
a seven-day batch in one sitting:

1. Open Pinterest on the web, signed in to the business account, and click
   **Create → Create Pin**.
2. Upload \`card-pin-1000x1500.png\` from the day's package folder.
3. Paste **Title** and **Description** from that folder's \`pinterest.md\`,
   verbatim — the description carries the check date, which is the whole point
   of the card.
4. Paste the **Destination link** from the same file. It already carries
   \`utm_source=pinterest\`; do not swap in the plain article URL.
5. Add the alt text from \`alt-text.txt\` (Pinterest calls it "Alt text" under
   the image).
6. Choose the board, then **Publish at a later date** and set the date from the
   table above, morning local time.
7. Repeat for each day. Scheduled Pins show up on your profile — Pinterest
   notes it can take a few minutes for them to appear.

## Target articles and check dates

${facts.map((f) => `- **day${f.day}-${f.id}** → ${data.site.baseUrl}${f.targetPath} (figures checked ${f.checked})`).join('\n')}
`;
  fs.writeFileSync(path.join(outRoot, 'POSTING-GUIDE.md'), guide);
  console.log('wrote POSTING-GUIDE.md');
}

main();
