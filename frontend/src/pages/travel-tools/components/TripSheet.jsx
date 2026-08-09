import { useState } from "react";
import { itineraryGenerator, budgetCalculator, packingChecklist, bestTime, ITINERARY_DESTINATIONS } from "@/lib/travelTools";
import { loadTripPlan, loadBudgetPrefs } from "@/lib/tripPlan";
import { itineraryToIcs, downloadIcs, dayDateLabel } from "@/lib/icsExport";
import { loadSavedGuides } from "@/lib/savedGuides";
import { canonical } from "@/lib/seo";
import { Link } from "react-router-dom";
import { FileText, Printer, CalendarDays, CalendarPlus, Wallet, Sun, ListChecks, BookmarkCheck } from "lucide-react";

// One printable page composed entirely from the "My Trip" plan and the same
// verified tables the individual tools use — no new claims, no fetches.
// Budget style comes from the levels last used in the Budget Planner.

const PREF_LABELS = {
  accommodation_level: { budget: "budget guesthouses", mid: "mid-range hotels", luxury: "luxury boutique stays" },
  food_level: { street: "casual & street food", casual: "trattoria meals", fine: "fine dining" },
  transport_type: { public: "public transport", mixed: "mixed transport", private: "private transport" },
  activities_level: { light: "a light activity pace", moderate: "a moderate activity pace", packed: "a packed activity pace" },
};

function buildSheet() {
  const plan = loadTripPlan();
  const prefs = loadBudgetPrefs();
  const maxDays = ITINERARY_DESTINATIONS.find((d) => d.value === plan.destination)?.days ?? 1;
  const itinerary = itineraryGenerator({ destination: plan.destination, trip_length: Math.min(plan.trip_length, maxDays) });
  const budget = budgetCalculator({
    destination: plan.destination,
    travelers: plan.travelers,
    trip_length: plan.trip_length,
    ...prefs,
  });
  const assumptions = [
    PREF_LABELS.accommodation_level[prefs.accommodation_level],
    PREF_LABELS.food_level[prefs.food_level],
    PREF_LABELS.transport_type[prefs.transport_type],
    PREF_LABELS.activities_level[prefs.activities_level],
  ].join(", ");
  const months = bestTime({ destination: plan.destination, preference: "good_weather" });
  const packing = packingChecklist({ season: plan.season, trip_length: plan.trip_length });
  const savedGuides = loadSavedGuides();
  return { plan, itinerary, budget, assumptions, months, packing, savedGuides, itineraryCapped: plan.trip_length > maxDays };
}

const SECTION = "rounded-3xl border border-[#F5EDE3] bg-white p-6 shadow-sm";
const SECTION_TITLE = "flex items-center gap-2 font-serif text-2xl text-[#2C211B] mb-4";

export default function TripSheet() {
  // Built once when the modal opens — reopen to pick up My Trip changes.
  const [sheet] = useState(buildSheet);
  const { plan, itinerary, budget, assumptions, months, packing, savedGuides, itineraryCapped } = sheet;

  return (
    <div className="font-sans printable-area">
      {/* Print/PDF rules live in index.css (@media print): the sheet must be
          freed from the dialog's fixed/transformed/scroll-clipped container
          or the PDF comes out blank past the title. */}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#A84A2E] no-print">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">My {plan.destination} Trip Sheet</h2>
            <p className="text-[#657143] mt-1">
              {plan.trip_length} {plan.trip_length === 1 ? "night" : "nights"} · {plan.travelers} {plan.travelers === 1 ? "traveller" : "travellers"} · {plan.season}
            </p>
          </div>
        </div>
        <div className="no-print shrink-0 flex flex-wrap gap-2">
          {plan.start_date && (
            <button
              type="button"
              data-testid="add-to-calendar"
              onClick={() => {
                const ics = itineraryToIcs({ plan, itinerary });
                if (ics) downloadIcs(ics, `archi-${plan.destination.toLowerCase()}-trip.ics`);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-[#C65A3A] text-[#A84A2E] hover:bg-[#A84A2E] hover:text-white rounded-2xl font-medium transition-colors"
            >
              <CalendarPlus className="w-4 h-4" /> Add to calendar
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-3 bg-[#A84A2E] hover:bg-[#8F3E26] text-white rounded-2xl font-medium transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / save as PDF
          </button>
        </div>
      </div>

      <p className="no-print text-xs text-[#657143] bg-[#FAF7F2] rounded-2xl px-4 py-3 mb-6">
        Built from your "My Trip" plan on the tools page — change the plan there and reopen this sheet to refresh it.
      </p>

      <div className="space-y-6">
        {/* Day by day */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}><CalendarDays className="w-5 h-5 text-[#A84A2E]" /> Day by day</h3>
          {itineraryCapped && (
            <p className="text-xs text-[#657143] mb-4">
              Showing the {itinerary.trip_length} days of {plan.destination} content we actually have — we never pad an itinerary past that.
            </p>
          )}
          <div className="space-y-3">
            {itinerary.days.map((d, i) => (
              <div key={d.day} className="border-b border-[#F5EDE3] last:border-0 pb-3 last:pb-0">
                <p className="text-sm font-semibold text-[#A84A2E] uppercase tracking-wider mb-1">
                  Day {d.day}
                  {plan.start_date && dayDateLabel(plan.start_date, i) && (
                    <span className="normal-case tracking-normal text-[#657143] font-medium"> · {dayDateLabel(plan.start_date, i)}</span>
                  )}
                </p>
                <p className="text-sm text-[#2C211B]">
                  <span className="text-[#657143]">Morning:</span> {d.morning} · <span className="text-[#657143]">Afternoon:</span> {d.afternoon} · <span className="text-[#657143]">Evening:</span> {d.evening}
                </p>
                {d.notes?.map((n, i) => (
                  <p key={i} className="text-xs text-[#657143] mt-1.5 leading-relaxed">
                    <span className="font-semibold text-[#2C211B]">Plan around this:</span> {n.text} <span className="opacity-70">(Checked {n.checked})</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}><Wallet className="w-5 h-5 text-[#A84A2E]" /> Budget estimate</h3>
          <p className="font-serif text-3xl text-[#2C211B]">
            ${budget.estimated_low.toLocaleString()}–${budget.estimated_high.toLocaleString()} <span className="text-base text-[#657143] font-sans">USD total</span>
          </p>
          <p className="text-sm text-[#657143] mt-2">
            About ${budget.per_person_per_day} per person per day, assuming {assumptions} — your last choices in the Budget Planner; recalculate there to change them.
          </p>
        </div>

        {/* Best months */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}><Sun className="w-5 h-5 text-[#A84A2E]" /> Best months for weather</h3>
          <p className="text-lg text-[#2C211B]">{months.months}</p>
          {months.note && <p className="text-sm text-[#657143] mt-1">{months.note}</p>}
        </div>

        {/* Packing */}
        <div className={SECTION}>
          <h3 className={SECTION_TITLE}><ListChecks className="w-5 h-5 text-[#A84A2E]" /> Packing checklist — {plan.season}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(packing.categories).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-sm font-semibold text-[#2C211B] mb-2">{cat}</p>
                <ul className="space-y-1.5">
                  {items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm text-[#2C211B]">
                      <span className="w-3.5 h-3.5 border border-[#8A9A5B] rounded-sm shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Saved guides — the visitor's own reading list. The printed sheet
            shows full URLs so the paper copy still leads somewhere. */}
        {savedGuides.length > 0 && (
          <div className={SECTION} data-testid="saved-guides">
            <h3 className={SECTION_TITLE}><BookmarkCheck className="w-5 h-5 text-[#A84A2E]" /> Saved guides</h3>
            <ul className="space-y-2">
              {savedGuides.map((g) => (
                <li key={g.path} className="text-sm">
                  <Link to={g.path} className="text-[#2C211B] font-medium hover:text-[#A84A2E] underline underline-offset-4">
                    {g.title}
                  </Link>
                  <span className="block text-xs text-[#657143] mt-0.5">{canonical(g.path)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
