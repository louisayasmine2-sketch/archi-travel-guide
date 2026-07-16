import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AffiliateCard from "@/components/common/AffiliateCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { trackLeadSubmit } from "@/lib/analytics";
import { Send } from "lucide-react";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const RESOURCES = [
  { title: "Compare hotels across major booking sites", provider: "Hotels", tag: "Search", description: "Meta-search platforms let you compare prices from booking sites in one place — better than pledging loyalty to one.", href: "/travel-deals?utm_source=archi&utm_medium=deals&utm_campaign=hub" },
  { title: "Small-group tours and skip-the-line experiences", provider: "Tours", tag: "Experiences", description: "Curated guided experiences for cities where a good guide changes the trip — museums, food walks, cooking classes.", href: "/travel-deals?utm_source=archi&utm_medium=deals&utm_campaign=hub" },
  { title: "Global eSIM data plans", provider: "Connectivity", tag: "eSIM", description: "Set up mobile data before you land. Better rates than roaming, and no waiting at the airport SIM kiosk.", href: "/travel-deals?utm_source=archi&utm_medium=deals&utm_campaign=hub" },
  { title: "Travel insurance for medical + trip cancellation", provider: "Insurance", tag: "Coverage", description: "The one thing we never skip. Even a short delay can cost more than a full policy.", href: "/travel-deals?utm_source=archi&utm_medium=deals&utm_campaign=hub" },
  { title: "Rail passes and long-distance train tickets", provider: "Transport", tag: "Rail", description: "For Europe especially, booking well in advance often saves 40–60% on high-speed routes.", href: "/travel-deals?utm_source=archi&utm_medium=deals&utm_campaign=hub" },
  { title: "Compact travel gear and packing accessories", provider: "Gear", tag: "Accessories", description: "Packing cubes, folding daypacks, universal adapters — the small items that make trips less friction-heavy.", href: "/travel-deals?utm_source=archi&utm_medium=deals&utm_campaign=hub" },
];

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api/contact` : null;
const CONTACT_EMAIL = "contact@affittacameregliarchi.com";
const FIELD = "w-full rounded-2xl border-2 border-[#F5EDE3] bg-[#FAF7F2] px-5 py-4 text-sm focus:border-[#C65A3A] focus:outline-none transition-all shadow-inner";
const LABEL = "text-sm font-bold text-[#8A9A5B] uppercase tracking-widest";

const requestMailto = ({ name, email, category, message }) => {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Category: ${category}`,
    "",
    message,
  ].join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Travel deals request")}&body=${encodeURIComponent(body)}`;
};

export default function TravelDeals() {
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
        title="Travel Deals & Resources — Curated tools for hotels, tours, eSIM, insurance"
        description="A small, carefully-chosen shortlist of travel platforms Archi recommends for hotels, tours, eSIM, insurance, transport and gear. Clear affiliate disclosure."
        path="/travel-deals"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Deals & Resources' }])}
      />
      
      {/* 4D Header */}
      <section className="relative py-32 bg-[#2C211B] text-white overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-[#2C211B] z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Deals & Resources" }]} />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-serif mb-6 drop-shadow-xl text-white">
              Travel Deals <span className="text-[#8A9A5B]">& Resources</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl max-w-3xl mx-auto text-[#F5EDE3]/90 leading-relaxed drop-shadow-md">
              A small, carefully-chosen shortlist of platforms we recommend. Every card is clearly marked. We may earn a commission at no extra cost to you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-xl mb-16 flex flex-col md:flex-row items-center gap-6 text-[#8A9A5B]">
            <div className="p-4 bg-[#FAF7F2] rounded-full text-[#C65A3A]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-lg leading-relaxed flex-1">
              <strong className="font-semibold text-[#2C211B]">Affiliate disclosure:</strong> Some cards contain affiliate links. If you buy through a partner link, we may earn a small commission — the price you pay does not change. We only list tools we actually use.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                {RESOURCES.map((r) => (
                  <motion.div key={r.title} variants={fadeInUp} className="group h-full bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4 border border-[#F5EDE3]/50">
                    <AffiliateCard {...r} />
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
                <AdPlaceholder className="rounded-[2rem] overflow-hidden shadow-xl" />
              </motion.div>
            </div>
            
            <aside className="lg:col-span-4">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="sticky top-32">
                <DealLeadForm />
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function DealLeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Hotels",
    message: "I need a short recommendation for Siena or Tuscany. My dates, budget, and travel style are...",
  });
  const [loading, setLoading] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();

    if (!API) {
      trackLeadSubmit({ form_source: "deals_page", delivery_method: "mailto" });
      window.location.href = requestMailto(form);
      toast.info("Opening your email app...");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API, form);
      trackLeadSubmit({ form_source: "deals_page", delivery_method: "backend" });
      toast.success(res.data.message || "Request sent. We will reply soon.");
      setForm({ name: "", email: "", category: "Hotels", message: "" });
    } catch (_) {
      toast.error(`Could not send right now. Please email ${CONTACT_EMAIL}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-[#F5EDE3] bg-white p-8 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-20">
        <Send className="w-24 h-24 text-[#C65A3A]" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">Free advice</p>
          <AIRecommendedBadge />
        </div>
        <h3 className="font-serif text-3xl mt-2 mb-8 text-[#2C211B]">Need a custom recommendation?</h3>
        <form onSubmit={submit} className="space-y-6 relative">
          <label className="block space-y-2">
            <span className={LABEL}>Name</span>
            <input required className={FIELD} value={form.name} onChange={(e) => update("name", e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className={LABEL}>Email</span>
            <input required type="email" className={FIELD} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className={LABEL}>Category</span>
            <select className={FIELD + " cursor-pointer"} value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option>Hotels</option>
              <option>Tours</option>
              <option>Transport</option>
              <option>Insurance</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className={LABEL}>Details</span>
            <textarea required rows={4} className={FIELD + " resize-y"} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </label>
          <button type="submit" disabled={loading} className="w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 mt-4">
            {loading ? "Sending..." : "Request Advice"}
          </button>
        </form>
      </div>
    </div>
  );
}
