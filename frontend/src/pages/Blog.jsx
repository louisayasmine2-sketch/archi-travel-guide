import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ArticleCard from "@/components/common/ArticleCard";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { articles } from "@/data/articles";
import { Search } from "lucide-react";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [region, setRegion] = useState("all");

  useEffect(() => { setQ(params.get("q") || ""); }, [params]);

  const regions = useMemo(() => ["all", ...Array.from(new Set(articles.map((a) => a.region)))], []);

  const filtered = articles.filter((a) => {
    const rOK = region === "all" || a.region === region;
    const qOK = !q.trim() || (a.title + a.excerpt + a.category + a.region).toLowerCase().includes(q.toLowerCase());
    return rOK && qOK;
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setParams(q.trim() ? { q: q.trim() } : {});
  };

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
        title="Blog — Every Archi Travel Guide, one shelf"
        description="All Archi Travel Guide articles: itineraries, planning frameworks, budget guides, food guides, transport tips. Filter by destination or search a term."
        path="/blog"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Blog' }])}
      />
      
      {/* 4D Header */}
      <section className="relative py-32 bg-[#2C211B] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-[#2C211B] z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-serif mb-6 drop-shadow-xl">
              Every guide, <span className="text-[#8A9A5B]">one shelf.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl max-w-2xl mx-auto text-[#F5EDE3]/90 leading-relaxed drop-shadow-md">
              Long-form guides, itineraries, and practical frameworks. Filter by destination or search a term.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white shadow-sm sticky top-[4rem] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
            <label className="relative w-full sm:flex-1 shadow-lg rounded-full">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-[#2C211B]/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search articles (e.g. Rome, Budget)"
                className="w-full rounded-full border-2 border-[#F5EDE3] bg-[#FAF7F2] pl-14 pr-6 py-4 text-sm focus:border-[#C65A3A] focus:outline-none transition-colors"
              />
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full sm:w-auto rounded-full border-2 border-[#F5EDE3] bg-[#FAF7F2] px-8 py-4 text-sm focus:border-[#C65A3A] focus:outline-none shadow-lg cursor-pointer transition-colors"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r === "all" ? "All regions" : r}</option>
              ))}
            </select>
          </form>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <p className="text-xl text-[#8A9A5B] font-serif">{filtered.length} guides found</p>
            <AIRecommendedBadge />
          </div>
          
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-[#2C211B] font-serif">No guides found for that query.</p>
            </div>
          ) : (
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {filtered.map((a) => (
                <motion.div key={a.slug} variants={fadeInUp} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4 h-full border border-[#F5EDE3]/50">
                  <ArticleCard article={a} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
