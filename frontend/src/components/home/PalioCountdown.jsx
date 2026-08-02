import { Link } from "react-router-dom";
import { Flag } from "lucide-react";

// Verified Palio dates: 2 July and 16 August (checked 20 July 2026 against
// the Comune di Siena — see the operational note in lib/travelTools.js).
// The banner only exists in the 60 days before a race; the rest of the year
// the homepage carries no artificial urgency.
const WINDOW_DAYS = 60;

export function nextPalio(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (const year of [today.getFullYear(), today.getFullYear() + 1]) {
    for (const [monthIndex, day, label] of [[6, 2, "2 July"], [7, 16, "16 August"]]) {
      const race = new Date(year, monthIndex, day);
      const days = Math.round((race - today) / 86400000);
      if (days >= 0 && days <= WINDOW_DAYS) return { label, days };
    }
  }
  return null;
}

export default function PalioCountdown() {
  const race = nextPalio();
  if (!race) return null;

  return (
    <section className="px-4 sm:px-6 mt-4">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/blog/palio-di-siena-guide/"
          className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl bg-[#2C211B] text-[#F5EDE3] px-6 py-4 hover:bg-[#3a2c22] transition-colors"
        >
          <span className="flex items-center gap-2 font-medium">
            <Flag className="w-4 h-4 text-[#C65A3A]" />
            Palio di Siena — {race.label}
            {race.days > 0 && (
              <span className="text-[#C65A3A]">· in {race.days} {race.days === 1 ? "day" : "days"}</span>
            )}
            {race.days === 0 && <span className="text-[#C65A3A]">· today</span>}
          </span>
          <span className="text-sm text-gray-300 flex-1">
            Trial races fill the days immediately before each race, when the Campo is fenced and the city is at its busiest.
          </span>
          <span className="text-sm font-medium text-[#C65A3A] group-hover:underline shrink-0">
            Read the Palio guide →
          </span>
        </Link>
      </div>
    </section>
  );
}
