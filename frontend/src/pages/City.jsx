import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import LazyImage from "@/components/common/LazyImage";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import FAQAccordion from "@/components/common/FAQAccordion";
import ArticleCard from "@/components/common/ArticleCard";
import HotelWidget from "@/components/shared/HotelWidget";
import SEO from "@/components/common/SEO";
import { getCity } from "@/data/cities";
import { getArticle } from "@/data/articles";
import { breadcrumbSchema, faqSchema, placeSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import NotFound from "./NotFound";
import { MapPin, Sun, Bed, TramFront, Route, Wallet } from "lucide-react";

const ICONS = { overview: MapPin, best: Sun, stay: Bed, transport: TramFront, itinerary: Route, budget: Wallet };

export default function City({ slug: slugProp }) {
  const params = useParams();
  const slug = slugProp || params.slug;
  const city = getCity(slug);
  if (!city) return <NotFound />;

  const relatedArticles = (city.related || []).map(getArticle).filter(Boolean);
  const path = `/${city.slug}`;
  const url = canonical(path);

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Italy', to: '/italy' },
    ...(city.region === 'Tuscany' ? [{ label: 'Tuscany', to: '/tuscany-travel-guide' }] : []),
    { label: city.name },
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    placeSchema({ name: city.name, description: city.metaDescription, image: city.hero, url, region: city.region }),
    faqSchema(city.faqs),
  ];

  return (
    <div>
      <SEO
        title={city.metaTitle}
        description={city.metaDescription}
        path={path}
        image={city.hero}
        schema={schemas}
      />

      <section className="relative overflow-hidden">
        <img src={city.hero} alt={`${city.name} — ${city.tagline}`} loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/85 via-[hsl(var(--charcoal))]/30 to-transparent" />
        <div className="relative container-editorial pt-14 pb-24 lg:pb-32 text-[hsl(var(--ivory))]">
          <Breadcrumbs items={crumbs} />
          <p className="overline text-[hsl(var(--ivory))]/80 mt-6">{city.country} · {city.region}</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-none tracking-tight max-w-3xl">{city.name} travel guide</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--ivory))]/85">{city.tagline}.</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-14">
            <section id="overview">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.overview className="w-4 h-4 text-[hsl(var(--terracotta))]" />
                <p className="overline">Overview</p>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">How to think about {city.name}</h2>
              <p className="mt-5 text-[hsl(var(--charcoal))]/85 leading-relaxed text-lg">{city.overview}</p>
              <p className="mt-4 text-[hsl(var(--charcoal))]/85 leading-relaxed text-lg">{city.overview2}</p>
            </section>

            <section id="best-time">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.best className="w-4 h-4 text-[hsl(var(--terracotta))]" />
                <p className="overline">Best time to visit</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">When to go</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5">
                  <p className="text-xs uppercase tracking-widest text-[hsl(var(--olive))] font-semibold mb-2">Best months</p>
                  <p className="text-sm leading-relaxed">{city.bestTime.good}</p>
                </div>
                <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5">
                  <p className="text-xs uppercase tracking-widest text-[hsl(var(--terracotta))] font-semibold mb-2">Avoid</p>
                  <p className="text-sm leading-relaxed">{city.bestTime.avoid}</p>
                </div>
                <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5">
                  <p className="text-xs uppercase tracking-widest text-[hsl(var(--charcoal-soft))] font-semibold mb-2">Quiet & cheap</p>
                  <p className="text-sm leading-relaxed">{city.bestTime.quiet}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[hsl(var(--charcoal-soft))]">
                Want month-by-month recommendations? Try our <Link to="/travel-tools/best-time-to-visit" className="link-terra">Best Time to Visit tool</Link>.
              </p>
            </section>

            <AdPlaceholder />

            <section id="where-to-stay">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.stay className="w-4 h-4 text-[hsl(var(--terracotta))]" />
                <p className="overline">Where to stay</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">Neighborhoods, compared</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {city.whereToStay.map((n) => (
                  <div key={n.name} className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-5">
                    <h3 className="font-serif text-xl">{n.name}</h3>
                    <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-2 leading-relaxed">{n.why}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-[hsl(var(--charcoal-soft))]">
                For a personalised recommendation, use our <Link to="/travel-tools/area-finder" className="link-terra">Best Area to Stay finder</Link>.
              </p>

              <HotelWidget 
                destination={city.name}
                subtitle={`Ready to book? Find the best hotels in ${city.name} across our recommended neighborhoods.`}
                imageUrl={city.hero}
              />
            </section>

            <section id="transport">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.transport className="w-4 h-4 text-[hsl(var(--terracotta))]" />
                <p className="overline">Transport</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">Getting there and around</h2>
              <ul className="mt-6 space-y-3 text-[15px] leading-relaxed">
                {city.transport.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[hsl(var(--terracotta))] mt-1 shrink-0">→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="itinerary">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.itinerary className="w-4 h-4 text-[hsl(var(--terracotta))]" />
                <p className="overline">Itinerary ideas</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">How to spend your days</h2>
              <div className="mt-6 space-y-4">
                {city.itineraryIdeas.map((d, i) => (
                  <div key={i} className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-5">
                    <h3 className="font-serif text-xl">{d.title}</h3>
                    <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-2 leading-relaxed">{d.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-[hsl(var(--charcoal-soft))]">
                Build a custom day-by-day plan with our <Link to="/travel-tools/itinerary-generator" className="link-terra">Itinerary Generator</Link>.
              </p>
            </section>

            <section id="budget">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.budget className="w-4 h-4 text-[hsl(var(--terracotta))]" />
                <p className="overline">Budget</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">What it costs</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Budget', value: city.budget.budget },
                  { label: 'Mid', value: city.budget.mid },
                  { label: 'Luxury', value: city.budget.luxury },
                ].map((t) => (
                  <div key={t.label} className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5">
                    <p className="text-xs uppercase tracking-widest font-semibold text-[hsl(var(--terracotta))] mb-2">{t.label}</p>
                    <p className="text-sm leading-relaxed">{t.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-[hsl(var(--charcoal-soft))]">
                Fine-tune with our <Link to="/travel-budget-calculator" className="link-terra">Trip Budget Calculator</Link>.
              </p>
            </section>

            <section id="faq" className="scroll-mt-28">
              <p className="overline">Frequently asked</p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight mt-2">FAQ</h2>
              <FAQAccordion items={city.faqs} />
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6">
              <p className="overline">On this page</p>
              <ol className="mt-4 space-y-2.5 text-sm">
                {[
                  ['overview', 'Overview'],
                  ['best-time', 'Best time to visit'],
                  ['where-to-stay', 'Where to stay'],
                  ['transport', 'Transport'],
                  ['itinerary', 'Itinerary ideas'],
                  ['budget', 'Budget'],
                  ['faq', 'FAQ'],
                ].map(([id, label]) => (
                  <li key={id}><a href={`#${id}`} className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))]">{label}</a></li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--stone-border))] p-6 bg-[hsl(var(--ivory))]">
              <p className="overline">Keep exploring</p>
              <ul className="mt-4 space-y-3 text-sm">
                {city.internalLinks.map((l) => (
                  <li key={l.to}><Link to={l.to} className="link-terra font-medium">{l.label} →</Link></li>
                ))}
              </ul>
            </div>
            <AdPlaceholder variant="sidebar" />
          </aside>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="section-y bg-[hsl(var(--ivory-2))]">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-serif text-3xl md:text-4xl">Related guides</h2>
              <Link to="/blog" className="link-terra text-sm font-medium">All guides →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
