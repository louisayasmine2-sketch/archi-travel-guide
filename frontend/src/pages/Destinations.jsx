import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { destinations } from "@/data/destinations";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

export default function Destinations() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");

  const regions = useMemo(() => {
    const set = new Set(destinations.map((d) => d.region));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = destinations.filter((d) => {
    const rOK = region === "all" || d.region === region;
    const qOK = !q.trim() || (d.name + d.blurb + d.tagline).toLowerCase().includes(q.toLowerCase());
    return rOK && qOK;
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      <SEO
        title="Destinations"
        description="All Archi Travel Guide destinations — Italy, Tuscany, Siena, Europe and Asia. Deep editorial coverage of the places we know best."
        path="/destinations/"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Destinations' }])}
      />
      
      {/* 4D Parallax Header */}
      <section className="relative py-32 bg-[#2C211B] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-[#2C211B] z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-serif mb-6 drop-shadow-xl"
          >
            Destinations, <span className="text-[#8A9A5B]">mapped honestly.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="text-xl max-w-2xl mx-auto text-[#F5EDE3]/90 leading-relaxed drop-shadow-md"
          >
            Deep coverage begins in Italy. Europe and Asia are being built out with the same care.
            No filler pages, no destinations we haven’t actually planned trips for.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white shadow-sm sticky top-[4rem] z-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <label className="relative w-full sm:w-96 shadow-lg rounded-full">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-[#2C211B]/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search destinations (e.g. Rome, Siena)"
              className="w-full rounded-full border-2 border-[#F5EDE3] bg-[#FAF7F2] pl-14 pr-6 py-4 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors"
            />
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full sm:w-auto rounded-full border-2 border-[#F5EDE3] bg-[#FAF7F2] px-8 py-4 text-sm focus:border-[#C65A3A] focus:outline-none shadow-lg cursor-pointer transition-colors"
          >
            {regions.map((r) => (
              <option key={r} value={r}>{r === "all" ? "All regions" : r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Destinations Grid 4D */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center text-xl text-[#2C211B]/60 py-20">No destinations match your filters.</div>
          ) : (
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {filtered.map((d, i) => (
                <motion.div key={d.slug} variants={fadeInUp} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4 cursor-pointer block">
                  <Link to={`/${d.slug}`}>
                    <div className="h-72 overflow-hidden relative">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${d.image}')` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* AI Recommended Hint Logic (Show on Siena or top items) */}
                      {(d.slug === 'siena' || i === 0) && (
                        <div className="absolute top-6 left-6 z-10">
                          <AIRecommendedBadge />
                        </div>
                      )}

                      <div className="absolute bottom-6 left-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                        <h3 className="text-4xl font-serif mb-1 drop-shadow-md">{d.name}</h3>
                        <p className="text-[#F5EDE3] font-medium tracking-wide text-sm uppercase drop-shadow-md">{d.tagline}</p>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-[#8A9A5B] leading-relaxed line-clamp-3">{d.blurb}</p>
                      <div className="mt-6 flex items-center gap-2 text-[#C65A3A] font-semibold group-hover:text-[#A84A2E] transition-colors group/btn">
                        Explore Guide <span className="transform transition-transform group-hover/btn:translate-x-1">&rarr;</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
