import "@/App.css";
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from "react-router-dom";
import { Toaster } from "sonner";

import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import HubPage from "@/pages/HubPage";
import SEO from "@/components/common/SEO";
import { trackPageView } from "@/lib/analytics";

const Destinations = lazy(() => import("@/pages/Destinations"));
const Italy = lazy(() => import("@/pages/Italy"));
const Tuscany = lazy(() => import("@/pages/Tuscany"));
const Siena = lazy(() => import("@/pages/Siena"));
const France = lazy(() => import("@/pages/France"));
const Europe = lazy(() => import("@/pages/Europe"));
const Asia = lazy(() => import("@/pages/Asia"));
const TravelTools = lazy(() => import("@/pages/TravelTools"));
const TravelDeals = lazy(() => import("@/pages/TravelDeals"));
const Blog = lazy(() => import("@/pages/Blog"));
const Article = lazy(() => import("@/pages/Article"));
const SienaDayTripFromFlorence = lazy(() => import("@/pages/SienaDayTripFromFlorence"));
const SienaContentClusterArticle = lazy(() => import("@/pages/SienaContentClusterArticle"));
const City = lazy(() => import("@/pages/City"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const BudgetCalculator = lazy(() => import("@/pages/tools/BudgetCalculator"));
const ItineraryGenerator = lazy(() => import("@/pages/tools/ItineraryGenerator"));
const AreaFinder = lazy(() => import("@/pages/tools/AreaFinder"));
const PackingChecklist = lazy(() => import("@/pages/tools/PackingChecklist"));
const BestTimeToVisit = lazy(() => import("@/pages/tools/BestTimeToVisit"));
const TransportGuide = lazy(() => import("@/pages/tools/TransportGuide"));

function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}`;
    trackPageView(pagePath, document.title);
  }, [location.pathname, location.search]);

  return null;
}

function RouteFallback() {
  return <div className="min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)]" aria-hidden="true" />;
}

function FlorenceToSienaScheduled() {
  return (
    <>
      <SEO
        title="Florence to Siena by Train or Bus"
        titleTemplate="replace"
        description="This Florence to Siena transport guide is scheduled for publication soon. Start with the Siena day trip guide while it is being prepared."
        path="/florence-to-siena-by-train-or-bus"
        noindex
      />
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl flex-col justify-center px-6 py-20 sm:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#a45d49]">Scheduled guide</p>
        <h1 className="font-serif text-4xl leading-tight text-[#24211f] sm:text-5xl">
          Florence to Siena by Train or Bus
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4f4842]">
          This transport guide is queued for publication on July 14, 2026. For today, use the Siena day trip guide
          and main Siena guide while the route article is being prepared.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-[#cf6f57] px-5 py-3 text-sm font-semibold text-white"
            to="/siena-day-trip-from-florence"
          >
            Open today&apos;s Siena article
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-[#d8c3b5] px-5 py-3 text-sm font-semibold text-[#24211f]"
            to="/siena-travel-guide"
          >
            Siena travel guide
          </Link>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <GoogleAnalytics />
        <Layout>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/en" element={<HubPage pageKey="en-home" routePath="/en" />} />
            <Route path="/en/" element={<HubPage pageKey="en-home" routePath="/en" />} />
            <Route path="/it" element={<HubPage pageKey="it-home" routePath="/it" />} />
            <Route path="/it/" element={<HubPage pageKey="it-home" routePath="/it" />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/italy" element={<Italy />} />
            <Route path="/tuscany" element={<Navigate to="/tuscany-travel-guide" replace />} />
            <Route path="/siena" element={<Siena />} />
            <Route path="/tuscany-travel-guide" element={<Tuscany />} />
            <Route path="/tuscany-travel-guide/" element={<Tuscany />} />
            <Route path="/florence-to-siena-by-train-or-bus" element={<Article fixedSlug="florence-to-siena-transport" canonicalPath="/florence-to-siena-by-train-or-bus" />} />
            <Route path="/florence-to-siena-by-train-or-bus/" element={<Article fixedSlug="florence-to-siena-transport" canonicalPath="/florence-to-siena-by-train-or-bus" />} />
            <Route path="/siena-day-trip-from-florence" element={<SienaDayTripFromFlorence />} />
            <Route path="/siena-day-trip-from-florence/" element={<SienaDayTripFromFlorence />} />
            <Route path="/piazza-del-campo-guide" element={<SienaContentClusterArticle slug="piazza-del-campo-guide" />} />
            <Route path="/piazza-del-campo-guide/" element={<SienaContentClusterArticle slug="piazza-del-campo-guide" />} />
            <Route path="/siena-cathedral-guide" element={<SienaContentClusterArticle slug="siena-cathedral-guide" />} />
            <Route path="/siena-cathedral-guide/" element={<SienaContentClusterArticle slug="siena-cathedral-guide" />} />
            <Route path="/torre-del-mangia-guide" element={<SienaContentClusterArticle slug="torre-del-mangia-guide" />} />
            <Route path="/torre-del-mangia-guide/" element={<SienaContentClusterArticle slug="torre-del-mangia-guide" />} />
            <Route path="/siena-contrade-guide" element={<SienaContentClusterArticle slug="siena-contrade-guide" />} />
            <Route path="/siena-contrade-guide/" element={<SienaContentClusterArticle slug="siena-contrade-guide" />} />
            <Route path="/where-to-eat-in-siena" element={<SienaContentClusterArticle slug="where-to-eat-in-siena" />} />
            <Route path="/where-to-eat-in-siena/" element={<SienaContentClusterArticle slug="where-to-eat-in-siena" />} />
            <Route path="/siena-walking-tour" element={<SienaContentClusterArticle slug="siena-walking-tour" />} />
            <Route path="/siena-walking-tour/" element={<SienaContentClusterArticle slug="siena-walking-tour" />} />
            <Route path="/santa-maria-della-scala-siena" element={<SienaContentClusterArticle slug="santa-maria-della-scala-siena" />} />
            <Route path="/santa-maria-della-scala-siena/" element={<SienaContentClusterArticle slug="santa-maria-della-scala-siena" />} />
            <Route path="/one-day-in-siena" element={<SienaContentClusterArticle slug="one-day-in-siena" />} />
            <Route path="/one-day-in-siena/" element={<SienaContentClusterArticle slug="one-day-in-siena" />} />
            <Route path="/things-to-do-in-siena" element={<Article fixedSlug="best-things-to-do-in-siena" canonicalPath="/things-to-do-in-siena" />} />
            <Route path="/things-to-do-in-siena/" element={<Article fixedSlug="best-things-to-do-in-siena" canonicalPath="/things-to-do-in-siena" />} />
            <Route path="/florence" element={<City slug="florence" />} />
            <Route path="/rome" element={<City slug="rome" />} />
            <Route path="/venice" element={<City slug="venice" />} />
            <Route path="/france" element={<France />} />
            <Route path="/paris" element={<City slug="paris" />} />
            <Route path="/europe" element={<Europe />} />
            <Route path="/asia" element={<Asia />} />
            <Route path="/travel-tools" element={<TravelTools />} />
            <Route path="/travel-tools/budget-calculator" element={<Navigate to="/travel-budget-calculator" replace />} />
            <Route path="/travel-budget-calculator" element={<BudgetCalculator />} />
            <Route path="/travel-budget-calculator/" element={<BudgetCalculator />} />
            <Route path="/travel-tools/itinerary-generator" element={<ItineraryGenerator />} />
            <Route path="/travel-tools/area-finder" element={<AreaFinder />} />
            <Route path="/travel-tools/packing-checklist" element={<PackingChecklist />} />
            <Route path="/travel-tools/best-time-to-visit" element={<BestTimeToVisit />} />
            <Route path="/travel-tools/transport-guide" element={<TransportGuide />} />
            <Route path="/travel-deals" element={<TravelDeals />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/siena-day-trip-from-florence" element={<Navigate to="/siena-day-trip-from-florence" replace />} />
            <Route path="/blog/siena-day-trip-from-florence/" element={<Navigate to="/siena-day-trip-from-florence" replace />} />
            <Route path="/blog/florence-to-siena-transport" element={<Navigate to="/florence-to-siena-by-train-or-bus" replace />} />
            <Route path="/blog/florence-to-siena-transport/" element={<Navigate to="/florence-to-siena-by-train-or-bus" replace />} />
            <Route path="/blog/flexible-itinerary" element={<Navigate to="/blog/italy-itinerary-10-days" replace />} />
            <Route path="/blog/flexible-itinerary/" element={<Navigate to="/blog/italy-itinerary-10-days" replace />} />
            <Route path="/blog/choose-area-any-city" element={<Navigate to="/blog/where-to-stay-in-rome" replace />} />
            <Route path="/blog/choose-area-any-city/" element={<Navigate to="/blog/where-to-stay-in-rome" replace />} />
            <Route path="/blog/perfect-3-day-rome-itinerary" element={<Navigate to="/blog/rome-5-day-itinerary" replace />} />
            <Route path="/blog/perfect-3-day-rome-itinerary/" element={<Navigate to="/blog/rome-5-day-itinerary" replace />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/privacy-policy" element={<Legal doc="privacy" />} />
            <Route path="/privacy-policy/" element={<Legal doc="privacy" />} />
            <Route path="/cookie-policy" element={<Legal doc="cookie" />} />
            <Route path="/cookie-policy/" element={<Legal doc="cookie" />} />
            <Route path="/terms-of-use" element={<Legal doc="terms" />} />
            <Route path="/terms-of-use/" element={<Legal doc="terms" />} />
            <Route path="/terms-of-service" element={<Legal doc="terms" />} />
            <Route path="/terms-of-service/" element={<Legal doc="terms" />} />
            <Route path="/affiliate-disclosure" element={<Legal doc="affiliate" />} />
            <Route path="/affiliate-disclosure/" element={<Legal doc="affiliate" />} />
            <Route path="/editorial-policy" element={<Legal doc="editorial" />} />
            <Route path="/editorial-policy/" element={<Legal doc="editorial" />} />
            <Route path="/disclaimer" element={<Legal doc="disclaimer" />} />
            <Route path="/disclaimer/" element={<Legal doc="disclaimer" />} />
            <Route path="/siena-travel-guide" element={<HubPage pageKey="siena-travel-guide" routePath="/siena-travel-guide" />} />
            <Route path="/siena-travel-guide/" element={<HubPage pageKey="siena-travel-guide" routePath="/siena-travel-guide" />} />
            <Route path="/where-to-stay-in-siena" element={<HubPage pageKey="where-to-stay-in-siena" routePath="/where-to-stay-in-siena" />} />
            <Route path="/where-to-stay-in-siena/" element={<HubPage pageKey="where-to-stay-in-siena" routePath="/where-to-stay-in-siena" />} />
            <Route path="/siena-itinerary" element={<HubPage pageKey="siena-itinerary" routePath="/siena-itinerary" />} />
            <Route path="/siena-itinerary/" element={<HubPage pageKey="siena-itinerary" routePath="/siena-itinerary" />} />
            <Route path="/siena-accommodation-guide" element={<HubPage pageKey="siena-accommodation-guide" routePath="/siena-accommodation-guide" />} />
            <Route path="/siena-accommodation-guide/" element={<HubPage pageKey="siena-accommodation-guide" routePath="/siena-accommodation-guide" />} />
            <Route path="/travel-tips" element={<HubPage pageKey="travel-tips" routePath="/travel-tips" />} />
            <Route path="/travel-tips/" element={<HubPage pageKey="travel-tips" routePath="/travel-tips" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </Layout>
        <Toaster position="bottom-right" richColors closeButton />
      </BrowserRouter>
    </div>
  );
}

export default App;
