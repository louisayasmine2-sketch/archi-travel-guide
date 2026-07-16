import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SEO from "@/components/common/SEO";
import { ORGANIZATION_JSONLD } from "@/lib/seo";

export default function HomePage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const welcomeBgY = useTransform(scrollY, [0, 2000], [0, 200]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#F5EDE3] font-sans">
      <SEO
        title="Gli Archi — Siena Travel Guide & Accommodation"
        description="Plan your dream Tuscany trip with our interactive travel tools and book your stay at Affittacamere Gli Archi in Siena, Italy."
        path="/"
        schema={ORGANIZATION_JSONLD}
      />

      {/* Hero Section 4D */}
      <section className="relative h-screen overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[120%]">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            {/* Fallback to Pexels Tuscany video */}
            <source src="https://player.vimeo.com/external/498426058.sd.mp4?s=d9ce961bf275ce30501a3cd3da65deef96144577&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-6">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="max-w-4xl"
          >
            <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-serif leading-none mb-6 tracking-tighter drop-shadow-2xl">
              Plan Your Dream<br/>Tuscany Trip
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-3xl md:text-4xl text-[#F5EDE3] mb-10 drop-shadow-lg">
              Welcome to Gli Archi
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 justify-center">
              <Link to="/travel-tools" className="bg-[#C65A3A] hover:bg-[#A84A2E] shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 px-12 py-6 rounded-3xl text-2xl font-semibold">
                Explore Tools 4D
              </Link>
              <a href="https://beds24.com/booking2.php?propid=215570" target="_blank" rel="noreferrer" className="border-2 border-white hover:bg-white hover:text-[#2C211B] shadow-2xl hover:scale-105 transition-all duration-300 px-12 py-6 rounded-3xl text-2xl font-semibold">
                Book Your Room Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Travel Tools 4D Section */}
      <section className="py-24 bg-[#FAF7F2] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-5xl font-serif text-center mb-16 text-[#2C211B]"
          >
            Our Travel Tools 4D
          </motion.h2>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552604617-2ba077db3d96?q=80&w=800&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="bg-[#C65A3A] text-xs px-3 py-1 rounded-full font-bold tracking-wider">NEW</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-serif mb-3 text-[#2C211B]">AI Itinerary Builder</h3>
                <p className="text-[#8A9A5B] leading-relaxed">Day-by-day plan yang hidup dengan map interaktif & drag-drop</p>
                <Link to="/travel-tools" className="mt-6 inline-flex items-center text-[#C65A3A] font-semibold hover:text-[#A84A2E] transition-colors">Coba Sekarang &rarr;</Link>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=800&auto=format&fit=crop')" }}></div>
              <div className="p-8">
                <h3 className="text-3xl font-serif mb-3 text-[#2C211B]">Budget Planner & Expense Tracker</h3>
                <p className="text-[#8A9A5B] leading-relaxed">Hitung biaya real-time + catat pengeluaran harian</p>
                <Link to="/travel-tools" className="mt-6 inline-flex items-center text-[#C65A3A] font-semibold hover:text-[#A84A2E] transition-colors">Coba Sekarang &rarr;</Link>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
              <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop')" }}></div>
              <div className="p-8">
                <h3 className="text-3xl font-serif mb-3 text-[#2C211B]">Smart Packing List</h3>
                <p className="text-[#8A9A5B] leading-relaxed">Auto-adjust berdasarkan musim + Download PDF</p>
                <Link to="/travel-tools" className="mt-6 inline-flex items-center text-[#C65A3A] font-semibold hover:text-[#A84A2E] transition-colors">Coba Sekarang &rarr;</Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Welcome to Gli Archi 4D Section */}
      <section className="relative py-32 bg-[#2C211B] text-white overflow-hidden z-10">
        <motion.div 
          style={{ y: welcomeBgY }}
          className="absolute inset-0 bg-cover bg-center opacity-20 h-[120%]" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=1920&auto=format&fit=crop')" }}
        >
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
            <h2 className="text-6xl font-serif leading-none mb-8">Welcome to<br/>Gli Archi</h2>
            <p className="text-2xl text-[#F5EDE3] max-w-lg mb-10 leading-relaxed opacity-90">
              Tempat sempurna untuk memulai petualangan Tuscany Anda. Kamar nyaman, pemandangan bukit, dan akses mudah ke Siena.
            </p>
            <a href="https://beds24.com/booking2.php?propid=215570" target="_blank" rel="noreferrer" className="inline-block bg-[#C65A3A] hover:bg-[#A84A2E] shadow-xl hover:shadow-2xl text-white px-10 py-5 rounded-3xl text-xl font-semibold hover:-translate-y-1 transition-all duration-300">
              Book Your Room Now &rarr;
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 border border-white/20 rounded-3xl z-10 pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1618773928120-2e15dc3ce8aa?q=80&w=800&auto=format&fit=crop" alt="Gli Archi Room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </motion.div>
        </div>
      </section>

      {/* Destinations in 4D */}
      <section className="py-28 bg-[#FAF7F2] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-5xl font-serif text-center mb-12 text-[#2C211B]"
          >
            Destinations in 4D
          </motion.h2>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Siena */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 block">
              <Link to="/siena">
                <div className="h-80 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552604617-2ba077db3d96?q=80&w=800&auto=format&fit=crop')" }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-4xl font-serif mb-1 drop-shadow-md">Siena</h3>
                    <p className="text-[#F5EDE3] drop-shadow-md">The heart of Tuscany</p>
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-[#C65A3A] text-white text-xs px-4 py-2 rounded-3xl font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore Now
                </div>
              </Link>
            </motion.div>

            {/* Florence */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 block">
              <Link to="/florence">
                <div className="h-80 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543627063-424a1e95690b?q=80&w=800&auto=format&fit=crop')" }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-4xl font-serif mb-1 drop-shadow-md">Florence</h3>
                    <p className="text-[#F5EDE3] drop-shadow-md">Just 1 hour away</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Tuscany Hilltowns */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 block">
              <Link to="/tuscany">
                <div className="h-80 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop')" }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-4xl font-serif mb-1 drop-shadow-md">Tuscany Hilltowns</h3>
                    <p className="text-[#F5EDE3] drop-shadow-md">San Gimignano • Volterra • Montepulciano</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
