import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema, articleSchema, faqSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import { trackAffiliateClick } from "@/lib/analytics";
import guide from "@/data/florenceToSienaGuide.json";

const breadcrumbs = [
  { label: "Home", to: "/" },
  { label: "Tuscany Travel Guide", to: "/tuscany-travel-guide" },
  { label: "Florence to Siena by Train or Bus" },
];

const partnerDestinationType = {
  Trainline: "rail",
  Omio: "transport",
  GetYourGuide: "tour",
  Viator: "tour",
  "Booking.com": "accommodation",
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function partnerForHref(href) {
  if (!href?.startsWith("http")) return "";

  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    const match = Object.entries(guide.partnerHosts).find(([domain]) => host === domain || host.endsWith(`.${domain}`));
    return match?.[1] || "";
  } catch (_) {
    return "";
  }
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
  const lines = markdown.split(/\n/);
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
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim(), id: slugify(heading[2]) });
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
        rows: rowLines.map(splitTableLine),
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

function renderInline(text, position) {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const label = match[1] || match[3];
    const href = match[2] || match[3];
    const partner = partnerForHref(href);
    const isExternal = href.startsWith("http");

    if (isExternal) {
      parts.push(
        <a
          key={`${position}-${match.index}`}
          href={href}
          target="_blank"
          rel={partner ? "sponsored noopener noreferrer" : "noopener noreferrer"}
          onClick={() => {
            if (!partner) return;
            trackAffiliateClick({
              affiliate_partner: partner,
              article_slug: guide.slug,
              link_position: position,
              destination_type: partnerDestinationType[partner] || "partner",
            });
          }}
        >
          {label}
        </a>
      );
    } else {
      parts.push(
        <Link key={`${position}-${match.index}`} to={href}>
          {label}
        </Link>
      );
    }

    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function MarkdownBlocks({ markdown, className = "", skipHeading = "" }) {
  const blocks = parseMarkdown(markdown);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading" && block.text === skipHeading) return null;

        if (block.type === "heading") {
          const Heading = `h${block.level}`;
          return (
            <Heading key={`${block.id}-${index}`} id={block.level <= 3 ? block.id : undefined} className={block.level <= 3 ? "scroll-mt-28" : undefined}>
              {block.text}
            </Heading>
          );
        }

        if (block.type === "table") {
          return (
            <div key={`table-${index}`} className="longform-table-wrap">
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`}>{renderInline(cell, `table-${rowIndex}-${cellIndex}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }

        return <p key={`p-${index}`}>{renderInline(block.text, `paragraph-${index}`)}</p>;
      })}
    </div>
  );
}

function tocItems(markdown) {
  return parseMarkdown(markdown)
    .filter((block) => block.type === "heading" && block.level === 2)
    .map((block) => ({ id: block.id, label: block.text }));
}

export default function FlorenceToSienaGuide() {
  useEffect(() => {
    document.getElementById("static-fallback")?.remove();
  }, []);

  const url = canonical(guide.canonicalPath);
  const heroUrl = canonical(guide.hero.src);
  const faqItems = guide.faq.map((item) => ({ q: item.question, a: item.answer }));
  const schemas = [
    breadcrumbSchema(breadcrumbs),
    articleSchema({
      title: guide.title,
      description: guide.metaDescription,
      image: heroUrl,
      url,
      published: guide.datePublished,
      modified: guide.dateModified,
      author: guide.author,
      category: guide.category,
    }),
    faqSchema(faqItems),
  ];
  const items = tocItems(guide.bodyMarkdown);

  return (
    <article className="longform-article">
      <SEO
        title={guide.seoTitle}
        titleTemplate="exact"
        description={guide.metaDescription}
        path={guide.canonicalPath}
        image={heroUrl}
        type="article"
        articleMeta={{ published: guide.datePublished, modified: guide.dateModified, section: guide.category, tags: [guide.region, guide.category] }}
        schema={schemas}
      />

      <div className="container-editorial pt-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <header className="longform-header container-reading pt-8 pb-6">
        <p className="overline">{guide.category}</p>
        <h1>{guide.title}</h1>
        <div className="longform-intro">
          <MarkdownBlocks markdown={guide.introMarkdown} />
        </div>
        <dl className="longform-meta">
          <div>
            <dt>Author</dt>
            <dd>
              <Link to={guide.author.url}>{guide.author.name}</Link>
            </dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>July 14, 2026</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>July 14, 2026</dd>
          </div>
          <div>
            <dt>Fact-checked</dt>
            <dd>{guide.factChecked}</dd>
          </div>
        </dl>
      </header>

      <figure className="container-reading longform-hero">
        <img
          src={guide.hero.src}
          alt={guide.hero.alt}
          width={guide.hero.width}
          height={guide.hero.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {(guide.hero.placeholder || guide.hero.credit) && (
          <figcaption>{guide.hero.placeholder ? guide.hero.note : guide.hero.credit}</figcaption>
        )}
      </figure>

      <div className="container-reading">
        <section className="longform-callout" aria-labelledby="quick-answer-what-is-the-best-way-from-florence-to-siena">
          <MarkdownBlocks markdown={guide.quickAnswerMarkdown} />
        </section>

        <aside className="longform-disclosure">
          <MarkdownBlocks markdown={guide.disclosureMarkdown} />
        </aside>
      </div>

      <div className="container-editorial longform-layout">
        <aside className="longform-toc" aria-label="Article sections">
          <p className="overline">In this guide</p>
          <ol>
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href="#official-sources">Official sources</a>
            </li>
          </ol>
        </aside>

        <div className="longform-body prose-editorial">
          <MarkdownBlocks markdown={guide.bodyMarkdown} />

          <section id="official-sources" className="longform-sources scroll-mt-28">
            <h2>Official sources</h2>
            <ul>
              {guide.officialSources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.url} <ExternalLink aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="longform-editorial-box">
            <p className="overline">Editorial note</p>
            <h2>{guide.author.name}</h2>
            <p>{guide.author.bio}</p>
            <p>
              We keep source notes visible and separate editorial recommendations from commercial links. Read our{" "}
              <Link to="/editorial-policy">editorial policy</Link> and <Link to="/affiliate-disclosure">affiliate disclosure</Link>.
            </p>
          </section>
        </div>

        <aside className="longform-related">
          <p className="overline">Related planning</p>
          <div>
            {guide.relatedLinks.map((item) => (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
