import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import RecommendedTravelResources from "@/components/common/RecommendedTravelResources";
import { breadcrumbSchema } from "@/lib/schema";
import { TOOLS } from "@/constants/testIds";
import { Wallet } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SEL = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const LABEL = "text-sm font-medium text-[hsl(var(--charcoal))]";

export default function BudgetPlanner() {
  const [form, setForm] = useState({
    destination: "Siena",
    travelers: 2,
    trip_length: 4,
    accommodation_level: "mid",
    food_level: "casual",
    transport_type: "public",
    activities_level: "moderate",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/tools/budget-calculator`, {
        ...form,
        travelers: Number(form.travelers),
        trip_length: Number(form.trip_length),
      });
      setResult(res.data);
    } catch (_) {
      toast.error("Couldn't calculate the budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      <section className="">
        <div className="container-editorial pt-4 pb-8">
          
          <div className="flex items-center gap-3 mt-6">
            <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))]"><Wallet className="w-5 h-5" /></div>
            <p className="overline">Trip Budget Calculator</p>
          </div>
          <h2 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">How much will your trip cost?</h2>
          <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Estimate a realistic low–high budget range based on destination, party size, trip length and travel style.
            Regional presets for Italy, Tuscany, Siena, Europe and Asia.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={submit} data-testid={TOOLS.budgetForm} className="lg:col-span-7 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-1.5"><span className={LABEL}>Destination</span>
                <input data-testid={TOOLS.budgetDestination} className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)} placeholder="e.g. Siena" />
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Travelers</span>
                <input data-testid={TOOLS.budgetTravelers} type="number" min="1" max="20" className={SEL} value={form.travelers} onChange={(e) => upd("travelers", e.target.value)} />
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Trip length (nights)</span>
                <input data-testid={TOOLS.budgetLength} type="number" min="1" max="90" className={SEL} value={form.trip_length} onChange={(e) => upd("trip_length", e.target.value)} />
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Accommodation level</span>
                <select data-testid={TOOLS.budgetAccommodation} className={SEL} value={form.accommodation_level} onChange={(e) => upd("accommodation_level", e.target.value)}>
                  <option value="budget">Budget (guesthouses / hostels)</option>
                  <option value="mid">Mid (3–4★ hotels)</option>
                  <option value="luxury">Luxury (boutique / design)</option>
                </select>
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Food style</span>
                <select data-testid={TOOLS.budgetFood} className={SEL} value={form.food_level} onChange={(e) => upd("food_level", e.target.value)}>
                  <option value="street">Casual & street food</option>
                  <option value="casual">Trattorias & cafés</option>
                  <option value="fine">Enotecas & tasting menus</option>
                </select>
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Transport</span>
                <select data-testid={TOOLS.budgetTransport} className={SEL} value={form.transport_type} onChange={(e) => upd("transport_type", e.target.value)}>
                  <option value="public">Public (trains, buses)</option>
                  <option value="mixed">Mixed (occasional taxi)</option>
                  <option value="private">Private (car / driver)</option>
                </select>
              </label>
              <label className="space-y-1.5 md:col-span-2"><span className={LABEL}>Activities pace</span>
                <select data-testid={TOOLS.budgetActivities} className={SEL} value={form.activities_level} onChange={(e) => upd("activities_level", e.target.value)}>
                  <option value="light">Light — 0–1 paid activities / day</option>
                  <option value="moderate">Moderate — 1–2 paid activities / day</option>
                  <option value="packed">Packed — 2–3 paid activities / day</option>
                </select>
              </label>
            </div>
            <button data-testid={TOOLS.budgetSubmit} type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Calculating…" : "Calculate my budget"}
            </button>
          </form>

          <aside className="lg:col-span-5">
            {result ? (
              <div data-testid={TOOLS.budgetResult} className="rounded-2xl bg-[hsl(var(--charcoal))] text-[hsl(var(--ivory))] p-8 grain">
                <p className="overline text-[hsl(var(--ivory))]/70">Estimated total</p>
                <p className="font-serif text-5xl md:text-6xl mt-3 leading-none">${result.estimated_low.toLocaleString()}–${result.estimated_high.toLocaleString()}</p>
                <p className="mt-2 text-sm text-[hsl(var(--ivory))]/75">USD, all-inclusive of accommodation, food, transport and activities.</p>
                <p className="mt-6 text-sm text-[hsl(var(--ivory))]/85">
                  Per person, per day: <strong>${result.per_person_per_day}</strong>
                </p>
                <ul className="mt-8 space-y-3 text-sm text-[hsl(var(--ivory))]/85">
                  {result.tips.map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[hsl(var(--sand))] mt-1">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[hsl(var(--stone-border))] p-8 text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Fill in the form to see a realistic budget range and practical tips. Presets exist for Italy, Tuscany, Siena, Europe and Asia — anything else uses a global baseline.
              </div>
            )}
            <div className="mt-8"><AdPlaceholder /></div>
          </aside>
        </div>
      </section>

      <RecommendedTravelResources context="travel-budget-calculator" />
    </div>
  );
}
