import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { asiaCountries } from "@/data/destinations";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const HERO = "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=2000&q=75";

export default function Asia() {
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
        title="Asia Travel Guide — Editorial roadmap, tools ready today"
        description="Archi's Asia travel guide roadmap. Queued country guides for Indonesia, Thailand, Japan and Singapore. Our travel tools already support Asia presets."
        path="/asia"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: 'Asia' }])}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={HERO} alt="Asia" loading="eager" className="w-full h-full object-cover opacity-80" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 mt-16">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <div className="bg-[#C65A3A]/20 border border-[#C65A3A]/40 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8A9A5B] animate-pulse"></span>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EDE3]">Continent · Queued</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-serif leading-[1] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Asia travel guide
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] mb-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-light max-w-3xl mx-auto leading-relaxed">
              Our third phase. We’d rather publish nothing than publish shallow guides for Bali or Bangkok. Below is our plan — the pages come as we can do them justice.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF7F2] relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <h2 className="font-serif text-5xl mb-6 text-[#2C211B]">Structure over shortcuts</h2>
              <p className="text-xl text-[#8A9A5B] leading-relaxed mb-12">
                Every country below will get proper city coverage, itineraries and area finders — not a generic list of “top 10 things.”
              </p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {asiaCountries.map((c) => (
                <motion.div key={c.name} variants={fadeInUp} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-3xl text-[#2C211B]">{c.name}</h3>
                      <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FAF7F2] text-[#8A9A5B] font-bold border border-[#8A9A5B]/20">Queued</span>
                    </div>
                    <p className="text-sm text-[#8A9A5B] leading-relaxed">{c.blurb}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mt-24 rounded-[2.5rem] border-2 border-[#F5EDE3] bg-white p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <AIRecommendedBadge />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-3">While you wait</p>
                <h3 className="font-serif text-4xl mb-6 text-[#2C211B]">Our global travel tools already work for Asia</h3>
                <p className="text-lg text-[#8A9A5B] leading-relaxed max-w-xl mb-10">
                  The budget calculator, itinerary generator and area finder have Asia presets built in — try them for your next trip to Japan or Indonesia.
                </p>
                <Link to="/travel-tools" className="inline-flex items-center gap-3 bg-[#C65A3A] hover:bg-[#A84A2E] shadow-[0_0_20px_rgba(198,90,58,0.3)] hover:shadow-[0_0_40px_rgba(198,90,58,0.5)] text-white px-10 py-5 rounded-full text-lg font-semibold hover:-translate-y-2 transition-all duration-500">
                  Open travel tools &rarr;
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar 4D */}
          <aside className="lg:col-span-4 space-y-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-500 sticky top-32">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-2">Editorial roadmap</p>
              <h3 className="font-serif text-3xl mb-6 text-[#2C211B]">Publishing order</h3>
              
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-[#FAF7F2] text-[#C65A3A] flex items-center justify-center font-bold font-serif shadow-inner">1</span>
                  <p className="text-sm text-[#2C211B] mt-1.5 leading-relaxed"><strong>Japan</strong> — first-timer routes, quieter secondary cities.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-[#FAF7F2] text-[#C65A3A] flex items-center justify-center font-bold font-serif shadow-inner">2</span>
                  <p className="text-sm text-[#2C211B] mt-1.5 leading-relaxed"><strong>Indonesia</strong> — Bali beyond the crowds, Java, Lombok.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-[#FAF7F2] text-[#C65A3A] flex items-center justify-center font-bold font-serif shadow-inner">3</span>
                  <p className="text-sm text-[#2C211B] mt-1.5 leading-relaxed"><strong>Thailand</strong> — Bangkok base + islands + north.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-[#FAF7F2] text-[#C65A3A] flex items-center justify-center font-bold font-serif shadow-inner">4</span>
                  <p className="text-sm text-[#2C211B] mt-1.5 leading-relaxed"><strong>Singapore</strong> — a proper 3-day stopover guide.</p>
                </li>
              </ol>
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
