import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/common/SEO";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Siena', 'Tuscany', 'Where to Stay', 'Getting There', 'Budget Tips', 'Food & Wine'];
  
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);
  const heroRef = useRef(null);

  // 4D Scroll Tracking & Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <SEO 
        title="Travel Blog · Archi Travel Guide" 
        description="Real stories & guides from Siena & Tuscany"
        path="/blog/"
      />

      {/* Progress Bar - Soft */}
      <div className="fixed top-0 left-0 h-[3px] bg-primary/70 z-[9999] transition-all" 
           style={{ width: `${progress}%` }} />

      {/* HERO 4D - SOFT & ELEGANT */}
      <section ref={heroRef} className="relative h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden bg-background">
        {/* Layer Background (soft) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://picsum.photos/id/1015/2000/1200')`,
            transform: `translateY(${scrollY * 0.15}px)`,
            filter: 'brightness(0.85) saturate(0.9)'
          }}
        />
        
        {/* Layer Mid (medium speed) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('https://picsum.photos/id/133/2000/1200')`,
            transform: `translateY(${scrollY * 0.45}px)`,
            filter: 'brightness(0.9)'
          }}
        />

        {/* Layer Foreground (fastest) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://picsum.photos/id/1016/2000/1200')`,
            transform: `translateY(${scrollY * 0.75}px)`,
            filter: 'brightness(0.95)'
          }}
        />

        {/* Gradient Soft Hangat */}
        {/* Mapped to dark mode semantic variables while maintaining the soft feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-primary/15 to-background/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <p className="text-sm tracking-widest mb-3 uppercase opacity-90 drop-shadow-md">Archi Travel Blog</p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-md">
              Real stories & guides<br />from Siena & Tuscany
            </h1>
            
            {/* Numbered 4D Indicator */}
            <div className="flex flex-wrap gap-6 md:gap-8 mt-10 md:mt-12">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-4xl md:text-5xl font-bold text-white/70 drop-shadow-md">01</span>
                <div>
                  <p className="text-sm md:text-lg font-medium drop-shadow-md">Siena</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-4xl md:text-5xl font-bold text-white/70 drop-shadow-md">02</span>
                <div>
                  <p className="text-sm md:text-lg font-medium drop-shadow-md">Tuscany</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-4xl md:text-5xl font-bold text-white/70 drop-shadow-md">03</span>
                <div>
                  <p className="text-sm md:text-lg font-medium drop-shadow-md">Local Tips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-b border-border">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 border rounded-full text-sm font-medium cursor-pointer transition-colors ${
                activeCategory === cat 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-card border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-8">
        {/* MAIN CONTENT */}
        <div className="col-span-12 lg:col-span-8">
          
          {/* Featured 4D */}
          <div className="fade-in mb-12 opacity-0 translate-y-8 transition-all duration-700 [perspective:1000px]">
            <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">Archi’s Pick</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-3">Siena 2026 – Complete 3-Day Local Guide</h2>
            <p className="text-lg text-muted-foreground">Explore the piazzas, authentic cuisine, and the city's best-kept secrets...</p>
            <Link to="/siena-travel-guide" className="inline-flex mt-6 items-center gap-2 text-primary font-medium hover:underline">
              Read More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid 3D Tilt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div 
              className="fade-in group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-border opacity-0 translate-y-8 transition-all duration-500 hover:[transform:rotateX(6deg)_rotateY(6deg)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative">
                <img src="https://picsum.photos/id/1016/600/800" alt="Tuscany" className="w-full h-64 object-cover transition-transform group-hover:scale-105 duration-700" />
                <span className="absolute top-4 left-4 bg-card text-primary text-xs font-bold px-3 py-1 rounded-full">1st</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">Tuscany Road Trip – Best 7-Day Route</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">From Florence to Val d'Orcia, the best villas, and wine tasting with a 4D feel...</p>
                <div className="mt-4 text-xs text-muted-foreground">12 Jul 2026 • 8 min read</div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className="fade-in group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-border opacity-0 translate-y-8 transition-all duration-500 hover:[transform:rotateX(6deg)_rotateY(6deg)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative">
                <img src="https://picsum.photos/id/133/600/800" alt="Siena" className="w-full h-64 object-cover transition-transform group-hover:scale-105 duration-700" />
                <span className="absolute top-4 left-4 bg-card text-primary text-xs font-bold px-3 py-1 rounded-full">2nd</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">Where to Stay in Siena – 12 Best Recommendations</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">From luxury palazzos to cozy local apartments with a 4D feel...</p>
                <div className="mt-4 text-xs text-muted-foreground">11 Jul 2026 • 6 min read</div>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              className="fade-in group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-border opacity-0 translate-y-8 transition-all duration-500 hover:[transform:rotateX(6deg)_rotateY(6deg)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative">
                <img src="https://picsum.photos/id/201/600/800" alt="Food" className="w-full h-64 object-cover transition-transform group-hover:scale-105 duration-700" />
                <span className="absolute top-4 left-4 bg-card text-primary text-xs font-bold px-3 py-1 rounded-full">3rd</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">Tuscany Dining Guide – Don't Miss This</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">The best ristorantes, osterias, and gelato according to locals with a 4D feel...</p>
                <div className="mt-4 text-xs text-muted-foreground">10 Jul 2026 • 5 min read</div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-24 fade-in opacity-0 translate-y-8 transition-all duration-700">
            <h3 className="font-semibold text-xl mb-6">Archi’s Top Picks</h3>
            
            {/* Affiliate Teaser */}
            <div className="bg-card rounded-3xl p-6 mb-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <p className="text-sm font-medium mb-4">Best Siena hotels this month</p>
              <a href="/go/booking" target="_blank" rel="noopener noreferrer nofollow"
                 className="flex items-center justify-between bg-muted hover:bg-primary hover:text-primary-foreground rounded-2xl p-4 transition-colors group">
                <span className="text-primary group-hover:text-primary-foreground font-medium text-sm">Check real-time prices &rarr;</span>
                <span className="text-2xl">🏨</span>
              </a>
            </div>

            {/* Recent */}
            <div className="space-y-6">
              <div className="flex gap-4 items-center group cursor-pointer">
                <img src="https://picsum.photos/id/251/80/80" className="w-20 h-20 rounded-2xl object-cover transition-transform group-hover:scale-105" alt="Train" />
                <div>
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">Florence to Siena by Train – Schedule & Tips</h4>
                  <p className="text-xs text-muted-foreground mt-1">9 Jul 2026</p>
                </div>
              </div>
              <div className="flex gap-4 items-center group cursor-pointer">
                <img src="https://picsum.photos/id/320/80/80" className="w-20 h-20 rounded-2xl object-cover transition-transform group-hover:scale-105" alt="Gelato" />
                <div>
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">10 Best Gelaterias in Florence City Center</h4>
                  <p className="text-xs text-muted-foreground mt-1">5 Jul 2026</p>
                </div>
              </div>
              <div className="flex gap-4 items-center group cursor-pointer">
                <img src="https://picsum.photos/id/400/80/80" className="w-20 h-20 rounded-2xl object-cover transition-transform group-hover:scale-105" alt="Museum" />
                <div>
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">Guide to Buying Uffizi Gallery Tickets Online</h4>
                  <p className="text-xs text-muted-foreground mt-1">2 Jul 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
