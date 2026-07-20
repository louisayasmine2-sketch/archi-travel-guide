import { useState } from "react";
import { itineraryGenerator, ITINERARY_DESTINATIONS } from "@/lib/travelTools";
import { toast } from "sonner";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { TOOLS } from "@/constants/testIds";
import { Sparkles } from "lucide-react";

const SEL = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const LABEL = "text-sm font-medium text-[hsl(var(--charcoal))]";

export default function ItineraryGenerator() {
  const [form, setForm] = useState({ destination: "Siena", trip_length: 3 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const maxDays = ITINERARY_DESTINATIONS.find((d) => d.value === form.destination)?.days ?? 1;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = itineraryGenerator({ ...form, trip_length: Number(form.trip_length) });
      setResult(data);
    } catch (_) {
      toast.error("Couldn't generate the itinerary. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <SEO
        title="Itinerary Generator — Day-by-day travel plans"
        description="Generate a day-by-day travel outline by destination and trip length. Presets for Siena, Tuscany and Italy; a generic outline for other destinations."
        path="/travel-tools/itinerary-generator"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Tools', to: '/travel-tools' }, { label: 'Itinerary Generator' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools", to: "/travel-tools" }, { label: "Itinerary Generator" }]} />
          <div className="flex items-center gap-3 mt-6">
            <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))]"><Sparkles className="w-5 h-5" /></div>
            <p className="overline">Itinerary Generator</p>
          </div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">A day-by-day outline, by destination and length.</h1>
          <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Pick a destination and trip length. We’ll suggest a day-by-day outline — a starting point, not a rigid schedule.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={submit} data-testid={TOOLS.itinForm} className="lg:col-span-5 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 md:p-8 space-y-5">
            <label className="space-y-1.5 block"><span className={LABEL}>Destination</span>
              <select data-testid={TOOLS.itinDestination} className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)}>
                {ITINERARY_DESTINATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 block"><span className={LABEL}>Trip length (days, max {maxDays})</span>
              <input data-testid={TOOLS.itinLength} type="number" min="1" max={maxDays} className={SEL} value={form.trip_length} onChange={(e) => upd("trip_length", Math.min(Number(e.target.value) || 1, maxDays))} />
            </label>
            <button data-testid={TOOLS.itinSubmit} type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Generating…" : "Generate itinerary"}
            </button>
          </form>

          <div className="lg:col-span-7">
            {result ? (
              <div data-testid={TOOLS.itinResult} className="space-y-5">
                <p className="text-sm text-[hsl(var(--charcoal-soft))]">{result.summary}</p>
                {result.days.map((d) => (
                  <div key={d.day} className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-6">
                    <div className="flex items-baseline gap-4">
                      <p className="overline">Day</p>
                      <p className="font-serif text-3xl leading-none">{d.day}</p>
                    </div>
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div><p className="text-[hsl(var(--charcoal-soft))] text-xs uppercase tracking-widest mb-1">Morning</p><p>{d.morning}</p></div>
                      <div><p className="text-[hsl(var(--charcoal-soft))] text-xs uppercase tracking-widest mb-1">Afternoon</p><p>{d.afternoon}</p></div>
                      <div><p className="text-[hsl(var(--charcoal-soft))] text-xs uppercase tracking-widest mb-1">Evening</p><p>{d.evening}</p></div>
                    </div>
                    {d.notes?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {d.notes.map((n, i) => (
                          <p key={i} className="text-xs leading-relaxed text-[hsl(var(--charcoal-soft))] bg-[hsl(var(--ivory))] border border-[hsl(var(--stone-border))] rounded-xl px-3 py-2">
                            <span className="font-semibold text-[hsl(var(--charcoal))]">Plan around this: </span>{n.text} <span className="opacity-70">(Checked {n.checked})</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[hsl(var(--stone-border))] p-8 text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Fill in the form to generate a customisable day-by-day itinerary. Includes presets for Siena, Tuscany, Italy — falls back to a smart default for anywhere else.
              </div>
            )}
            <div className="mt-8"><AdPlaceholder /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
