#!/usr/bin/env node
/*
 * scripts/generate-articles-index.js
 *
 * Writes src/data/articlesIndex.json: the lightweight metadata (slug, title,
 * excerpt, canonicalPath, updated) of every PUBLISHED article — the A() calls
 * in src/data/articles.js (parsed with the same dependency-free parser the
 * sitemap and llms.txt generators use), the Siena cluster pages in
 * sienaContentCluster.json, and the standalone Florence→Siena guide. Search
 * (lib/searchIndex.js) and the month cue read this index, so a page missing
 * here is invisible to both.
 *
 * Why: articles.js carries every article's full body (~830KB of the main
 * bundle before this existed). Listing surfaces — the homepage pillars,
 * recently-updated cards and the month picker — only need metadata, so they
 * import this index instead and the bodies stay in the lazily-loaded article
 * routes. Regenerated on every build and on npm start; committed like
 * sitemap.xml so fresh clones work without a build step.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_UPDATED = '2025-11-10'; // A() helper's default `updated`

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
      const explicitUpdated = args.map(stringArg).find((a) => /^\d{4}-\d{2}-\d{2}/.test(a));
      results.push({
        slug,
        title: stringArg(args[1]),
        excerpt: stringArg(args[4]),
        canonicalPath: canonicalPathArg(args[9] || ''),
        updated: explicitUpdated ? explicitUpdated.slice(0, 10) : DEFAULT_UPDATED,
      });
    }
    i = j;
  }
  return results;
}

// The Siena cluster and the standalone Florence→Siena guide live in JSON data
// files with their own publish timestamps; without them the index (and so
// site search and 404 suggestions) cannot see those routes.
function extractJsonArticles(now) {
  const results = [];

  const cluster = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/sienaContentCluster.json'), 'utf-8')
  );
  for (const a of cluster.articles) {
    if (new Date(a.publishAtWib) > now) continue;
    results.push({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      canonicalPath: a.canonicalPath,
      updated: String(a.dateModified).slice(0, 10),
    });
  }

  const f2s = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/florenceToSienaGuide.json'), 'utf-8')
  );
  if (new Date(f2s.datePublished) <= now) {
    results.push({
      slug: f2s.slug,
      title: f2s.title,
      excerpt: f2s.metaDescription,
      canonicalPath: f2s.canonicalPath,
      updated: String(f2s.dateModified).slice(0, 10),
    });
  }

  return results;
}

function main() {
  // Same publish rule (and +07:00 site timezone) as articles.js's own
  // `articles` export: future-dated entries are not listed.
  const now = new Date();
  const published = extractArticles().filter(
    (a) => new Date(`${a.updated}T00:00:00+07:00`) <= now
  );
  const seen = new Set(published.map((a) => a.slug));
  for (const extra of extractJsonArticles(now)) {
    if (!seen.has(extra.slug)) {
      seen.add(extra.slug);
      published.push(extra);
    }
  }
  const out = path.join(ROOT, 'src/data/articlesIndex.json');
  fs.writeFileSync(out, `${JSON.stringify(published, null, 1)}\n`);
  console.log(`articlesIndex.json written: ${published.length} published articles`);
}

main();
