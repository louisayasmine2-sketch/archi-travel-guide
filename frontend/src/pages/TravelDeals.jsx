import Breadcrumbs from "@/components/common/Breadcrumbs";
import AffiliateCard from "@/components/common/AffiliateCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";

const RESOURCES = [
  { title: "Compare hotels across major booking sites", provider: "Hotels", tag: "Search", description: "Meta-search platforms let you compare prices from booking sites in one place — better than pledging loyalty to one." },
  { title: "Small-group tours and skip-the-line experiences", provider: "Tours", tag: "Experiences", description: "Curated guided experiences for cities where a good guide changes the trip — museums, food walks, cooking classes." },
  { title: "Global eSIM data plans", provider: "Connectivity", tag: "eSIM", description: "Set up mobile data before you land. Better rates than roaming, and no waiting at the airport SIM kiosk." },
  { title: "Travel insurance for medical + trip cancellation", provider: "Insurance", tag: "Coverage", description: "The one thing we never skip. Even a short delay can cost more than a full policy." },
  { title: "Rail passes and long-distance train tickets", provider: "Transport", tag: "Rail", description: "For Europe especially, booking well in advance often saves 40–60% on high-speed routes." },
  { title: "Compact travel gear and packing accessories", provider: "Gear", tag: "Accessories", description: "Packing cubes, folding daypacks, universal adapters — the small items that make trips less friction-heavy." },
];

export default function TravelDeals() {
  return (
    <div>
      <SEO
        title="Travel Deals & Resources — Curated tools for hotels, tours, eSIM, insurance"
        description="A small, carefully-chosen shortlist of travel platforms Archi recommends for hotels, tours, eSIM, insurance, transport and gear. Clear affiliate disclosure."
        path="/travel-deals"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Deals & Resources' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Deals & Resources" }]} />
          <p className="overline mt-6">Curated travel resources</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">Travel Deals & Resources</h1>
          <p className="mt-5 max-w-3xl text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">
            A small, carefully-chosen shortlist of platforms we recommend for hotels, tours, connectivity, insurance,
            transport and gear. Every card is clearly marked. We may earn a commission at no extra cost to you —
            editorial choices remain independent.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 mb-10">
            <p className="text-sm leading-relaxed">
              <strong className="font-semibold">Affiliate disclosure:</strong> The cards below contain affiliate links.
              If you buy through them, we may earn a small commission — the price you pay does not change. We only list
              tools we would recommend anyway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((r) => (
              <AffiliateCard key={r.title} {...r} />
            ))}
          </div>

          <div className="mt-14">
            <AdPlaceholder />
          </div>
        </div>
      </section>
    </div>
  );
}
