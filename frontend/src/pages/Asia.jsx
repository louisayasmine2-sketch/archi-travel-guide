import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { asiaCountries } from "@/data/destinations";

const HERO = "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=2000&q=75";

export default function Asia() {
  return (
    <div>
      <SEO
        title="Asia Travel Guide — Editorial roadmap, tools ready today"
        description="Archi's Asia travel guide roadmap. Queued country guides for Indonesia, Thailand, Japan and Singapore. Our travel tools already support Asia presets."
        path="/asia"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: 'Asia' }])}
      />
      <section className="relative overflow-hidden">
        <img src={HERO} alt="Asia" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/80 via-[hsl(var(--charcoal))]/25 to-transparent" />
        <div className="relative container-editorial pt-14 pb-24 lg:pb-32 text-[hsl(var(--ivory))]">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations", to: "/destinations" }, { label: "Asia" }]} />
          <p className="overline text-[hsl(var(--ivory))]/80 mt-6">Continent · queued</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-none tracking-tight max-w-3xl">Asia travel guide</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--ivory))]/85">
            Our third phase. We’d rather publish nothing than publish shallow guides for Bali or Bangkok.
            Below is our plan — the pages come as we can do them justice.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <p className="overline">Coming country pillars</p>
            <h2 className="font-serif text-4xl mt-3">Structure over shortcuts</h2>
            <p className="mt-4 text-[hsl(var(--charcoal-soft))] leading-relaxed">
              Every country below will get proper city coverage, itineraries and area finders — not a
              generic list of “top 10 things.”
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {asiaCountries.map((c) => (
                <div key={c.name} className="card-editorial p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl">{c.name}</h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-[hsl(var(--ivory-2))] text-[hsl(var(--charcoal-soft))]">Queued</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed">{c.blurb}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-8">
              <p className="overline">While you wait</p>
              <h3 className="font-serif text-2xl mt-2">Our global travel tools already work for Asia</h3>
              <p className="mt-3 text-[hsl(var(--charcoal-soft))]">
                The budget calculator, itinerary generator and area finder have Asia presets built in — try them for your next trip.
              </p>
              <Link to="/travel-tools" className="mt-5 inline-block btn-primary">Open travel tools</Link>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-6">
              <p className="overline">Editorial roadmap</p>
              <h3 className="font-serif text-2xl mt-2 leading-tight">Publishing order</h3>
              <ol className="mt-5 space-y-3 text-sm list-decimal list-inside">
                <li>Japan — first-timer routes, quieter secondary cities.</li>
                <li>Indonesia — Bali beyond the crowds, Java, Lombok.</li>
                <li>Thailand — Bangkok base + islands + north.</li>
                <li>Singapore — a proper 3-day stopover guide.</li>
              </ol>
            </div>
            <AdPlaceholder variant="sidebar" />
          </aside>
        </div>
      </section>
    </div>
  );
}
