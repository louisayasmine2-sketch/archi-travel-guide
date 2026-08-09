// Relevance-scored "Keep reading" picks. The previous logic was
// `region === region || category === category`, first three in file order —
// which meant 30 Tuscany articles all showed the same three cards. Scoring:
//
//   same category  +3   (strongest editorial signal we have)
//   same region    +2
//   title-keyword overlap  +1 per shared meaningful word, capped at +3
//
// Ties break toward the most recently updated article, then file order.
// Everything is computed from fields every article is guaranteed to carry
// (category, region, title, updated) — no curation, no fabricated data.

const TITLE_STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "your", "you", "how", "what", "when",
  "where", "which", "why", "who", "guide", "complete", "travel", "trip",
  "visit", "visiting", "not", "should", "need", "know", "before", "into",
  "near", "around",
]);

function titleTokens(title) {
  return new Set(
    String(title || "")
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((t) => t.length > 2 && !TITLE_STOPWORDS.has(t))
  );
}

export function relatedArticles(current, all, limit = 3) {
  const currentTokens = titleTokens(current.title);
  const scored = [];

  for (const candidate of all) {
    if (candidate.slug === current.slug) continue;
    let score = 0;
    if (candidate.category === current.category) score += 3;
    if (candidate.region === current.region) score += 2;
    let overlap = 0;
    for (const token of titleTokens(candidate.title)) {
      if (currentTokens.has(token)) overlap += 1;
    }
    score += Math.min(overlap, 3);
    if (score > 0) scored.push({ score, candidate });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return String(b.candidate.updated).localeCompare(String(a.candidate.updated));
  });

  return scored.slice(0, limit).map((s) => s.candidate);
}
