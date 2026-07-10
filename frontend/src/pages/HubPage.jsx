import { Link } from "react-router-dom";
import { Mail, MapPin, Compass, Calendar, Home, Star } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { SITE_URL, canonical, websiteSchema } from "@/lib/seo";

const SCHEMA_UPDATED = "2026-07-10";

const HUB_CONTENT = {
  "en-home": {
    title: "Archi Travel Guide · Siena, Italy",
    description: "Practical guides and tips for planning a stay in Siena, Tuscany, and beyond.",
    h1: "Siena-focused travel guide for easy planning",
    intro:
      "You’re now on the English landing for Archi Travel Guide. We keep this site focused on practical planning: where to stay in Siena, what to do, transport options, and budget-ready itineraries.",
    bullets: [
      "Direct booking contact information for fast decisions.",
      "Actionable city and area guides before and during your trip.",
      "Clear affiliate policy and transparent recommendations.",
    ],
    cta: {
      title: "Start with our best pages",
      items: [
        { to: "/siena-travel-guide", label: "Siena travel guide", desc: "Your one-stop Siena planning path." },
        { to: "/where-to-stay-in-siena", label: "Where to stay in Siena", desc: "Area-by-area comparison." },
        { to: "/travel-tips", label: "Travel tips", desc: "Fast, practical traveler checklists." },
      ],
    },
    faqs: [
      { q: "Do you help with real bookings?", a: "We provide clear contacts and practical checks, then direct you to the right booking destination quickly." },
      { q: "Can I use this from mobile?", a: "Yes. All pages are responsive and built for fast browsing on the move." },
      { q: "Are your recommendations updated?", a: "We review practical details regularly and keep updates visible in article dates." },
    ],
    schemaType: "website",
  },
  "it-home": {
    title: "Guida Archi · Siena, Italia",
    description: "Guide pratiche per organizzare il soggiorno a Siena, Toscana e dintorni.",
    h1: "Pianifica Siena, Toscana e dintorni in modo pratico",
    intro:
      "Benvenuto. Manteniamo contenuti pratici su alloggi, itinerari e consigli reali per chi viaggia a Siena e in Toscana, con contenuti aggiornati e contatti chiari.",
    bullets: [
      "Contatti rapidi e pratiche guida locale.",
      "Consigli su trasporti, parcheggio e quartieri.",
      "Guide trasparenti con disclosure affiliata chiara.",
    ],
    cta: {
      title: "Inizia qui",
      items: [
        { to: "/siena-travel-guide", label: "Guida di Siena", desc: "Percorso completo in una pagina." },
        { to: "/where-to-stay-in-siena", label: "Dove stare a Siena", desc: "Confronto aree e accessibilità." },
        { to: "/travel-tips", label: "Travel tips", desc: "Checklist operative da viaggio." },
      ],
    },
    faqs: [
      { q: "Fate prenotazioni dirette?", a: "Forniamo contatti diretti e opzioni pratiche per chiudere velocemente le decisioni di soggiorno." },
      { q: "Posso usare il sito da mobile?", a: "Sì, tutte le pagine sono ottimizzate per uso mobile." },
      { q: "Aggiornate i contenuti?", a: "Sì, i contenuti vengono rivisti regolarmente con date di aggiornamento visibili." },
    ],
    schemaType: "website",
  },
  // TODO: /siena-travel-guide needs owner-authored editorial expansion.
  // Current body text is intentionally temporary and should be replaced with
  // a full in-depth Siena travel article before ranking-focused campaigns.
  "siena-travel-guide": {
    title: "Siena Travel Guide | Where to stay, plan, and enjoy",
    description: "A practical Siena travel guide with accommodation zones, practical itineraries, transport and first-hand planning tips.",
    h1: "Siena travel guide",
    intro: "This hub keeps recommendations focused on what helps: where to stay, what to skip, how to move efficiently, and how to stretch your budget.",
    bullets: [
      "Quick comparison: first-time visitor vs return trip planning.",
      "Area-by-area suggestions for hotels, B&B and family stays.",
      "Actionable route plans from Florence, airports, and Pisa."
    ],
    cta: {
      title: "Popular Siena pages",
      items: [
        { to: "/where-to-stay-in-siena", label: "Where to stay", desc: "Terzo, San Donato, Camollia and value picks." },
        { to: "/siena-itinerary", label: "Siena itinerary", desc: "1-day and 2-day planning templates." },
        { to: "/travel-tips", label: "Travel tips", desc: "Transport, parking, and trip safety checklists." },
      ],
    },
    faqs: [
      { q: "How many days in Siena?", a: "For most travelers 2 nights are enough. First-time visitors may want 3 days." },
      { q: "Best time to visit?", a: "April–June and September–October are often quieter with good weather." },
      { q: "Can families stay in central Siena?", a: "Yes, with early planning for quieter neighborhoods and practical transport links." },
    ],
    schemaType: "article",
  },
  // TODO: /where-to-stay-in-siena needs owner-authored editorial expansion.
  // Current body text is intentionally temporary and should be replaced with
  // a full article with practical booking guidance before ranking-focused campaigns.
  "where-to-stay-in-siena": {
    title: "Where to Stay in Siena",
    description: "Zone-by-zone Siena accommodation advice for couples, families, and budget-focused travelers.",
    h1: "Where to stay in Siena",
    intro: "Choose by mood and mobility, not just price. The best stay is not always the cheapest one.",
    bullets: [
      "Terzo di Città for walkability and local atmosphere.",
      "San Martino for quieter nights with easy access.",
      "Camollia for practical family routines and service proximity.",
    ],
    cta: {
      title: "Start with",
      items: [
        { to: "/siena", label: "Siena overview", desc: "Top attractions and practical context." },
        { to: "/blog/siena-2-day-itinerary", label: "2-day itinerary", desc: "Efficient pace for first-timers." },
        { to: "/contact", label: "Contact for booking", desc: "Send your dates and priorities." },
      ],
    },
    faqs: [
      { q: "What's best for families?", a: "Prioritize quieter terzi near family-friendly food and services, and confirm elevator availability early." },
      { q: "Need a short weekend stay?", a: "Look for places 3–5 blocks outside the main piazza to avoid noise while still being close." },
      { q: "Any safety tips?", a: "Use daytime route scouting and keep booking receipts accessible for transfers and check-in." },
    ],
    schemaType: "article",
  },
  "siena-itinerary": {
    title: "Siena Itinerary Guide",
    description: "Practical Siena itinerary for 1 day, 2 days, and 3 days with pacing and transport notes.",
    h1: "Siena itinerary",
    intro: "No one-size-fits-all plans. We give practical structures you can adapt in under 3 minutes.",
    bullets: [
      "1-day compact route for short trips.",
      "2-day cultural + food-first structure.",
      "3-day expanded plan with countryside add-on.",
    ],
    cta: {
      title: "Build your own",
      items: [
        { to: "/travel-tools/itinerary-generator", label: "Itinerary generator", desc: "Generate a personalized trip flow." },
        { to: "/travel-budget-calculator", label: "Budget calculator", desc: "Tune spending by day and person." },
        { to: "/travel-tools/best-time-to-visit", label: "Best time to visit", desc: "Choose realistic timing for your dates." },
      ],
    },
    faqs: [
      { q: "How to balance art and food?", a: "Block morning museums and afternoon food/walks to avoid burnout." },
      { q: "Where to park?", a: "Reserve for city limits and use peripheral parking when possible." },
      { q: "Best first-day order?", a: "Piazza del Campo, Duomo, then a short walk through nearby lanes." },
    ],
    schemaType: "article",
  },
  "siena-accommodation-guide": {
    title: "Siena Accommodation Guide",
    description: "Clear guide to B&Bs, apartments, and practical stay categories around Siena.",
    h1: "Siena accommodation guide",
    intro: "A practical room-by-room and area-by-area approach for travelers with different budgets.",
    bullets: [
      "What to ask before confirming a booking.",
      "How to compare B&B quality without fake ratings.",
      "Parking and transfer access checkpoints.",
    ],
    cta: {
      title: "Direct actions",
      items: [
        { to: "/where-to-stay-in-siena", label: "See area guide", desc: "Filter by style, walkability, noise, and family needs." },
        { to: "/siena-itinerary", label: "Itinerary", desc: "Pair your accommodation choice with route planning." },
        { to: "/contact", label: "Contact", desc: "Send us your dates and constraints." },
      ],
    },
    faqs: [
      { q: "Which area is quietest?", a: "For first-time travelers, Terzo di Città and nearby quieter blocks usually perform better at night." },
      { q: "Do I need a deposit before checking-in?", a: "Yes, many places ask for a deposit. Confirm policy before booking." },
      { q: "Can you suggest room types?", a: "Couples usually prefer double rooms; families often need flexible bed configurations and transport access." },
    ],
    schemaType: "article",
  },
  "travel-tips": {
    title: "Travel Tips for Siena and Tuscany",
    description: "Compact travel tips: mobility, parking, packing, safety, and money-saving habits for Italy trips.",
    h1: "Travel tips that save time and stress",
    intro: "These are practical, field-tested points we use for each Siena trip and every family calendar booking.",
    bullets: [
      "Plan transfer windows around strike season and weather.",
      "Use one-day city blocks for pacing and meal windows.",
      "Preload maps and offline essentials for old towns with weak signal.",
    ],
    cta: {
      title: "Use planning tools",
      items: [
        { to: "/travel-tools/packing-checklist", label: "Packing checklist", desc: "Create a personalized trip checklist." },
        { to: "/travel-tools/area-finder", label: "Area finder", desc: "Discover better stay neighborhoods." },
        { to: "/travel-tools/transport-guide", label: "Transport guide", desc: "Practical intercity and local mobility tips." },
      ],
    },
    faqs: [
      { q: "What should I carry for old town walking?", a: "Comfortable shoes, refillable water, and a compact map with offline backup." },
      { q: "How to travel cheaply?", a: "Book transport early, stay with flexible check-in plans, and avoid peak-hour transfers." },
      { q: "How to stay safe with kids?", a: "Keep route cards, photo check-ins, and a backup family contact list." },
    ],
    schemaType: "article",
  },
};

function iconFromKey(key) {
  if (key.includes("stay")) return Home;
  if (key.includes("it-home") || key.includes("en-home")) return MapPin;
  if (key.includes("itinerary") || key.includes("travel-tips")) return Calendar;
  if (key.includes("guide")) return Compass;
  if (key.includes("it")) return Mail;
  return Star;
}

export default function HubPage({ pageKey, routePath }) {
  const page = HUB_CONTENT[pageKey] ?? HUB_CONTENT["siena-travel-guide"];
  const Icon = iconFromKey(pageKey);
  const path = routePath ?? `/${pageKey}`;
  const url = canonical(path);
  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: page.h1 },
  ];
  const schema = [
    breadcrumbSchema(breadcrumbs),
    faqSchema(page.faqs),
    ...(page.schemaType === "article"
      ? [
          articleSchema({
            title: page.title,
            description: page.description,
            image: `${SITE_URL}/og-image.jpg`,
            url,
            published: SCHEMA_UPDATED,
            modified: SCHEMA_UPDATED,
            category: "Travel guide",
          }),
        ]
      : []),
    ...(page.schemaType === "website" ? [websiteSchema()] : []),
  ];

  return (
    <div>
      <SEO
        title={page.title}
        description={page.description}
        path={path}
        type={page.schemaType === "article" ? "article" : "website"}
        articleMeta={page.schemaType === "article" ? { published: SCHEMA_UPDATED, modified: SCHEMA_UPDATED, section: "Travel guide", tags: ["Siena", "Tuscany", "Travel planning"] } : undefined}
        schema={schema}
      />

      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={breadcrumbs} />
          <p className="mt-6 inline-flex items-center gap-2 text-sm">
            <Icon className="w-4 h-4 text-[hsl(var(--terracotta))]" />
            <span className="overline">Travel hub</span>
          </p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">{page.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">{page.intro}</p>
          <ul className="mt-6 space-y-2 text-[hsl(var(--charcoal))]">
            {page.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-[hsl(var(--terracotta))]">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <a href="/contact" className="inline-flex mt-8 btn-primary">
            Need direct booking support?
          </a>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <h2 className="font-serif text-3xl md:text-4xl">{page.cta.title}</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {page.cta.items.map((item) => (
              <Link key={item.to} to={item.to} className="card-editorial p-6 block">
                <h3 className="font-serif text-2xl">{item.label}</h3>
                <p className="mt-3 text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed">{item.desc}</p>
                <span className="mt-5 inline-block text-sm text-[hsl(var(--terracotta))] font-medium">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-[hsl(var(--ivory-2))]">
        <div className="container-editorial max-w-3xl">
          <p className="overline">Quick FAQ</p>
          <h2 className="font-serif text-3xl mt-2">Questions travelers ask first</h2>
          <p className="mt-4 text-[hsl(var(--charcoal-soft))]">
            We keep answers short and practical so planning can move forward quickly.
          </p>
          <div className="mt-8">
            {page.faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-[hsl(var(--stone-border))] py-3">
                <summary className="font-semibold cursor-pointer list-none text-lg">{faq.q}</summary>
                <p className="mt-3 text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
