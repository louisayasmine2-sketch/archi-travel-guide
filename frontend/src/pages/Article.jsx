import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AuthorCard from "@/components/common/AuthorCard";
import FAQAccordion from "@/components/common/FAQAccordion";
import ArticleCard from "@/components/common/ArticleCard";
import LazyImage from "@/components/common/LazyImage";
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
import { motion } from "framer-motion";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

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
        const isInternal = href.startsWith("/");
        parts.push(
          isInternal ? (
            <Link key={`${keyPrefix}-link-${match.index}`} to={href}>
              {label}
            </Link>
          ) : (
            <a key={`${keyPrefix}-link-${match.index}`} href={href} target="_blank" rel="nofollow noopener noreferrer">
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
    <div key={keyPrefix} className="my-6 overflow-x-auto rounded-2xl border border-[hsl(var(--stone-border))]">
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
          return (
            <div key={keyPrefix} className="my-8">
              <img src={src} alt={alt} className="w-full rounded-2xl object-cover aspect-[16/9] shadow-sm" />
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
  const article = getArticle(slug);
  if (!article) return <NotFound />;

  const related = articles.filter((a) => a.slug !== slug && (a.region === article.region || a.category === article.category)).slice(0, 3);
  const monetization = article.monetization || {};
  const bookingCta = monetization.booking;
  const imageCredit = article.imageCredit;

  const path = canonicalPath || article.canonicalPath || `/blog/${article.slug}`;
  const url = canonical(path);
    const regionTo = article.region === 'Siena' ? '/siena' : article.region === 'Tuscany' ? '/tuscany-travel-guide' : article.region === 'Italy' ? '/tuscany-travel-guide/' : '/blog';
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
      published: article.published || article.updated,
      modified: article.updated,
      author: article.author,
      category: article.category,
    }),
    ...(article.faqs?.length ? [faqSchema(article.faqs)] : []),
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <article className="bg-[#FAF7F2] font-sans min-h-screen">
      <SEO
        title={article.seoTitle || article.title}
        description={article.excerpt}
        path={path}
        image={article.image || undefined}
        type="article"
        articleMeta={{ published: article.published || article.updated, modified: article.updated, section: article.category, tags: [article.region, article.category] }}
        schema={schemas}
      />
      
      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-[#2C211B] text-white">
        {article.image && (
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 w-full h-full"
          >
            <img src={article.image} alt={article.imageAlt || article.title} loading="eager" className="w-full h-full object-cover opacity-60" />
          </motion.div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={crumbs} />
            </motion.div>
            <motion.div variants={fadeInUp} className="mb-4 flex justify-center items-center gap-3">
               <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A5B] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                 {article.category}
               </span>
               <AIRecommendedBadge />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              {article.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] drop-shadow-md font-light leading-relaxed max-w-3xl mx-auto">
              {article.excerpt}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {article.image && imageCredit && (
          <div className="max-w-5xl mx-auto px-6 mt-4">
            <p className="text-xs leading-relaxed text-[#8A9A5B] text-right">
              Photo:{" "}
              {imageCredit.source ? (
                <a href={imageCredit.source} target="_blank" rel="nofollow noopener noreferrer" className="text-[#C65A3A] hover:underline">
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
