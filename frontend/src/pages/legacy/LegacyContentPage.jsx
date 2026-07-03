import { Link } from "react-router-dom";
import { AlertTriangle, BedDouble, Calendar, Mail, PhoneCall } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";

const ROOM_TEMPLATES = {
  "rooms-bed-and-breakfast-in-siena": {
    title: "Rooms · Bed and Breakfast in Siena",
    description: "Practical room guide for stays in Siena, with practical options and direct booking contact.",
    h1: "Rooms at Gli Archi Bed & Breakfast",
    intro:
      "Use this page as a practical starting point to compare room types, amenities, and family-fit options in Siena.",
    rooms: [
      "Family B&B room layout",
      "Quiet morning-focused check-in windows",
      "Breakfast, Wi-Fi, and city access details",
    ],
    links: [
      { to: "/siena-accommodation-guide", label: "View accommodation guide", desc: "Compare more options by area." },
      { to: "/siena-itinerary", label: "Build your Siena itinerary", desc: "Plan trip pacing around your room choices." },
      { to: "/contact", label: "Send dates and request options", desc: "Direct contact for specific booking questions." },
    ],
  },
  "standard-double-room": {
    title: "Standard Double Room in Siena",
    description: "A practical overview of the standard double room option in Siena, including usage context and booking guidance.",
    h1: "Standard Double Room in Siena",
    intro:
      "Designed for couples or solo travel with an extra bag, this option focuses on practical comfort and simple routines.",
    rooms: [
      "Comfort-first room layout",
      "Quiet nights with practical circulation",
      "Direct help for early check-in questions",
    ],
    links: [
      { to: "/contact", label: "Ask about availability", desc: "Send dates, city-center preference, and parking needs." },
      { to: "/where-to-stay-in-siena", label: "Where should I stay?", desc: "Compare areas by comfort and access." },
      { to: "/siena-accommodation-guide", label: "View accommodation guide", desc: "Get a complete room and location framework." },
    ],
  },
  "superior-double-room": {
    title: "Superior Double Room in Siena",
    description: "Information about the superior double room option with practical highlights and planning tips.",
    h1: "Superior Double Room in Siena",
    intro:
      "If you are planning a longer stay, this option can help with comfort-first stays in or near central Siena.",
    rooms: [
      "Upgraded comfort and in-room essentials",
      "Flexible add-ons for longer visits",
      "Simple check-in and contact path",
    ],
    links: [
      { to: "/contact", label: "Contact for dates", desc: "Share arrival and departure details for availability check." },
      { to: "/travel-tips", label: "Travel tips", desc: "Plan transport and parking in advance." },
      { to: "/siena-itinerary", label: "Siena itinerary", desc: "Match room comfort with your trip rhythm." },
    ],
  },
  "family-accommodation": {
    title: "Family Accommodation in Siena",
    description: "Family focused room guidance in Siena, from room space and amenities to practical mobility needs.",
    h1: "Family accommodation in Siena",
    intro:
      "Family stays usually work best when you pick by route simplicity, not just by room size.",
    rooms: [
      "Family room suitability and bed configuration",
      "Quiet blocks, daytime routing, kid-friendly routines",
      "Family transport and check-in clarity",
    ],
    links: [
      { to: "/where-to-stay-in-siena", label: "Family stay areas", desc: "Compare neighborhoods by logistics." },
      { to: "/travel-tools/area-finder", label: "Area finder", desc: "Pick zones using your travel constraints." },
      { to: "/contact", label: "Contact the team", desc: "Ask for family-friendly options and advice." },
    ],
  },
  "bed-and-breakfast-home": {
    title: "Gli Archi Bed and Breakfast Siena",
    description: "Homepage-style overview of Gli Archi B&B Siena with practical booking and planning points.",
    h1: "Gli Archi Bed and Breakfast in Siena",
    intro:
      "A practical Siena B&B overview focused on local access, practical room types, and transparent contact options.",
    rooms: [
      "Local area context for central city stays",
      "Simple amenities and practical service expectations",
      "Clear pathways for booking discussions",
    ],
    links: [
      { to: "/siena", label: "Siena guide", desc: "Explore what to do around central districts." },
      { to: "/about", label: "About Archi", desc: "Understand editorial process and intent." },
      { to: "/contact", label: "Direct contact", desc: "Start with dates and room requirements." },
    ],
  },
  "services-and-conditions": {
    title: "Services and Conditions",
    description: "Clear service and condition overview for stay inquiries and practical booking expectations.",
    h1: "Services and Conditions",
    intro:
      "This page keeps booking conditions and practical service options clear before finalizing your stay.",
    rooms: [
      "Clear communication before reservation",
      "Transparent expectations on timing and access",
      "Flexible follow-up for changes and questions",
    ],
    links: [
      { to: "/contact", label: "Request confirmation details", desc: "Send your travel dates and plan." },
      { to: "/terms-of-service", label: "Terms of service", desc: "Read the general service terms." },
      { to: "/privacy-policy", label: "Privacy policy", desc: "How we handle your request data." },
    ],
  },
  "holidays-in-siena": {
    title: "Holidays in Siena",
    description: "A practical holidays in Siena guide with timing options and planning recommendations for smooth visits.",
    h1: "Holidays in Siena",
    intro:
      "Holiday planning is easier when you separate sightseeing windows from logistics windows.",
    rooms: [
      "Family-friendly holiday blocks",
      "Seasonal crowd patterns and timing",
      "Transport and parking strategy",
    ],
    links: [
      { to: "/siena-itinerary", label: "Build holiday itinerary", desc: "Create a rhythm that matches your group." },
      { to: "/travel-tips", label: "Holiday checklist", desc: "Practical holiday planning checklist." },
      { to: "/where-to-stay-in-siena", label: "Accommodation by neighborhood", desc: "Pick the right stay for your timing." },
    ],
  },
  contacts: {
    title: "Contact Gli Archi Bed and Breakfast Siena",
    description: "Primary contact page for room availability and stay-related questions in Siena.",
    h1: "Contact Gli Archi Bed and Breakfast Siena",
    intro:
      "Use this route for direct contact needs. If you need fast replies, include date window, room type, and number of guests.",
    rooms: [
      "Fast inquiry routing",
      "Clear room preference capture",
      "Response support within business hours",
    ],
    links: [
      { to: "/contact", label: "Write us directly", desc: "Use the main contact form." },
      { to: "/where-to-stay-in-siena", label: "Room comparison", desc: "Review options before confirming details." },
      { to: "/siena-accommodation-guide", label: "Accommodation guide", desc: "Understand best-fit options." },
    ],
  },
};

export default function LegacyContentPage({ pageKey, routePath }) {
  const page = ROOM_TEMPLATES[pageKey];
  if (!page) {
    return (
      <div className="container-editorial section-y">
        <h1 className="font-serif text-4xl">Page not available</h1>
        <p className="mt-4 text-[hsl(var(--charcoal-soft))]">The requested legacy page is not yet mapped.</p>
        <Link to="/" className="inline-block mt-6 btn-primary">Back to home</Link>
      </div>
    );
  }

  const crumb = [{ label: "Home", to: "/" }, { label: page.title }];

  return (
    <div>
      <SEO
        title={page.title}
        description={page.description}
        path={routePath || `/${pageKey}`}
        schema={breadcrumbSchema(crumb)}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={crumb} />
          <p className="overline mt-6">Legacy route · archived migration</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">{page.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">{page.intro}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {page.rooms.map((item) => (
              <article key={item} className="card-editorial p-5 flex gap-4">
                <BedDouble className="w-5 h-5 text-[hsl(var(--terracotta))] shrink-0 mt-1" />
                <p>{item}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-3xl border border-[hsl(var(--stone-border))] p-6 bg-[hsl(var(--ivory-2))]">
            <p className="overline">Need booking support?</p>
            <h2 className="font-serif text-3xl mt-2">Fast contact options</h2>
            <div className="mt-5 space-y-3">
              <a href="mailto:contact@affittacameregliarchi.com" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[hsl(var(--terracotta))]" />
                contact@affittacameregliarchi.com
              </a>
              <p className="flex items-center gap-2 text-sm text-[hsl(var(--charcoal-soft))]">
                <PhoneCall className="w-4 h-4" />
                Add destination, dates, and room preference to get a useful reply.
              </p>
              <p className="flex items-center gap-2 text-sm text-[hsl(var(--charcoal-soft))]">
                <Calendar className="w-4 h-4" />
                We confirm requests and send updates by email.
              </p>
              <p className="flex items-center gap-2 text-sm text-[hsl(var(--charcoal-soft))]">
                <AlertTriangle className="w-4 h-4" />
                This page is migrated from legacy paths and kept for compatibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {page.links.map((link) => (
              <Link key={link.to} to={link.to} className="card-editorial p-6 block">
                <h3 className="font-serif text-xl">{link.label}</h3>
                <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-2 leading-relaxed">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
