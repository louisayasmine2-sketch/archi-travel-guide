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
import { motion } from "framer-motion";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#FAF7F2] font-sans min-h-screen overflow-hidden">
      <SEO
        title={city.metaTitle}
        description={city.metaDescription}
        path={path}
        image={city.hero}
        schema={schemas}
      />

      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-[#2C211B] text-white">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={city.hero} alt={`${city.name} — ${city.tagline}`} loading="eager" className="w-full h-full object-cover opacity-70" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={crumbs} />
            </motion.div>
            <motion.div variants={fadeInUp} className="mb-4 flex justify-center items-center gap-3">
               <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A5B] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                 {city.country} · {city.region}
               </span>
               <AIRecommendedBadge />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              {city.name} travel guide
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] drop-shadow-md font-light leading-relaxed max-w-3xl mx-auto">
              {city.tagline}.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16">
            <section id="overview">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.overview className="w-5 h-5 text-[#C65A3A]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Overview</p>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight text-[#2C211B] mb-6">How to think about {city.name}</h2>
              <p className="text-[#8A9A5B] leading-relaxed text-lg mb-4">{city.overview}</p>
              <p className="text-[#8A9A5B] leading-relaxed text-lg">{city.overview2}</p>
            </section>

            <section id="best-time">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.best className="w-5 h-5 text-[#C65A3A]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Best time to visit</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2C211B] mb-6">When to go</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-md">
                  <p className="text-xs uppercase tracking-widest text-[#8A9A5B] font-bold mb-3">Best months</p>
                  <p className="text-[#8A9A5B] leading-relaxed">{city.bestTime.good}</p>
                </div>
                <div className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-md">
                  <p className="text-xs uppercase tracking-widest text-[#C65A3A] font-bold mb-3">Avoid</p>
                  <p className="text-[#8A9A5B] leading-relaxed">{city.bestTime.avoid}</p>
                </div>
                <div className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-md">
                  <p className="text-xs uppercase tracking-widest text-[#2C211B] font-bold mb-3">Quiet & cheap</p>
                  <p className="text-[#8A9A5B] leading-relaxed">{city.bestTime.quiet}</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-[#8A9A5B]">
                Want month-by-month recommendations? Try our <Link to="/travel-tools" className="text-[#C65A3A] hover:underline font-semibold">Best Time to Visit tool</Link>.
              </p>
            </section>

            <AdPlaceholder className="rounded-[2rem] overflow-hidden shadow-xl" />

            <section id="where-to-stay">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.stay className="w-5 h-5 text-[#C65A3A]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Where to stay</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2C211B] mb-6">Neighborhoods</h2>
              <p className="text-[#8A9A5B] leading-relaxed text-lg mb-8">{city.neighborhoodsIntro}</p>
              <div className="space-y-6">
                {city.neighborhoods.map((n, i) => (
                  <div key={i} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-lg flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h3 className="font-serif text-2xl text-[#2C211B]">{n.name}</h3>
                      <p className="text-sm font-semibold text-[#8A9A5B] mt-2">{n.vibe}</p>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-[#8A9A5B] leading-relaxed">{n.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-[#8A9A5B]">
                Compare areas based on your travel style with our <Link to="/travel-tools" className="text-[#C65A3A] hover:underline font-semibold">Area Finder tool</Link>.
              </p>
            </section>

            <section id="transport">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.transport className="w-5 h-5 text-[#C65A3A]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Transport</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2C211B] mb-6">Getting in & around</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-md">
                  <h3 className="font-serif text-2xl text-[#2C211B] mb-3">Arriving</h3>
                  <p className="text-[#8A9A5B] leading-relaxed">{city.transport.arrive}</p>
                </div>
                <div className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-md">
                  <h3 className="font-serif text-2xl text-[#2C211B] mb-3">Getting around</h3>
                  <p className="text-[#8A9A5B] leading-relaxed">{city.transport.around}</p>
                </div>
              </div>
            </section>

            <section id="itinerary">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.itinerary className="w-5 h-5 text-[#C65A3A]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Itinerary ideas</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2C211B] mb-6">How to spend your days</h2>
              <div className="space-y-6">
                {city.itineraryIdeas.map((d, i) => (
                  <div key={i} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-md">
                    <h3 className="font-serif text-2xl text-[#2C211B] mb-3">{d.title}</h3>
                    <p className="text-[#8A9A5B] leading-relaxed">{d.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-[#8A9A5B]">
                Build a custom day-by-day plan with our <Link to="/travel-tools" className="text-[#C65A3A] hover:underline font-semibold">Itinerary Generator</Link>.
              </p>
            </section>

            <section id="budget">
              <div className="flex items-center gap-3 mb-4">
                <ICONS.budget className="w-5 h-5 text-[#C65A3A]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Budget</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2C211B] mb-6">What it costs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Budget', value: city.budget.budget },
                  { label: 'Mid', value: city.budget.mid },
                  { label: 'Luxury', value: city.budget.luxury },
                ].map((t) => (
                  <div key={t.label} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-md text-center">
                    <p className="text-xs uppercase tracking-widest font-bold text-[#C65A3A] mb-3">{t.label}</p>
                    <p className="text-[#2C211B] font-medium text-lg leading-relaxed">{t.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-[#8A9A5B] text-center">
                Fine-tune with our <Link to="/travel-tools" className="text-[#C65A3A] hover:underline font-semibold">Trip Budget Calculator</Link>.
              </p>
            </section>

            <section id="faq" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Frequently asked</p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-[#2C211B] mb-6">FAQ</h2>
              <div className="bg-white rounded-[2rem] border border-[#F5EDE3] p-8 shadow-xl">
                 <FAQAccordion items={city.faqs} />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-10">
            <div className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-xl sticky top-32">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-4">On this page</p>
              <ol className="space-y-4">
                {[
                  ['overview', 'Overview'],
                  ['best-time', 'Best time to visit'],
                  ['where-to-stay', 'Where to stay'],
                  ['transport', 'Transport'],
                  ['itinerary', 'Itinerary ideas'],
                  ['budget', 'Budget'],
                  ['faq', 'FAQ'],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-[#2C211B] hover:text-[#C65A3A] font-medium transition-colors">{label}</a>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="rounded-[2rem] border border-[#F5EDE3] p-8 bg-[#2C211B] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <AIRecommendedBadge />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-4">Keep exploring</p>
              <ul className="space-y-4">
                {city.internalLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white hover:text-[#C65A3A] font-serif text-xl transition-colors">{l.label} &rarr;</Link>
                  </li>
                ))}
              </ul>
            </div>
            <AdPlaceholder variant="sidebar" className="rounded-[2rem] overflow-hidden shadow-xl" />
          </aside>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="py-24 bg-white relative z-30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12 border-b border-[#F5EDE3] pb-6">
              <h2 className="font-serif text-4xl text-[#2C211B]">Related guides</h2>
              <Link to="/blog" className="text-[#C65A3A] font-semibold hover:underline">All guides &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((a) => (
                <div key={a.slug} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 h-full border border-[#F5EDE3]/50">
                  <ArticleCard article={a} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
