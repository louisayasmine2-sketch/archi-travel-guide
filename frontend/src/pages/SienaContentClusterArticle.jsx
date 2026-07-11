import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import cluster from "@/data/sienaContentCluster.json";
import NotFound from "./NotFound";

const PREVIEW_SCHEDULED_CONTENT =
  process.env.REACT_APP_SHOW_SCHEDULED_CONTENT === "true";

const publishedRoutes = new Set([
  "/",
  "/siena",
  "/siena-travel-guide",
  "/tuscany-travel-guide",
  "/where-to-stay-in-siena",
  "/things-to-do-in-siena",
  "/siena-day-trip-from-florence",
  "/florence-to-siena-by-train-or-bus",
]);

const articlesByRoute = new Map(cluster.articles.map((article) => [article.route, article]));

function isArticlePublished(article, now = new Date()) {
  return PREVIEW_SCHEDULED_CONTENT || Date.parse(article.publishAtWib) <= now.getTime();
}

function isRoutePublished(href) {
  const target = articlesByRoute.get(href);
  return target ? isArticlePublished(target) : publishedRoutes.has(href);
}

function filterFutureClusterLinks(html) {
  return html.replace(/<a href="(\/[^"]+)"([^>]*)>(.*?)<\/a>/gims, (match, href, attrs, label) => {
    if (!articlesByRoute.has(href) || isRoutePublished(href)) {
      return match;
    }

    return `<span class="scheduled-inline-link">${label}</span>`;
  });
}

function findArticle(slug) {
  return cluster.articles.find((article) => article.slug === slug);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ScheduledArticleNotice({ article }) {
  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Siena Travel Guide", to: "/siena-travel-guide" },
    { label: article.title },
  ];

  return (
    <section className="section-y">
      <SEO
        title={`${article.title} - scheduled`}
        titleTemplate="exact"
        description="This Siena guide is scheduled for publication and is not indexable yet."
        path={article.canonicalPath}
        noindex
      />
      <div className="container-editorial max-w-3xl">
        <Breadcrumbs items={breadcrumbs} />
        <p className="overline mt-10">Scheduled guide</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
          {article.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[hsl(var(--charcoal-soft))]">
          This article is prepared, image-licensed, and scheduled for publication on{" "}
          {formatDate(article.publishAtWib)}. It will become available automatically after
          its assigned launch time.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/siena-travel-guide">
            Back to Siena guide
          </Link>
          <Link className="btn-ghost" to="/tuscany-travel-guide">
            Tuscany guide
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function SienaContentClusterArticle({ slug }) {
  const article = findArticle(slug);

  if (!article) {
    return <NotFound />;
  }

  if (!isArticlePublished(article)) {
    return <ScheduledArticleNotice article={article} />;
  }

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Siena Travel Guide", to: "/siena-travel-guide" },
    { label: article.title },
  ];
  const articleUrl = canonical(article.canonicalPath);
  const imageUrl = canonical(article.hero.ogSrc);
  const visibleRelated = article.relatedLinks.filter((link) => isRoutePublished(link.href)).slice(0, 8);
  const bodyHtml = filterFutureClusterLinks(article.bodyHtml);
  const schemas = [
    breadcrumbSchema(breadcrumbs),
    articleSchema({
      title: article.title,
      description: article.metaDescription,
      image: imageUrl,
      url: articleUrl,
      published: article.datePublished,
      modified: article.dateModified,
      author: article.author,
      category: article.category,
    }),
    ...(article.faqs.length ? [faqSchema(article.faqs)] : []),
  ];

  return (
    <article className="siena-cluster-page">
      <SEO
        title={article.seoTitle}
        titleTemplate="exact"
        description={article.metaDescription}
        path={article.canonicalPath}
        image={imageUrl}
        type="article"
        articleMeta={{
          published: article.datePublished,
          modified: article.dateModified,
          section: article.category,
          tags: [article.primaryKeyword, ...article.secondaryKeywords],
        }}
        schema={schemas}
      />

      <div className="container-editorial pt-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <header className="container-editorial max-w-4xl pt-8 pb-6">
        <p className="overline">{article.category}</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {article.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[hsl(var(--charcoal-soft))]">
          {article.excerpt}
        </p>
        <p className="mt-4 text-sm text-[hsl(var(--charcoal-soft))]">
          Fact checked {article.factChecked} · Published {formatDate(article.datePublished)}
        </p>
      </header>

      <div className="container-editorial max-w-5xl">
        <figure className="siena-cluster-hero">
          <img
            src={article.hero.src}
            alt={article.hero.alt}
            width={article.hero.width}
            height={article.hero.height}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>
            {article.hero.credit} License:{" "}
            <a href={article.hero.licenseUrl} rel="license noopener" target="_blank">
              {article.hero.license}
            </a>
            . Cropped, resized, and compressed for web.
          </figcaption>
        </figure>
      </div>

      <div className="container-editorial mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <aside className="order-2 lg:order-1 lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="overline mb-4">Siena cluster</p>
            <div className="grid gap-2 text-sm">
              {cluster.articles
                .filter((item) => item.route !== article.route && isArticlePublished(item))
                .map((item) => (
                  <Link
                    key={item.route}
                    to={item.route}
                    className="rounded-xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory))] px-4 py-3 text-[hsl(var(--charcoal-soft))] hover:border-[hsl(var(--terracotta))] hover:text-[hsl(var(--terracotta))]"
                  >
                    {item.title}
                  </Link>
                ))}
            </div>
          </div>
        </aside>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <div
            className="prose-editorial siena-cluster-article"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {visibleRelated.length > 0 && (
            <section className="siena-cluster-related">
              <p className="overline">Keep planning</p>
              <h2>Related Siena guides</h2>
              <div>
                {visibleRelated.map((link) => (
                  <Link key={`${link.href}-${link.label}`} to={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="order-3 hidden lg:col-span-2 lg:block">
          <div className="sticky top-28 rounded-2xl border border-[hsl(var(--stone-border))] bg-[hsl(var(--ivory-2))] p-5 text-sm leading-relaxed text-[hsl(var(--charcoal-soft))]">
            <p className="overline">Accuracy</p>
            <p className="mt-3">
              Operational details were checked on {article.factChecked}. Always confirm
              tickets, hours, and access rules with official sources for your exact date.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

export { isArticlePublished };
