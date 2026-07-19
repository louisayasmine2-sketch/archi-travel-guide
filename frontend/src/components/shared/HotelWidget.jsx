import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Search, ArrowRight, Star, Coffee } from "lucide-react";

export default function HotelWidget({ 
  destination = "Siena", 
  subtitle = "Find the best boutique hotels, B&Bs, and vacation rentals.",
  imageUrl = "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=80",
  affiliateLink = "/go/booking-search?ss="
}) {
  const handleSearch = (e) => {
    e.preventDefault();
    window.open(`${affiliateLink}${encodeURIComponent(destination)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="my-10 bg-[hsl(var(--ivory))] border border-[hsl(var(--stone-border))] rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
      {/* Left side: Image & Value Prop */}
      <div className="relative md:w-2/5 h-48 md:h-auto shrink-0">
        <div className="absolute inset-0 bg-[hsl(var(--charcoal))]/20 z-10" />
        <img 
          src={imageUrl} 
          alt={`Where to stay in ${destination}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-[hsl(var(--ivory))] bg-gradient-to-t from-[hsl(var(--charcoal))]/80 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-[hsl(var(--terracotta))] text-[hsl(var(--terracotta))]" />
            <span className="text-xs font-bold tracking-wider uppercase">Editor's Pick</span>
          </div>
          <h3 className="font-serif text-2xl font-medium leading-tight text-[hsl(var(--ivory))]">
            Where to stay in {destination}
          </h3>
        </div>
      </div>

      {/* Right side: Search Widget */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
        <p className="text-[hsl(var(--charcoal-soft))] mb-6 leading-relaxed">
          {subtitle} We recommend booking at least 3-4 months in advance for the best rates during high season.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-[hsl(var(--charcoal-muted))]" />
              </div>
              <input
                type="text"
                readOnly
                value={destination}
                className="block w-full pl-10 pr-3 py-3 border border-[hsl(var(--stone-border))] rounded-xl bg-[hsl(var(--ivory-2))] text-[hsl(var(--charcoal))] cursor-default focus:outline-none"
              />
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-[hsl(var(--charcoal-muted))]" />
              </div>
              <input
                type="text"
                placeholder="Check-in — Check-out"
                className="block w-full pl-10 pr-3 py-3 border border-[hsl(var(--stone-border))] rounded-xl bg-[hsl(var(--ivory))] text-[hsl(var(--charcoal))] focus:border-[hsl(var(--terracotta))] focus:ring-1 focus:ring-[hsl(var(--terracotta))] outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--terracotta))] text-[hsl(var(--ivory))] font-medium py-3.5 px-6 rounded-xl hover:bg-[hsl(var(--rust))] transition-colors shadow-sm"
          >
            <Search className="w-5 h-5" />
            Check Availability
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[hsl(var(--charcoal-muted))]">
          <div className="flex items-center gap-1.5">
            <Coffee className="w-4 h-4" />
            <span>Breakfast included</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Central locations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
