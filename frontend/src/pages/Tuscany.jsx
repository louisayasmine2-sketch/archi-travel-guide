import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import LazyImage from "@/components/common/LazyImage";
import { articlesByRegion, articles } from "@/data/articles";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";

const HERO = "https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=2000&q=75";

const sections = [
  { title: "Itineraries", to: "/blog?region=Tuscany&cat=itineraries", body: "Two- and three-day plans for Siena, plus longer routes through Val d’Orcia and Chianti." },
  { title: "Where to stay", to: "/travel-tools/area-finder", body: "Countryside agriturismos, hilltown boutique hotels, or a base in Florence — which one fits your trip." },
  { title: "Food guide", to: "/blog/tuscany-food-guide", body: "The dishes and wines worth ordering, and the menu vocabulary that opens up family-run trattorias." },
  { title: "Transport", to: "/blog/florence-to-siena-transport", body: "Bus, train or rental car — how to move between Florence, Siena and the countryside." },
  { title: "Best season", to: "/blog/best-time-to-visit-tuscany", body: "Month-by-month realities of Tuscany, with an honest take on August heat and the Palio." },
];

export default function Tuscany() {
  const tuscanyArticles = articlesByRegion("Tuscany").concat(articlesByRegion("Siena")).slice(0, 6);
  return (
    <div>
      <SEO
        title="Tuscany Travel Guide — Itineraries, food, transport, best time to visit"
        description="Practical Tuscany travel guide from Archi: hilltowns, vineyards, itineraries, food, transport and the best time to visit. Deep coverage starts with Siena."
        path="/tuscany"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Italy', to: '/italy' }, { label: 'Tuscany' }])}
      />
      <section className="relative overflow-hidden">
        <img src={HERO} alt="Tuscany cypress road" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/80 via-[hsl(var(--charcoal))]/25 to-transparent" />
        <div className="relative container-editorial pt-14 pb-24 lg:pb-32 text-[hsl(var(--ivory))]">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Italy", to: "/italy" }, { label: "Tuscany" }]} />
          <p className="overline text-[hsl(var(--ivory))]/80 mt-6">Region · Italy</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-none tracking-tight max-w-3xl">Tuscany travel guide</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--ivory))]/85">
            Hilltowns, vineyards, slow food and long shadows. This is where Archi Travel Guide begins — with the region we know most intimately.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-8">
            <p className="overline">Overview</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mt-3">Slow region, careful planning</h2>
            <p className="mt-5 text-[hsl(var(--charcoal))]/85 leading-relaxed text-lg">
              Tuscany rewards a slow itinerary. Two hilltowns per day is plenty. Distances look short on a map,
              but the roads curve, the light is worth stopping for, and lunch takes as long as it needs to.
            </p>
            <p className="mt-4 text-[hsl(var(--charcoal))]/85 leading-relaxed text-lg">
              Our region coverage starts with Siena and expands out to the Val d’Orcia, Chianti,
              San Gimignano, Monteriggioni and the Etruscan coast.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((s) => (
                <Link key={s.title} to={s.to} className="card-editorial p-6 block">
                  <p className="overline">Section</p>
                  <h3 className="font-serif text-2xl mt-2">{s.title}</h3>
                  <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed">{s.body}</p>
                  <span className="mt-4 inline-block text-sm text-[hsl(var(--terracotta))] font-medium">Open →</span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-[hsl(var(--stone-border))]">
              <LazyImage src="https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=1200&q=75" alt="Val d'Orcia" ratio="4/3" />
              <div className="p-5">
                <p className="overline">Editor’s pick</p>
                <h4 className="font-serif text-xl mt-2 leading-snug">A slow half-day in Val d’Orcia</h4>
                <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-2">Pienza for cheese, Montalcino for Brunello, and a long lunch in between.</p>
              </div>
            </div>
            <AdPlaceholder variant="sidebar" />
          </aside>
        </div>
      </section>

      <section className="section-y bg-[hsl(var(--ivory-2))]">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">Tuscany guides</h2>
            <Link to="/siena" className="link-terra text-sm font-medium">Jump to Siena →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuscanyArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
