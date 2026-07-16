import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Suspense, lazy } from "react";
import SEO from "@/components/common/SEO";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Map, MapPin, Calculator, Calendar, Compass, Backpack } from "lucide-react";
import { AffiliateWidgetSmall, AffiliateWidgetMedium, AffiliateWidgetLarge } from "./travel-tools/components/AffiliateWidgets";

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

const TOOLS = [
  {
    id: "itinerary",
    name: "AI Itinerary Builder",
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
    id: "currency",
    name: "Live Currency Converter",
    description: "Instantly check the latest exchange rates for USD, GBP, and more to EUR.",
    icon: Map,
    component: CurrencyConverter
  }
];

export default function TravelToolsPage() {
  return (
    <div className="min-h-screen bg-[#F5EDE3] font-sans pb-24">
      <SEO
        title="Travel Tools — Plan Your Dream Tuscany Trip"
        description="Free interactive travel planning tools: itinerary builder, budget planner, transport comparator, packing list, map, and currency converter."
        path="/travel-tools"
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools" }]} />
        
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-6xl font-serif text-[#2C211B] tracking-tight">Plan Your Dream Tuscany Trip</h1>
          <p className="text-[#8A9A5B] mt-4 text-xl">Free interactive tools • Hyper-local Siena & Tuscany • Direct to Gli Archi</p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool) => (
            <Dialog key={tool.id}>
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md border border-[#C65A3A]/20 transition-all duration-300 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
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
              </div>

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

        {/* Affiliate Widgets Section */}
        <div className="mt-24 space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#2C211B]">Partner with Us</h2>
            <p className="text-[#8A9A5B] mt-4 text-lg max-w-2xl mx-auto">Embed these tools on your own travel blog or website. We provide customizable widgets to help your readers plan their trips while you earn commissions.</p>
          </div>
          
          <AffiliateWidgetLarge />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
             <AffiliateWidgetMedium />
             <AffiliateWidgetSmall />
          </div>
        </div>

      </div>
    </div>
  );
}
