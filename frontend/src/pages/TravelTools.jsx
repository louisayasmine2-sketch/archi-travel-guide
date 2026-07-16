import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/common/SEO";
import Breadcrumbs from "@/components/common/Breadcrumbs";

import AIItineraryBuilder from "./travel-tools/components/AIItineraryBuilder";
import BudgetPlanner from "./travel-tools/components/BudgetPlanner";
import TransportComparator from "./travel-tools/components/TransportComparator";
import SmartPackingList from "./travel-tools/components/SmartPackingList";
import InteractiveMap from "./travel-tools/components/InteractiveMap";
import CurrencyConverter from "./travel-tools/components/CurrencyConverter";

export default function TravelToolsPage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">
      <SEO
        title="Travel Tools — Plan Your Dream Tuscany Trip"
        description="Free interactive travel planning tools: itinerary builder, budget planner, transport comparator, packing list, map, and currency converter."
        path="/travel-tools"
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools" }]} />
        
        <div className="text-center mb-12 mt-8">
          <h1 className="text-5xl font-serif text-[#2C221F]">Plan Your Dream Tuscany Trip</h1>
          <p className="text-[#5C6B4A] mt-3 text-xl">Free interactive tools • Hyper-local Siena & Tuscany • Direct to Gli Archi</p>
        </div>

        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="flex flex-wrap w-full bg-white shadow-sm rounded-3xl p-1 mb-8">
            <TabsTrigger className="flex-1 rounded-2xl data-[state=active]:bg-[#E2725B] data-[state=active]:text-white" value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger className="flex-1 rounded-2xl data-[state=active]:bg-[#E2725B] data-[state=active]:text-white" value="budget">Budget</TabsTrigger>
            <TabsTrigger className="flex-1 rounded-2xl data-[state=active]:bg-[#E2725B] data-[state=active]:text-white" value="transport">Transport</TabsTrigger>
            <TabsTrigger className="flex-1 rounded-2xl data-[state=active]:bg-[#E2725B] data-[state=active]:text-white" value="packing">Packing</TabsTrigger>
            <TabsTrigger className="flex-1 rounded-2xl data-[state=active]:bg-[#E2725B] data-[state=active]:text-white" value="map">Map</TabsTrigger>
            <TabsTrigger className="flex-1 rounded-2xl data-[state=active]:bg-[#E2725B] data-[state=active]:text-white" value="currency">Currency</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" forceMount className="data-[state=inactive]:hidden"><AIItineraryBuilder /></TabsContent>
          <TabsContent value="budget" forceMount className="data-[state=inactive]:hidden"><BudgetPlanner /></TabsContent>
          <TabsContent value="transport" forceMount className="data-[state=inactive]:hidden"><TransportComparator /></TabsContent>
          <TabsContent value="packing" forceMount className="data-[state=inactive]:hidden"><SmartPackingList /></TabsContent>
          <TabsContent value="map" forceMount className="data-[state=inactive]:hidden"><InteractiveMap /></TabsContent>
          <TabsContent value="currency" forceMount className="data-[state=inactive]:hidden"><CurrencyConverter /></TabsContent>
        </Tabs>

        {/* Affiliate Banner */}
        <div className="mt-16 bg-white rounded-3xl p-8 text-center border border-[#5C6B4A]/10">
          <p className="text-[#5C6B4A] text-lg mb-4">For Affiliates: Embed any tool above and earn 15-25% commission per booking</p>
          <button className="px-8 py-3 bg-[#E2725B] text-white font-medium rounded-2xl hover:bg-[#C15F4A] transition-colors">
            Join Affiliate Program → Get Embed Code
          </button>
        </div>
      </div>
    </div>
  );
}
