import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { trackLeadSubmit } from "@/lib/analytics";
import { Send, Tag, Filter, CheckCircle2 } from "lucide-react";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const DEALS = [
  {
    id: 1,
    title: "Siena Duomo & City Walking Tour",
    category: "Tours",
    price: "€45",
    destination: "Siena",
    bookingLink: "https://www.getyourguide.com/siena-l323/siena-duomo-and-city-walking-tour-skip-the-line-t402834/?partner_id=XXXXX",
    recommended: true,
    image: "https://images.unsplash.com/photo-1646319514161-8fba0ebc3275?auto=format&fit=crop&w=800&q=80",
    description: "Skip the line at the Duomo and walk the historic center with an expert local guide."
  },
  {
    id: 2,
    title: "Boutique Stay in Val d'Orcia",
    category: "Hotels",
    price: "€150/night",
    destination: "Tuscany",
    bookingLink: "https://www.booking.com/searchresults.html?region=3014&aid=XXXXX",
    recommended: true,
    image: "https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=800&q=80",
    description: "Experience an authentic agriturismo with a complimentary wine tasting."
  },
  {
    id: 3,
    title: "Florence to Siena Express Bus",
    category: "Transport",
    price: "€9",
    destination: "Siena",
    bookingLink: "https://www.omio.com/buses/florence/siena?partner_id=XXXXX",
    recommended: false,
    image: "https://images.unsplash.com/photo-1534445867742-43195f401b6c?auto=format&fit=crop&w=800&q=80",
    description: "Fastest way between the two cities, dropping you directly at the historic center."
  },
  {
    id: 4,
    title: "Chianti Wine Tasting Half-Day",
    category: "Tours",
    price: "€80",
    destination: "Tuscany",
    bookingLink: "https://www.viator.com/tours/Siena/Chianti-Wine-Tasting/d802-12345?pid=XXXXX",
    recommended: true,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    description: "Visit two renowned wineries with local pairings and transport included."
  },
  {
    id: 5,
    title: "Europe eSIM 30 Days (50GB)",
    category: "Connectivity",
    price: "€20",
    destination: "Global",
    bookingLink: "https://airalo.com/europe-esim?ref=XXXXX",
    recommended: true,
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80",
    description: "Instant activation. Stay connected seamlessly across Italy and the EU."
  },
  {
    id: 6,
    title: "Uffizi Gallery Skip-the-Line",
    category: "Tours",
    price: "€25",
    destination: "Florence",
    bookingLink: "https://www.getyourguide.com/florence-l32/uffizi-gallery-ticket-t12345/?partner_id=XXXXX",
    recommended: false,
    image: "https://images.unsplash.com/photo-1541358994356-02e9a66b96e4?auto=format&fit=crop&w=800&q=80",
    description: "Priority entrance to one of the world's most important art collections."
  }
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
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDestination, setFilterDestination] = useState("All");

  const categories = ["All", ...Array.from(new Set(DEALS.map(d => d.category)))];
  const destinations = ["All", ...Array.from(new Set(DEALS.map(d => d.destination)))];

  const filteredDeals = useMemo(() => {
    return DEALS.filter(deal => {
      const matchCategory = filterCategory === "All" || deal.category === filterCategory;
      const matchDestination = filterDestination === "All" || deal.destination === filterDestination;
      return matchCategory && matchDestination;
    });
  }, [filterCategory, filterDestination]);

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
        description="A carefully-chosen shortlist of travel deals for Tuscany. Compare tours, hotels, and transport."
        path="/travel-deals"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Deals & Resources' }])}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-[#2C211B] text-white">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80" alt="Travel Deals Background" loading="eager" className="w-full h-full object-cover opacity-50" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Deals" }]} />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-6 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Travel Deals <span className="text-[#8A9A5B]">& Resources</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] drop-shadow-md font-light leading-relaxed max-w-3xl mx-auto">
              Curated partner discounts for Tuscany, Siena, and beyond. Every card is hand-picked.
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
                 <span className="font-serif text-2xl text-[#2C211B]">Filter Deals</span>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 <select 
                   className={FIELD + " cursor-pointer !py-3 !w-full sm:!w-48"}
                   value={filterCategory}
                   onChange={(e) => setFilterCategory(e.target.value)}
                 >
                   {categories.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
                 </select>
                 <select 
                   className={FIELD + " cursor-pointer !py-3 !w-full sm:!w-48"}
                   value={filterDestination}
                   onChange={(e) => setFilterDestination(e.target.value)}
                 >
                   {destinations.map(c => <option key={c} value={c}>{c === "All" ? "All Destinations" : c}</option>)}
                 </select>
               </div>
            </motion.div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <AnimatePresence>
                {filteredDeals.map((deal) => (
                  <motion.div 
                    key={deal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border border-[#F5EDE3]/50"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#2C211B]/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                          {deal.category}
                        </span>
                      </div>
                      {deal.recommended && (
                        <div className="absolute top-4 right-4">
                          <AIRecommendedBadge />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="text-[#F5EDE3] text-sm font-semibold">{deal.destination}</span>
                        <span className="text-white font-serif text-2xl font-bold drop-shadow-md">{deal.price}</span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="font-serif text-2xl text-[#2C211B] mb-3 leading-tight">{deal.title}</h3>
                      <p className="text-sm text-[#8A9A5B] leading-relaxed mb-6 flex-1">
                        {deal.description}
                      </p>
                      <a 
                        href={deal.bookingLink}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] text-[#C65A3A] group-hover:bg-[#C65A3A] group-hover:text-white border border-[#F5EDE3] px-6 py-4 rounded-xl font-semibold transition-colors shadow-sm"
                      >
                        <Tag className="w-4 h-4" />
                        Claim Deal
                      </a>
                      <p className="text-[10px] text-center text-[#8A9A5B]/60 mt-4 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Partner Affiliate
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredDeals.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-[#8A9A5B] font-serif italic">No deals found for your selected filters.</p>
                <button onClick={() => { setFilterCategory("All"); setFilterDestination("All"); }} className="mt-4 text-[#C65A3A] font-semibold hover:underline">Clear filters</button>
              </div>
            )}
            
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
        <h3 className="font-serif text-3xl mt-2 mb-8 text-[#2C211B]">Need a custom deal?</h3>
        <p className="text-[#8A9A5B] mb-6 leading-relaxed text-sm">Tell us your destination and budget, and we'll send you our top affiliate partners tailored for your trip.</p>
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
            {loading ? "Sending..." : "Request Deals"}
          </button>
        </form>
      </div>
    </div>
  );
}
