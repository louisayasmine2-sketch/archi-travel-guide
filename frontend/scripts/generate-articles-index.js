#!/usr/bin/env node
/*
 * scripts/generate-articles-index.js
 *
 * Writes src/data/articlesIndex.json: the card-level metadata (publishedAt,
 * slug, title, category, region, excerpt, image, readMinutes, canonicalPath,
 * updated) of every article — src/data/articles.js, the Siena cluster pages
 * in sienaContentCluster.json, and the standalone Florence→Siena guide.
 *
 * SCHEDULED entries are included, each carrying the moment it goes live.
 * This file is a build-time snapshot, so filtering here would tie publication
 * to deploys: an article dated today would be live on its own URL (the store
 * filters in the browser) while every listing pretended it did not exist.
 * Consumers therefore read lib/publishedArticles.js, which filters at
 * runtime — never this JSON directly.
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
 * The publish rule (+07:00 site timezone) is read from the store itself, so
 * the runtime filter and the article route agree to the minute.
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
  new Function('module', 'require',
    `${src}\nmodule.exports = { allArticles, SITE_TZ };`)(mod, require);
  if (!Array.isArray(mod.exports.allArticles)) {
    throw new Error('articles.js did not expose an allArticles array');
  }
  return mod.exports;
}

// Scheduled entries are INCLUDED, each stamped with the moment it goes live.
// The index is a build-time snapshot, so filtering here would freeze the site
// until the next deploy: an article dated today would sit live on its own URL
// (articles.js filters in the browser) while every listing pretended it did
// not exist. Consumers filter at runtime through lib/publishedArticles.js.
function extractArticles() {
  const { allArticles, SITE_TZ } = loadArticleStore();
  const publishedAt = (updated) =>
    (/^\d{4}-\d{2}-\d{2}$/.test(updated) ? `${updated}T00:00:00${SITE_TZ}` : String(updated));
  return allArticles.map((a) => ({
    publishedAt: publishedAt(a.updated),
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
// site search and 404 suggestions) cannot see those routes. Like the articles
// store, their scheduled entries are carried with a publishedAt stamp rather
// than dropped at build time.
function extractJsonArticles() {
  const results = [];

  const cluster = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/sienaContentCluster.json'), 'utf-8')
  );
  for (const a of cluster.articles) {
    results.push({
      publishedAt: String(a.publishAtWib),
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
  {
    results.push({
      publishedAt: String(f2s.datePublished),
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
  const entries = extractArticles();
  const seen = new Set(entries.map((a) => a.slug));
  for (const extra of extractJsonArticles()) {
    if (!seen.has(extra.slug)) {
      seen.add(extra.slug);
      entries.push(extra);
    }
  }
  const out = path.join(ROOT, 'src/data/articlesIndex.json');
  fs.writeFileSync(out, `${JSON.stringify(entries, null, 1)}\n`);
  const now = new Date();
  const live = entries.filter((a) => new Date(a.publishedAt) <= now).length;
  console.log(`articlesIndex.json written: ${entries.length} entries `
    + `(${live} live now, ${entries.length - live} scheduled)`);
}

main();
