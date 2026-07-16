import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import DestinationCard from "@/components/common/DestinationCard";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import HotelWidget from "@/components/shared/HotelWidget";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { franceRegions } from "@/data/destinations";
import { articles } from "@/data/articles";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const HERO = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2000&q=75";

export default function France() {
  const franceArticles = articles.filter((a) => ["France", "Paris", "Loire", "Provence"].includes(a.region)).slice(0, 6);

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
        title="France Travel Guide — Paris, Loire Valley, Provence"
        description="A practical France travel guide from Archi. Deep editorial coverage of Paris and its arrondissements, plus road trip itineraries for the Loire Valley and Provence."
        path="/france"
        image={HERO}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: 'France' }])}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={HERO} alt="France" loading="eager" className="w-full h-full object-cover opacity-80" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 mt-16">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <div className="bg-[#C65A3A]/20 border border-[#C65A3A]/40 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C65A3A] animate-pulse"></span>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EDE3]">Editorial Pillar · France</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-serif leading-[1] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              France travel guide
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] mb-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-light max-w-3xl mx-auto leading-relaxed">
              Honest, practical guides to navigating Paris, escaping the crowds in the Louvre, and building realistic itineraries.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF7F2] relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-2">Regions & cities</p>
                <h2 className="font-serif text-5xl mb-6 text-[#2C211B]">Where to start in France</h2>
                <p className="text-xl text-[#8A9A5B] leading-relaxed mb-12">
                  Everything starts in Paris. Our Paris destination guide covers the best arrondissements for first-timers, 
                  how to pace your museum visits, and the classic 3-day route.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {franceRegions.map((r, i) => (
                  <motion.div key={r.slug} variants={fadeInUp} className="relative group block h-full">
                    {r.comingSoon ? (
                      <div className="rounded-[2rem] overflow-hidden border border-[#F5EDE3] bg-white h-full opacity-80 grayscale-[30%] shadow-md">
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                        <div className="p-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-serif text-3xl text-[#2C211B]">{r.name}</h3>
                            <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FAF7F2] text-[#8A9A5B] font-bold">Coming</span>
                          </div>
                          <p className="text-sm text-[#8A9A5B] leading-relaxed mt-4">{r.blurb}</p>
                        </div>
                      </div>
                    ) : (
                      <Link to={`/${r.slug}`} className="block h-full bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${r.image}')` }}></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {(i === 0) && (
                            <div className="absolute top-6 left-6 z-10">
                              <AIRecommendedBadge />
                            </div>
                          )}

                          <div className="absolute bottom-6 left-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                            <h3 className="text-3xl font-serif drop-shadow-md">{r.name}</h3>
                          </div>
                        </div>
                        <div className="p-8">
                          <p className="text-sm text-[#8A9A5B] leading-relaxed mb-6 line-clamp-3">{r.blurb}</p>
                          <div className="inline-flex items-center gap-2 text-[#C65A3A] font-semibold group-hover:text-[#A84A2E] transition-colors group/link">
                            Explore <span className="transform transition-transform group-hover/link:translate-x-1">&rarr;</span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <aside className="lg:col-span-4 space-y-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-500 sticky top-32">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-2">Practical planning</p>
                <h3 className="font-serif text-3xl mb-6 text-[#2C211B]">Start with these tools</h3>
                <ul className="space-y-4">
                  <li>
                    <Link to="/travel-tools" className="group flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#C65A3A] hover:text-white transition-all duration-300">
                      <span className="font-medium text-[#2C211B] group-hover:text-white">Trip Budget Calculator</span>
                      <span className="text-[#C65A3A] group-hover:text-white transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/travel-tools" className="group flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#C65A3A] hover:text-white transition-all duration-300">
                      <span className="font-medium text-[#2C211B] group-hover:text-white">Best Time to Visit</span>
                      <span className="text-[#C65A3A] group-hover:text-white transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/travel-tools" className="group flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#C65A3A] hover:text-white transition-all duration-300">
                      <span className="font-medium text-[#2C211B] group-hover:text-white">Best Area to Stay Finder</span>
                      <span className="text-[#C65A3A] group-hover:text-white transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  </li>
                </ul>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
                <AdPlaceholder variant="sidebar" className="rounded-[2rem] overflow-hidden shadow-xl" />
              </motion.div>
            </aside>

          </div>

          {/* SEO Hotel Widget */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mt-20">
            <HotelWidget 
              destination="France"
              subtitle="Looking for the best places to stay? Compare boutique hotels, charming B&Bs, and luxury châteaux across France for your perfect holiday."
              imageUrl="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
