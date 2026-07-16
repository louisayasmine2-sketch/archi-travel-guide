import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import RecommendedTravelResources from "@/components/common/RecommendedTravelResources";
import SEO from "@/components/common/SEO";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import guide from "@/data/sienaDayTripFromFlorenceGuide.json";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

const breadcrumbs = [
  { label: "Home", to: "/" },
  { label: "Tuscany Travel Guide", to: "/tuscany-travel-guide" },
  { label: "Siena Day Trip from Florence" },
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTableLine(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const text = heading[2].trim();
      blocks.push({ type: "heading", level: heading[1].length, text, id: slugify(text) });
      i += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const [headerLine, ...rowLines] = tableLines;
      blocks.push({
        type: "table",
        headers: splitTableLine(headerLine),
        rows: rowLines
          .map(splitTableLine)
          .filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell))),
      });
      continue;
    }

    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const paragraph = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,4})\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("|")
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderInline(text, keyPrefix = "inline") {
  const internal = text.match(/^\[Internal link:\s*([^\]]+)\]$/);
  if (internal) {
    const label = internal[1].trim();
    const href = guide.linkMap[label] || "/blog";
    return (
      <Link className="article-inline-cta" to={href}>
        Continue reading: {label}
      </Link>
    );
  }

  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
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
      const label = match[2];
      const href = match[3];
      const isExternal = /^https?:\/\//i.test(href);
      parts.push(
        <a
          key={`${keyPrefix}-link-${match.index}`}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {label}
        </a>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function ArticleFigure({ image, eager = false }) {
  if (!image) return null;

  return (
    <figure className="article-image my-8 overflow-hidden rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))]">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className="h-auto w-full object-cover"
      />
      <figcaption className="px-4 py-3 text-xs leading-relaxed text-[hsl(var(--charcoal-soft))]">
        {image.caption} Photo:{" "}
        <a href={image.source} rel="nofollow noopener" target="_blank">
          {image.photographer}
        </a>
        ,{" "}
        <a href={image.licenseUrl} rel="license noopener" target="_blank">
          {image.licenseName}
        </a>
        . {image.adaptation}
      </figcaption>
    </figure>
  );
}

function renderBlock(block, index) {
  if (block.type === "heading") {
    const Tag = block.level === 2 ? "h2" : block.level === 3 ? "h3" : "h4";
    return (
      <section key={block.id} id={block.id} className="scroll-mt-28">
        <Tag>{renderInline(block.text, `heading-${index}`)}</Tag>
        <ArticleFigure image={guide.imagePlacements[block.id]} />
      </section>
    );
  }

  if (block.type === "paragraph") {
    return <p key={index}>{renderInline(block.text, `paragraph-${index}`)}</p>;
  }

  if (block.type === "list") {
    return (
      <ul key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "table") {
    return (
      <div key={index} className="not-prose my-8 overflow-x-auto rounded-2xl border border-[hsl(var(--stone-border))]">
        <table className="w-full min-w-[620px] border-collapse bg-[hsl(var(--ivory))] text-sm">
          <thead>
            <tr>
              {block.headers.map((header) => (
                <th
                  key={header}
                  className="border-b border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] px-4 py-3 text-left font-semibold"
                >
                  {renderInline(header, `table-header-${header}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-b border-[hsl(var(--stone-border))] px-4 py-3 align-top">
                    {renderInline(cell, `table-${rowIndex}-${cellIndex}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

export default function SienaDayTripFromFlorence() {
  const introBlocks = parseMarkdown(guide.introMarkdown);
  const bodyBlocks = parseMarkdown(guide.bodyMarkdown);
  const toc = bodyBlocks.filter((block) => block.type === "heading" && block.level === 2);
  const articleUrl = canonical(guide.canonicalPath);
  const imageUrl = canonical(guide.hero.src);
  const schemas = [
    breadcrumbSchema(breadcrumbs),
    articleSchema({
      title: guide.title,
      description: guide.metaDescription,
      image: imageUrl,
      url: articleUrl,
      published: guide.datePublished,
      modified: guide.dateModified,
      author: guide.author,
      category: guide.category,
    }),
    faqSchema(guide.faqs),
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <article className="longform-article bg-[#FAF7F2] font-sans min-h-screen">
      <SEO
        title={guide.seoTitle}
        titleTemplate="exact"
        description={guide.metaDescription}
        path={guide.canonicalPath}
        image={imageUrl}
        type="article"
        articleMeta={{ published: guide.datePublished, modified: guide.dateModified, section: guide.category, tags: [guide.region, guide.category] }}
        schema={schemas}
      />

      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-[#2C211B] text-white">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={guide.hero.src} alt={guide.hero.alt} loading="eager" className="w-full h-full object-cover opacity-60" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C211B] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 mt-16 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="w-full">
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={breadcrumbs} />
            </motion.div>
            <motion.div variants={fadeInUp} className="mb-4 flex justify-center items-center gap-3">
               <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A5B] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                 {guide.category}
               </span>
               <AIRecommendedBadge />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-8 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              {guide.title}
            </motion.h1>
            <motion.div variants={fadeInUp} className="text-xl md:text-2xl text-[#F5EDE3] drop-shadow-md font-light leading-relaxed max-w-3xl mx-auto">
               {introBlocks.map((block, index) => renderBlock(block, index))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <header className="longform-header container-reading pt-8 pb-6">
        <p className="mt-4 text-sm text-[hsl(var(--charcoal-soft))]">
          Fact checked {guide.factChecked} · Published {new Date(guide.datePublished).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </header>

      <div className="container-editorial max-w-4xl">
        <div className="prose-editorial">
          {introBlocks.map((block, index) => renderBlock(block, index))}
        </div>
        <ArticleFigure image={guide.hero} eager />
      </div>

      <RecommendedTravelResources
        context="siena-day-trip-from-florence"
        title="Useful resources for a Siena day trip"
        intro="Use these after you choose the bus, train, or guided-tour plan. They are practical next steps for timing, tickets, and backup options."
        className="pt-8 pb-10"
      />

      <div className="container-editorial mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <aside className="order-2 lg:order-1 lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="overline mb-4">In this guide</p>
            <ol className="space-y-2.5 text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--terracotta))]">
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="prose-editorial">
            {bodyBlocks.map((block, index) => renderBlock(block, index))}
          </div>

          <section className="mt-12 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-6">
            <p className="overline">Photo credits</p>
            <h2 className="mt-2 font-serif text-3xl">Licensed image credits</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[hsl(var(--charcoal-soft))]">
              {[guide.hero, ...Object.values(guide.imagePlacements)].map((image) => (
                <li key={image.src}>
                  <strong>{image.caption}</strong> Photo:{" "}
                  <a href={image.source} rel="nofollow noopener" target="_blank">
                    {image.photographer}
                  </a>
                  ,{" "}
                  <a href={image.licenseUrl} rel="license noopener" target="_blank">
                    {image.licenseName}
                  </a>
                  . {image.adaptation}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="order-3 hidden lg:col-span-2 lg:block">
          <div className="sticky top-28 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5 text-sm leading-relaxed text-[hsl(var(--charcoal-soft))]">
            <p className="overline">Disclosure</p>
            <p className="mt-3">
              Some outbound links may be affiliate links. Recommendations remain editorial and practical.
            </p>
            <Link className="mt-4 inline-flex items-center gap-2 text-[hsl(var(--terracotta))]" to="/affiliate-disclosure">
              Affiliate disclosure
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
