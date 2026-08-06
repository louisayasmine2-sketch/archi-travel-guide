import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  hasTripPlan, loadTripPlan, daysUntilTrip, tripOverlapsPalio, PALIO_NOTE, TRIP_CHANGE_EVENT,
} from "@/lib/tripPlan";
import { Luggage, ArrowRight } from "lucide-react";

// Destination-page strip connecting to the My Trip layer. Visitors whose
// saved plan targets THIS destination see their countdown (and the verified
// Palio warning when their dates overlap); everyone else gets one planning
// CTA. Used by /siena and /tuscany-travel-guide.
export default function PlanStrip({ destination }) {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const refresh = () => setPlan(hasTripPlan() ? loadTripPlan() : null);
    refresh();
    window.addEventListener(TRIP_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(TRIP_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const match = plan && plan.destination === destination ? plan : null;
  const days = match ? daysUntilTrip(match) : null;

  return (
    <section className="py-10 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl border border-[#C65A3A]/25 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#C65A3A]/10 grid place-items-center text-[#C65A3A] shrink-0">
                <Luggage className="w-5 h-5" />
              </div>
              <p className="font-serif text-lg text-[#2C211B] leading-tight">
                {match
                  ? days !== null && days > 0
                    ? `${days} ${days === 1 ? "day" : "days"} to your ${destination} trip`
                    : days === 0
                      ? `Your ${destination} trip starts today`
                      : `Your ${destination} plan: ${match.trip_length} ${match.trip_length === 1 ? "night" : "nights"}`
                  : `Planning a ${destination} trip? Set it once and every tool follows.`}
              </p>
            </div>
            <Link
              to={match ? "/travel-tools?tool=trip-sheet" : "/travel-tools"}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C65A3A] hover:bg-[#A84A2E] text-white text-sm font-medium transition-colors"
            >
              {match ? "Open your Trip Sheet" : `Plan your ${destination} trip`} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {match && tripOverlapsPalio(match) && (
            <p className="mt-4 text-xs leading-relaxed text-[#8A9A5B] bg-[#FAF7F2] rounded-2xl px-4 py-3">
              <span className="font-semibold text-[#2C211B]">Your dates overlap the Palio: </span>
              {PALIO_NOTE.text} <span className="opacity-70">(Checked {PALIO_NOTE.checked})</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
