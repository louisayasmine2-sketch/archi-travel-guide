import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import { europeCountries } from "@/data/destinations";
import { articles } from "@/data/articles";

const HERO = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=75";

export default function Europe() {
  const list = articles.filter((a) => a.region === "Europe" || a.region === "Global").slice(0, 3);
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={HERO} alt="Europe" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/80 via-[hsl(var(--charcoal))]/25 to-transparent" />
        <div className="relative container-editorial pt-14 pb-24 lg:pb-32 text-[hsl(var(--ivory))]">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations", to: "/destinations" }, { label: "Europe" }]} />
          <p className="overline text-[hsl(var(--ivory))]/80 mt-6">Continent · in progress</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-none tracking-tight max-w-3xl">Europe travel guide</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--ivory))]/85">
            Our second phase. We publish country guides only when we can do them properly — the placeholders
            below show what’s next, not filler.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <p className="overline">Coming country pillars</p>
            <h2 className="font-serif text-4xl mt-3">Where Europe expands from</h2>
            <p className="mt-4 text-[hsl(var(--charcoal-soft))] leading-relaxed">
              We prioritise depth over breadth. Each of the countries below will get city guides,
              itineraries and travel tools — not thin overview pages.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {europeCountries.map((c) => (
                <div key={c.name} className="card-editorial p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl">{c.name}</h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-[hsl(var(--ivory-2))] text-[hsl(var(--charcoal-soft))]">Coming</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed">{c.blurb}</p>
                </div>
              ))}
            </div>

            <div className="mt-14">
              <p className="overline">Available today</p>
              <h3 className="font-serif text-2xl mt-2 mb-6">General Europe planning frameworks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {list.map((a) => <ArticleCard key={a.slug} article={a} />)}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6">
              <p className="overline">Editorial roadmap</p>
              <h3 className="font-serif text-2xl mt-2 leading-tight">Next up</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li><span className="text-[hsl(var(--terracotta))] font-medium">Q1</span> · France — Paris & Loire</li>
                <li><span className="text-[hsl(var(--terracotta))] font-medium">Q2</span> · Spain — Barcelona & Andalucía</li>
                <li><span className="text-[hsl(var(--terracotta))] font-medium">Q3</span> · Switzerland — Alps & trains</li>
                <li><span className="text-[hsl(var(--terracotta))] font-medium">Q4</span> · Greece — Athens & islands</li>
              </ul>
              <Link to="/travel-tools" className="mt-6 inline-block link-terra text-sm font-medium">Meanwhile — try our tools →</Link>
            </div>
            <AdPlaceholder variant="sidebar" />
          </aside>
        </div>
      </section>
    </div>
  );
}
