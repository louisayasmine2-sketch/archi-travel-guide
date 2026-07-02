import { useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/common/DestinationCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Search } from "lucide-react";

export default function Destinations() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");

  const regions = useMemo(() => {
    const set = new Set(destinations.map((d) => d.region));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = destinations.filter((d) => {
    const rOK = region === "all" || d.region === region;
    const qOK = !q.trim() || (d.name + d.blurb + d.tagline).toLowerCase().includes(q.toLowerCase());
    return rOK && qOK;
  });

  return (
    <div>
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations" }]} />
          <h1 className="font-serif text-5xl md:text-6xl leading-none tracking-tight mt-6 max-w-3xl">
            Destinations, mapped honestly.
          </h1>
          <p className="mt-5 text-lg max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Deep coverage begins in Italy. Europe and Asia are being built out with the same care.
            No filler pages, no destinations we haven’t actually planned trips for.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <label className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--charcoal-soft))]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search destinations"
                className="w-full rounded-full border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] pl-11 pr-5 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none"
              />
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-full border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-5 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r === "all" ? "All regions" : r}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          {filtered.length === 0 ? (
            <p className="text-[hsl(var(--charcoal-soft))]">No destinations match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((d) => (
                <DestinationCard
                  key={d.slug}
                  to={`/${d.slug}`}
                  name={d.name}
                  tagline={d.tagline}
                  blurb={d.blurb}
                  image={d.image}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
