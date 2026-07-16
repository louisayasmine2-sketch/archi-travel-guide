import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import { ORGANIZATION_JSONLD, SITE_URL } from "@/lib/seo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">
      <SEO
        title="Gli Archi — Siena Travel Guide & Accommodation"
        description="Plan your dream Tuscany trip with our interactive travel tools and book your stay at Affittacamere Gli Archi in Siena, Italy."
        path="/"
        schema={ORGANIZATION_JSONLD}
      />
      {/* Hero Section - sesuai mockup */}
      <div className="relative h-screen flex items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499596396569-bea61a96759c?auto=format&fit=crop&q=80&w=2070')" }}>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-serif mb-6 leading-none">
            Welcome to Gli Archi
          </h1>
          <p className="text-3xl mb-10">Plan Your Dream Tuscany Trip</p>
          
          <Link to="/travel-tools" 
             className="inline-block bg-[#E2725B] hover:bg-[#C15F4A] text-white px-12 py-5 rounded-2xl text-2xl font-medium shadow-lg transition-colors">
            Explore Travel Tools &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Tools Preview */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-serif text-center mb-12">Our Travel Tools</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h3 className="text-xl font-medium mb-2">AI Itinerary Builder</h3>
            <p className="text-gray-600">Create your perfect day-by-day plan</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h3 className="text-xl font-medium mb-2">Budget Planner</h3>
            <p className="text-gray-600">Calculate and save money in Tuscany</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
            <h3 className="text-xl font-medium mb-2">Smart Packing List</h3>
            <p className="text-gray-600">Weather-based checklist</p>
          </div>
        </div>
      </div>

      {/* Booking CTA */}
      <div className="bg-white py-20 text-center">
        <h2 className="text-4xl font-serif mb-6">Ready to Stay at Gli Archi?</h2>
        <a href="https://affittacameregliarchi.com/booking" className="inline-block bg-[#E2725B] hover:bg-[#C15F4A] transition-colors text-white px-12 py-5 rounded-2xl text-2xl font-medium shadow-sm">
          Book Your Room Now &rarr;
        </a>
      </div>
    </div>
  );
}
