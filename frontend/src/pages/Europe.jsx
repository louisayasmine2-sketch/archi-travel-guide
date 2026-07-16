import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { europeCountries } from "@/data/destinations";
import { articles } from "@/data/articles";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const HERO = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=75";

export default function Europe() {
  const list = articles.filter((a) => a.region === "Europe" || a.region === "Global").slice(0, 3);

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
        title="Europe Travel Guide — Planning frameworks, countries in progress"
        description="Archi's Europe travel guide. Editorial roadmap (France, Spain, Switzerland, Greece, Germany) plus general Europe planning frameworks you can use today."
        path="/europe"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: 'Europe' }])}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={HERO} alt="Europe" loading="eager" className="w-full h-full object-cover opacity-80" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 mt-16">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <div className="bg-[#C65A3A]/20 border border-[#C65A3A]/40 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8A9A5B] animate-pulse"></span>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EDE3]">Continent · In Progress</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-serif leading-[1] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Europe travel guide
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] mb-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-light max-w-3xl mx-auto leading-relaxed">
              Our second phase. We publish country guides only when we can do them properly — the placeholders below show what’s next, not filler.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF7F2] relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <h2 className="font-serif text-5xl mb-6 text-[#2C211B]">Where Europe expands from</h2>
              <p className="text-xl text-[#8A9A5B] leading-relaxed mb-12">
                We prioritise depth over breadth. Each of the countries below will get city guides, itineraries and travel tools — not thin overview pages.
              </p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {europeCountries.map((c) => (
                <motion.div key={c.name} variants={fadeInUp} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-3xl text-[#2C211B]">{c.name}</h3>
                      <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FAF7F2] text-[#8A9A5B] font-bold border border-[#8A9A5B]/20">Coming</span>
                    </div>
                    <p className="text-sm text-[#8A9A5B] leading-relaxed">{c.blurb}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mt-24">
              <div className="flex items-center gap-3 mb-8">
                <h3 className="font-serif text-4xl text-[#2C211B]">Available today</h3>
                <AIRecommendedBadge />
              </div>
              <p className="text-xl text-[#8A9A5B] leading-relaxed mb-10">General Europe planning frameworks</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {list.map((a) => (
                  <div key={a.slug} className="group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3">
                    <ArticleCard article={a} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar 4D */}
          <aside className="lg:col-span-4 space-y-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-500 sticky top-32">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-2">Editorial roadmap</p>
              <h3 className="font-serif text-3xl mb-6 text-[#2C211B]">Next up</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#C65A3A]">Q1</span>
                  <span className="text-sm text-[#2C211B] mt-1 leading-relaxed">France — Paris & Loire</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#C65A3A]">Q2</span>
                  <span className="text-sm text-[#2C211B] mt-1 leading-relaxed">Spain — Barcelona & Andalucía</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#C65A3A]">Q3</span>
                  <span className="text-sm text-[#2C211B] mt-1 leading-relaxed">Switzerland — Alps & trains</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#C65A3A]">Q4</span>
                  <span className="text-sm text-[#2C211B] mt-1 leading-relaxed">Greece — Athens & islands</span>
                </li>
              </ul>
              
              <div className="mt-8 pt-8 border-t border-[#F5EDE3]">
                <Link to="/travel-tools" className="group flex items-center justify-between p-4 rounded-2xl bg-[#C65A3A] text-white hover:bg-[#A84A2E] shadow-md hover:shadow-xl transition-all duration-300">
                  <span className="font-medium">Try our tools meanwhile</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
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
