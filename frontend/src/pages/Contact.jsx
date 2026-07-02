import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { CONTACT } from "@/constants/testIds";
import { Mail } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SEL = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const LABEL = "text-sm font-medium text-[hsl(var(--charcoal))]";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/contact`, form);
      toast.success(res.data.message || "Thanks — message sent.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (_) {
      toast.error("Couldn't send your message. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <SEO
        title="Contact Archi Travel Guide"
        description="Editorial questions, partnership requests, corrections. Reach the Archi Travel Guide team — we respond in 2–3 business days."
        path="/contact"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Contact' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
          <p className="overline mt-6">Contact</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">Say hello.</h1>
          <p className="mt-5 max-w-2xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Editorial questions, partnership requests, corrections — we read every message. Response time is typically 2–3 business days.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={submit} data-testid={CONTACT.form} className="lg:col-span-8 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-1.5"><span className={LABEL}>Name</span>
                <input required data-testid={CONTACT.name} className={SEL} value={form.name} onChange={(e) => upd("name", e.target.value)} />
              </label>
              <label className="space-y-1.5"><span className={LABEL}>Email</span>
                <input required type="email" data-testid={CONTACT.email} className={SEL} value={form.email} onChange={(e) => upd("email", e.target.value)} />
              </label>
            </div>
            <label className="space-y-1.5 block"><span className={LABEL}>Subject</span>
              <input required data-testid={CONTACT.subject} className={SEL} value={form.subject} onChange={(e) => upd("subject", e.target.value)} />
            </label>
            <label className="space-y-1.5 block"><span className={LABEL}>Message</span>
              <textarea required rows={7} data-testid={CONTACT.message} className={SEL + " resize-y"} value={form.message} onChange={(e) => upd("message", e.target.value)} />
            </label>
            <button type="submit" data-testid={CONTACT.submit} className="btn-primary" disabled={loading}>
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6">
              <div className="w-11 h-11 rounded-full bg-[hsl(var(--terracotta))] text-[hsl(var(--ivory))] grid place-items-center mb-4"><Mail className="w-5 h-5" /></div>
              <p className="overline">Direct email</p>
              <p className="mt-2 font-serif text-2xl">hello@archi.travel</p>
              <p className="text-sm text-[hsl(var(--charcoal-soft))] mt-2">For editorial pitches, corrections and general enquiries.</p>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--stone-border))] p-6">
              <p className="overline">Partnerships</p>
              <p className="mt-2 text-sm text-[hsl(var(--charcoal))]/85 leading-relaxed">
                We work with a small number of vetted travel partners each year. Editorial independence is non-negotiable.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
