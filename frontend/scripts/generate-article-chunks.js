#!/usr/bin/env node
/*
 * scripts/generate-article-chunks.js
 *
 * Writes public/article-data/<slug>.json — the complete article object
 * (sections, faqs, author, options, readMinutes) for every entry in
 * src/data/articles.js — so the article route can fetch ONE article's body
 * instead of importing the whole store. The store had grown to a 1.5MB
 * JavaScript chunk that every article page downloaded and parsed just to
 * read a single entry from it; after this split nothing in src/ imports
 * the store at all and that chunk disappears from the client build.
 *
 * Scheduled articles are emitted too, deliberately: the JS store shipped
 * every scheduled body to every reader, so per-article files are at worst
 * exposure parity — and emitting them means an article whose publish moment
 * passes between daily rebuilds serves correctly the minute the runtime
 * filter (lib/publishedArticles.js) lets it through, instead of 404ing
 * until the next deploy.
 *
 * The output directory is generated on every build and gitignored (unlike
 * articlesIndex.json, which is committed for fresh clones: `npm start` runs
 * this script through prestart, so clones still work without a build).
 *
 * articles.js is EVALUATED with the same dependency-free shim as
 * generate-articles-index.js — pattern-matching drifted once and is banned.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'article-data');

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
    `${src}\nmodule.exports = { allArticles };`)(mod, require);
  if (!Array.isArray(mod.exports.allArticles)) {
    throw new Error('articles.js did not expose an allArticles array');
  }
  return mod.exports.allArticles;
}

const articles = loadArticleStore();

// Rebuild the directory from scratch so renamed or deleted slugs leave no
// orphan files behind.
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const seen = new Set();
for (const article of articles) {
  if (seen.has(article.slug)) {
    throw new Error(`generate-article-chunks: duplicate slug "${article.slug}"`);
  }
  seen.add(article.slug);
  fs.writeFileSync(
    path.join(OUT_DIR, `${article.slug}.json`),
    JSON.stringify(article)
  );
}

console.log(`[article-chunks] wrote ${articles.length} files to public/article-data/`);
