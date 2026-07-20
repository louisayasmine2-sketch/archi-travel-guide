import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema, placeSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import { articlesByRegion } from "@/data/articles";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const HERO = "https://images.unsplash.com/photo-1646319514161-8fba0ebc3275?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxzaWVuYSUyMGl0YWx5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc4MzAwNDQ4Nnww&ixlib=rb-4.1.0&q=85";

const chapters = [
  { title: "Things to do", to: "/blog/best-things-to-do-in-siena/", blurb: "Piazza del Campo, Duomo, Torre del Mangia — and what to skip on a short trip." },
  { title: "Where to stay",  to: "/blog/where-to-stay-in-siena/", blurb: "Terzo di Città, San Martino or Camollia? Compared honestly." },
  { title: "2-day itinerary", to: "/blog/siena-2-day-itinerary/", blurb: "A well-paced two-day plan that leaves room to breathe." },
  { title: "3-day itinerary", to: "/blog/siena-3-day-itinerary/", blurb: "Add a proper half-day trip to Val d’Orcia or San Gimignano." },
  { title: "Family travel",   to: "/blog/siena-with-kids/", blurb: "Kid-paced days, contrada scavenger hunts, and family-friendly trattorias." },
  { title: "Budget travel",   to: "/blog/how-much-siena-trip-costs/", blurb: "Three tiers of cost, from guesthouse to design hotel." },
  { title: "Transport",       to: "/florence-to-siena-by-train-or-bus/", blurb: "How to arrive from Florence, and when a rental car makes sense." },
];

export default function Siena() {
  const breadcrumbs = [{ label: 'Home', to: '/' }, { label: 'Italy', to: '/italy/' }, { label: 'Tuscany', to: '/tuscany-travel-guide/' }, { label: 'Siena' }];
  const schema = [
    breadcrumbSchema(breadcrumbs),
    placeSchema({
      name: "Siena",
      description: "Medieval Tuscan city known for Piazza del Campo, the Palio, Gothic streets, and slow travel planning.",
      image: HERO,
      url: canonical("/siena/"),
      region: "Tuscany",
      country: "Italy",
      touristType: ["Cultural travelers", "Couples", "Families", "Slow travel planners"],
    }),
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans overflow-hidden">
      <SEO
        title="Siena Travel Guide — Things to do, where to stay, itineraries, family & budget"
        description="The Archi Siena guide: what to do first, where to stay in each terzo, 1–3 day itineraries, family and budget travel, and how to arrive from Florence."
        path="/siena/"
        image={HERO}
        schema={schema}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={HERO} alt="Siena skyline" loading="eager" className="w-full h-full object-cover opacity-80" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 mt-16">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <div className="bg-[#C65A3A]/20 border border-[#C65A3A]/40 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C65A3A] animate-pulse"></span>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EDE3]">Deep Coverage · Siena</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-serif leading-[1] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Siena travel guide
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] mb-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-light max-w-3xl mx-auto leading-relaxed">
              The medieval heart of Tuscany. Piazza del Campo, contrada traditions and streets that reveal themselves slowly.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF7F2] relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Chapters</p>
                <AIRecommendedBadge />
              </div>
              <h2 className="font-serif text-5xl mb-6 text-[#2C211B]">The Siena canon</h2>
              <p className="text-xl text-[#8A9A5B] leading-relaxed mb-12">
                Everything you need to plan a first trip — and a second one. We prioritise clarity over completeness: our guides tell you what to skip, not just what to see.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {chapters.map((c) => (
                <motion.div key={c.title} variants={fadeInUp} className="group relative block h-full">
                  <Link to={c.to} className="block h-full bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4 border border-[#F5EDE3]/50">
                    <h3 className="font-serif text-3xl text-[#2C211B] mb-4 group-hover:text-[#C65A3A] transition-colors">{c.title}</h3>
                    <p className="text-sm text-[#8A9A5B] leading-relaxed mb-6">{c.blurb}</p>
                    <div className="inline-flex items-center gap-2 text-[#C65A3A] font-semibold group-hover:text-[#A84A2E] transition-colors">
                      Read <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <aside className="lg:col-span-4 space-y-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 sticky top-32 group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={HERO} alt="Siena skyline" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                   <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold mb-2">Editorial image</p>
                   <p className="font-serif text-2xl text-white leading-snug drop-shadow-md">Medieval Siena, best explored slowly on foot</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-sm text-[#8A9A5B] leading-relaxed">
                  We will add an embedded walk-through only after a verified Siena video is available.
                </p>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <AdPlaceholder variant="sidebar" className="rounded-[2rem] overflow-hidden shadow-xl" />
            </motion.div>
          </aside>
          
        </div>
      </section>
    </div>
  );
}
