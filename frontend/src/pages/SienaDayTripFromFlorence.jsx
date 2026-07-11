import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import RecommendedTravelResources from "@/components/common/RecommendedTravelResources";
import SEO from "@/components/common/SEO";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import guide from "@/data/sienaDayTripFromFlorenceGuide.json";

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

  return (
    <article>
      <SEO
        title={guide.seoTitle}
        titleTemplate="exact"
        description={guide.metaDescription}
        path={guide.canonicalPath}
        image={imageUrl}
        type="article"
        articleMeta={{
          published: guide.datePublished,
          modified: guide.dateModified,
          section: guide.category,
          tags: [guide.region, guide.category, guide.primaryKeyword],
        }}
        schema={schemas}
      />

      <div className="container-editorial pt-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <header className="container-editorial max-w-4xl pt-8 pb-4">
        <p className="overline">{guide.category}</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {guide.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[hsl(var(--charcoal-soft))]">
          {guide.excerpt}
        </p>
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
