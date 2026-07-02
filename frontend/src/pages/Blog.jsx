import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ArticleCard from "@/components/common/ArticleCard";
import { articles } from "@/data/articles";
import { Search } from "lucide-react";

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [region, setRegion] = useState("all");

  useEffect(() => { setQ(params.get("q") || ""); }, [params]);

  const regions = useMemo(() => ["all", ...Array.from(new Set(articles.map((a) => a.region)))], []);

  const filtered = articles.filter((a) => {
    const rOK = region === "all" || a.region === region;
    const qOK = !q.trim() || (a.title + a.excerpt + a.category + a.region).toLowerCase().includes(q.toLowerCase());
    return rOK && qOK;
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setParams(q.trim() ? { q: q.trim() } : {});
  };

  return (
    <div>
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
          <p className="overline mt-6">Editorial index</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">
            Every guide, one shelf.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Long-form guides, itineraries, and practical frameworks. Filter by destination or search a term.
          </p>

          <form onSubmit={onSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <label className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--charcoal-soft))]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search guides"
                className="w-full rounded-full border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] pl-11 pr-5 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none"
              />
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-full border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-5 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none"
            >
              {regions.map((r) => <option key={r} value={r}>{r === "all" ? "All regions" : r}</option>)}
            </select>
          </form>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <p className="text-sm text-[hsl(var(--charcoal-soft))] mb-8">{filtered.length} guides</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
