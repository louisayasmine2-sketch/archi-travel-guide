import { useState } from "react";
import { areaFinder } from "@/lib/travelTools";
import { Hotel } from "lucide-react";

const SEL = "w-full rounded-2xl border border-[#F5EDE3] bg-white px-4 py-3 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors";
const LABEL = "text-sm font-medium text-[#657143] mb-1.5 block";

// Only cities with a real entry in the AREA_MAP table are offered, so a
// free-text city can never fall through silently to generic advice.
const CITIES = ["Siena", "Florence", "Rome"];

export default function AreaMatch() {
  const [form, setForm] = useState({
    destination: "Siena",
    budget: "mid",
    transport_preference: "walk",
    nightlife: "low",
    family: false,
  });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Pure table lookup — the recommendation updates as the form changes.
  const result = areaFinder(form);

  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#A84A2E]">
          <Hotel className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Area Match</h2>
          <p className="text-[#657143] mt-1">Answer four questions, get the neighbourhood that fits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6 space-y-4 shadow-sm h-fit">
          <label className="block">
            <span className={LABEL}>City</span>
            <select className={SEL} value={form.destination} onChange={(e) => upd("destination", e.target.value)}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Budget</span>
            <select className={SEL} value={form.budget} onChange={(e) => upd("budget", e.target.value)}>
              <option value="budget">Budget (guesthouses, B&amp;Bs)</option>
              <option value="mid">Mid (3–4★ hotels)</option>
              <option value="luxury">Luxury (boutique, historic)</option>
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Getting around</span>
            <select className={SEL} value={form.transport_preference} onChange={(e) => upd("transport_preference", e.target.value)}>
              <option value="walk">Mostly on foot</option>
              <option value="public">Public transport</option>
              <option value="mixed">A bit of both</option>
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Evenings</span>
            <select className={SEL} value={form.nightlife} onChange={(e) => upd("nightlife", e.target.value)}>
              <option value="low">Quiet dinners, early nights</option>
              <option value="high">Bars and late passeggiata</option>
            </select>
          </label>
          <label className="flex items-center gap-3 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={form.family}
              onChange={(e) => upd("family", e.target.checked)}
              className="w-4 h-4 accent-[#C65A3A]"
            />
            <span className="text-sm text-[#2C211B]">Travelling with children</span>
          </label>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-[#2C211B] text-[#F5EDE3] p-8 shadow-lg h-fit">
            <p className="text-[#657143] font-medium uppercase tracking-wider text-sm mb-2">
              Your match in {result.destination}
            </p>
            <p className="font-serif text-4xl md:text-5xl leading-tight mt-2 text-white">{result.recommended_area}</p>
            <p className="mt-5 text-gray-300 leading-relaxed text-sm">{result.why}</p>
            {result.budget_note && (
              <p className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-300">
                <span className="text-[#A84A2E] font-medium">For your budget: </span>{result.budget_note}
              </p>
            )}
          </div>
          <p className="mt-4 text-xs text-[#657143]">
            Editorial picks by our team — pair this with the Best Area to Stay map for Siena's geography.
          </p>
        </div>
      </div>
    </div>
  );
}
