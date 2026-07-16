import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import { motion } from "framer-motion";

const DOCS = {
  privacy: {
    title: "Privacy Policy",
    updated: "November 2025",
    intro: "We collect only what we need to run this website and improve our editorial guides. This policy explains what that means in practice.",
    sections: [
      { h: "What we collect", b: "Newsletter signups (email + source page), contact form submissions (name, email, subject, message), and analytics data such as pages viewed, referrer, approximate country, clicks, scroll depth and session behavior. We do not sell personal data. Ever." },
      { h: "Cookies", b: "We use a small set of first-party cookies for functionality and, where you consent, analytics and advertising cookies. See our Cookie Policy for the full list." },
      { h: "Legal bases", b: "We rely on legitimate interest for analytics and consent for advertising cookies. You can withdraw consent at any time via the cookie banner." },
      { h: "Your rights", b: "You can request access, correction, or deletion of your data by emailing contact@affittacameregliarchi.com. We respond within 30 days." },
      { h: "Third parties", b: "We use standard analytics providers including Google Analytics, Microsoft Clarity and Amplitude, and, in the future, Google AdSense for advertising. Any advertising is clearly labeled and content-relevant." },
    ],
  },
  cookie: {
    title: "Cookie Policy",
    updated: "November 2025",
    intro: "This policy explains the cookies used on Archi Travel Guide and how to opt out.",
    sections: [
      { h: "Essential", b: "Required for the site to work — for example, remembering your cookie choice. Cannot be disabled." },
      { h: "Analytics", b: "Used to understand which guides are useful and where readers get stuck, including page views, lead events, clicks, scroll depth, heatmaps and session recordings when enabled." },
      { h: "Advertising", b: "Only set if you accept. Used to show travel-relevant ads that fund independent editorial work. Ads are always labeled 'Advertisement'." },
      { h: "How to opt out", b: "Use the cookie banner to decline non-essential cookies, or clear cookies in your browser settings." },
    ],
  },
  terms: {
    title: "Terms of Use",
    updated: "November 2025",
    intro: "By using Archi Travel Guide you agree to these terms.",
    sections: [
      { h: "Editorial nature", b: "The content on this site is editorial and provided for planning purposes. We check facts diligently, but travel details change — always double-check with official sources before booking." },
      { h: "Affiliate links", b: "Some outbound links are affiliate links. We may earn a commission at no extra cost to you. Editorial decisions remain independent." },
      { h: "Intellectual property", b: "All original text is © Archi Travel Guide. Images used are either licensed or under an appropriate open license." },
      { h: "Liability", b: "We provide guides in good faith. We are not liable for booking issues, weather changes, transport delays, or other trip disruptions." },
    ],
  },
  affiliate: {
    title: "Affiliate Disclosure",
    updated: "November 2025",
    intro: "Independence matters. Here's exactly how affiliate relationships work on Archi Travel Guide.",
    sections: [
      { h: "What is an affiliate link?", b: "A link to a partner site that gives us a small commission if you make a purchase — at no extra cost to you." },
      { h: "How we choose partners", b: "We only recommend platforms we would use ourselves. If a partner underperforms or acts against our readers’ interests, we drop them." },
      { h: "How we label affiliate content", b: "Every commercial card is clearly marked, and includes a disclosure. Article-level affiliate content is disclosed at the top of the piece." },
      { h: "What this doesn't affect", b: "Which destinations we cover, which itineraries we suggest, or what we recommend inside a guide. Editorial decisions are made independently of commercial partners." },
    ],
  },
  editorial: {
    title: "Editorial Policy",
    updated: "November 2025",
    intro: "The rules we hold ourselves to when writing and updating guides.",
    sections: [
      { h: "Human-written", b: "All articles are written by our editorial team, not by AI. We may use AI as a research assistant, but every published sentence is authored by a human." },
      { h: "Fact-checking", b: "Prices, opening hours, transport frequencies and event dates are checked at least twice a year — and on every major update." },
      { h: "Updates", b: "Every article shows an 'Updated' date. Substantial changes trigger a new date; minor typo fixes don’t." },
      { h: "Corrections", b: "If we get something wrong, tell us: contact@affittacameregliarchi.com. We correct promptly and note the change in the article footer." },
      { h: "No paid coverage", b: "We do not accept payment to feature a destination, hotel or restaurant. Affiliate partnerships (see disclosure) never dictate editorial coverage." },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    updated: "November 2025",
    intro: "Travel recommendations are editorial opinions built from published sources and practical experience. Read carefully before relying on any itinerary details.",
    sections: [
      { h: "Information accuracy", b: "We make every effort to keep opening hours, prices, routes, and transport details current. Timetables and availability can change before you travel." },
      { h: "Booking choices", b: "We provide references and contacts. Confirm details directly with providers before booking or planning an activity." },
      { h: "Liability", b: "We are not liable for delays, weather disruption, roadworks, closures, or booking errors outside our control." },
      { h: "Affiliate content", b: "Some links may generate a commission at no extra cost to you. This does not affect editorial recommendations." },
      { h: "Local advice", b: "Always follow official local signage and regulations when travelling in unfamiliar areas." },
    ],
  },
};

export default function Legal({ doc }) {
  const d = DOCS[doc];
  const path = doc === 'privacy' ? '/privacy-policy'
    : doc === 'cookie' ? '/cookie-policy'
    : doc === 'terms' ? '/terms-of-service'
    : doc === 'affiliate' ? '/affiliate-disclosure'
    : doc === 'disclaimer' ? '/disclaimer'
    : '/editorial-policy';

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
        title={d.title}
        description={d.intro}
        path={path}
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: d.title }])}
      />
      
      {/* 4D Header */}
      <section className="relative py-32 bg-[#2C211B] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-[#2C211B] z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: d.title }]} />
            </motion.div>
            <motion.p variants={fadeInUp} className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-4">
              Legal · Updated {d.updated}
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif leading-[1] mb-8 drop-shadow-xl">
              {d.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] mb-10 drop-shadow-md font-light leading-relaxed">
              {d.intro}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF7F2] relative z-30">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-8">
            {d.sections.map((s) => (
              <motion.div key={s.h} variants={fadeInUp} className="rounded-[2rem] border border-[#F5EDE3] bg-white p-10 shadow-lg hover:shadow-xl transition-shadow duration-500">
                <h2 className="font-serif text-3xl mb-4 text-[#2C211B]">{s.h}</h2>
                <p className="text-lg text-[#8A9A5B] leading-relaxed">{s.b}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
