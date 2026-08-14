#!/usr/bin/env node
/*
 * scripts/generate-articles-index.js
 *
 * Writes src/data/articlesIndex.json: the card-level metadata (slug, title,
 * category, region, excerpt, image, readMinutes, canonicalPath, updated) of
 * every PUBLISHED article — src/data/articles.js, the Siena cluster pages in
 * sienaContentCluster.json, and the standalone Florence→Siena guide. Search
 * (lib/searchIndex.js), the month cue and every listing surface read this
 * index, so a page missing here is invisible to all of them.
 *
 * Why: articles.js carries every article's full body — 1.2MB of JavaScript at
 * 59 published articles, and growing with every one added. Listing surfaces
 * (the blog index, destination pages, homepage cards, city related-guides)
 * only need the fields above, so they import this index and the bodies stay
 * in the lazily-loaded article route.
 *
 * articles.js is EVALUATED rather than pattern-matched: the earlier regex
 * parser silently drifted from the store (wrong readMinutes on 8 articles,
 * wrong updated on 10, because options can override constructor arguments).
 * Reading the store's own `articles` export also inherits its publish rule
 * verbatim, so scheduled posts cannot leak into the index. The JSON stores
 * keep their own publish timestamps.
 *
 * Regenerated on every build and on npm start; committed like sitemap.xml so
 * fresh clones work without a build step.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// The JSON stores keep their bodies as one string rather than the section
// array A() uses, so their reading time is estimated the same way A() does:
// characters over 1200, floored at 4.
function readMinutesFromText(text = '') {
  return Math.max(4, Math.round(String(text).length / 1200));
}

// Load src/data/articles.js in Node. It is plain data (ESM syntax + two JSON
// imports), so a light shim is enough — no bundler, no dependencies, matching
// the rule that these scripts stay dependency-free.
function loadArticleStore() {
  const dataDir = path.join(ROOT, 'src/data');
  const src = fs
    .readFileSync(path.join(dataDir, 'articles.js'), 'utf-8')
    .replace(/^import (\w+) from "\.\/([^"]+)";$/gm,
      (_, name, file) => `const ${name} = require(${JSON.stringify(path.join(dataDir, file))});`)
    .replace(/^export const /gm, 'const ')
    .replace(/^export /gm, '');
  const mod = { exports: {} };
  // eslint-disable-next-line no-new-func
  new Function('module', 'require', `${src}\nmodule.exports = { articles };`)(mod, require);
  if (!Array.isArray(mod.exports.articles)) {
    throw new Error('articles.js did not export an articles array');
  }
  return mod.exports.articles;
}

// The store's own `articles` export already applies the publish rule, so this
// is a pure projection: pick the card fields, drop the bodies.
function extractArticles() {
  return loadArticleStore().map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    region: a.region,
    excerpt: a.excerpt,
    image: a.image,
    readMinutes: a.readMinutes,
    canonicalPath: a.canonicalPath || null,
    updated: a.updated,
    store: 'articles',
  }));
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
      category: a.category,
      region: a.region,
      excerpt: a.excerpt,
      image: a.hero?.src || '',
      readMinutes: readMinutesFromText(a.bodyHtml),
      canonicalPath: a.canonicalPath,
      updated: String(a.dateModified).slice(0, 10),
      store: 'cluster',
    });
  }

  const f2s = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/florenceToSienaGuide.json'), 'utf-8')
  );
  if (new Date(f2s.datePublished) <= now) {
    results.push({
      slug: f2s.slug,
      title: f2s.title,
      category: f2s.category || 'Transport',
      region: 'Tuscany',
      excerpt: f2s.metaDescription,
      image: f2s.hero?.src || '',
      readMinutes: readMinutesFromText(f2s.bodyMarkdown),
      canonicalPath: f2s.canonicalPath,
      updated: String(f2s.dateModified).slice(0, 10),
      store: 'guide',
    });
  }

  return results;
}

function main() {
  // extractArticles() already returns the store's published set (its own
  // `articles` export applies the +07:00 publish rule), so no second filter
  // here — one would have to re-parse `updated`, which is exactly the kind of
  // drift this rewrite removes.
  const now = new Date();
  const published = extractArticles();
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
