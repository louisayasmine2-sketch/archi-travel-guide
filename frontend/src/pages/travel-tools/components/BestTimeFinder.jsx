import { useState } from "react";
import { bestTime } from "@/lib/travelTools";
import { loadTripPlan } from "@/lib/tripPlan";
import { Sun } from "lucide-react";

const SEL = "w-full rounded-2xl border border-[#F5EDE3] bg-white px-4 py-3 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors";
const LABEL = "text-sm font-medium text-[#8A9A5B] mb-1.5 block";

// Only destinations with a real entry in the BEST_TIME table are offered, so a
// free-text city can never fall through silently to a generic bucket.
const DESTINATIONS = ["Siena", "Tuscany", "Italy", "Europe", "Asia"];

const PREFERENCES = [
  { value: "good_weather", label: "Best weather" },
  { value: "low_crowds", label: "Fewest crowds" },
  { value: "low_prices", label: "Lowest prices" },
  { value: "festivals", label: "Big festivals" },
];

export default function BestTimeFinder() {
  // Pre-filled from "My Trip" when its destination has an entry here.
  const [destination, setDestination] = useState(() => {
    const d = loadTripPlan().destination;
    return DESTINATIONS.includes(d) ? d : "Tuscany";
  });
  const [preference, setPreference] = useState("good_weather");

  // Pure table lookup — no fetch, so the result updates as the form changes.
  const selected = bestTime({ destination, preference });
  const others = PREFERENCES.filter((p) => p.value !== preference).map((p) => ({
    ...p,
    ...bestTime({ destination, preference: p.value }),
  }));

  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#C65A3A]">
          <Sun className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Best Time to Visit</h2>
          <p className="text-[#8A9A5B] mt-1">Pick the right month — optimised for one thing at a time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6 space-y-4 shadow-sm h-fit">
          <h3 className="font-semibold text-lg text-[#2C211B] mb-4">Your Trip</h3>
          <label className="block">
            <span className={LABEL}>Destination</span>
            <select className={SEL} value={destination} onChange={(e) => setDestination(e.target.value)}>
              {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={LABEL}>Optimise for</span>
            <select className={SEL} value={preference} onChange={(e) => setPreference(e.target.value)}>
              {PREFERENCES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </label>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl bg-[#2C211B] text-[#F5EDE3] p-8 shadow-lg">
            <p className="text-[#8A9A5B] font-medium uppercase tracking-wider text-sm mb-2">
              {PREFERENCES.find((p) => p.value === preference)?.label} in {destination}
            </p>
            <p className="font-serif text-4xl md:text-5xl leading-tight mt-2 text-white">{selected.months}</p>
            {selected.note && <p className="mt-5 text-gray-300 leading-relaxed text-sm">{selected.note}</p>}
          </div>

          <div className="rounded-3xl border border-[#F5EDE3] bg-white p-6 shadow-sm">
            <h3 className="font-serif text-2xl text-[#2C211B] mb-4">If you'd rather optimise for…</h3>
            <ul className="divide-y divide-[#F5EDE3]">
              {others.map((o) => (
                <li key={o.value} className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setPreference(o.value)}
                    className="text-left text-sm font-medium text-[#C65A3A] hover:underline sm:w-36 shrink-0"
                  >
                    {o.label}
                  </button>
                  <span className="text-sm text-[#2C211B]">{o.months}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
