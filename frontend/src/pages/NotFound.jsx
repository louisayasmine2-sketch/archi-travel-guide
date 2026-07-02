import { Link } from "react-router-dom";
import SEO from "@/components/common/SEO";

export default function NotFound() {
  return (
    <section className="section-y">
      <SEO title="Page not found" description="This page doesn't exist on Archi Travel Guide." path="/404" noindex />
      <div className="container-editorial max-w-2xl">
        <p className="overline">404 · Off the map</p>
        <h1 className="font-serif text-6xl md:text-7xl leading-none tracking-tight mt-4">
          Not every road is paved.
        </h1>
        <p className="mt-6 text-lg text-[hsl(var(--charcoal-soft))] leading-relaxed">
          The page you were looking for doesn’t exist — or it may have moved as our editorial index grew.
          Try one of these instead:
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">Back home</Link>
          <Link to="/destinations" className="btn-ghost">All destinations</Link>
          <Link to="/blog" className="btn-ghost">Browse the blog</Link>
        </div>
      </div>
    </section>
  );
}
