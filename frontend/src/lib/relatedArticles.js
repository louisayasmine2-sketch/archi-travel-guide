import { articles } from "@/data/articles";

// Who "Keep reading" points at.
//
// It used to be `articles.filter(same region or category).slice(0, 3)` — array
// order. That handed every recommendation on the site to whichever few guides
// happen to sit early in articles.js, while ten published guides ended up with
// no in-content inbound link at all. Same topical constraint as before, but
// within it the least-linked candidate wins, so the module spreads inbound
// links instead of concentrating them.
//
// Everything here is deterministic: same content in, same recommendations out.

const INTERNAL_LINK = /\]\((\/[^)\s]*)\)/g;

const normalise = (path) => {
  const clean = String(path).split("#")[0].split("?")[0];
  return clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
};

const routesOf = (article) => {
  const routes = [normalise(`/blog/${article.slug}`)];
  if (article.canonicalPath) routes.push(normalise(article.canonicalPath));
  return routes;
};

const textOf = (article) =>
  [
    ...(article.sections || []).map((s) => s.body || ""),
    ...(article.faqs || []).map((f) => f.a || ""),
  ].join("\n");

// One pass over every published body, at module load.
const inboundCounts = (() => {
  const counts = new Map();
  for (const article of articles) {
    const targets = new Set();
    let match;
    INTERNAL_LINK.lastIndex = 0;
    while ((match = INTERNAL_LINK.exec(textOf(article))) !== null) {
      targets.add(normalise(match[1]));
    }
    for (const target of targets) {
      counts.set(target, (counts.get(target) || 0) + 1);
    }
  }
  return counts;
})();

/** In-content internal links pointing at this article, from anywhere on the site. */
export const inboundLinkCount = (article) =>
  routesOf(article).reduce((most, route) => Math.max(most, inboundCounts.get(route) || 0), 0);

/**
 * Up to `limit` articles to recommend alongside this one. Same category ranks
 * above same region, as before; the tie-break is how few inbound links the
 * candidate already has, then how recently it was updated.
 */
export const relatedArticles = (article, limit = 3) => {
  const affinity = (candidate) => {
    if (candidate.category === article.category) return 0;
    if (candidate.region === article.region) return 1;
    return 2;
  };

  return articles
    .filter((candidate) => candidate.slug !== article.slug && affinity(candidate) < 2)
    .sort(
      (a, b) =>
        affinity(a) - affinity(b) ||
        inboundLinkCount(a) - inboundLinkCount(b) ||
        String(b.updated || "").localeCompare(String(a.updated || "")) ||
        a.slug.localeCompare(b.slug)
    )
    .slice(0, limit);
};
