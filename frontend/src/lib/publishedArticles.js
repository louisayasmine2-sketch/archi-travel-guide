import articlesIndex from "@/data/articlesIndex.json";

// The single place the generated index is read. articlesIndex.json is a
// build-time snapshot that deliberately carries SCHEDULED entries too, each
// stamped with the moment it goes live; filtering here — in the visitor's
// browser, on every render — is what lets a dated article appear in listings
// the minute it publishes, exactly as its own page already does, with no
// deploy in between.
//
// Import from this module, never from the JSON: a component reading the raw
// file would show tomorrow's article today. e2e/publishing.spec.js guards it.

function isLive(entry, now) {
  const at = Date.parse(entry.publishedAt);
  return Number.isNaN(at) ? true : at <= now;
}

// Every published article, newest first — the order listings want.
export function publishedArticles(now = Date.now()) {
  return articlesIndex
    .filter((a) => isLive(a, now))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

// Published articles from the main store only (the blog listing's scope —
// cluster pages and long-form guides have their own hub pages).
export function publishedBlogArticles(now = Date.now()) {
  return publishedArticles(now).filter((a) => a.store === "articles");
}

export function findPublishedArticle(slug, now = Date.now()) {
  return publishedArticles(now).find((a) => a.slug === slug) || null;
}
