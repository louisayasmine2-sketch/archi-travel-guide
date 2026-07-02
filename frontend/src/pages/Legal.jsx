import Breadcrumbs from "@/components/common/Breadcrumbs";

const DOCS = {
  privacy: {
    title: "Privacy Policy",
    updated: "November 2025",
    intro: "We collect only what we need to run this website and improve our editorial guides. This policy explains what that means in practice.",
    sections: [
      { h: "What we collect", b: "Newsletter signups (email + source page), contact form submissions (name, email, subject, message), and anonymous analytics (pages viewed, referrer, approximate country). We do not sell personal data. Ever." },
      { h: "Cookies", b: "We use a small set of first-party cookies for functionality and, where you consent, analytics and advertising cookies. See our Cookie Policy for the full list." },
      { h: "Legal bases", b: "We rely on legitimate interest for analytics and consent for advertising cookies. You can withdraw consent at any time via the cookie banner." },
      { h: "Your rights", b: "You can request access, correction, or deletion of your data by emailing hello@archi.travel. We respond within 30 days." },
      { h: "Third parties", b: "We use standard analytics providers and, in the future, Google AdSense for advertising. Any advertising is clearly labeled and content-relevant." },
    ],
  },
  cookie: {
    title: "Cookie Policy",
    updated: "November 2025",
    intro: "This policy explains the cookies used on Archi Travel Guide and how to opt out.",
    sections: [
      { h: "Essential", b: "Required for the site to work — for example, remembering your cookie choice. Cannot be disabled." },
      { h: "Analytics", b: "Used to understand which guides are useful and where readers get stuck. Anonymised and aggregated." },
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
      { h: "Corrections", b: "If we get something wrong, tell us: hello@archi.travel. We correct promptly and note the change in the article footer." },
      { h: "No paid coverage", b: "We do not accept payment to feature a destination, hotel or restaurant. Affiliate partnerships (see disclosure) never dictate editorial coverage." },
    ],
  },
};

export default function Legal({ doc }) {
  const d = DOCS[doc];
  return (
    <div>
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: d.title }]} />
          <p className="overline mt-6">Legal · Updated {d.updated}</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">{d.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">{d.intro}</p>
        </div>
      </section>
      <section className="section-y">
        <div className="container-reading prose-editorial">
          {d.sections.map((s, i) => (
            <div key={i}>
              <h2>{s.h}</h2>
              <p>{s.b}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
