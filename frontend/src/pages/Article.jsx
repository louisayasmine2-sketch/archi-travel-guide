import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AuthorCard from "@/components/common/AuthorCard";
import FAQAccordion from "@/components/common/FAQAccordion";
import ArticleCard from "@/components/common/ArticleCard";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import LazyImage from "@/components/common/LazyImage";
import { getArticle, articles } from "@/data/articles";
import NotFound from "./NotFound";

export default function Article() {
  const { slug } = useParams();
  const article = getArticle(slug);
  if (!article) return <NotFound />;

  const related = articles.filter((a) => a.slug !== slug && (a.region === article.region || a.category === article.category)).slice(0, 3);

  return (
    <article>
      <div className="container-editorial pt-8">
        <Breadcrumbs items={[
          { label: "Home", to: "/" },
          { label: "Blog", to: "/blog" },
          { label: article.region, to: article.region === 'Siena' ? '/siena' : article.region === 'Tuscany' ? '/tuscany' : article.region === 'Italy' ? '/italy' : '/blog' },
          { label: article.title },
        ]} />
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
            </ol>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-6 order-1 lg:order-2 prose-editorial">
          <AdPlaceholder className="mb-10" />

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
