import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import LazyImage from "@/components/common/LazyImage";
import { articlesByRegion } from "@/data/articles";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema, placeSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const HERO = "https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=2000&q=75";

const sections = [
  { title: "Itineraries", to: "/blog/?region=Tuscany&cat=itineraries", body: "Two- and three-day plans for Siena, plus longer routes through Val d’Orcia and Chianti." },
  { title: "Where to stay", to: "/travel-tools/", body: "Countryside agriturismos, hilltown boutique hotels, or a base in Florence — which one fits your trip." },
  { title: "Food guide", to: "/blog/", body: "The dishes and wines worth ordering, and the menu vocabulary that opens up family-run trattorias." },
  { title: "Transport", to: "/florence-to-siena-by-train-or-bus/", body: "Bus, train or rental car — how to move between Florence, Siena and the countryside." },
  { title: "Best season", to: "/travel-tools/", body: "Month-by-month realities of Tuscany, with an honest take on August heat and the Palio." },
];

export default function Tuscany() {
  const tuscanyArticles = articlesByRegion("Tuscany").concat(articlesByRegion("Siena")).slice(0, 6);
  const breadcrumbs = [{ label: 'Home', to: '/' }, { label: 'Italy', to: '/italy/' }, { label: 'Tuscany' }];
  const schema = [
    breadcrumbSchema(breadcrumbs),
    placeSchema({
      name: "Tuscany",
      description: "Italian region known for Siena, Florence, hilltowns, vineyards, food routes, and slow countryside itineraries.",
      image: HERO,
      url: canonical("/tuscany-travel-guide/"),
      country: "Italy",
      touristType: ["Cultural travelers", "Food travelers", "Road trip planners", "Couples"],
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
        title="Tuscany Travel Guide — Itineraries, food, transport, best time to visit"
        description="Practical Tuscany travel guide from Archi: hilltowns, vineyards, itineraries, food, transport and the best time to visit. Deep coverage starts with Siena."
        path="/tuscany-travel-guide/"
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
          <img src={HERO} alt="Tuscany cypress road" loading="eager" className="w-full h-full object-cover opacity-80" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 mt-16">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <div className="bg-[#C65A3A]/20 border border-[#C65A3A]/40 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C65A3A] animate-pulse"></span>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F5EDE3]">Region · Italy</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-serif leading-[1] mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Tuscany travel guide
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] mb-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-light max-w-3xl mx-auto leading-relaxed">
              Hilltowns, vineyards, slow food and long shadows. This is where Archi Travel Guide begins — with the region we know most intimately.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF7F2] relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-2">Overview</p>
              <h2 className="font-serif text-5xl mb-6 text-[#2C211B]">Slow region, careful planning</h2>
              <p className="text-xl text-[#8A9A5B] leading-relaxed mb-6">
                Tuscany rewards a slow itinerary. Two hilltowns per day is plenty. Distances look short on a map,
                but the roads curve, the light is worth stopping for, and lunch takes as long as it needs to.
              </p>
              <p className="text-xl text-[#8A9A5B] leading-relaxed mb-12">
                Our region coverage starts with Siena and expands out to the Val d’Orcia, Chianti,
                San Gimignano, Monteriggioni and the Etruscan coast.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {sections.map((s, i) => (
                <motion.div key={s.title} variants={fadeInUp} className="group relative block h-full">
                  <Link to={s.to} className="block h-full bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4 border border-[#F5EDE3]/50">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-3">Section</p>
                    <h3 className="font-serif text-3xl text-[#2C211B] mb-4 group-hover:text-[#C65A3A] transition-colors">{s.title}</h3>
                    <p className="text-sm text-[#8A9A5B] leading-relaxed mb-6">{s.body}</p>
                    <div className="inline-flex items-center gap-2 text-[#C65A3A] font-semibold group-hover:text-[#A84A2E] transition-colors">
                      Open <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <aside className="lg:col-span-4 space-y-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 sticky top-32 group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <LazyImage src="https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=1200&q=75" alt="Val d'Orcia" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-4 right-4 z-10"><AIRecommendedBadge /></div>
              </div>
              <div className="p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-2">Editor’s pick</p>
                <h4 className="font-serif text-2xl text-[#2C211B] mb-3 leading-snug">A slow half-day in Val d’Orcia</h4>
                <p className="text-sm text-[#8A9A5B] leading-relaxed">Pienza for cheese, Montalcino for Brunello, and a long lunch in between.</p>
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
