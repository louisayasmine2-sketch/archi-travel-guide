import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Luggage } from "lucide-react";
import { hasTripPlan, loadTripPlan, daysUntilTrip, TRIP_CHANGE_EVENT } from "@/lib/tripPlan";

// Site-wide "My Trip" chip. Appears once the visitor has saved a plan and
// links straight to their Trip Sheet. Listens for plan changes so it stays
// current without a reload.
export default function TripChip() {
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

  if (!plan) return null;

  const days = daysUntilTrip(plan);
  const label = days !== null && days > 0
    ? `${days} ${days === 1 ? "day" : "days"} to ${plan.destination}`
    : days === 0
      ? `${plan.destination} — today!`
      : `${plan.destination} · ${plan.trip_length} ${plan.trip_length === 1 ? "night" : "nights"}`;

  return (
    <Link
      to="/travel-tools?tool=trip-sheet"
      aria-label={`My Trip: ${label} — open trip sheet`}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#C65A3A]/10 border border-[#C65A3A]/30 text-[#C65A3A] text-sm font-medium hover:bg-[#C65A3A] hover:text-white transition-colors whitespace-nowrap"
    >
      <Luggage className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
}
