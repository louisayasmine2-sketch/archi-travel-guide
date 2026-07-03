import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AffiliateCard from "@/components/common/AffiliateCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { trackLeadSubmit } from "@/lib/analytics";
import { Send } from "lucide-react";

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
const FIELD = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const LABEL = "text-sm font-medium text-[hsl(var(--charcoal))]";

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
  return (
    <div>
      <SEO
        title="Travel Deals & Resources — Curated tools for hotels, tours, eSIM, insurance"
        description="A small, carefully-chosen shortlist of travel platforms Archi recommends for hotels, tours, eSIM, insurance, transport and gear. Clear affiliate disclosure."
        path="/travel-deals"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'Travel Deals & Resources' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel Deals & Resources" }]} />
          <p className="overline mt-6">Curated travel resources</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">Travel Deals & Resources</h1>
          <p className="mt-5 max-w-3xl text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">
            A small, carefully-chosen shortlist of platforms we recommend for hotels, tours, connectivity, insurance,
            transport and gear. Every card is clearly marked. We may earn a commission at no extra cost to you —
            editorial choices remain independent.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial">
          <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6 mb-10">
            <p className="text-sm leading-relaxed">
              <strong className="font-semibold">Affiliate disclosure:</strong> Some cards may contain affiliate links once partner URLs are active.
              If you buy through a live partner link, we may earn a small commission — the price you pay does not change.
              We only list tools we would recommend anyway.
            </p>
          </div>

          <DealLeadForm />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((r) => (
              <AffiliateCard key={r.title} {...r} />
            ))}
          </div>

          <div className="mt-14">
            <AdPlaceholder />
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
      trackLeadSubmit({
        form_source: "travel_deals_request",
        delivery_method: "mailto",
        category: form.category,
      });
      window.location.href = requestMailto(form);
      toast.info("Opening your email app with this request prepared.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API, {
        name: form.name,
        email: form.email,
        subject: `Travel deals request: ${form.category}`,
        message: form.message,
      });
      trackLeadSubmit({
        form_source: "travel_deals_request",
        delivery_method: "backend",
        category: form.category,
      });
      toast.success("Request sent. We will reply with a practical shortlist.");
      setForm({
        name: "",
        email: "",
        category: "Hotels",
        message: "I need a short recommendation for Siena or Tuscany. My dates, budget, and travel style are...",
      });
    } catch {
      toast.error(`We could not send this request right now. Please email ${CONTACT_EMAIL}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-12 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <p className="overline">Fast shortlist</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight">Need one practical recommendation?</h2>
          <p className="mt-3 text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed">
            Send your route, dates and budget. We will point you toward the most useful category first, without pushing a partner link.
          </p>
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className={LABEL}>Name</span>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={FIELD} placeholder="Your name" />
            </label>
            <label className="space-y-1.5">
              <span className={LABEL}>Email</span>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={FIELD} placeholder="you@email.com" />
            </label>
          </div>
          <label className="space-y-1.5 block">
            <span className={LABEL}>What do you need?</span>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className={FIELD}>
              <option>Hotels</option>
              <option>Tours</option>
              <option>Transport</option>
              <option>eSIM</option>
              <option>Insurance</option>
              <option>Gear</option>
            </select>
          </label>
          <label className="space-y-1.5 block">
            <span className={LABEL}>Trip notes</span>
            <textarea required rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${FIELD} resize-y`} />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Send className="w-4 h-4" />
            {loading ? "Sending..." : "Send request"}
          </button>
        </div>
      </div>
    </form>
  );
}
