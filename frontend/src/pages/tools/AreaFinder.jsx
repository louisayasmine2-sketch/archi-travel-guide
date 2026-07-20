import { useState } from "react";
import { areaFinder } from "@/lib/travelTools";
import { toast } from "sonner";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { TOOLS } from "@/constants/testIds";
import { MapPin } from "lucide-react";

const SEL = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const LABEL = "text-sm font-medium text-[hsl(var(--charcoal))]";

export default function AreaFinder() {
  const [form, setForm] = useState({ destination: "Siena", budget: "mid", travel_style: "culture", transport_preference: "walk", nightlife: "some", family: false });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = areaFinder(form);
      setResult(data);
    } catch (_) {
      toast.error("Couldn't find an area. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <SEO
        title="Best Area to Stay Finder — Neighborhood recommendations"
        description="Get a targeted neighborhood recommendation for your destination based on budget, style, transport and family. Deep coverage for Siena, Florence and Rome."
        path="/travel-tools/area-finder"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Tools', to: '/travel-tools' }, { label: 'Best Area to Stay Finder' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools", to: "/travel-tools" }, { label: "Best Area to Stay Finder" }]} />
          <div className="flex items-center gap-3 mt-6">
            <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))]"><MapPin className="w-5 h-5" /></div>
            <p className="overline">Best Area to Stay Finder</p>
          </div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">The right neighborhood for your trip.</h1>
          <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Detailed recommendations for Siena, Florence and Rome — general framework for other cities.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={submit} data-testid={TOOLS.areaForm} className="lg:col-span-6 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-1.5"><span className={LABEL}>Destination</span>
                <input data-testid={TOOLS.areaDestination} className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)} placeholder="e.g. Florence" />
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Budget</span>
                <select data-testid={TOOLS.areaBudget} className={SEL} value={form.budget} onChange={(e) => upd("budget", e.target.value)}>
                  <option value="budget">Budget</option><option value="mid">Mid</option><option value="luxury">Luxury</option>
                </select>
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Travel style</span>
                <select data-testid={TOOLS.areaStyle} className={SEL} value={form.travel_style} onChange={(e) => upd("travel_style", e.target.value)}>
                  <option value="culture">Culture</option><option value="food">Food</option><option value="nature">Nature</option><option value="mix">Mix</option>
                </select>
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Getting around</span>
                <select data-testid={TOOLS.areaTransport} className={SEL} value={form.transport_preference} onChange={(e) => upd("transport_preference", e.target.value)}>
                  <option value="walk">Mostly walking</option><option value="public">Mostly public transport</option><option value="car">By car</option>
                </select>
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Nightlife</span>
                <select data-testid={TOOLS.areaNightlife} className={SEL} value={form.nightlife} onChange={(e) => upd("nightlife", e.target.value)}>
                  <option value="low">Quiet nights</option><option value="some">Some evening life</option><option value="high">Lively nightlife</option>
                </select>
              </label>
              <label className="flex items-center gap-3 pt-6">
                <input data-testid={TOOLS.areaFamily} type="checkbox" checked={form.family} onChange={(e) => upd("family", e.target.checked)} className="w-4 h-4 accent-[hsl(var(--terracotta))]" />
                <span className={LABEL}>Traveling with kids</span>
              </label>
            </div>
            <button data-testid={TOOLS.areaSubmit} type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Finding area…" : "Find my area"}
            </button>
          </form>

          <div className="lg:col-span-6">
            {result ? (
              <div data-testid={TOOLS.areaResult} className="rounded-2xl bg-[hsl(var(--charcoal))] text-[hsl(var(--ivory))] p-8 grain">
                <p className="overline text-[hsl(var(--ivory))]/70">Recommended for {result.destination}</p>
                <h3 className="font-serif text-4xl md:text-5xl leading-tight mt-3">{result.recommended_area}</h3>
                <p className="mt-4 text-[hsl(var(--ivory))]/85 leading-relaxed">{result.why}</p>
                {result.budget_note && <p className="mt-4 text-sm text-[hsl(var(--sand))]">{result.budget_note}</p>}
                {result.runner_up && (
                  <div className="mt-8 pt-8 border-t border-[hsl(var(--ivory))]/15">
                    <p className="text-xs uppercase tracking-widest text-[hsl(var(--ivory))]/60">Runner-up</p>
                    <p className="font-serif text-2xl mt-1">{result.runner_up}</p>
                    <p className="text-sm text-[hsl(var(--ivory))]/75 mt-2">{result.runner_up_why}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[hsl(var(--stone-border))] p-8 text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Answer the questions to get a targeted neighborhood recommendation. Deep coverage for Siena, Florence and Rome.
              </div>
            )}
            <div className="mt-8"><AdPlaceholder /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
