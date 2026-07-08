import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import DestinationCard from "@/components/common/DestinationCard";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import HotelWidget from "@/components/shared/HotelWidget";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { franceRegions } from "@/data/destinations";
import { articles } from "@/data/articles";

const HERO = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2000&q=75";

export default function France() {
  const franceArticles = articles.filter((a) => ["France", "Paris", "Loire", "Provence"].includes(a.region)).slice(0, 6);

  return (
    <div>
      <SEO
        title="France Travel Guide — Paris, Loire Valley, Provence"
        description="A practical France travel guide from Archi. Deep editorial coverage of Paris and its arrondissements, plus road trip itineraries for the Loire Valley and Provence."
        path="/france"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: 'France' }])}
      />
      <section className="relative overflow-hidden">
        <img src={HERO} alt="France" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/80 via-[hsl(var(--charcoal))]/25 to-transparent" />
        <div className="relative container-editorial pt-14 pb-24 lg:pb-32 text-[hsl(var(--ivory))]">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations", to: "/destinations" }, { label: "France" }]} />
          <p className="overline text-[hsl(var(--ivory))]/80 mt-6">Editorial pillar · France</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-none tracking-tight max-w-3xl">
            France travel guide
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--ivory))]/85">
            Our second editorial pillar. Honest, practical guides to navigating Paris, 
            escaping the crowds in the Louvre, and building realistic itineraries for the regions beyond the capital.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <p className="overline">Regions & cities</p>
              <h2 className="font-serif text-4xl mt-3">Where to start in France</h2>
              <p className="mt-4 text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Everything starts in Paris. Our Paris destination guide covers the best arrondissements for first-timers, 
                how to pace your museum visits, and the classic 3-day route. 
                Guides for the Loire Valley and Provence are currently in development for Q1.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {franceRegions.map((r) => (
                  <div key={r.slug} className="relative">
                    {r.comingSoon ? (
                      <div className="rounded-2xl overflow-hidden border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))]">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-2xl">{r.name}</h3>
                            <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-[hsl(var(--ivory-2))] text-[hsl(var(--charcoal-soft))]">Coming</span>
                          </div>
                          <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-2">{r.blurb}</p>
                        </div>
                      </div>
                    ) : (
                      <DestinationCard to={`/${r.slug}`} name={r.name} blurb={r.blurb} image={r.image} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6">
                <p className="overline">Practical planning</p>
                <h3 className="font-serif text-2xl mt-2 leading-tight">Start with these tools</h3>
                <ul className="mt-5 space-y-3 text-sm">
                   <li><Link to="/travel-budget-calculator" className="link-terra font-medium">Trip Budget Calculator →</Link></li>
                  <li><Link to="/travel-tools/best-time-to-visit" className="link-terra font-medium">Best Time to Visit →</Link></li>
                  <li><Link to="/travel-tools/area-finder" className="link-terra font-medium">Best Area to Stay Finder →</Link></li>
                  <li><Link to="/travel-tools/packing-checklist" className="link-terra font-medium">Packing Checklist →</Link></li>
                </ul>
              </div>
              <AdPlaceholder variant="sidebar" />
            </aside>
          </div>

          {/* New SEO Hotel Widget Section */}
          <div className="mt-16">
            <HotelWidget 
              destination="France"
              subtitle="Looking for the best places to stay? Compare boutique hotels, charming B&Bs, and luxury châteaux across France for your perfect holiday."
              imageUrl="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      <section className="section-y bg-[hsl(var(--ivory-2))]">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">Featured France guides</h2>
            <Link to="/blog" className="link-terra text-sm font-medium">All guides →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {franceArticles.length > 0 ? (
              franceArticles.map((a) => <ArticleCard key={a.slug} article={a} />)
            ) : (
              <p className="text-[hsl(var(--charcoal-soft))] col-span-3 py-12 text-center border border-dashed border-[hsl(var(--stone-border))] rounded-xl">
                Editorial guides for France are being published this week. Check back soon.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
