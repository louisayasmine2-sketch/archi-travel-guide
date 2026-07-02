import { Link } from "react-router-dom";
import { Wallet, Sparkles, MapPin, ListChecks, Sun, Bus } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ToolCard from "@/components/common/ToolCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import { travelTools } from "@/data/destinations";

const ICONS = {
  'budget-calculator': Wallet,
  'itinerary-generator': Sparkles,
  'area-finder': MapPin,
  'packing-checklist': ListChecks,
  'best-time-to-visit': Sun,
  'transport-guide': Bus,
};

export default function TravelTools() {
  return (
    <div>
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-16">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Tools" }]} />
          <p className="overline mt-6">Practical planning workbench</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">Travel Tools</h1>
          <p className="mt-5 max-w-2xl text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Six interactive tools we built for our own trips — free, no sign-up, no data harvesting.
            They work for our featured Italy destinations and for the wider world.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelTools.map((t) => (
            <ToolCard key={t.slug} to={`/travel-tools/${t.slug}`} name={t.name} blurb={t.blurb} icon={ICONS[t.slug]} />
          ))}
        </div>
        <div className="container-editorial mt-14">
          <AdPlaceholder />
        </div>
      </section>
    </div>
  );
}
