import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Destinations from "@/pages/Destinations";
import Italy from "@/pages/Italy";
import Tuscany from "@/pages/Tuscany";
import Siena from "@/pages/Siena";
import Europe from "@/pages/Europe";
import Asia from "@/pages/Asia";
import TravelTools from "@/pages/TravelTools";
import TravelDeals from "@/pages/TravelDeals";
import Blog from "@/pages/Blog";
import Article from "@/pages/Article";
import City from "@/pages/City";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";
import BudgetCalculator from "@/pages/tools/BudgetCalculator";
import ItineraryGenerator from "@/pages/tools/ItineraryGenerator";
import AreaFinder from "@/pages/tools/AreaFinder";
import PackingChecklist from "@/pages/tools/PackingChecklist";
import BestTimeToVisit from "@/pages/tools/BestTimeToVisit";
import TransportGuide from "@/pages/tools/TransportGuide";
import LegacyContentPage from "@/pages/legacy/LegacyContentPage";
import HubPage from "@/pages/HubPage";
import { initializeClarity, trackPageView } from "@/lib/analytics";

function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    initializeClarity();
    const pagePath = `${location.pathname}${location.search}`;
    trackPageView(pagePath, document.title);
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <GoogleAnalytics />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/en" element={<HubPage pageKey="en-home" routePath="/en" />} />
            <Route path="/en/" element={<HubPage pageKey="en-home" routePath="/en" />} />
            <Route path="/it" element={<HubPage pageKey="it-home" routePath="/it" />} />
            <Route path="/it/" element={<HubPage pageKey="it-home" routePath="/it" />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/italy" element={<Italy />} />
            <Route path="/tuscany" element={<Tuscany />} />
            <Route path="/siena" element={<Siena />} />
            <Route path="/florence" element={<City slug="florence" />} />
            <Route path="/rome" element={<City slug="rome" />} />
            <Route path="/venice" element={<City slug="venice" />} />
            <Route path="/europe" element={<Europe />} />
            <Route path="/asia" element={<Asia />} />
            <Route path="/travel-tools" element={<TravelTools />} />
            <Route path="/travel-tools/budget-calculator" element={<BudgetCalculator />} />
            <Route path="/travel-tools/itinerary-generator" element={<ItineraryGenerator />} />
            <Route path="/travel-tools/area-finder" element={<AreaFinder />} />
            <Route path="/travel-tools/packing-checklist" element={<PackingChecklist />} />
            <Route path="/travel-tools/best-time-to-visit" element={<BestTimeToVisit />} />
            <Route path="/travel-tools/transport-guide" element={<TransportGuide />} />
            <Route path="/travel-deals" element={<TravelDeals />} />
            <Route path="/blog" element={<Blog />} />
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
            <Route path="/en/rooms-bed-and-breakfast-in-siena.html" element={<LegacyContentPage pageKey="rooms-bed-and-breakfast-in-siena" routePath="/en/rooms-bed-and-breakfast-in-siena.html" />} />
            <Route path="/en/standard-double-room-in-siena.html" element={<LegacyContentPage pageKey="standard-double-room" routePath="/en/standard-double-room-in-siena.html" />} />
            <Route path="/en/superior-double-room-in-siena.html" element={<LegacyContentPage pageKey="superior-double-room" routePath="/en/superior-double-room-in-siena.html" />} />
            <Route path="/it/family-accomodation-per-4-a-siena.html" element={<LegacyContentPage pageKey="family-accommodation" routePath="/it/family-accomodation-per-4-a-siena.html" />} />
            <Route path="/en/gli-archi-bed-and-breakfast-siena.html" element={<LegacyContentPage pageKey="bed-and-breakfast-home" routePath="/en/gli-archi-bed-and-breakfast-siena.html" />} />
            <Route path="/en/services-and-conditions-gli-archi-bad-and-breakfast.html" element={<LegacyContentPage pageKey="services-and-conditions" routePath="/en/services-and-conditions-gli-archi-bad-and-breakfast.html" />} />
            <Route path="/en/holidays-in-siena.html" element={<LegacyContentPage pageKey="holidays-in-siena" routePath="/en/holidays-in-siena.html" />} />
            <Route path="/en/contacts-gli-archi-bed-and-breakfast-siena.html" element={<LegacyContentPage pageKey="contacts" routePath="/en/contacts-gli-archi-bed-and-breakfast-siena.html" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="bottom-right" richColors closeButton />
      </BrowserRouter>
    </div>
  );
}

export default App;
