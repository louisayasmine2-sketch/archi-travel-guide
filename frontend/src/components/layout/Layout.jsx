import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import OfflineBanner from "./OfflineBanner";
import LanguageSuggestionBanner from "./LanguageSuggestionBanner";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--ivory))] text-[hsl(var(--charcoal))]">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <OfflineBanner />
      <LanguageSuggestionBanner />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
