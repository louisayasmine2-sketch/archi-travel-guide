import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { TOOLS } from "@/constants/testIds";
import { Sun } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SEL = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const LABEL = "text-sm font-medium text-[hsl(var(--charcoal))]";

export default function BestTimeToVisit() {
  const [form, setForm] = useState({ destination: "Tuscany", preference: "good_weather" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/tools/best-time`, form);
      setResult(res.data);
    } catch (_) {
      toast.error("Couldn't fetch a suggestion. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <SEO
        title="Best Time to Visit — Month-by-month recommendations"
        description="Pick the right month for your destination — optimised for weather, low crowds, low prices or festivals. Honest, opinionated advice."
        path="/travel-tools/best-time-to-visit"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Tools', to: '/travel-tools' }, { label: 'Best Time to Visit' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools", to: "/travel-tools" }, { label: "Best Time to Visit" }]} />
          <div className="flex items-center gap-3 mt-6">
            <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))]"><Sun className="w-5 h-5" /></div>
            <p className="overline">Best Time to Visit</p>
          </div>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">Pick the right month.</h1>
          <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Optimise your trip for weather, low crowds, low prices or festivals — one at a time, honestly.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={submit} data-testid={TOOLS.btForm} className="lg:col-span-5 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 md:p-8 space-y-5 h-fit">
            <label className="space-y-1.5 block"><span className={LABEL}>Destination</span>
              <input data-testid={TOOLS.btDestination} className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)} />
            </label>
            <label className="space-y-1.5 block"><span className={LABEL}>Optimise for</span>
              <select data-testid={TOOLS.btPreference} className={SEL} value={form.preference} onChange={(e) => upd("preference", e.target.value)}>
                <option value="good_weather">Best weather</option>
                <option value="low_crowds">Fewest crowds</option>
                <option value="low_prices">Lowest prices</option>
                <option value="festivals">Big festivals</option>
              </select>
            </label>
            <button data-testid={TOOLS.btSubmit} type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Checking…" : "Show months"}
            </button>
          </form>

          <div className="lg:col-span-7">
            {result ? (
              <div data-testid={TOOLS.btResult} className="rounded-2xl bg-[hsl(var(--charcoal))] text-[hsl(var(--ivory))] p-8 grain">
                <p className="overline text-[hsl(var(--ivory))]/70">Best months for {result.destination}</p>
                <p className="font-serif text-4xl md:text-5xl leading-tight mt-3">{result.months}</p>
                <p className="mt-5 text-[hsl(var(--ivory))]/85 leading-relaxed">{result.note}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[hsl(var(--stone-border))] p-8 text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Choose a preference to see the months that match — and why.
              </div>
            )}
            <div className="mt-8"><AdPlaceholder /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
