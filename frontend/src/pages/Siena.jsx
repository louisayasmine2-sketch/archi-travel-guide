import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import VideoThumb from "@/components/common/VideoThumb";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { articlesByRegion } from "@/data/articles";

const HERO = "https://images.unsplash.com/photo-1646319514161-8fba0ebc3275?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxzaWVuYSUyMGl0YWx5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4MzAwNDQ4Nnww&ixlib=rb-4.1.0&q=85";

const chapters = [
  { title: "Things to do", to: "/blog/best-things-to-do-in-siena", blurb: "Piazza del Campo, Duomo, Torre del Mangia — and what to skip on a short trip." },
  { title: "Where to stay",  to: "/blog/where-to-stay-in-siena", blurb: "Terzo di Città, San Martino or Camollia? Compared honestly." },
  { title: "2-day itinerary", to: "/blog/siena-2-day-itinerary", blurb: "A well-paced two-day plan that leaves room to breathe." },
  { title: "3-day itinerary", to: "/blog/siena-3-day-itinerary", blurb: "Add a proper half-day trip to Val d’Orcia or San Gimignano." },
  { title: "Family travel",   to: "/blog/siena-with-kids", blurb: "Kid-paced days, contrada scavenger hunts, and family-friendly trattorias." },
  { title: "Budget travel",   to: "/blog/how-much-siena-trip-costs", blurb: "Three tiers of cost, from guesthouse to design hotel." },
  { title: "Transport",       to: "/blog/florence-to-siena-transport", blurb: "How to arrive from Florence, and when a rental car makes sense." },
];

export default function Siena() {
  const list = articlesByRegion("Siena").concat(articlesByRegion("Tuscany").filter(a => a.slug.includes('tuscany') === false)).slice(0, 6);
  return (
    <div>
      <SEO
        title="Siena Travel Guide — Things to do, where to stay, itineraries, family & budget"
        description="The Archi Siena guide: what to do first, where to stay in each terzo, 1–3 day itineraries, family and budget travel, and how to arrive from Florence."
        path="/siena"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Italy', to: '/italy' }, { label: 'Tuscany', to: '/tuscany' }, { label: 'Siena' }])}
      />
      <section className="relative overflow-hidden">
        <img src={HERO} alt="Siena skyline" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/85 via-[hsl(var(--charcoal))]/30 to-transparent" />
        <div className="relative container-editorial pt-14 pb-24 lg:pb-32 text-[hsl(var(--ivory))]">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Italy", to: "/italy" }, { label: "Tuscany", to: "/tuscany" }, { label: "Siena" }]} />
          <p className="overline text-[hsl(var(--ivory))]/80 mt-6">Deep coverage · Siena</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-none tracking-tight max-w-3xl">Siena travel guide</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--ivory))]/85">
            The medieval heart of Tuscany. Piazza del Campo, contrada traditions and streets that reveal themselves slowly.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-8">
            <p className="overline">Chapters</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mt-3">The Siena canon</h2>
            <p className="mt-5 text-[hsl(var(--charcoal))]/85 leading-relaxed text-lg">
              Everything you need to plan a first trip — and a second one.
              We prioritise clarity over completeness: our guides tell you what to skip, not just what to see.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {chapters.map((c) => (
                <Link key={c.title} to={c.to} className="card-editorial p-6 block">
                  <h3 className="font-serif text-2xl">{c.title}</h3>
                  <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed">{c.blurb}</p>
                  <span className="mt-4 inline-block text-sm text-[hsl(var(--terracotta))] font-medium">Read →</span>
                </Link>
              ))}
            </div>

            <div className="mt-14">
              <p className="overline">Watch</p>
              <h3 className="font-serif text-2xl mt-2 mb-4">A quiet walk through Siena at dawn</h3>
              <VideoThumb
                src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=75"
                title="A quiet morning walk from Piazza del Campo to the Duomo"
                alt="Siena at dawn"
                provider="External video CDN placeholder"
              />
              <p className="text-xs text-[hsl(var(--charcoal-soft))] mt-3">
                Video thumbnails load first for speed. Play triggers the external embed only when requested.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6">
              <p className="overline">Plan your trip</p>
              <h3 className="font-serif text-2xl mt-2 leading-tight">Siena in 60 seconds</h3>
              <ul className="mt-5 space-y-2 text-sm">
                <li><strong>Ideal length:</strong> 2 nights inside the walls.</li>
                <li><strong>Best months:</strong> May, June, September.</li>
                <li><strong>Palio dates:</strong> July 2 & August 16.</li>
                <li><strong>Getting there:</strong> Bus from Florence (75 min).</li>
                <li><strong>Where to stay:</strong> Terzo di Città for quiet nights.</li>
              </ul>
            </div>
            <AdPlaceholder variant="sidebar" />
          </aside>
        </div>
      </section>

      <section className="section-y bg-[hsl(var(--ivory-2))]">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">More Siena reading</h2>
            <Link to="/blog" className="link-terra text-sm font-medium">All guides →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
