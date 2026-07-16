import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import SEO from "@/components/common/SEO";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { canonical } from "@/lib/seo";
import cluster from "@/data/sienaContentCluster.json";
import NotFound from "./NotFound";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <article className="siena-cluster-page bg-[#FAF7F2] font-sans min-h-screen">
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

      {/* 4D Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-[#2C211B] text-white">
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={article.hero.src} alt={article.hero.alt} loading="eager" className="w-full h-full object-cover opacity-60" />
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
