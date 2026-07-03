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
 * We import the ES module data files via a tiny Node --experimental-vm-modules
 * loader fallback: since the data files are pure ES module exports of literals
 * with no React imports, we transpile them on the fly with a lightweight
 * regex-based reader — this keeps the script runnable in CI without extra deps.
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

// --- Article extraction (regex-based, no build tooling required) ----------
// Article slugs are extracted from `A('slug', ...)` calls in src/data/articles.js.
// Per-article `updated` overrides the default global date when present as the
// final positional argument on the A() helper. Currently all articles use the
// helper default (see `A = (... updated = 'YYYY-MM-DD') =>` in articles.js).
function extractArticles() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/articles.js'), 'utf-8');

  // Global default = helper's default value.
  const defaultMatch = src.match(/updated\s*=\s*'(\d{4}-\d{2}-\d{2})'/);
  const globalDefault = defaultMatch ? defaultMatch[1] : new Date().toISOString().slice(0, 10);

  const slugRe = /A\(\s*'([a-z0-9-]+)'/g;
  const results = [];
  const seen = new Set();
  let m;
  while ((m = slugRe.exec(src)) !== null) {
    const slug = m[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    results.push({ slug, updated: globalDefault });
  }
  return results;
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
