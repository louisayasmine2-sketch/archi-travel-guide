import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/common/SEO";
import { articles } from "@/data/articles";

// Everything on this page is derived from articles.js. No card, date, image or
// category is hardcoded — the previous version was a mockup wired to nothing.
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

// Category buttons come from the data's distinct category values — so a button
// can never point at a category no article has, and a new category shows up on
// its own. Cleaning the vocabulary in articles.js changes this list; the page
// never hardcodes it.
const CATEGORIES = ["All", ...[...new Set(articles.map((a) => a.category))].sort((a, b) => a.localeCompare(b))];

// Most-recently-updated first, computed once.
const BY_RECENT = [...articles].sort((a, b) => new Date(b.updated) - new Date(a.updated));

const PAGE_SIZE = 9;

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (activeCategory === "All" ? BY_RECENT : BY_RECENT.filter((a) => a.category === activeCategory)),
    [activeCategory]
  );
  const shown = filtered.slice(0, visible);
  const recent = BY_RECENT.slice(0, 4);

  const pickCategory = (cat) => {
    setActiveCategory(cat);
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
            <p className="text-muted-foreground py-12 text-center">No guides in this category yet.</p>
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
