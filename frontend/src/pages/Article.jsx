import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AuthorCard from "@/components/common/AuthorCard";
import FAQAccordion from "@/components/common/FAQAccordion";
import ArticleCard from "@/components/common/ArticleCard";
import LazyImage from "@/components/common/LazyImage";
import SEO from "@/components/common/SEO";
import ToolCue from "@/components/common/ToolCue";
import SaveGuideButton from "@/components/common/SaveGuideButton";
import { breadcrumbSchema, articleSchema, faqSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import { trackLeadSubmit } from "@/lib/analytics";
import { findPublishedArticle } from "@/lib/publishedArticles";
import { relatedArticles } from "@/lib/relatedArticles";
import imageDimensions from "@/data/imageDimensions.json";
import NotFound from "./NotFound";
import { Send, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

// /go/ slugs whose redirect carries live affiliate tracking. Links to these
// must declare rel="sponsored"; all other /go/ links stay nofollow until the
// programme behind them is approved. Keep in sync with _redirects.
const SPONSORED_GO_SLUGS = new Set([
  "/go/viator",
  "/go/viator-siena-san-gimignano-tour",
  "/go/discovercars",
  "/go/discovercars-italy",
]);

const renderInlineMarkdown = (text, keyPrefix) => {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={`${keyPrefix}-strong-${match.index}`}>{token.slice(2, -2)}</strong>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        // /go/ shortcuts only exist as CDN-level redirects in _redirects, not
        // as SPA routes — a client-side <Link> navigation would land on the
        // 404 page. They need a real browser request, like external links.
        const isInternal = href.startsWith("/") && !href.startsWith("/go/");
        parts.push(
          isInternal ? (
            <Link key={`${keyPrefix}-link-${match.index}`} to={href}>
              {label}
            </Link>
          ) : (
            <a
              key={`${keyPrefix}-link-${match.index}`}
              href={href}
              target="_blank"
              rel={SPONSORED_GO_SLUGS.has(href.split("?")[0]) ? "sponsored noopener noreferrer" : "nofollow noopener noreferrer"}
            >
              {label}
            </a>
          )
        );
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
};

const stripMarkdownDecorators = (text) =>
  text
    .replace(/^\s*[-*]\s+/, "")
    .replace(/^\s*\d+\.\s+/, "")
    .trim();

const renderMarkdownTable = (lines, keyPrefix) => {
  const rows = lines
    .filter((line) => /^\s*\|/.test(line))
    .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));

  if (rows.length < 2) return null;
  const header = rows[0];
  const bodyRows = rows.slice(1).filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));

  return (
    // tabIndex={0} so keyboard users can scroll the overflow-x container
    // when the table is wider than the viewport (WCAG 2.1.1).
    <div key={keyPrefix} tabIndex={0} className="my-6 overflow-x-auto rounded-2xl border border-[hsl(var(--stone-border))]">
      <table className="min-w-full text-sm">
        <thead className="bg-[hsl(var(--ivory-2))]">
          <tr>
            {header.map((cell, index) => (
              <th key={`${keyPrefix}-head-${index}`} className="px-4 py-3 text-left font-semibold text-[hsl(var(--charcoal))]">
                {renderInlineMarkdown(cell, `${keyPrefix}-head-${index}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={`${keyPrefix}-row-${rowIndex}`} className="border-t border-[hsl(var(--stone-border))]">
              {row.map((cell, cellIndex) => (
                <td key={`${keyPrefix}-cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top">
                  {renderInlineMarkdown(cell, `${keyPrefix}-cell-${rowIndex}-${cellIndex}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderArticleBody = (body) => {
  if (!body) return null;

  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, blockIndex) => {
      const keyPrefix = `article-body-${blockIndex}`;
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

      if (block.startsWith("![")) {
        const imageMatch = block.match(/^!\[([^\]]+)\]\(([^)]+)\)(?:\s*\n\s*(.+))?$/s);
        if (imageMatch) {
          const [, alt, src, caption] = imageMatch;
          // Vector diagrams (SVG) must show in full — never crop them to a fixed
          // photo aspect ratio, or labels and the credit line get cut off.
          const isVector = /\.svg(\?|$)/i.test(src);
          const imgClass = isVector
            ? "w-full h-auto rounded-2xl shadow-sm"
            : "w-full rounded-2xl object-cover aspect-[16/9] shadow-sm";
          // Measured width/height reserve the box before the file loads —
          // without them the lazy-loaded SVG diagrams shift the whole page.
          const dims = imageDimensions[src.split("?")[0]];
          return (
            <div key={keyPrefix} className="my-8">
              <img src={src} alt={alt} className={imgClass} loading="lazy" decoding="async" width={dims?.width} height={dims?.height} />
              {caption && (
                <p className="mt-2 text-center text-sm text-[hsl(var(--charcoal-soft))] italic animate-fade-in">
                  {renderInlineMarkdown(caption, `${keyPrefix}-caption`)}
                </p>
              )}
            </div>
          );
        }
      }

      if (lines.length === 1 && /^#{3,4}\s+/.test(lines[0])) {
        return (
          <h3 key={keyPrefix} className="font-serif text-2xl mt-9">
            {lines[0].replace(/^#{3,4}\s+/, "")}
          </h3>
        );
      }

      if (lines.length > 1 && lines.every((line) => /^\s*\|/.test(line))) {
        return renderMarkdownTable(lines, keyPrefix);
      }

      if (lines.length >= 1 && lines.every((line) => /^\s*>/.test(line))) {
        return (
          <blockquote key={keyPrefix}>
            {lines.map((line, index) => (
              <p key={`${keyPrefix}-quote-${index}`}>
                {renderInlineMarkdown(line.replace(/^\s*>\s?/, ""), `${keyPrefix}-quote-${index}`)}
              </p>
            ))}
          </blockquote>
        );
      }

      if (lines.length >= 1 && lines.every((line) => /^\s*[-*]\s+/.test(line))) {
        return (
          <ul key={keyPrefix}>
            {lines.map((line, index) => (
              <li key={`${keyPrefix}-li-${index}`}>
                {renderInlineMarkdown(stripMarkdownDecorators(line), `${keyPrefix}-li-${index}`)}
              </li>
            ))}
          </ul>
        );
      }

      if (lines.length >= 1 && lines.every((line) => /^\s*\d+\.\s+/.test(line))) {
        return (
          <ol key={keyPrefix}>
            {lines.map((line, index) => (
              <li key={`${keyPrefix}-li-${index}`}>
                {renderInlineMarkdown(stripMarkdownDecorators(line), `${keyPrefix}-li-${index}`)}
              </li>
            ))}
          </ol>
        );
      }

      return <p key={keyPrefix}>{renderInlineMarkdown(lines.join(" "), keyPrefix)}</p>;
    });
};

export default function Article({ fixedSlug, canonicalPath }) {
  const { slug: routeSlug } = useParams();
  const slug = fixedSlug || routeSlug;
  // Two-phase load. The 1.4MB article store used to sit on this page's
  // critical path, holding the hero back until the whole chunk arrived —
  // 14s LCP on throttled mobile. The shell (hero, title, excerpt, SEO)
  // renders from the 56KB published index immediately; the store loads as
  // its own async chunk and fills in the body, byline and related reads.
  const indexEntry = findPublishedArticle(slug);
  // On prerendered pages index.js loads the store BEFORE hydrating, so the
  // first client render carries the full body and matches the served DOM.
  const [store, setStore] = useState(() => (typeof window !== "undefined" && window.__ARTICLE_STORE__) || null);
  useEffect(() => {
    if (store) return undefined;
    let live = true;
    import("@/data/articles").then((m) => { if (live) setStore(m); });
    return () => { live = false; };
  }, [store]);
  if (!indexEntry) return <NotFound />;
  const article = store ? store.getArticle(slug) : null;
  if (store && !article) return <NotFound />;
  const shell = article || indexEntry;

  const related = article ? relatedArticles(article, store.articles) : [];
  const monetization = article?.monetization || {};
  const bookingCta = monetization.booking;
  const imageCredit = article?.imageCredit;

  const path = canonicalPath || shell.canonicalPath || `/blog/${shell.slug}`;
  const url = canonical(path);
    const regionTo = shell.region === 'Siena' ? '/siena' : shell.region === 'Tuscany' ? '/tuscany-travel-guide' : shell.region === 'Italy' ? '/tuscany-travel-guide/' : '/blog';
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: shell.region, to: regionTo },
    { label: shell.title },
  ];
  // Article/FAQ schema needs full store fields; the static HTML already
  // serves complete schema to crawlers, so emitting it a beat after
  // hydration costs nothing.
  const schemas = article
    ? [
        breadcrumbSchema(crumbs),
        articleSchema({
          title: article.title,
          description: article.excerpt,
          image: article.image,
          url,
          published: article.published || article.updated,
          modified: article.updated,
          author: article.author,
          category: article.category,
        }),
        ...(article.faqs?.length ? [faqSchema(article.faqs)] : []),
      ]
    : [breadcrumbSchema(crumbs)];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  // false disables framer's entrance pass entirely: prerendered HTML is
  // already at the final state, and animating from hidden would blank the
  // hero the moment JS arrives.
  const entrance = typeof window !== "undefined" && window.__PRERENDERED__ ? false : "hidden";

  return (
    <article className="bg-[#FAF7F2] font-sans min-h-screen">
      <SEO
        title={article?.seoTitle || shell.title}
        description={shell.excerpt}
        path={path}
        image={shell.image || undefined}
        type="article"
        articleMeta={{ published: article?.published || shell.updated, modified: shell.updated, section: shell.category, tags: [shell.region, shell.category] }}
        schema={schemas}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-[#2C211B] text-white">
        {shell.image && (
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* lowercase fetchpriority: React 18 only forwards the lowercase
                form to the DOM. The head preload (generate-static-html.js)
                stays unhinted so the LCP hero carries a single high hint. */}
            <img src={shell.image} alt={article?.imageAlt || shell.title} loading="eager" fetchpriority="high" className="w-full h-full object-cover opacity-60" />
          </motion.div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto">
          <motion.div initial={entrance} animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={crumbs} />
            </motion.div>
            <motion.div variants={fadeInUp} className="mb-4 flex justify-center items-center gap-3">
               <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A5B] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                 {shell.category}
               </span>
               <AIRecommendedBadge />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              {shell.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] drop-shadow-md font-light leading-relaxed max-w-3xl mx-auto">
              {shell.excerpt}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {shell.image && imageCredit && (
          <div className="max-w-5xl mx-auto px-6 mt-4">
            <p className="text-xs leading-relaxed text-[#657143] text-right">
              Photo:{" "}
              {imageCredit.source ? (
                <a href={imageCredit.source} target="_blank" rel="nofollow noopener noreferrer" className="text-[#A84A2E] hover:underline">
                {imageCredit.author}
              </a>
            ) : (
              imageCredit.author
            )}
            {imageCredit.license && (
              <>
                {", "}
                {imageCredit.licenseUrl ? (
                  <a href={imageCredit.licenseUrl} target="_blank" rel="license noopener noreferrer" className="link-terra">
                    {imageCredit.license}
                  </a>
                ) : (
                  imageCredit.license
                )}
              </>
            )}
            {imageCredit.changes ? `. ${imageCredit.changes}` : ""}
          </p>
      </div>
      )}

      {/* Body, byline and related reads arrive with the async store chunk.
          The static fallback already served the full text pre-hydration, so
          this gap is a beat on fast connections, not a blank page. */}
      {!article && (
        <div className="container-editorial mt-12 pb-24" aria-busy="true">
          <p className="text-[hsl(var(--charcoal-soft))]">Loading the full guide…</p>
        </div>
      )}
      {article && (<>
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
            </ol>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-6 order-1 lg:order-2 prose-editorial">

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
              </ol>
            </div>
          </details>

          {article.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-serif">{s.heading}</h2>
              {renderArticleBody(s.body)}
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

        </div>

        {/* Right rail */}
        <aside className="lg:col-span-3 order-3 space-y-6">
          <SaveGuideButton path={path} title={article.title} />
          <AuthorCard author={article.author} updated={article.updated} readMinutes={article.readMinutes} />
          <div className="rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5">
            <p className="overline">Editorial policy</p>
            <p className="text-sm mt-2 text-[hsl(var(--charcoal))]/85 leading-relaxed">
              We update guides when facts change. Article prices, opening hours and transport frequencies
              are checked at least twice a year. <Link to="/editorial-policy" className="link-terra">Read more →</Link>
            </p>
          </div>
          {/* Category-matched tool deep link */}
          <ToolCue category={article.category} />
        </aside>
      </div>

      {/* Related — relevance-scored, see lib/relatedArticles.js */}
      {related.length > 0 && (
        <section className="section-y bg-[hsl(var(--ivory-2))] mt-20" data-testid="related-articles">
          <div className="container-editorial">
            <h2 className="font-serif text-3xl md:text-4xl mb-8">Keep reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => <ArticleCard key={r.slug} article={r} />)}
            </div>
          </div>
        </section>
      )}
      </>)}
    </article>
  );
}

const API = process.env.REACT_APP_N8N_WEBHOOK_URL || (process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api/contact` : null);
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
