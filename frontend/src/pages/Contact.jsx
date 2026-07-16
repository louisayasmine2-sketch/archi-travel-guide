import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { trackContactSubmit } from "@/lib/analytics";
import { CONTACT } from "@/constants/testIds";
import { Mail, MessageSquare } from "lucide-react";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const CONTACT_EMAIL = "contact@affittacameregliarchi.com";
const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api/contact` : null;
const SEL = "w-full rounded-2xl border-2 border-[#F5EDE3] bg-[#FAF7F2] px-5 py-4 text-sm focus:border-[#C65A3A] focus:outline-none transition-all shadow-inner";
const LABEL = "text-sm font-bold text-[#8A9A5B] uppercase tracking-widest mb-2 block";

const contactMailto = ({ name, email, subject, message }) => {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();

    if (!API) {
      trackContactSubmit({ form_source: "contact_page", delivery_method: "mailto" });
      window.location.href = contactMailto(form);
      toast.info("Opening your email app with this message prepared.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API, form);
      trackContactSubmit({ form_source: "contact_page", delivery_method: "backend" });
      toast.success(res.data.message || "Thanks — message sent.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (_) {
      toast.error(`We could not send this form right now. Please email ${CONTACT_EMAIL}.`);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-[#FAF7F2] font-sans overflow-hidden">
      <SEO
        title="Contact Archi Travel Guide"
        description="Editorial questions, partnership requests, corrections. Reach the Archi Travel Guide team — we respond in 2–3 business days."
        path="/contact"
        schema={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Contact" }])}
      />
      
      {/* 4D Header */}
      <section className="relative py-32 bg-[#2C211B] text-white overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520101244084-2ee159937dfc?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-[#2C211B] z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-serif mb-6 drop-shadow-xl text-white">
              Say <span className="text-[#C65A3A]">hello.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl max-w-2xl mx-auto text-[#F5EDE3]/90 leading-relaxed drop-shadow-md">
              Editorial questions, partnership requests, corrections — we read every message. Response time is typically 2–3 business days.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeInUp}
            className="rounded-[3rem] border-2 border-[#F5EDE3] bg-white p-10 md:p-16 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-16"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <MessageSquare className="w-48 h-48 text-[#8A9A5B]" />
            </div>
            
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="font-serif text-4xl text-[#2C211B]">Send a message</h2>
                <AIRecommendedBadge />
              </div>
              <p className="text-lg text-[#8A9A5B] leading-relaxed mb-10">
                Messages are delivered directly to <a className="text-[#C65A3A] font-semibold hover:underline" href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>. 
                If delivery is temporarily unavailable, we will show a clear fallback.
              </p>
              
              <div className="bg-[#FAF7F2] p-8 rounded-[2rem] border border-[#F5EDE3] flex items-center gap-4">
                <Mail className="w-8 h-8 text-[#C65A3A]" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#8A9A5B]">Direct Email</p>
                  <a href={"mailto:" + CONTACT_EMAIL} className="text-[#2C211B] font-serif text-xl hover:text-[#C65A3A] transition-colors">{CONTACT_EMAIL}</a>
                </div>
              </div>
            </div>

            <div className="flex-1 relative z-10">
              <form onSubmit={submit} data-testid={CONTACT.form} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <label>
                    <span className={LABEL}>Name</span>
                    <input required data-testid={CONTACT.name} className={SEL} value={form.name} onChange={(e) => upd("name", e.target.value)} />
                  </label>
                  <label>
                    <span className={LABEL}>Email</span>
                    <input required type="email" data-testid={CONTACT.email} className={SEL} value={form.email} onChange={(e) => upd("email", e.target.value)} />
                  </label>
                </div>
                <label className="block">
                  <span className={LABEL}>Subject</span>
                  <input required data-testid={CONTACT.subject} className={SEL} value={form.subject} onChange={(e) => upd("subject", e.target.value)} />
                </label>
                <label className="block">
                  <span className={LABEL}>Message</span>
                  <textarea required rows={5} data-testid={CONTACT.message} className={SEL + " resize-y"} value={form.message} onChange={(e) => upd("message", e.target.value)} />
                </label>
                <button type="submit" data-testid={CONTACT.submit} className="w-full bg-[#C65A3A] hover:bg-[#A84A2E] text-white px-8 py-5 rounded-2xl text-lg font-semibold shadow-[0_10px_20px_rgba(198,90,58,0.3)] hover:shadow-[0_15px_30px_rgba(198,90,58,0.4)] transition-all duration-300 hover:-translate-y-1 mt-4" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
