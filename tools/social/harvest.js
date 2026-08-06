#!/usr/bin/env node
// Harvests candidate facts for social cards from the site's content stores.
//
// Deterministic and read-only with respect to the stores: it scans
// frontend/src/data/ for sentences that carry BOTH a concrete figure
// (€ amount, HH:MM time, or a counted quantity) AND an explicit check date
// ("checked 3 August 2026", "verified on 22 July 2026", "FACT CHECKED: ...").
// Each hit is recorded VERBATIM as a sourceQuote with its store file.
// This script never invents, rounds, or rewrites a figure — selection and
// card copy happen later (claude -p with PROMPT.md), and verify.js re-checks
// every published figure against the stores before anything is committed.
//
// Usage: node harvest.js [--queue path] [--dry-run]
// Appends new candidates (status "candidate") to queue.json, skipping any
// whose normalized sourceQuote is already present (any status).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'frontend', 'src', 'data');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const qIdx = args.indexOf('--queue');
const QUEUE_PATH = qIdx >= 0 ? path.resolve(args[qIdx + 1]) : path.join(__dirname, 'queue.json');

const STORES = [
  'articles.js',
  'florenceToSienaGuide.json',
  'sienaDayTripFromFlorenceGuide.json',
  'sienaContentCluster.json',
  'destinations.js',
  'cities.js',
];

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
// "checked 3 August 2026", "checked on 3 August 2026", "verified 22 July 2026",
// "FACT CHECKED: 11 July 2026", "as checked on 3 August 2026", "checked 3 Aug 2026"
const CHECK_RE = new RegExp(
  `(?:checked|verified|re-verified|re-counted)[^.!?]{0,40}?` +
    `(\\d{1,2}\\s(?:${MONTHS}|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s20\\d{2}` +
    `|(?:${MONTHS})\\s\\d{1,2},\\s20\\d{2})`,
  'i'
);
const FIGURE_RE = /€\s?\d+(?:[.,]\d{1,2})?|\b\d{1,2}:\d{2}\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?:departures?|departure times?|coaches|nights?|minutes?|hours?|km|kilometres|steps|euros?)\b/i;

// A counted departures claim must state its direction (RECONCILE.md guardrail).
const DEPARTURE_COUNT_RE = /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+departures?/i;
const DIRECTION_RE = /\bfrom\s+(?:Florence|Siena|Firenze)|\bback\b|\bout(?:bound)?\b|\breturn\b|\bto\s+(?:Florence|Siena)\b|leaves\s+(?:Siena|Florence)/i;

const normalize = (s) => s.replace(/\s+/g, ' ').trim();

// Split a blob of prose into sentence-ish spans. Works on raw store text
// (string literals with \n escapes included) because quotes stay verbatim.
function sentences(text) {
  return text
    .replace(/\\n/g, '\n')
    .split(/(?<=[.!?])\s+|\n{2,}|\n(?=[-*#|])/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 40 && s.length <= 420);
}

function slugify(s) {
  return normalize(s)
    .toLowerCase()
    .replace(/€\s?(\d+)[.,]?(\d*)/g, 'eur$1$2')
    .replace(/(\d{1,2}):(\d{2})/g, '$1$2')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .slice(0, 6)
    .join('-');
}

function main() {
  const queue = fs.existsSync(QUEUE_PATH)
    ? JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'))
    : { facts: [] };
  const seen = new Set(queue.facts.map((f) => normalize(f.sourceQuote || '')));

  const candidates = [];
  for (const store of STORES) {
    const file = path.join(DATA_DIR, store);
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    for (const sent of sentences(raw)) {
      const check = sent.match(CHECK_RE);
      if (!check) continue;
      const figure = sent.match(FIGURE_RE);
      if (!figure) continue;
      // Guardrail: never harvest an ambiguous departures count.
      if (DEPARTURE_COUNT_RE.test(sent) && !DIRECTION_RE.test(sent)) continue;
      const quote = normalize(sent).replace(/\\"/g, '"').replace(/\\u2019|’/g, '’');
      if (seen.has(quote)) continue;
      seen.add(quote);
      candidates.push({
        id: `${slugify(figure[0])}-${slugify(quote).slice(0, 40)}`.replace(/-+$/, ''),
        status: 'candidate',
        sourceStore: store,
        sourceQuote: quote,
        checked: check[1],
        figureHint: figure[0],
      });
    }
  }

  if (DRY) {
    console.log(JSON.stringify(candidates, null, 2));
    console.log(`# ${candidates.length} new candidate(s) (dry run, queue untouched)`);
    return;
  }

  queue.facts.push(...candidates);
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');
  console.log(`harvested ${candidates.length} new candidate(s) → ${path.relative(ROOT, QUEUE_PATH)}`);
}

main();
