import articlesIndex from "@/data/articlesIndex.json";

// Site search index. Every entry is derived from a real, published surface:
// articlesIndex.json only contains published articles, destination paths are
// router routes, and tool paths are the hub's ?tool= deep links. Nothing here
// is hand-written content, so a result can never lead somewhere that doesn't
// exist.

const DESTINATIONS = [
  { type: "Destination", title: "Siena travel guide", path: "/siena" },
  { type: "Destination", title: "Tuscany travel guide", path: "/tuscany-travel-guide" },
  { type: "Destination", title: "Florence travel guide", path: "/florence" },
];

// Mirrors the TOOLS registry in pages/TravelTools.jsx (id + display name).
const TOOLS = [
  { id: "trip-sheet", name: "My Trip Sheet" },
  { id: "itinerary", name: "Itinerary Generator" },
  { id: "budget", name: "Tuscany Budget Planner" },
  { id: "transport", name: "Transport Comparator" },
  { id: "packing", name: "Smart Packing List" },
  { id: "area-match", name: "Area Match" },
  { id: "map", name: "Best Area to Stay Finder" },
  { id: "best-time", name: "Best Time to Visit" },
  { id: "currency", name: "Live Currency Converter" },
].map((t) => ({ type: "Tool", title: t.name, path: `/travel-tools?tool=${t.id}` }));

const GUIDES = articlesIndex.map((a) => {
  const path = a.canonicalPath || `/blog/${a.slug}`;
  return {
    type: "Guide",
    title: a.title,
    extra: a.excerpt || "",
    path: path.endsWith("/") ? path : `${path}/`,
  };
});

export const SEARCH_INDEX = [...GUIDES, ...DESTINATIONS, ...TOOLS];
export const GUIDE_COUNT = GUIDES.length;

// Words that appear in almost every slug and carry no signal for matching.
const PATH_STOPWORDS = new Set(["the", "and", "for", "with", "from", "guide", "blog", "www", "html", "index"]);

// Best-effort matches for a mistyped or moved URL (the 404 page). Unlike
// searchSite this scores per-token (OR), because a typo in one path segment
// must not blank out every suggestion.
export function suggestForPath(pathname, limit = 4) {
  const tokens = String(pathname || "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((t) => t.length > 2 && !PATH_STOPWORDS.has(t));
  if (!tokens.length) return [];
  const scored = [];
  for (const entry of SEARCH_INDEX) {
    const haystack = `${entry.title} ${entry.path}`.toLowerCase();
    const hits = tokens.filter((t) => haystack.includes(t)).length;
    if (hits > 0) scored.push([hits, entry]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  // Only offer suggestions that share a real majority of the path's words —
  // a one-word overlap on a five-word path is noise, not a suggestion.
  const threshold = Math.max(1, Math.ceil(tokens.length / 2));
  return scored.filter(([hits]) => hits >= threshold).slice(0, limit).map(([, entry]) => entry);
}

// Multi-word AND match. Title hits rank above excerpt-only hits; ties keep
// index order (guides are already most-relevant-first from the generator).
export function searchSite(query, limit = 6) {
  const tokens = String(query || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored = [];
  for (const entry of SEARCH_INDEX) {
    const title = entry.title.toLowerCase();
    const extra = (entry.extra || "").toLowerCase();
    if (tokens.every((t) => title.includes(t))) {
      scored.push([2, entry]);
    } else if (tokens.every((t) => title.includes(t) || extra.includes(t))) {
      scored.push([1, entry]);
    }
  }
  scored.sort((a, b) => b[0] - a[0]);
  return scored.slice(0, limit).map(([, entry]) => entry);
}
