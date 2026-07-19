import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { trackLeadSubmit } from "@/lib/analytics";
import { Send, Filter, ExternalLink } from "lucide-react";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

// Booking platforms we point readers to. We have no commercial relationship
// with any of them, so nothing here claims a price, a discount, or a specific
// product — only what the platform itself does. Prices change constantly and
// none of these were verified, so none are stated.
const PLATFORMS = [
  {
    id: "booking",
    name: "Booking.com",
    category: "Accommodation",
    link: "/go/booking",
    description: "Hotels, B&Bs, agriturismi and apartments across Tuscany. Filter by area first, then check the property's own site — direct rates and cancellation terms sometimes differ from the listing.",
  },
  {
    id: "getyourguide",
    name: "GetYourGuide",
    category: "Tours and tickets",
    link: "/go/getyourguide",
    description: "Guided walks, day trips and timed-entry tickets. Listings are run by independent operators, so read the operator name, group size and cancellation window before booking.",
  },
  {
    id: "omio",
    name: "Omio",
    category: "Transport",
    link: "/go/omio",
    description: "Compares trains, buses and coaches across operators, including Florence to Siena. Confirm times against the operator's own timetable — regional services change on Sundays and holidays.",
  },
  {
    id: "airalo",
    name: "Airalo",
    category: "Connectivity",
    link: "/go/airalo",
    description: "Prepaid eSIM data plans covering Italy and the wider EU. Check your handset supports eSIM and is carrier-unlocked before buying, as plans are not refundable once installed.",
  },
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

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Travel recommendation request")}&body=${encodeURIComponent(body)}`;
};

export default function TravelDeals() {
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(PLATFORMS.map(p => p.category)))];

  const filteredPlatforms = useMemo(() => {
    if (filterCategory === "All") return PLATFORMS;
    return PLATFORMS.filter(p => p.category === filterCategory);
  }, [filterCategory]);

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
        title="Booking Platforms We Point Readers To"
        description="The booking platforms we point readers to for Tuscany travel. We have no affiliate relationship with any of them and earn nothing from these links."
        path="/travel-deals"
        noindex
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Booking Platforms' }])}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-[#2C211B] text-white">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80" alt="" loading="eager" className="w-full h-full object-cover opacity-50" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Booking Platforms" }]} />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-6 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Booking <span className="text-[#8A9A5B]">Platforms</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] drop-shadow-md font-light leading-relaxed max-w-3xl mx-auto">
              The platforms we point readers to for Tuscany travel. We have no commercial relationship with any of them, and we earn nothing if you book.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative z-30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <Filter className="w-6 h-6 text-[#C65A3A]" />
                 <span className="font-serif text-2xl text-[#2C211B]">Filter by type</span>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 <select
                   className={FIELD + " cursor-pointer !py-3 !w-full sm:!w-48"}
                   value={filterCategory}
                   onChange={(e) => setFilterCategory(e.target.value)}
                 >
                   {categories.map(c => <option key={c} value={c}>{c === "All" ? "All types" : c}</option>)}
                 </select>
               </div>
            </motion.div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <AnimatePresence>
                {filteredPlatforms.map((platform) => (
                  <motion.div
                    key={platform.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border border-[#F5EDE3]/50"
                  >
                    <div className="p-8 flex flex-col flex-1">
                      <span className="self-start bg-[#FAF7F2] text-[#8A9A5B] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#F5EDE3] mb-5">
                        {platform.category}
                      </span>
                      <h3 className="font-serif text-2xl text-[#2C211B] mb-3 leading-tight">{platform.name}</h3>
                      <p className="text-sm text-[#8A9A5B] leading-relaxed mb-6 flex-1">
                        {platform.description}
                      </p>
                      <a
                        href={platform.link}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] text-[#C65A3A] group-hover:bg-[#C65A3A] group-hover:text-white border border-[#F5EDE3] px-6 py-4 rounded-xl font-semibold transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit {platform.name}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredPlatforms.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-[#8A9A5B] font-serif italic">No platforms of this type are listed.</p>
                <button onClick={() => setFilterCategory("All")} className="mt-4 text-[#C65A3A] font-semibold hover:underline">Clear filter</button>
              </div>
            )}

            <div className="rounded-[2rem] border border-[#F5EDE3] bg-white p-8 shadow-sm mb-12">
              <h2 className="font-serif text-2xl text-[#2C211B] mb-3">How we chose these</h2>
              <p className="text-sm text-[#8A9A5B] leading-relaxed">
                These are the platforms we use ourselves when planning Tuscany travel. We are not affiliated with any of
                them, we are not paid to list them, and the links above carry no tracking or affiliate parameters — so we
                earn nothing whether you book or not. Nothing on this page states a price, because prices on these
                platforms change constantly and we have not verified any. Check the current price and the cancellation
                terms on the platform itself before you book.
              </p>
            </div>

            <AdPlaceholder className="rounded-[2rem] overflow-hidden shadow-xl" />
          </div>
          
          <aside className="lg:col-span-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="sticky top-32">
              <DealLeadForm />
            </motion.div>
          </aside>
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
        <h3 className="font-serif text-3xl mt-2 mb-8 text-[#2C211B]">Need a recommendation?</h3>
        <p className="text-[#8A9A5B] mb-6 leading-relaxed text-sm">Tell us your dates, budget and travel style, and we will reply with suggestions. We have no commercial relationship with any platform we might mention, and nothing we suggest earns us a commission.</p>
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
          <button type="submit" disabled={loading} className="w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 mt-4">
            {loading ? "Sending..." : "Send request"}
          </button>
        </form>
      </div>
    </div>
  );
}
