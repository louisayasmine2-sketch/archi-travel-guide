import { useState } from "react";
import { packingChecklist } from "@/lib/travelTools";
import { toast } from "sonner";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { TOOLS } from "@/constants/testIds";
import { ListChecks, Check, BedDouble, MapPin, ExternalLink } from "lucide-react";

const SEL = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const LABEL = "text-sm font-medium text-[hsl(var(--charcoal))]";

export default function PackingChecklist() {
  const [form, setForm] = useState({ destination: "Tuscany", season: "spring", trip_length: 7 });
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = packingChecklist({ ...form, trip_length: Number(form.trip_length) });
      setResult(data);
      setChecked(new Set());
    } catch (_) {
      toast.error("Couldn't generate the checklist. Please try again.");
    } finally { setLoading(false); }
  };

  const toggle = (k) => setChecked((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  return (
    <div>
      <SEO
        title="Packing Checklist — Season-aware, printable"
        description="Generate a smart packing checklist grouped by category and adjusted for your season and trip length. Tick as you pack."
        path="/travel-tools/packing-checklist"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Tools', to: '/travel-tools' }, { label: 'Packing Checklist' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools", to: "/travel-tools" }, { label: "Packing Checklist" }]} />
          <div className="flex items-center gap-3 mt-6">
            <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))]"><ListChecks className="w-5 h-5" /></div>
            <p className="overline">Packing Checklist</p>
          </div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">Everything, nothing extra.</h1>
          <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            A season-aware checklist grouped by category. Tick as you pack. Adjusts for longer trips automatically.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-28">
            <form onSubmit={submit} data-testid={TOOLS.packForm} className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 md:p-8 space-y-5">
            <label className="space-y-1.5 block"><span className={LABEL}>Destination</span>
              <input data-testid={TOOLS.packDestination} className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)} />
            </label>
            <label className="space-y-1.5 block"><span className={LABEL}>Season</span>
              <select data-testid={TOOLS.packSeason} className={SEL} value={form.season} onChange={(e) => upd("season", e.target.value)}>
                <option value="spring">Spring</option><option value="summer">Summer</option><option value="autumn">Autumn</option><option value="winter">Winter</option>
              </select>
            </label>
            <label className="space-y-1.5 block"><span className={LABEL}>Trip length (days)</span>
              <input data-testid={TOOLS.packLength} type="number" min="1" max="60" className={SEL} value={form.trip_length} onChange={(e) => upd("trip_length", e.target.value)} />
            </label>
            <button data-testid={TOOLS.packSubmit} type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? "Building…" : "Generate checklist"}
            </button>
            </form>

            <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[hsl(var(--terracotta))]">
                <MapPin className="w-5 h-5" />
                <h3 className="font-serif text-lg leading-tight">Heading to {form.destination}?</h3>
              </div>
              <p className="text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Book your stay early to secure the best spots. Compare prices and find great deals on top-rated accommodations.
              </p>
              <a href="/go/booking" target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-[hsl(var(--terracotta))] text-[hsl(var(--terracotta))] hover:bg-[hsl(var(--terracotta))] hover:text-white transition-colors text-sm font-semibold">
                <BedDouble className="w-4 h-4" />
                Find Hotels
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            {result ? (
              <div data-testid={TOOLS.packResult} className="space-y-6">
                
                <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--terracotta))]/10 to-[hsl(var(--olive))]/10 border border-[hsl(var(--terracotta))]/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
                  <div className="text-center sm:text-left">
                    <h3 className="font-serif text-xl sm:text-2xl text-[hsl(var(--charcoal))]">Still need a place to stay?</h3>
                    <p className="text-sm sm:text-base text-[hsl(var(--charcoal-soft))] mt-1">Don't wait until the last minute. Find the best deals in {form.destination}.</p>
                  </div>
                  <a href="/go/booking" target="_blank" rel="noopener noreferrer nofollow" className="btn-primary whitespace-nowrap shrink-0 flex items-center gap-2 w-full sm:w-auto justify-center">
                    Check Availability
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                {Object.entries(result.categories).map(([cat, items]) => (
                  <div key={cat} className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-6">
                    <h3 className="font-serif text-2xl">{cat}</h3>
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {items.map((it) => {
                        const key = `${cat}::${it}`;
                        const isChecked = checked.has(key);
                        return (
                          <li key={key}>
                            <button type="button" onClick={() => toggle(key)} className={["w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm border transition-colors",
                              isChecked ? "border-[hsl(var(--olive))] bg-[hsl(var(--olive))]/10 text-[hsl(var(--olive))] line-through" : "border-[hsl(var(--stone-border))] hover:border-[hsl(var(--terracotta))]"].join(" ")}>
                              <span className={["w-5 h-5 rounded-md border grid place-items-center shrink-0", isChecked ? "border-[hsl(var(--olive))] bg-[hsl(var(--olive))] text-[hsl(var(--ivory))]" : "border-[hsl(var(--stone-border))]"].join(" ")}>
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </span>
                              {it}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[hsl(var(--stone-border))] p-8 text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Choose a season and trip length to generate a smart packing checklist you can tick as you pack.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
