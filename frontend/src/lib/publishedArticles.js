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

// True for an internal href that points at an article the index knows about
// but which has NOT published yet. Renderers print such links as plain text
// until the day they resolve, so crawlers never discover a URL while it still
// serves the noindex scheduled-draft page. Search Console (coverage export,
// 2026-09-09) showed 61 pages stuck in "Excluded by noindex" exactly this
// way: linked before publish, crawled as noindex, then recrawled only weeks
// after going live. Query strings and fragments are ignored; both the /blog/
// slug form and a custom canonicalPath are recognised.
export function isScheduledArticlePath(href, now = Date.now()) {
  if (!href || !href.startsWith("/")) return false;
  const path = href.split(/[?#]/)[0].replace(/\/+$/, "");
  const slug = path.startsWith("/blog/") ? path.slice("/blog/".length) : null;
  return articlesIndex.some((a) => {
    const cp = (a.canonicalPath || "").replace(/\/+$/, "");
    const matches = (slug !== null && a.slug === slug) || (cp !== "" && cp === path);
    return matches && !isLive(a, now);
  });
}
