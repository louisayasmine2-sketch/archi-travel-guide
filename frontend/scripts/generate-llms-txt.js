#!/usr/bin/env node
/*
 * scripts/generate-llms-txt.js
 *
 * Regenerates /public/llms.txt following the llms.txt specification
 * (https://llmstxt.org/): an H1, a one-line blockquote summary, short
 * context paragraphs, then H2 sections of markdown link lists so AI agents
 * can find the right page without crawling the whole site.
 *
 * Every URL is derived from the same data the sitemap uses — the A() calls
 * in src/data/articles.js and the published entries of
 * sienaContentCluster.json — so the file can never point at a page that
 * does not exist. Curated top links mirror routes defined in
 * generate-static-html.js. Dependency-free, same as generate-sitemap.js.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

loadEnvFile(path.join(ROOT, '.env.production'));

const SITE_URL = (
  process.env.REACT_APP_SITE_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');

const SHOW_SCHEDULED_CONTENT =
  process.env.REACT_APP_SHOW_SCHEDULED_CONTENT === 'true' ||
  process.env.SHOW_SCHEDULED_CONTENT === 'true';
const BUILD_NOW = process.env.SCHEDULED_CONTENT_NOW
  ? new Date(process.env.SCHEDULED_CONTENT_NOW)
  : new Date();

// Slugs whose /blog/ route 301s elsewhere (kept in sync with
// generate-sitemap.js) — the canonical target appears instead.
const REDIRECTED_SLUGS = new Set([
  'florence-to-siena-transport',
  'best-things-to-do-in-siena',
  'siena-day-trip-from-florence',
]);

// --- articles.js lightweight parser (same approach as generate-sitemap.js) --

function splitTopLevelArgs(callText) {
  const args = [];
  let depth = 0;
  let current = '';
  let inString = false;
  let quote = '';
  let escaped = false;
  for (const ch of callText) {
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) { inString = false; quote = ''; }
      current += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; quote = ch; current += ch; continue; }
    if (ch === '(' || ch === '[' || ch === '{') depth += 1;
    if (ch === ')' || ch === ']' || ch === '}') depth -= 1;
    if (ch === ',' && depth === 0) { args.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function stringArg(arg = '') {
  const trimmed = arg.trim();
  if (!trimmed) return '';
  const q = trimmed[0];
  if (q !== '"' && q !== "'" && q !== '`') return '';
  let out = '';
  let escaped = false;
  for (let i = 1; i < trimmed.length; i += 1) {
    const ch = trimmed[i];
    if (escaped) { out += ch; escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === q) return out;
    out += ch;
  }
  return '';
}

function canonicalPathArg(arg = '') {
  const m = arg.match(/canonicalPath:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

function extractArticles() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/articles.js'), 'utf-8');
  const results = [];
  const seen = new Set();
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf('A(', i);
    if (idx === -1) break;
    const before = src[idx - 1];
    if (before && /[A-Za-z0-9_$.]/.test(before)) { i = idx + 2; continue; }
    let j = idx + 2;
    let depth = 1;
    let inString = false;
    let quote = '';
    let escaped = false;
    while (j < src.length && depth > 0) {
      const ch = src[j];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === quote) { inString = false; quote = ''; }
      } else if (ch === '"' || ch === "'" || ch === '`') {
        inString = true; quote = ch;
      } else if (ch === '(') depth += 1;
      else if (ch === ')') depth -= 1;
      j += 1;
    }
    if (depth !== 0) break;
    const args = splitTopLevelArgs(src.slice(idx + 2, j - 1));
    const slug = stringArg(args[0]);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      results.push({
        slug,
        title: stringArg(args[1]),
        excerpt: stringArg(args[4]),
        canonicalPath: canonicalPathArg(args[9] || ''),
      });
    }
    i = j;
  }
  return results;
}

function publishedClusterArticles() {
  const cluster = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/sienaContentCluster.json'), 'utf-8')
  );
  return cluster.articles.filter(
    (a) => SHOW_SCHEDULED_CONTENT || Date.parse(a.publishAtWib) <= BUILD_NOW.getTime()
  );
}

// --- rendering --------------------------------------------------------------

const abs = (p) => `${SITE_URL}${p.endsWith('/') || p.includes('.') ? p : `${p}/`}`;
const line = (title, url, desc) => `- [${title}](${url})${desc ? `: ${desc}` : ''}`;

// Curated entry points; paths mirror routes defined in
// generate-static-html.js / App.js and are also emitted by the sitemap.
const START_HERE = [
  ['Siena travel guide', '/siena-travel-guide/', 'The core city guide: what to see, timing, and practical logistics.'],
  ['Tuscany travel guide', '/tuscany-travel-guide/', 'Region-level planning: towns, routes and when to go.'],
  ['Florence to Siena by train or bus', '/florence-to-siena-by-train-or-bus/', 'The transport pillar: operators, journey times, arrival points and ticket rules, each dated.'],
  ['Where to stay in Siena', '/where-to-stay-in-siena/', 'Neighbourhood-level accommodation advice.'],
  ['Travel tools', '/travel-tools/', 'Nine interactive client-side planners: itinerary, budget, packing, transport comparison, best time, area match, currency, map and a printable trip sheet.'],
  ['Blog index', '/blog/', 'All published guides with update dates.'],
];

function render() {
  const articles = extractArticles().filter((a) => !REDIRECTED_SLUGS.has(a.slug));
  const cluster = publishedClusterArticles();

  const guideLines = [
    ...cluster.map((a) => line(a.title, abs(a.canonicalPath || a.route), a.metaDescription)),
    ...articles.map((a) => line(a.title, abs(a.canonicalPath || `/blog/${a.slug}`), a.excerpt)),
  ];

  return [
    '# Archi Travel Guide',
    '',
    '> Practical, fact-checked travel guides and interactive planning tools for Siena and Tuscany: transport, parking, ZTL rules, tickets, budgets and itineraries — every price, rule and date shows when it was last verified against official sources.',
    '',
    'Content is written for people about to spend money and time on a decision: caveats matter as much as recommendations. Figures that could not be verified against a primary source are stated as unknown rather than estimated. Interactive tools under /travel-tools/ are client-side JavaScript; for factual claims, prefer the guide pages below, which carry visible last-checked dates.',
    '',
    '## Start here',
    '',
    ...START_HERE.map(([t, p, d]) => line(t, abs(p), d)),
    '',
    '## Guides',
    '',
    ...guideLines,
    '',
    '## Optional',
    '',
    line('About', abs('/about/'), 'Who writes this site and how facts are checked.'),
    line('Contact', abs('/contact/'), 'Contact form and email.'),
    line('Sitemap', `${SITE_URL}/sitemap.xml`, 'Machine-readable list of every indexable page with last-modified dates.'),
    '',
  ].join('\n');
}

function main() {
  const out = path.join(ROOT, 'public', 'llms.txt');
  fs.writeFileSync(out, render());
  const count = (render().match(/^- \[/gm) || []).length;
  console.log(`llms.txt written: ${out} (${count} links, site ${SITE_URL})`);
}

main();
