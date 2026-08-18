import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import SEO from "@/components/common/SEO";
// Card metadata only. Importing @/data/articles here would pull every
// article BODY (1.2MB and growing) into this route's chunk to render a list
// of titles — the index is generated from that same store on every build.
import { publishedBlogArticles } from "@/lib/publishedArticles";


// Everything on this page is derived from the article store. No card, date,
// image or category is hardcoded — the previous version was a mockup wired to
// nothing.
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Timezone-safe: parse the ISO date prefix, never new Date(), so an evening
// +07:00 timestamp doesn't render as the previous day.
function formatDate(iso) {
  if (!iso) return "";
  const [year, month, day] = String(iso).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "";
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

// The article's real route, always with a trailing slash.
function articlePath(article) {
  const path = article.canonicalPath || `/blog/${article.slug}`;
  return path.endsWith("/") ? path : `${path}/`;
}

// This listing covers the articles.js store; the index also carries the
// cluster and long-form guides, which have their own hub pages. Resolved on
// render, not at module load, so an article whose publish moment passes shows
// up without a redeploy.

const PAGE_SIZE = 9;

export default function Blog() {
  // ?q= (header/mobile search), ?cat= and ?region= (destination-page links)
  // are all honoured — a search that silently ignored its query shipped here
  // once and must not again.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const region = (searchParams.get("region") || "").trim();
  const catParam = (searchParams.get("cat") || "").trim().toLowerCase();

  // Evaluated once per mount: the runtime publish filter re-runs on every
  // visit to the page, while within a mounted page the list keeps a stable
  // identity — which the filter memo below depends on.
  const articles = useMemo(() => publishedBlogArticles(), []);
  // Category buttons come from the data's distinct values — a button can never
  // point at a category no article has, and a new one appears on its own.
  const CATEGORIES = ["All", ...[...new Set(articles.map((a) => a.category))].sort((a, b) => a.localeCompare(b))];
  const BY_RECENT = articles; // publishedArticles() is already newest-first

  const [activeCategory, setActiveCategory] = useState(
    () => CATEGORIES.find((c) => c.toLowerCase() === catParam) || "All"
  );
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? BY_RECENT : BY_RECENT.filter((a) => a.category === activeCategory);
    if (region) {
      list = list.filter((a) => (a.region || "").toLowerCase() === region.toLowerCase());
    }
    if (query) {
      const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((a) => {
        const haystack = `${a.title} ${a.excerpt} ${a.category}`.toLowerCase();
        return tokens.every((t) => haystack.includes(t));
      });
    }
    return list;
  }, [BY_RECENT, activeCategory, query, region]);
  const shown = filtered.slice(0, visible);
  const recent = BY_RECENT.slice(0, 4);

  const pickCategory = (cat) => {
    setActiveCategory(cat);
    setVisible(PAGE_SIZE);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <SEO
        title="Travel Blog · Archi Travel Guide"
        description="Practical Siena and Tuscany travel guides: itineraries, transport, where to stay, day trips, food, budget and seasonal planning."
        path="/blog/"
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#2C211B] to-[#3a2c22] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <p className="text-sm tracking-widest mb-3 uppercase opacity-80">Archi Travel Blog</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            Practical guides for Siena &amp; Tuscany
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl leading-relaxed">
            {articles.length} guides on itineraries, transport, where to stay, day trips and more — each shows the date it was last updated.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER — derived from the data */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-b border-border">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => pickCategory(cat)}
              className={`px-5 py-2 border rounded-full text-sm font-medium cursor-pointer transition-colors ${
                activeCategory === cat
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-8">
        {/* MAIN LIST */}
        <div className="col-span-12 lg:col-span-8">
          {query && (
            <div data-testid="blog-search-summary" className="mb-8 flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "guide matches" : "guides match"} “{query}”
                {region ? ` in ${region}` : ""}
              </p>
              <button
                onClick={clearSearch}
                data-testid="blog-search-clear"
                className="inline-flex items-center gap-1 text-sm text-primary border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear search
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shown.map((a) => (
              <Link
                key={a.slug}
                to={articlePath(a)}
                className="group flex flex-col bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <span className="self-start text-xs font-semibold uppercase tracking-wide text-primary bg-muted rounded-full px-3 py-1 mb-4">
                  {a.category}
                </span>
                <h3 className="font-semibold text-xl leading-snug mb-2 group-hover:text-primary transition-colors">
                  {a.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{a.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Updated {formatDate(a.updated)}</span>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                    Read <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-muted-foreground py-12 text-center">
              {query
                ? `No guides match “${query}”. Try a shorter keyword, or browse by category above.`
                : "No guides in this category yet."}
            </p>
          )}

          {visible < filtered.length && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-8 py-3 border border-primary rounded-full text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Show more ({filtered.length - visible} more)
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR — recently updated, real data */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-24">
            <h3 className="font-semibold text-xl mb-6">Recently updated</h3>
            <div className="space-y-5">
              {recent.map((a) => (
                <Link key={a.slug} to={articlePath(a)} className="block group">
                  <h4 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">
                    {a.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Updated {formatDate(a.updated)}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
