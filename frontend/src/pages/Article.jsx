import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AuthorCard from "@/components/common/AuthorCard";
import FAQAccordion from "@/components/common/FAQAccordion";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import LazyImage from "@/components/common/LazyImage";
import AffiliateCard from "@/components/common/AffiliateCard";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema, articleSchema, faqSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import { trackLeadSubmit } from "@/lib/analytics";
import { getArticle, articles } from "@/data/articles";
import NotFound from "./NotFound";
import { Send, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

export default function Article() {
  const { slug } = useParams();
  const article = getArticle(slug);
  if (!article) return <NotFound />;

  const related = articles.filter((a) => a.slug !== slug && (a.region === article.region || a.category === article.category)).slice(0, 3);
  const monetization = article.monetization || {};
  const bookingCta = monetization.booking;
  const affiliateItems = monetization.affiliates || [];

  const path = `/blog/${article.slug}`;
  const url = canonical(path);
  const regionTo = article.region === 'Siena' ? '/siena' : article.region === 'Tuscany' ? '/tuscany' : article.region === 'Italy' ? '/italy' : '/blog';
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: article.region, to: regionTo },
    { label: article.title },
  ];
  const schemas = [
    breadcrumbSchema(crumbs),
    articleSchema({
      title: article.title,
      description: article.excerpt,
      image: article.image,
      url,
      published: article.updated,
      modified: article.updated,
      author: article.author,
      category: article.category,
    }),
    ...(article.faqs?.length ? [faqSchema(article.faqs)] : []),
  ];

  return (
    <article>
      <SEO
        title={article.title}
        description={article.excerpt}
        path={path}
        image={article.image}
        type="article"
        articleMeta={{ published: article.updated, modified: article.updated, section: article.category, tags: [article.region, article.category] }}
        schema={schemas}
      />
      <div className="container-editorial pt-8">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-editorial pt-8 pb-4 max-w-4xl">
        <p className="overline">{article.category}</p>
        <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mt-3">{article.title}</h1>
        <p className="mt-6 text-xl text-[hsl(var(--charcoal-soft))] leading-relaxed max-w-2xl">{article.excerpt}</p>
      </header>

      <div className="container-editorial">
        <LazyImage src={article.image} alt={article.title} ratio="16/9" className="rounded-2xl mt-4" eager />
      </div>

      <div className="container-editorial mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* TOC */}
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <div className="lg:sticky lg:top-28">
            <p className="overline mb-4">In this guide</p>
            <ol className="space-y-2.5 text-sm">
              {article.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))]">
                    {s.heading}
                  </a>
                </li>
              ))}
              {article.faqs.length > 0 && (
                <li><a href="#faq" className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))]">FAQ</a></li>
              )}
              {bookingCta && <li><a href="#booking-cta" className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))]">Booking help</a></li>}
              {affiliateItems.length > 0 && (
                <li><a href="#affiliate-resources" className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))]">Recommended resources</a></li>
              )}
            </ol>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-6 order-1 lg:order-2 prose-editorial">
          <AdPlaceholder className="mb-10" />

          {/* Mobile TOC */}
          <details className="lg:hidden mb-10 group rounded-2xl bg-[hsl(var(--ivory-2))] border border-[hsl(var(--stone-border))] overflow-hidden">
            <summary className="p-5 font-serif text-[1.1rem] font-medium cursor-pointer list-none [&::-webkit-details-marker]:hidden flex justify-between items-center bg-[hsl(var(--ivory))]">
              In this guide
              <ChevronDown className="w-5 h-5 text-[hsl(var(--terracotta))] transition-transform group-open:-rotate-180" />
            </summary>
            <div className="p-5 border-t border-[hsl(var(--stone-border))]">
              <ol className="space-y-3.5 text-[15px]">
                {article.sections.map((s) => (
                  <li key={`mobile-${s.id}`}>
                    <a href={`#${s.id}`} className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))] block">
                      {s.heading}
                    </a>
                  </li>
                ))}
                {article.faqs.length > 0 && (
                  <li><a href="#faq" className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))] block">FAQ</a></li>
                )}
                {bookingCta && <li><a href="#booking-cta" className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))] block">Booking help</a></li>}
                {affiliateItems.length > 0 && (
                  <li><a href="#affiliate-resources" className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))] block">Recommended resources</a></li>
                )}
              </ol>
            </div>
          </details>

          {article.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-serif">{s.heading}</h2>
              {s.body.split("\n\n").map((p, k) => (
                <p key={k}>{p}</p>
              ))}
              {i === Math.floor(article.sections.length / 2) && <AdPlaceholder className="my-10" />}
            </section>
          ))}

          <div className="mt-12 rounded-2xl bg-[hsl(var(--ivory-2))] p-6 border border-[hsl(var(--stone-border))]">
            <p className="overline">Helpful summary</p>
            <h3 className="font-serif text-2xl mt-2 leading-snug">The short version</h3>
            <p className="text-[15px] mt-3 text-[hsl(var(--charcoal))]/85 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {article.faqs.length > 0 && (
          <section id="faq" className="mt-14 scroll-mt-28">
              <p className="overline">Frequently asked</p>
              <h2 className="font-serif mt-2">FAQ</h2>
              <FAQAccordion items={article.faqs} />
            </section>
          )}

          {bookingCta && (
            <section id="booking-cta" className="mt-14 scroll-mt-28">
              <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6">
                <p className="overline">Booking support</p>
                <h2 className="font-serif mt-2">Need a fast recommendation?</h2>
                <p className="mt-3 text-[15px] text-[hsl(var(--charcoal-soft))] leading-relaxed">
                  {bookingCta.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={bookingCta.linkHref || "/contact"}
                    className="inline-flex items-center gap-2 btn-primary"
                  >
                    {bookingCta.linkText || "Contact us"}
                  </Link>
                </div>
                <FastLeadForm
                  sourceTitle={article.title}
                  sourceHint={bookingCta.leadSubjectHint || `Lead: ${article.title}`}
                  sourceSlug={article.slug}
                />
              </div>
            </section>
          )}

          {affiliateItems.length > 0 && (
            <section id="affiliate-resources" className="mt-14">
              <p className="overline">Affiliate resources</p>
              <h2 className="font-serif mt-2">Helpful next-step options</h2>
              <p className="mt-3 text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed">
                Affiliate links are clearly marked and fully optional. If you use them, we may earn a commission at no extra cost.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                {affiliateItems.map((item) => (
                  <AffiliateCard key={`${slug}-${item.title}`} {...item} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-14">
            <AdPlaceholder />
          </div>
        </div>

        {/* Right rail */}
        <aside className="lg:col-span-3 order-3 space-y-6">
          <AuthorCard author={article.author} updated={article.updated} readMinutes={article.readMinutes} />
          <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5">
            <p className="overline">Editorial policy</p>
            <p className="text-sm mt-2 text-[hsl(var(--charcoal))]/85 leading-relaxed">
              We update guides when facts change. Article prices, opening hours and transport frequencies
              are checked at least twice a year. <Link to="/editorial-policy" className="link-terra">Read more →</Link>
            </p>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-y bg-[hsl(var(--ivory-2))] mt-20">
          <div className="container-editorial">
            <h2 className="font-serif text-3xl md:text-4xl mb-8">Keep reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => <ArticleCard key={r.slug} article={r} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api/contact` : null;
const CONTACT_EMAIL = "contact@affittacameregliarchi.com";
const FIELD = "w-full rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-sm focus:border-[hsl(var(--terracotta))] focus:outline-none";
const defaultMessage = (sourceTitle) => sourceTitle
  ? `Hi team — I saw your article "${sourceTitle}". I need quick booking guidance.`
  : "Hi team — I need quick booking guidance for a Siena trip.";

const leadMailto = ({ name, email, subject, message }) => {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

function FastLeadForm({ sourceTitle = "", sourceHint = "", sourceSlug = "" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(defaultMessage(sourceTitle));

  const submit = async (e) => {
    e.preventDefault();
    const subject = sourceHint || "Quick trip lead";

    if (!API) {
      trackLeadSubmit({
        form_source: "article_fast_lead",
        delivery_method: "mailto",
        article_slug: sourceSlug,
      });
      window.location.href = leadMailto({ name, email, subject, message });
      toast.info("Opening your email app with this request prepared.");
      return;
    }

    try {
      await axios.post(API, {
        name,
        email,
        subject,
        message,
      });
      trackLeadSubmit({
        form_source: "article_fast_lead",
        delivery_method: "backend",
        article_slug: sourceSlug,
      });
      toast.success("Lead sent. We will reply within 1–2 business days.");
      setName("");
      setEmail("");
      setMessage(defaultMessage(sourceTitle));
    } catch {
      toast.error(`Couldn't send your request right now. Please email ${CONTACT_EMAIL}.`);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 border border-[hsl(var(--stone-border))] rounded-2xl bg-[hsl(var(--ivory))] p-6">
      <p className="text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed">
        Quick lead form: share your trip idea, dates, and priorities. We will return one practical booking plan.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm space-y-1.5">
          <span className="font-medium">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={FIELD}
            placeholder="Your name"
          />
        </label>
        <label className="text-sm space-y-1.5">
          <span className="font-medium">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={FIELD}
            placeholder="you@email.com"
          />
        </label>
      </div>
      <label className="text-sm space-y-1.5 block">
        <span className="font-medium">Message</span>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${FIELD} resize-y`}
        />
      </label>
      <button type="submit" className="btn-primary">
        <Send className="w-4 h-4" />
        Send fast lead
      </button>
    </form>
  );
}
