import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Suspense, lazy, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "@/components/common/SEO";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import {
  loadTripPlan, saveTripPlan, TRIP_DESTINATIONS, TRIP_SEASONS,
  daysUntilTrip, tripOverlapsPalio, PALIO_NOTE, loadTripProgress, TRIP_CHANGE_EVENT,
} from "@/lib/tripPlan";
import { Map, MapPin, Calculator, Calendar, Compass, Backpack, Sun, Luggage, FileText } from "lucide-react";
import TiltCard from "@/components/common/TiltCard";
import Reveal from "@/components/common/Reveal";

// Skeleton loader to reduce CLS and provide immediate feedback for LCP inside Modal
function ToolSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-2xl border border-[#F5EDE3] bg-white p-8 space-y-6">
      <div className="h-10 w-1/3 bg-gray-200 rounded-md"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="h-12 w-48 bg-gray-300 rounded-xl mt-6"></div>
    </div>
  );
}

// Lazy load semua tool
const AIItineraryBuilder = lazy(() => import("./travel-tools/components/AIItineraryBuilder"));
const BudgetPlanner = lazy(() => import("./travel-tools/components/BudgetPlanner"));
const TransportComparator = lazy(() => import("./travel-tools/components/TransportComparator"));
const SmartPackingList = lazy(() => import("./travel-tools/components/SmartPackingList"));
const InteractiveMap = lazy(() => import("./travel-tools/components/InteractiveMap"));
const CurrencyConverter = lazy(() => import("./travel-tools/components/CurrencyConverter"));
const BestTimeFinder = lazy(() => import("./travel-tools/components/BestTimeFinder"));
const TripSheet = lazy(() => import("./travel-tools/components/TripSheet"));

const TOOLS = [
  {
    id: "trip-sheet",
    name: "My Trip Sheet",
    description: "Turn your My Trip plan into one printable page: day-by-day itinerary, budget estimate, best months and packing list.",
    icon: FileText,
    component: TripSheet
  },
  {
    id: "itinerary",
    name: "Itinerary Generator",
    description: "Generate a personalized day-by-day plan for Tuscany tailored to your pace and interests.",
    icon: Calendar,
    component: AIItineraryBuilder
  },
  {
    id: "budget",
    name: "Tuscany Budget Planner",
    description: "Estimate your daily costs and find areas to save money on your Italian vacation.",
    icon: Calculator,
    component: BudgetPlanner
  },
  {
    id: "transport",
    name: "Transport Comparator",
    description: "Compare train vs bus options from Florence to Siena based on time, price, and convenience.",
    icon: Compass,
    component: TransportComparator
  },
  {
    id: "packing",
    name: "Smart Packing List",
    description: "Create a season-appropriate packing checklist for your Tuscany trip based on local weather.",
    icon: Backpack,
    component: SmartPackingList
  },
  {
    id: "map",
    name: "Best Area to Stay Finder",
    description: "Explore Siena's historic neighborhoods and find the perfect home base for your trip.",
    icon: MapPin,
    component: InteractiveMap
  },
  {
    id: "best-time",
    name: "Best Time to Visit",
    description: "Find the right months for your trip — optimised for weather, crowds, prices, or festivals.",
    icon: Sun,
    component: BestTimeFinder
  },
  {
    id: "currency",
    name: "Live Currency Converter",
    description: "Instantly check the latest exchange rates for USD, GBP, and more to EUR.",
    icon: Map,
    component: CurrencyConverter
  }
];

const TRIP_SEL = "rounded-xl border border-[#F5EDE3] bg-white px-3 py-2.5 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors";

// "My Trip" bar: describe the trip once and every tool below opens
// pre-filled from it. Saved to localStorage on every change.
function TripBar() {
  const [plan, setPlan] = useState(loadTripPlan);
  const [progress, setProgress] = useState(loadTripProgress);
  const upd = (k, v) => {
    const next = { ...plan, [k]: v };
    setPlan(next);
    saveTripPlan(next);
  };

  // Tools write their own progress marks — refresh the badges when they do.
  useEffect(() => {
    const refresh = () => setProgress(loadTripProgress());
    window.addEventListener(TRIP_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(TRIP_CHANGE_EVENT, refresh);
  }, []);

  const days = daysUntilTrip(plan);

  return (
    <div className="mb-12 rounded-3xl border border-[#C65A3A]/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-3 lg:w-64 shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#FAF7F2] grid place-items-center text-[#C65A3A]">
            <Luggage className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif text-xl text-[#2C211B] leading-tight">My Trip</p>
            <p className="text-xs text-[#8A9A5B]">Set once — every tool starts from this.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1">
          <label className="block">
            <span className="block text-xs font-medium text-[#8A9A5B] mb-1">Destination</span>
            <select className={TRIP_SEL + " w-full"} value={plan.destination} onChange={(e) => upd("destination", e.target.value)}>
              {TRIP_DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-[#8A9A5B] mb-1">Nights</span>
            <input type="number" min="1" max="60" className={TRIP_SEL + " w-full"} value={plan.trip_length}
              onChange={(e) => upd("trip_length", Math.min(Math.max(Number(e.target.value) || 1, 1), 60))} />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-[#8A9A5B] mb-1">Travellers</span>
            <input type="number" min="1" max="20" className={TRIP_SEL + " w-full"} value={plan.travelers}
              onChange={(e) => upd("travelers", Math.min(Math.max(Number(e.target.value) || 1, 1), 20))} />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-[#8A9A5B] mb-1">Season</span>
            <select className={TRIP_SEL + " w-full"} value={plan.season} onChange={(e) => upd("season", e.target.value)}>
              {TRIP_SEASONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </label>
          <label className="block col-span-2 sm:col-span-1">
            <span className="block text-xs font-medium text-[#8A9A5B] mb-1">Start date (optional)</span>
            <input type="date" className={TRIP_SEL + " w-full"} value={plan.start_date}
              onChange={(e) => upd("start_date", e.target.value)} />
          </label>
        </div>
      </div>

      {/* Countdown + verified Palio warning */}
      {days !== null && days >= 0 && (
        <p className="mt-4 text-sm font-medium text-[#C65A3A]">
          {days === 0 ? `Departure day — enjoy ${plan.destination}!` : `${days} ${days === 1 ? "day" : "days"} until your ${plan.destination} trip.`}
        </p>
      )}
      {tripOverlapsPalio(plan) && (
        <p className="mt-3 text-xs leading-relaxed text-[#8A9A5B] bg-[#FAF7F2] rounded-2xl px-4 py-3">
          <span className="font-semibold text-[#2C211B]">Your dates overlap the Palio: </span>
          {PALIO_NOTE.text} <span className="opacity-70">(Checked {PALIO_NOTE.checked})</span>
        </p>
      )}

      {/* Planning progress */}
      <div className="mt-4 pt-4 border-t border-[#F5EDE3] flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#8A9A5B] font-medium uppercase tracking-wider mr-1">Planning progress</span>
        <ProgressBadge done={progress.planSet} label="Trip set" />
        <ProgressBadge done={progress.itineraryDone} label="Itinerary" />
        <ProgressBadge done={progress.budgetDone} label="Budget" />
        <ProgressBadge
          done={progress.packing ? progress.packing.done === progress.packing.total : false}
          label={progress.packing ? `Packing ${progress.packing.done}/${progress.packing.total}` : "Packing"}
        />
      </div>
    </div>
  );
}

function ProgressBadge({ done, label }) {
  return (
    <span className={["px-3 py-1.5 rounded-full border font-medium",
      done ? "border-[#8A9A5B] bg-[#8A9A5B]/10 text-[#8A9A5B]" : "border-[#F5EDE3] text-[#8A9A5B]/60"].join(" ")}>
      {done ? "✓ " : ""}{label}
    </span>
  );
}

export default function TravelToolsPage() {
  // ?tool={id} deep-links straight into a tool's modal (used by share links).
  const [searchParams] = useSearchParams();
  const openToolId = searchParams.get("tool");

  return (
    <div className="min-h-screen bg-[#F5EDE3] font-sans pb-24">
      <SEO
        title="Travel Tools — Plan Your Dream Tuscany Trip"
        description="Free Tuscany planning tools: printable trip sheet, itinerary generator, budget planner, best-time finder, transport comparator, packing list and more."
        path="/travel-tools/"
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools" }]} />
        
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-6xl font-serif text-[#2C211B] tracking-tight">Plan Your Dream Tuscany Trip</h1>
          <p className="text-[#8A9A5B] mt-4 text-xl">Free interactive tools • Hyper-local Siena & Tuscany</p>
        </div>

        <TripBar />

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool, i) => (
            <Dialog key={tool.id} defaultOpen={tool.id === openToolId}>
              <Reveal delay={(i % 3) * 60} className="h-full">
              <TiltCard className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md border border-[#C65A3A]/20 transition-all duration-300 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C65A3A] mb-6">
                  <tool.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif text-[#2C211B] mb-3">{tool.name}</h3>
                <p className="text-[#8A9A5B] mb-8 flex-grow">{tool.description}</p>
                <DialogTrigger asChild>
                  <button className="w-full py-4 rounded-2xl bg-[#C65A3A] hover:bg-[#A84A2E] text-white font-medium transition-colors">
                    Try Now
                  </button>
                </DialogTrigger>
              </TiltCard>
              </Reveal>

              {/* Modal Content */}
              <DialogContent className="max-w-[95vw] md:max-w-[60vw] max-h-[90vh] overflow-y-auto bg-[#F5EDE3] p-0 border-none rounded-3xl">
                <DialogTitle className="sr-only">{tool.name}</DialogTitle>
                <div className="p-4 md:p-8">
                  <Suspense fallback={<ToolSkeleton />}>
                    <tool.component />
                  </Suspense>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

      </div>
    </div>
  );
}
