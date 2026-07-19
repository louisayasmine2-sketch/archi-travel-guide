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
  process.env.VITE_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');
const SIENA_CONTENT_CLUSTER = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/sienaContentCluster.json'), 'utf-8')
);
const SHOW_SCHEDULED_CONTENT =
  process.env.REACT_APP_SHOW_SCHEDULED_CONTENT === 'true' ||
  process.env.SHOW_SCHEDULED_CONTENT === 'true';
const BUILD_NOW = process.env.SCHEDULED_CONTENT_NOW
  ? new Date(process.env.SCHEDULED_CONTENT_NOW)
  : new Date();

// --- Static route table ---------------------------------------------------
const staticRoutes = [
  { path: '/',                                   changefreq: 'weekly',  priority: 1.0 },
  { path: '/destinations',                       changefreq: 'weekly',  priority: 0.9 },
  { path: '/blog',                               changefreq: 'weekly',  priority: 0.9 },
  { path: '/travel-tools',                       changefreq: 'monthly', priority: 0.9 },
  { path: '/travel-deals',                       changefreq: 'monthly', priority: 0.7 },
  { path: '/about',                              changefreq: 'yearly',  priority: 0.5 },
  { path: '/contact',                            changefreq: 'yearly',  priority: 0.5 },
  { path: '/siena-travel-guide',                 changefreq: 'weekly',  priority: 0.8 },
  { path: '/siena-day-trip-from-florence',       changefreq: 'weekly',  priority: 0.8, lastmod: '2026-07-11' },
  { path: '/florence-to-siena-by-train-or-bus',  changefreq: 'weekly',  priority: 0.8 },
  { path: '/where-to-stay-in-siena',             changefreq: 'weekly',  priority: 0.8 },
  { path: '/things-to-do-in-siena',              changefreq: 'weekly',  priority: 0.8 },
  { path: '/tuscany-travel-guide',               changefreq: 'weekly',  priority: 0.8 },
  { path: '/travel-budget-calculator',           changefreq: 'monthly', priority: 0.8 },
  { path: '/siena-accommodation-guide',          changefreq: 'weekly',  priority: 0.8 },
  { path: '/travel-tips',                        changefreq: 'monthly',  priority: 0.75 },

  { path: '/italy',                              changefreq: 'weekly',  priority: 0.95 },
  { path: '/siena',                              changefreq: 'weekly',  priority: 0.9 },
  { path: '/florence',                           changefreq: 'monthly', priority: 0.85 },
  { path: '/rome',                               changefreq: 'monthly', priority: 0.85 },
  { path: '/venice',                             changefreq: 'monthly', priority: 0.85 },
  { path: '/europe',                             changefreq: 'monthly', priority: 0.6 },
  { path: '/asia',                               changefreq: 'monthly', priority: 0.6 },

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
];

// --- Article extraction (simple parser, no build tooling required) ----------
// Article slugs are extracted from `A('slug', ...)` calls in src/data/articles.js.
// We also respect explicit per-article `updated` values when present.
function extractArticles() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/articles.js'), 'utf-8');

  const defaultMatch = src.match(/updated\s*=\s*['"](\d{4}-\d{2}-\d{2})['"]/);
  const defaultUpdated = defaultMatch ? defaultMatch[1] : new Date().toISOString().slice(0, 10);

  const results = [];
  const seen = new Set();

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
      } else if (ch === '"' || ch === "'" || ch === '`') {
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
    const args = splitTopLevelArgs(callText);
    const slug = stringArg(args[0]);
    if (!slug) {
      i = j;
      continue;
    }

    if (!seen.has(slug)) {
      seen.add(slug);

      const explicitUpdated = args.map(stringArg).find((arg) => /^\d{4}-\d{2}-\d{2}/.test(arg));
      const options = safeEvalLiteral(args[9] || '{}', {});
      results.push({
        slug,
        canonicalPath: options.canonicalPath,
        updated: explicitUpdated ? explicitUpdated.slice(0, 10) : defaultUpdated,
      });
    }

    i = j;
  }

  return results;
}

function safeEvalLiteral(literal, fallback) {
  try {
    return Function(`"use strict"; return (${literal});`)();
  } catch (_) {
    return fallback;
  }
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

    if (ch === '"' || ch === "'" || ch === '`') {
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

function stringArg(arg = '') {
  const trimmed = arg.trim();
  const quote = trimmed[0];
  if ((quote !== "'" && quote !== '"' && quote !== '`') || trimmed[trimmed.length - 1] !== quote) return '';
  return trimmed
    .slice(1, -1)
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n');
}

function isScheduledArticlePublished(article) {
  return SHOW_SCHEDULED_CONTENT || Date.parse(article.publishAtWib) <= BUILD_NOW.getTime();
}

function extractSienaClusterArticles() {
  return SIENA_CONTENT_CLUSTER.articles
    .filter(isScheduledArticlePublished)
    .map((article) => ({
      path: article.route,
      changefreq: 'weekly',
      priority: article.role === 'Pillar' ? 0.85 : 0.78,
      lastmod: article.dateModified.slice(0, 10),
    }));
}

// --- XML rendering --------------------------------------------------------
function urlEntry({ path: p, changefreq, priority, lastmod }) {
  // Cloudflare Pages appends a trailing slash with a 308. Emitting the
  // slashless form makes Google crawl a URL that immediately redirects,
  // which shows up as "Page with redirect" in Search Console.
  const path = p === '/' ? '/' : (p.endsWith('/') ? p : `${p}/`);
  const parts = [`<url>`, `<loc>${SITE_URL}${path}</loc>`];
  if (lastmod) parts.push(`<lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`);
  if (priority != null) parts.push(`<priority>${priority}</priority>`);
  parts.push('</url>');
  return '  ' + parts.join('');
}

function render() {
  const redirectedArticleSlugs = new Set([
    'florence-to-siena-transport',
    'best-things-to-do-in-siena',
    'siena-day-trip-from-florence',
  ]);

  const articleRoutes = extractArticles().filter((a) => !redirectedArticleSlugs.has(a.slug)).map((a) => ({
    path: a.canonicalPath || `/blog/${a.slug}`,
    changefreq: 'monthly',
    priority: 0.75,
    lastmod: a.updated,
  }));

  const sienaClusterRoutes = extractSienaClusterArticles();
  const all = [...staticRoutes, ...sienaClusterRoutes, ...articleRoutes];

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
  const clusterCount = extractSienaClusterArticles().length;
  console.log(`✓ Wrote ${outPath}`);
  console.log(`  ${staticRoutes.length} static + ${clusterCount} scheduled Siena + ${articleCount} article URLs`);
  console.log(`  SITE_URL = ${SITE_URL}`);
}

main();
