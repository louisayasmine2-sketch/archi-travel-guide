#!/usr/bin/env node
/*
 * scripts/generate-sitemap.js
 *
 * Regenerates /public/sitemap.xml from the current article + destination + city
 * data files. Uses per-article `updated` field to emit accurate <lastmod>.
 *
 * Usage:
 *   REACT_APP_SITE_URL=https://affittacameregliarchi.com node scripts/generate-sitemap.js
 *
 * If REACT_APP_SITE_URL is not set the script falls back to localhost,
 * matching the app's safe local behavior in src/lib/seo.js.
 *
 * The script is intentionally dependency-free (no build step required).
 * We read the article data file directly and extract routes with a lightweight
 * parser. The parser supports the current `A()` helper shape with optional
 * `faqs`, `updated`, and `options` arguments.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = (
  process.env.REACT_APP_SITE_URL ||
  process.env.VITE_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');

// --- Static route table ---------------------------------------------------
const staticRoutes = [
  { path: '/',                                   changefreq: 'weekly',  priority: 1.0 },
  { path: '/destinations',                       changefreq: 'weekly',  priority: 0.9 },
  { path: '/blog',                               changefreq: 'weekly',  priority: 0.9 },
  { path: '/travel-tools',                       changefreq: 'monthly', priority: 0.9 },
  { path: '/travel-deals',                       changefreq: 'monthly', priority: 0.7 },
  { path: '/about',                              changefreq: 'yearly',  priority: 0.5 },
  { path: '/contact',                            changefreq: 'yearly',  priority: 0.5 },
  { path: '/en',                                changefreq: 'monthly',  priority: 0.5 },
  { path: '/it',                                changefreq: 'monthly',  priority: 0.5 },
  { path: '/siena-travel-guide',                 changefreq: 'weekly',  priority: 0.8 },
  { path: '/where-to-stay-in-siena',             changefreq: 'weekly',  priority: 0.8 },
  { path: '/siena-itinerary',                    changefreq: 'weekly',  priority: 0.8 },
  { path: '/siena-accommodation-guide',          changefreq: 'weekly',  priority: 0.8 },
  { path: '/travel-tips',                        changefreq: 'monthly',  priority: 0.75 },

  { path: '/italy',                              changefreq: 'weekly',  priority: 0.95 },
  { path: '/tuscany',                            changefreq: 'weekly',  priority: 0.9 },
  { path: '/siena',                              changefreq: 'weekly',  priority: 0.9 },
  { path: '/florence',                           changefreq: 'monthly', priority: 0.85 },
  { path: '/rome',                               changefreq: 'monthly', priority: 0.85 },
  { path: '/venice',                             changefreq: 'monthly', priority: 0.85 },
  { path: '/europe',                             changefreq: 'monthly', priority: 0.6 },
  { path: '/asia',                               changefreq: 'monthly', priority: 0.6 },

  { path: '/travel-tools/budget-calculator',     changefreq: 'monthly', priority: 0.8 },
  { path: '/travel-tools/itinerary-generator',   changefreq: 'monthly', priority: 0.8 },
  { path: '/travel-tools/area-finder',           changefreq: 'monthly', priority: 0.8 },
  { path: '/travel-tools/packing-checklist',     changefreq: 'monthly', priority: 0.8 },
  { path: '/travel-tools/best-time-to-visit',    changefreq: 'monthly', priority: 0.8 },
  { path: '/travel-tools/transport-guide',       changefreq: 'monthly', priority: 0.8 },

  { path: '/privacy-policy',                     changefreq: 'yearly',  priority: 0.3 },
  { path: '/cookie-policy',                      changefreq: 'yearly',  priority: 0.3 },
  { path: '/terms-of-use',                       changefreq: 'yearly',  priority: 0.3 },
  { path: '/terms-of-service',                   changefreq: 'yearly',  priority: 0.3 },
  { path: '/disclaimer',                        changefreq: 'yearly',  priority: 0.3 },
  { path: '/affiliate-disclosure',               changefreq: 'yearly',  priority: 0.4 },
  { path: '/editorial-policy',                   changefreq: 'yearly',  priority: 0.4 },

  // Legacy accommodation URLs preserved for crawl-safe migration.
  { path: '/en/rooms-bed-and-breakfast-in-siena.html',                  changefreq: 'monthly', priority: 0.45 },
  { path: '/en/standard-double-room-in-siena.html',                     changefreq: 'monthly', priority: 0.45 },
  { path: '/en/superior-double-room-in-siena.html',                     changefreq: 'monthly', priority: 0.45 },
  { path: '/it/family-accomodation-per-4-a-siena.html',                changefreq: 'monthly', priority: 0.45 },
  { path: '/en/gli-archi-bed-and-breakfast-siena.html',                changefreq: 'monthly', priority: 0.45 },
  { path: '/en/services-and-conditions-gli-archi-bad-and-breakfast.html', changefreq: 'monthly', priority: 0.45 },
  { path: '/en/holidays-in-siena.html',                                 changefreq: 'monthly', priority: 0.45 },
  { path: '/en/contacts-gli-archi-bed-and-breakfast-siena.html',        changefreq: 'monthly', priority: 0.45 },
];

// --- Article extraction (simple parser, no build tooling required) ----------
// Article slugs are extracted from `A('slug', ...)` calls in src/data/articles.js.
// We also respect explicit per-article `updated` values when present.
function extractArticles() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/articles.js'), 'utf-8');

  const defaultMatch = src.match(/updated\s*=\s*'(\d{4}-\d{2}-\d{2})'/);
  const defaultUpdated = defaultMatch ? defaultMatch[1] : new Date().toISOString().slice(0, 10);

  const results = [];
  const seen = new Set();

  const dateRe = /^'\d{4}-\d{2}-\d{2}'$/;

  let i = 0;
  while ((i = src.indexOf('A(', i)) !== -1) {
    let j = i + 2;
    let depth = 1;
    let inString = false;
    let quote = '';
    let escaped = false;

    while (j < src.length && depth > 0) {
      const ch = src[j];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === quote) {
          inString = false;
          quote = '';
        }
      } else if (ch === '"' || ch === "'") {
        inString = true;
        quote = ch;
      } else if (ch === '(') {
        depth += 1;
      } else if (ch === ')') {
        depth -= 1;
      }
      j += 1;
    }

    if (depth !== 0) break;

    const callText = src.slice(i + 2, j - 1);
    const slugMatch = callText.match(/^\s*'([a-z0-9-]+)'/);
    if (!slugMatch) {
      i = j;
      continue;
    }

    const slug = slugMatch[1];
    if (!seen.has(slug)) {
      seen.add(slug);

      const args = splitTopLevelArgs(callText);
      const explicitUpdated = args.find((arg) => dateRe.test(arg.trim()));
      results.push({
        slug,
        updated: explicitUpdated ? explicitUpdated.trim().slice(1, -1) : defaultUpdated,
      });
    }

    i = j;
  }

  return results;
}

function splitTopLevelArgs(callText) {
  const args = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let i = 0; i < callText.length; i++) {
    const ch = callText[i];

    if (inString) {
      current += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === '[' || ch === '{' || ch === '(') depth += 1;
    if (ch === ']' || ch === '}' || ch === ')') depth -= 1;

    if (ch === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim()) args.push(current.trim());
  return args;
}

// --- XML rendering --------------------------------------------------------
function urlEntry({ path: p, changefreq, priority, lastmod }) {
  const parts = [`<url>`, `<loc>${SITE_URL}${p}</loc>`];
  if (lastmod) parts.push(`<lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`);
  if (priority != null) parts.push(`<priority>${priority}</priority>`);
  parts.push('</url>');
  return '  ' + parts.join('');
}

function render() {
  const articleRoutes = extractArticles().map((a) => ({
    path: `/blog/${a.slug}`,
    changefreq: 'monthly',
    priority: 0.75,
    lastmod: a.updated,
  }));

  const all = [...staticRoutes, ...articleRoutes];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '',
    ...all.map(urlEntry),
    '',
    '</urlset>',
    '',
  ].join('\n');
}

function main() {
  const xml = render();
  const outPath = path.join(ROOT, 'public/sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf-8');
  const articleCount = xml.match(/\/blog\//g)?.length || 0;
  console.log(`✓ Wrote ${outPath}`);
  console.log(`  ${staticRoutes.length} static + ${articleCount} article URLs`);
  console.log(`  SITE_URL = ${SITE_URL}`);
}

main();
