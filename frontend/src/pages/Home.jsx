import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles, Compass, Wallet, ListChecks, Sun, Bus } from "lucide-react";
import { destinations, travelTools } from "@/data/destinations";
import { articles } from "@/data/articles";
import DestinationCard from "@/components/common/DestinationCard";
import ArticleCard from "@/components/common/ArticleCard";
import ToolCard from "@/components/common/ToolCard";
import NewsletterForm from "@/components/common/NewsletterForm";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import SEO from "@/components/common/SEO";
import { websiteSchema } from "@/lib/schema";
import { ORGANIZATION_JSONLD } from "@/lib/seo";
import { HERO, HOME_SECTION } from "@/constants/testIds";

const HERO_IMG = "https://images.unsplash.com/photo-1761995912965-8f134652fc6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0dXNjYW55JTIwcm9sbGluZyUyMGhpbGxzJTIwc3VucmlzZXxlbnwwfHx8fDE3ODMwMDQ0ODZ8MA&ixlib=rb-4.1.0&q=85";

const TOOL_ICONS = {
  'budget-calculator': Wallet,
  'itinerary-generator': Sparkles,
  'area-finder': MapPin,
  'packing-checklist': ListChecks,
  'best-time-to-visit': Sun,
  'transport-guide': Bus,
};

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const italyFeatured = articles.filter((a) => ['Siena', 'Tuscany', 'Italy'].includes(a.region)).slice(0, 3);
  const globalFeatured = articles.filter((a) => a.region === 'Global' || a.region === 'Europe').slice(0, 3);

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/blog?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div>
      <SEO
        title="Archi Travel Guide — Plan smarter trips around the world"
        titleTemplate="exact"
        description="Independent global travel planning platform. Practical destination guides, itineraries, budget & packing tools. First editorial pillar: Italy, Tuscany, Siena."
        path="/"
        schema={[websiteSchema(), ORGANIZATION_JSONLD]}
      />
      {/* HERO */}
      <section data-testid={HERO.container} className="relative overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Rolling hills of Tuscany at sunrise"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/85 via-[hsl(var(--charcoal))]/45 to-[hsl(var(--charcoal))]/25" />
        <div className="relative container-editorial py-24 lg:py-40 text-[hsl(var(--ivory))]">
          <p className="overline text-[hsl(var(--ivory))]/80 fade-up">Independent · practical · premium</p>
          <h1 data-testid={HERO.title} className="fade-up delay-1 mt-4 font-serif font-medium text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl">
            Plan smarter trips <em className="italic text-[hsl(var(--sand))]">around the world.</em>
          </h1>
          <p className="fade-up delay-2 mt-6 text-lg lg:text-xl leading-relaxed max-w-2xl text-[hsl(var(--ivory))]/85">
            Archi Travel Guide is an independent global travel planning platform.
            Practical destination guides, itinerary tools, area comparisons and honest recommendations —
            starting with our first editorial pillar: Italy, Tuscany, and Siena.
          </p>

          <form onSubmit={onSearch} className="fade-up delay-3 mt-10 max-w-xl">
            <div className="flex items-center gap-2 rounded-full bg-[hsl(var(--ivory))] pl-5 pr-1.5 py-1.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
              <Search className="w-5 h-5 text-[hsl(var(--charcoal-soft))]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a destination or guide — e.g. Siena, budget, packing"
                data-testid={HERO.searchInput}
                aria-label="Search"
                className="flex-1 bg-transparent outline-none text-[15px] text-[hsl(var(--charcoal))] placeholder:text-[hsl(var(--charcoal-soft))]"
              />
              <button data-testid={HERO.searchSubmit} type="submit" className="btn-primary py-2.5 px-5 text-sm">
                Search
              </button>
            </div>
          </form>

          <div className="fade-up delay-4 mt-8 flex flex-wrap gap-3">
            <Link to="/destinations" data-testid={HERO.ctaExplore} className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--ivory))] hover:text-[hsl(var(--sand))]">
              <Compass className="w-4 h-4" /> Explore destinations
            </Link>
            <span className="text-[hsl(var(--ivory))]/40">·</span>
            <Link to="/travel-tools" data-testid={HERO.ctaTools} className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--ivory))] hover:text-[hsl(var(--sand))]">
              <Sparkles className="w-4 h-4" /> Open travel tools
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section data-testid={HOME_SECTION.trust} className="border-b border-[hsl(var(--stone-border))]">
        <div className="container-editorial py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {[
            { t: 'Independent editorial', b: 'No sponsored coverage, no clickbait, no thin AI filler.' },
            { t: 'Updated regularly', b: 'Guides carry a visible update date so you can trust what you read.' },
            { t: 'Built for real planning', b: 'Budget, itinerary and packing tools you can actually use.' },
          ].map((c) => (
            <div key={c.t} className="flex flex-col">
              <p className="overline">{c.t}</p>
              <p className="mt-2 text-[15px] text-[hsl(var(--charcoal))]/85 leading-relaxed">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED — Start with Italy */}
      <section data-testid={HOME_SECTION.featuredItaly} className="section-y">
        <div className="container-editorial">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <p className="overline">Editorial pillar · One</p>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mt-3 max-w-2xl">Start with Italy.</h2>
              <p className="mt-4 max-w-xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Our domain has decades of heritage around Siena. So we begin there — with deep coverage of Italy, Tuscany
                and Siena — before expanding to Europe, Asia and beyond.
              </p>
            </div>
            <Link to="/italy" className="btn-primary self-start">Open the Italy guide</Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DestinationCard
                to="/tuscany"
                name="Tuscany"
                tagline="Signature pillar"
                blurb="Rolling hills, medieval hilltowns and vineyards. Deep coverage of the Val d’Orcia, Chianti and Siena."
                image={destinations.find(d => d.slug === 'tuscany').image}
                size="lg"
                eager
              />
            </div>
            <div className="grid grid-rows-2 gap-6">
              <DestinationCard
                to="/siena"
                name="Siena"
                tagline="Medieval heart"
                image={destinations.find(d => d.slug === 'siena').image}
              />
              <DestinationCard
                to="/italy"
                name="Italy"
                tagline="Country overview"
                image={destinations.find(d => d.slug === 'italy').image}
              />
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl">Featured Italy guides</h3>
              <Link to="/blog" className="link-terra text-sm font-medium">All guides →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {italyFeatured.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement — clearly labeled, low-density */}
      <div className="container-editorial mb-8">
        <AdPlaceholder />
      </div>

      {/* Global destinations grid */}
      <section data-testid={HOME_SECTION.destinationGrid} className="section-y bg-[hsl(var(--ivory-2))]">
        <div className="container-editorial">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <p className="overline">The whole world, eventually</p>
              <h2 className="font-serif text-4xl sm:text-5xl leading-tight mt-3">Where we’re going next.</h2>
              <p className="mt-4 max-w-xl text-[hsl(var(--charcoal-soft))] leading-relaxed">
                We expand carefully. Below is the current editorial map — Europe and Asia are being built out
                across the coming quarters with the same depth we brought to Tuscany.
              </p>
            </div>
            <Link to="/destinations" className="btn-ghost self-start">All destinations</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DestinationCard to="/europe" name="Europe" tagline="Continent · in progress" blurb="France, Spain, Switzerland, Greece and Germany." image={destinations.find(d => d.slug === 'europe').image} />
            <DestinationCard to="/asia" name="Asia" tagline="Continent · queued" blurb="Indonesia, Thailand, Japan and Singapore. Coming soon." image={destinations.find(d => d.slug === 'asia').image} />
          </div>
        </div>
      </section>

      {/* Tools preview */}
      <section data-testid={HOME_SECTION.toolsPreview} className="section-y">
        <div className="container-editorial">
          <div className="max-w-2xl mb-12">
            <p className="overline">Practical planning tools</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight mt-3">Not another blog. A planning workbench.</h2>
            <p className="mt-4 text-[hsl(var(--charcoal-soft))] leading-relaxed">
              Interactive tools we built because we needed them ourselves — no sign-up required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelTools.map((t) => (
              <ToolCard key={t.slug} to={`/travel-tools/${t.slug}`} name={t.name} blurb={t.blurb} icon={TOOL_ICONS[t.slug]} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured global guides */}
      <section data-testid={HOME_SECTION.featuredGuides} className="section-y bg-[hsl(var(--ivory-2))]">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl">Frameworks for any trip</h2>
            <Link to="/blog" className="link-terra text-sm font-medium">All articles →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {globalFeatured.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-y">
        <div className="container-editorial">
          <div className="rounded-3xl bg-[hsl(var(--charcoal))] text-[hsl(var(--ivory))] p-10 md:p-16 grain overflow-hidden">
            <div className="max-w-2xl">
              <p className="overline text-[hsl(var(--ivory))]/70">The Archi Dispatch</p>
              <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">
                One quiet email a month. New guides, seasonal tips, honest recommendations.
              </h2>
              <p className="mt-5 text-[hsl(var(--ivory))]/75 leading-relaxed">
                No affiliate spam. No &lsquo;act now&rsquo; urgency. Just the guides worth reading and a few things we found that month.
              </p>
              <div className="mt-8">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
