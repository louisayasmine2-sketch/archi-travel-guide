import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { Bus, Plane, Train } from "lucide-react";

const guides = [
  { title: "Florence Airport (FLR) → Siena", body: "Take Sitabus Airport shuttle to Florence Villa Costanza, then Autolinee Toscane express bus to Siena. Total ~2h. Cheaper than a taxi/transfer by 60%.", icon: Bus, to: "/florence-to-siena-by-train-or-bus" },
  { title: "Pisa Airport (PSA) → Siena", body: "PisaMover to Pisa Centrale, then a regional train to Siena via Empoli (~2h30m). If you have luggage and time is short, book a private transfer.", icon: Train },
  { title: "Rome (FCO) → Tuscany", body: "Leonardo Express to Roma Termini, high-speed train to Florence, then bus to Siena. Around 4h total, but very comfortable.", icon: Train },
  { title: "Between Italian cities", body: "Trenitalia and Italo cover major routes at high speed. Book Frecciarossa/Italo 3–6 weeks ahead for the best fares (up to 60% cheaper).", icon: Train },
  { title: "In Tuscany without a car", body: "Autolinee Toscane buses reach almost every hilltown from Siena or Florence. Slower than a car, but cheaper and stress-free.", icon: Bus },
  { title: "Airports comparison", body: "For Tuscany: Florence FLR is closest, Pisa PSA has more low-cost carriers, Rome FCO is best for international arrivals. Choose by ticket price + total transit time.", icon: Plane },
];

export default function TransportComparator() {
  return (
    <div>
      
      <section className="">
        <div className="container-editorial pt-4 pb-8">
          
          <p className="overline mt-6">Airport & Transport Guide</p>
          <h2 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">Getting there, calmly.</h2>
          <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Airport transfers, intercity trains and hilltown buses — with our honest take on when each is worth it.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((g) => {
            const Icon = g.icon;
            const Wrapper = g.to ? Link : "div";
            return (
              <Wrapper key={g.title} to={g.to} className={"card-editorial p-7 " + (g.to ? "block" : "")}>
                <div className="w-11 h-11 rounded-full bg-[hsl(var(--ivory-2))] grid place-items-center text-[hsl(var(--terracotta))] mb-4"><Icon className="w-5 h-5" /></div>
                <h3 className="font-serif text-2xl">{g.title}</h3>
                <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed">{g.body}</p>
                {g.to && <span className="mt-4 inline-block text-sm text-[hsl(var(--terracotta))] font-medium">Read more →</span>}
              </Wrapper>
            );
          })}
        </div>
        <div className="container-editorial mt-14"><AdPlaceholder /></div>
      </section>
    </div>
  );
}
