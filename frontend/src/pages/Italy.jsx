import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import DestinationCard from "@/components/common/DestinationCard";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import HotelWidget from "@/components/shared/HotelWidget";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { italyRegions } from "@/data/destinations";
import { articlesByRegion, articles } from "@/data/articles";

const HERO = "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=75";

export default function Italy() {
  const italyArticles = articles.filter((a) => ["Italy", "Tuscany", "Siena"].includes(a.region)).slice(0, 6);

  return (
    <div>
      <SEO
        title="Italy Travel Guide — Tuscany, Siena, Florence, Rome, Venice"
        description="A practical Italy travel guide from Archi. Deep editorial coverage of Tuscany and Siena, plus full destination guides for Florence, Rome and Venice."
        path="/italy"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: 'Italy' }])}
      />
      <section className="relative overflow-hidden">
        <img src={HERO} alt="Italy" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/80 via-[hsl(var(--charcoal))]/25 to-transparent" />
        <div className="relative container-editorial pt-14 pb-24 lg:pb-32 text-[hsl(var(--ivory))]">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations", to: "/destinations" }, { label: "Italy" }]} />
          <p className="overline text-[hsl(var(--ivory))]/80 mt-6">Editorial pillar · Italy</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-none tracking-tight max-w-3xl">
            Italy travel guide
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--ivory))]/85">
            The country where we began — because our domain history sits here.
            Deep coverage of Tuscany and Siena, plus starter guides for Florence, Rome and Venice.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <p className="overline">Regions & cities</p>
              <h2 className="font-serif text-4xl mt-3">Where to start in Italy</h2>
              <p className="mt-4 text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Our deepest coverage is Tuscany and Siena. Florence, Rome and Venice have full destination guides with
                overviews, where-to-stay, transport, itinerary ideas and budget breakdowns — expanded seasonally.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {italyRegions.map((r) => (
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
                  <li><Link to="/travel-tools/budget-calculator" className="link-terra font-medium">Trip Budget Calculator →</Link></li>
                  <li><Link to="/travel-tools/best-time-to-visit" className="link-terra font-medium">Best Time to Visit →</Link></li>
                  <li><Link to="/travel-tools/area-finder" className="link-terra font-medium">Best Area to Stay Finder →</Link></li>
                  <li><Link to="/travel-tools/itinerary-generator" className="link-terra font-medium">Itinerary Generator →</Link></li>
                </ul>
              </div>
              <AdPlaceholder variant="sidebar" />
            </aside>
          </div>

          {/* New SEO Hotel Widget Section */}
          <div className="mt-16">
            <HotelWidget 
              destination="Italy"
              subtitle="Looking for the perfect Italian getaway? Discover top-rated boutique hotels, rustic Tuscan villas, and luxury city stays for your next holiday."
              imageUrl="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      <section className="section-y bg-[hsl(var(--ivory-2))]">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">Featured Italy guides</h2>
            <Link to="/blog" className="link-terra text-sm font-medium">All guides →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {italyArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
