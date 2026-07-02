import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { HOME_SECTION } from "@/constants/testIds";
import { Mail } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function NewsletterForm({ source = "homepage", compact = false }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/newsletter/subscribe`, { email, source });
      if (res.data.already_subscribed) {
        toast.success("You're already on the list — thank you.");
      } else {
        toast.success("Subscribed. A gentle newsletter, no spam.");
      }
      setEmail("");
    } catch (err) {
      toast.error("Couldn't subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      data-testid={HOME_SECTION.newsletterForm}
      className={compact ? "flex gap-2" : "grid gap-3 sm:grid-cols-[1fr_auto]"}
    >
      <label className="relative block">
        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--charcoal-soft))]" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@your-inbox.com"
          data-testid={HOME_SECTION.newsletterEmail}
          className="w-full rounded-full border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] pl-11 pr-5 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--terracotta))]"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        data-testid={HOME_SECTION.newsletterSubmit}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
