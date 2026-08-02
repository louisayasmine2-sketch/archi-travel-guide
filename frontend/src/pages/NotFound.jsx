import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "@/components/common/SEO";
import { Search } from "lucide-react";

export default function NotFound() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/blog?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <section className="section-y">
      <SEO title="Page not found" description="This page doesn't exist on Archi Travel Guide." path="/404" noindex />
      <div className="container-editorial max-w-2xl">
        <p className="overline">404 · Off the map</p>
        <h1 className="font-serif text-6xl md:text-7xl leading-none tracking-tight mt-4">
          Not every road is paved.
        </h1>
        <p className="mt-6 text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">
          The page you were looking for doesn’t exist — or it may have moved as our editorial index grew.
        </p>

        <form onSubmit={onSearch} className="mt-8 flex gap-3 max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search our guides…"
            aria-label="Search guides"
            className="flex-1 px-5 py-3 rounded-2xl border border-[hsl(var(--stone-border))] bg-white text-sm focus:outline-none focus:border-[hsl(var(--terracotta))]"
          />
          <button type="submit" aria-label="Submit search" className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
        </form>

        <p className="mt-10 text-sm font-medium text-[hsl(var(--charcoal-soft))] uppercase tracking-wider">Most useful from here</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/" className="btn-ghost">Back home</Link>
          <Link to="/travel-tools" className="btn-ghost">Travel Tools</Link>
          <Link to="/siena" className="btn-ghost">Siena guide</Link>
          <Link to="/florence-to-siena-by-train-or-bus/" className="btn-ghost">Florence → Siena transport</Link>
          <Link to="/blog" className="btn-ghost">Browse all guides</Link>
        </div>
      </div>
    </section>
  );
}
