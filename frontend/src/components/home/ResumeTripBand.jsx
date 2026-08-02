import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hasTripPlan, loadTripPlan, daysUntilTrip, loadTripProgress, TRIP_CHANGE_EVENT } from "@/lib/tripPlan";
import { Luggage, ArrowRight } from "lucide-react";

// Returning planners see their trip waiting for them right under the hero;
// first-time visitors see nothing at all.
export default function ResumeTripBand() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const refresh = () =>
      setState(hasTripPlan() ? { plan: loadTripPlan(), progress: loadTripProgress() } : null);
    refresh();
    window.addEventListener(TRIP_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(TRIP_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!state) return null;
  const { plan, progress } = state;
  const days = daysUntilTrip(plan);

  const bits = [];
  if (progress.itineraryDone) bits.push("Itinerary ✓");
  if (progress.budgetDone) bits.push("Budget ✓");
  if (progress.packing) bits.push(`Packing ${progress.packing.done}/${progress.packing.total}`);

  return (
    <section className="px-4 sm:px-6 -mt-2">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-[#C65A3A]/25 bg-[#FAF7F2] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#C65A3A]/10 grid place-items-center text-[#C65A3A] shrink-0">
              <Luggage className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-lg text-[#2C211B] leading-tight truncate">
                {days !== null && days > 0
                  ? `${days} ${days === 1 ? "day" : "days"} to ${plan.destination}`
                  : days === 0
                    ? `${plan.destination} — departure day!`
                    : `Your ${plan.destination} trip · ${plan.trip_length} ${plan.trip_length === 1 ? "night" : "nights"}`}
              </p>
              {bits.length > 0 && <p className="text-xs text-[#8A9A5B] mt-0.5">{bits.join(" · ")}</p>}
            </div>
          </div>
          <Link
            to="/travel-tools?tool=trip-sheet"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C65A3A] hover:bg-[#A84A2E] text-white text-sm font-medium transition-colors"
          >
            Open your Trip Sheet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
