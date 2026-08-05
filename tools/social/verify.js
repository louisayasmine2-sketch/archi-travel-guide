#!/usr/bin/env node
// Verification gate for a generated week/promo facts file. Run BEFORE commit.
// Exits non-zero with a findings list if anything fails. Never edits content.
//
// Checks, per fact in the given facts file:
//   1. sourceQuote appears verbatim (whitespace-normalized) in its sourceStore.
//   2. Every concrete figure used on the card (figure, figureLabel, detail,
//      and all copy fields) — € amounts and HH:MM times — appears in the
//      sourceQuote or the sourceStore file. No invented numbers.
//   3. A counted "departures" claim always states its direction
//      (RECONCILE.md guardrail).
//   4. No banned hedge phrases (CLAUDE.md §1) anywhere in the copy.
//   5. Card check-date present; UTM link parts well-formed; targetPath starts
//      with "/"; no affiliate/tracking parameters in targetPath.
//
// Usage: node verify.js <factsFile>

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'frontend', 'src', 'data');

const factsFile = process.argv[2];
if (!factsFile) {
  console.error('usage: node verify.js <factsFile>');
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(factsFile, 'utf8'));

const BANNED = [
  'reports vary between',
  'sometimes available',
  'typically around',
  'some sources say',
  'appears to offer',
];
const TRACKING_PARAMS = /[?&](aid|tag|ref|affiliate_id|partner)=/i;
const DEPARTURE_COUNT_RE = /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+departures?\b/gi;
const DIRECTION_NEAR_RE = /\bfrom\s+(?:Florence|Siena|Firenze)|\bback\b|\bout(?:bound)?\b|\breturn\b|\bto\s+(?:Florence|Siena)\b|leaves\s+(?:Siena|Florence)|each\s+way|in\s+each\s+direction/i;

// Normalization tolerates presentation differences (markdown emphasis,
// escaped newlines/quotes, curly vs straight apostrophes) but never numbers.
const normalize = (s) =>
  String(s)
    .replace(/\\n/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\*\*|\*|__|_(?=\s)|(?<=\s)_/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

const storeCache = {};
function storeText(name) {
  if (!(name in storeCache)) {
    const base = name.replace(/\s*\(.*\)$/, ''); // "articles.js (slug)" → articles.js
    const p = path.join(DATA_DIR, base);
    storeCache[name] = fs.existsSync(p) ? normalize(fs.readFileSync(p, 'utf8')) : null;
  }
  return storeCache[name];
}

function copyFields(fact) {
  const fields = [fact.hook, fact.figure, fact.figureLabel, fact.detail];
  if (fact.copy) {
    fields.push(
      fact.copy.caption, fact.copy.alt, fact.copy.pinterestTitle,
      fact.copy.pinterestDescription, fact.copy.voiceover
    );
  }
  return fields.filter(Boolean).map(String);
}

// The original W32 facts predate this gate; their sourceQuotes are condensed
// provenance notes, not contiguous spans. Their figures are still validated
// (check 2). Everything generated after W32 must quote verbatim.
const W32_IDS = new Set([
  '131r-fare-rise', 'airport-cheapest-route', 'bus-vs-train-arrival',
  'parking-free-vs-35', 'sunday-timetable', 'tourist-tax',
  'torre-del-mangia-same-day',
]);

const findings = [];
const fail = (fact, msg) => findings.push(`[${fact.id}] ${msg}`);

for (const fact of data.facts || []) {
  const store = storeText(fact.sourceStore || '');
  if (!store) {
    fail(fact, `sourceStore not found: ${fact.sourceStore}`);
    continue;
  }

  // 1. Verbatim source quote. Quotes may stitch several store sentences
  //    together, so each sentence must appear verbatim, not the whole span.
  const quote = normalize(fact.sourceQuote || '');
  if (!quote) fail(fact, 'missing sourceQuote');
  else if (!W32_IDS.has(fact.id)) {
    for (const sent of quote.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length >= 25)) {
      if (!store.includes(sent)) fail(fact, `sourceQuote sentence not verbatim in ${fact.sourceStore}: "${sent.slice(0, 70)}…"`);
    }
  }

  // 2. Every € figure and HH:MM time in the card copy must exist in the store.
  const allCopy = copyFields(fact).map(normalize).join('\n');
  const figures = allCopy.match(/€\s?\d+(?:[.,]\d{1,2})?|\b\d{1,2}:\d{2}\b/g) || [];
  for (const fig of new Set(figures.map((f) => f.replace(/€\s/, '€')))) {
    if (!quote.includes(fig) && !store.includes(fig)) {
      fail(fact, `figure "${fig}" not found in sourceQuote or ${fact.sourceStore}`);
    }
  }

  // 3. Departure counts must state direction, in every field where they appear.
  for (const field of copyFields(fact)) {
    const text = normalize(field);
    if (DEPARTURE_COUNT_RE.test(text) && !DIRECTION_NEAR_RE.test(text)) {
      fail(fact, `departures count without direction: "${text.slice(0, 90)}…"`);
    }
    DEPARTURE_COUNT_RE.lastIndex = 0;
  }

  // 4. Banned phrases.
  const lower = allCopy.toLowerCase();
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) fail(fact, `banned phrase: "${phrase}"`);
  }

  // 5. Structure.
  if (!fact.checked) fail(fact, 'missing checked date');
  if (!/^\//.test(fact.targetPath || '')) fail(fact, `bad targetPath: ${fact.targetPath}`);
  if (TRACKING_PARAMS.test(fact.targetPath || '')) fail(fact, `tracking param in targetPath: ${fact.targetPath}`);
  if (fact.day == null || !fact.date) fail(fact, 'missing posting day/date');
  if (!fact.copy && !['131r-fare-rise', 'airport-cheapest-route', 'bus-vs-train-arrival', 'parking-free-vs-35', 'sunday-timetable', 'tourist-tax', 'torre-del-mangia-same-day'].includes(fact.id)) {
    fail(fact, 'missing copy object (required for post-W32 facts)');
  }
}

if (!data.site || !/utm_medium=social/.test(data.site.utm || '')) {
  findings.push('[site] missing or malformed site.utm');
}

if (findings.length) {
  console.error(`VERIFY FAILED — ${findings.length} finding(s):`);
  for (const f of findings) console.error('  - ' + f);
  process.exit(1);
}
console.log(`verify OK — ${(data.facts || []).length} fact(s) checked against the content stores`);
