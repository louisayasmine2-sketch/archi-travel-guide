import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COOKIE } from "@/constants/testIds";
import { initializeAmplitude, initializeClarity, trackPageView } from "@/lib/analytics";

const STORAGE_KEY = "archi_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setTimeout(() => setVisible(true), 800);
    } catch (_) { /* ignore */ }
  }, []);

  const setChoice = (choice) => {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch (_) { /* ignore */ }
    if (choice === "accepted") {
      initializeClarity();
      initializeAmplitude();
      trackPageView(`${window.location.pathname}${window.location.search}`, document.title);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      data-testid={COOKIE.banner}
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-6 md:max-w-md z-50 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] shadow-[0_20px_60px_-20px_rgba(44,44,42,0.35)] p-5 fade-up"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-sm leading-relaxed">
        We use minimal cookies to understand traffic and, where you consent, to serve travel-relevant advertising.
        Read our{" "}
        <Link to="/cookie-policy" className="link-terra">cookie policy</Link>.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          data-testid={COOKIE.accept}
          onClick={() => setChoice("accepted")}
          className="btn-primary py-2 px-4 text-xs"
        >
          Accept
        </button>
        <button
          data-testid={COOKIE.decline}
          onClick={() => setChoice("declined")}
          className="btn-ghost py-2 px-4 text-xs"
        >
          Decline non-essential
        </button>
      </div>
    </div>
  );
}
