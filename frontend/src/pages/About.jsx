import Breadcrumbs from "@/components/common/Breadcrumbs";
import NewsletterForm from "@/components/common/NewsletterForm";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";

export default function About() {
  return (
    <div>
      <SEO
        title="About Archi Travel Guide"
        description="Archi Travel Guide is a new, independent editorial travel platform. Learn how we work, why we started in Italy, and what Archi is and isn't."
        path="/about"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'About' }])}
      />
      <section className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial pt-10 pb-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
          <p className="overline mt-6">About</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-none tracking-tight max-w-3xl">
            An independent global travel guide.
          </h1>
        </div>
      </section>

      <section className="section-y">
        <div className="container-editorial max-w-3xl prose-editorial">
          <p className="text-xl leading-relaxed text-[hsl(var(--charcoal-soft))]">
            Archi Travel Guide is a new, independent editorial travel platform. We publish practical planning
            frameworks, itineraries and destination guides for smart travelers, families, digital nomads and
            budget-conscious tourists.
          </p>
          <h2>Why we started in Italy</h2>
          <p>
            The domain <em>affittacameregliarchi.com</em> has decades of heritage around accommodation and travel in Siena.
            Our team decided to honor that history by making Italy — and specifically Tuscany and Siena — our first editorial pillar.
            From there we expand carefully: Europe next, then Asia.
          </p>
          <p>
            We are not affiliated with, and do not claim to represent, any previous business associated with this domain.
            This is a new brand with independent editorial ownership.
          </p>
          <h2>How we work</h2>
          <p>
            Our guides are written by travelers, checked against local sources, and updated on a visible schedule. We prefer
            saying &ldquo;we don&rsquo;t know yet&rdquo; over publishing thin content. When we recommend a partner
            (hotel booking site, insurance provider, etc.), we say so clearly — with a visible affiliate disclosure.
          </p>
          <h2>What Archi is not</h2>
          <ul>
            <li>Not a booking engine. We link to specialists who do that well.</li>
            <li>Not an AI content farm. Every article is human-written and reviewed.</li>
            <li>Not a clickbait blog. Ads are labeled, low-density, and never disguised as navigation.</li>
          </ul>
        </div>

        <div className="container-editorial mt-16">
          <div className="rounded-3xl bg-[hsl(var(--ivory-2))] p-8 md:p-12 max-w-3xl mx-auto">
            <p className="overline">Stay in touch</p>
            <h3 className="font-serif text-3xl mt-2">One thoughtful email a month.</h3>
            <p className="text-[hsl(var(--charcoal-soft))] mt-3">New guides, seasonal tips, and a small list of things we found that month.</p>
            <div className="mt-6 max-w-md"><NewsletterForm source="about" /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
