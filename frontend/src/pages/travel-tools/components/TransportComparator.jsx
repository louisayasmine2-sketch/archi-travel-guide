import { useState } from "react";
import { Link } from "react-router-dom";
import guide from "@/data/florenceToSienaGuide.json";
import AffiliateHandoff from "@/components/common/AffiliateHandoff";
import { Bus, Plane, Train, Compass, Car, Users, Check } from "lucide-react";

// Florence → Siena comparison. Every figure below is copied verbatim from the
// fact-checked guide (florenceToSienaGuide.json — its factChecked date is
// shown to the reader). These are planning ranges, not schedules.
const OPTIONS = [
  {
    id: "train",
    name: "Regional train",
    icon: Train,
    time: "1 hr 20 min–1 hr 45 min planning range, direct or changing at Empoli",
    arrival: "Railway station below the old town",
    bestFor: "Comfort, space, familiar booking",
    drawback: "Extra connection or uphill route to centre",
  },
  {
    id: "bus",
    name: "131R regional bus",
    icon: Bus,
    time: "About 75 minutes on the current timetable; traffic can add time",
    arrival: "Viale Tozzi/Piazza Gramsci side near centre",
    bestFor: "Most day trippers",
    drawback: "Road traffic, stop changes, less onboard space",
  },
  {
    id: "tour",
    name: "Guided tour",
    icon: Users,
    time: "Usually a full day",
    arrival: "Tour drop-off or walking-tour meeting area",
    bestFor: "Multiple Tuscan stops, low logistics",
    drawback: "Higher cost, fixed timetable, limited free time",
  },
  {
    id: "car",
    name: "Rental car",
    icon: Car,
    time: "Drive time varies",
    arrival: "Parking outside restricted centre",
    bestFor: "Wider road trip",
    drawback: "Parking, ZTL, designated-driver problem",
  },
];

const PRIORITIES = [
  { value: "centre", label: "Arriving closest to the centre", pick: "bus" },
  { value: "comfort", label: "Comfort and space on board", pick: "train" },
  { value: "stops", label: "Several Tuscan stops in one day", pick: "tour" },
  { value: "flexibility", label: "Full flexibility on the road", pick: "car" },
];

// Airport and intercity guides retained from the previous version of this tool.
const MORE_ROUTES = [
  { title: "Florence Airport (FLR) → Siena", body: "Take Sitabus Airport shuttle to Florence Villa Costanza, then Autolinee Toscane express bus to Siena. Total ~2h. Cheaper than a taxi/transfer by 60%.", icon: Bus },
  { title: "Pisa Airport (PSA) → Siena", body: "PisaMover to Pisa Centrale, then a regional train to Siena via Empoli (~2h30m). If you have luggage and time is short, book a private transfer.", icon: Train },
  { title: "Rome (FCO) → Tuscany", body: "Leonardo Express to Roma Termini, high-speed train to Florence, then bus to Siena. Around 4h total, but very comfortable.", icon: Train },
  { title: "Between Italian cities", body: "Trenitalia and Italo cover major routes at high speed. Book Frecciarossa/Italo 3–6 weeks ahead for the best fares (up to 60% cheaper).", icon: Train },
  { title: "In Tuscany without a car", body: "Autolinee Toscane buses reach almost every hilltown from Siena or Florence. Slower than a car, but cheaper and stress-free.", icon: Bus },
  { title: "Airports comparison", body: "For Tuscany: Florence FLR is closest, Pisa PSA has more low-cost carriers, Rome FCO is best for international arrivals. Choose by ticket price + total transit time.", icon: Plane },
];

export default function TransportComparator() {
  const [priority, setPriority] = useState("centre");
  const recommendedId = PRIORITIES.find((p) => p.value === priority)?.pick;

  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#A84A2E]">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2C211B] leading-none">Transport Comparator</h2>
          <p className="text-[#657143] mt-1">Florence → Siena: pick what matters most and compare.</p>
        </div>
      </div>

      {/* Priority picker */}
      <div className="rounded-3xl border border-[#F5EDE3] bg-[#FAF7F2] p-6 mb-8">
        <p className="text-sm font-medium text-[#2C211B] mb-3">What matters most for your trip?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={["rounded-2xl border px-4 py-3 text-sm text-left transition-all",
                priority === p.value
                  ? "border-[#C65A3A] bg-white text-[#2C211B] shadow-sm"
                  : "border-[#F5EDE3] bg-white/60 text-[#657143] hover:border-[#C65A3A]/50"].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          const recommended = o.id === recommendedId;
          return (
            <div
              key={o.id}
              className={["rounded-3xl border bg-white p-6 transition-all",
                recommended ? "border-[#C65A3A] shadow-md" : "border-[#F5EDE3] shadow-sm"].join(" ")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#FAF7F2] grid place-items-center text-[#A84A2E]"><Icon className="w-5 h-5" /></div>
                  <h3 className="font-serif text-2xl text-[#2C211B]">{o.name}</h3>
                </div>
                {recommended && (
                  <span className="flex items-center gap-1.5 bg-[#A84A2E] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    <Check className="w-3.5 h-3.5" /> Best match
                  </span>
                )}
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-[#657143] font-medium uppercase tracking-wider text-xs mb-0.5">Typical planning time</dt>
                  <dd className="text-[#2C211B]">{o.time}</dd>
                </div>
                <div>
                  <dt className="text-[#657143] font-medium uppercase tracking-wider text-xs mb-0.5">Arrival in Siena</dt>
                  <dd className="text-[#2C211B]">{o.arrival}</dd>
                </div>
                <div>
                  <dt className="text-[#657143] font-medium uppercase tracking-wider text-xs mb-0.5">Best for</dt>
                  <dd className="text-[#2C211B]">{o.bestFor}</dd>
                </div>
                <div>
                  <dt className="text-[#657143] font-medium uppercase tracking-wider text-xs mb-0.5">Main drawback</dt>
                  <dd className="text-[#2C211B]">{o.drawback}</dd>
                </div>
              </dl>
              {/* The handoff renders only on the card the tool itself just
                  recommended, and only for the two options a live programme
                  can actually book. On any other card it would be an ad. */}
              {recommended && o.id === "tour" && <AffiliateHandoff variant="tour" />}
              {recommended && o.id === "car" && <AffiliateHandoff variant="car" />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-[#FAF7F2] border border-[#F5EDE3] p-5 text-sm text-[#657143] leading-relaxed">
        These are planning ranges, not schedules — regional services, engineering works, strikes, Sundays, holidays,
        traffic and temporary stop changes can alter the trip. Fact-checked {guide.factChecked}; always confirm your
        exact date with the official operator.{" "}
        <Link to="/florence-to-siena-by-train-or-bus" className="text-[#A84A2E] font-medium hover:underline">
          Read the full Florence → Siena guide →
        </Link>
      </div>

      {/* Airport & intercity routes */}
      <h3 className="font-serif text-2xl text-[#2C211B] mt-10 mb-4">More routes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MORE_ROUTES.map((g) => {
          const Icon = g.icon;
          return (
            <div key={g.title} className="rounded-3xl border border-[#F5EDE3] bg-white p-6 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-[#FAF7F2] grid place-items-center text-[#A84A2E] mb-4"><Icon className="w-5 h-5" /></div>
              <h4 className="font-serif text-xl text-[#2C211B]">{g.title}</h4>
              <p className="text-sm text-[#657143] mt-2 leading-relaxed">{g.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
