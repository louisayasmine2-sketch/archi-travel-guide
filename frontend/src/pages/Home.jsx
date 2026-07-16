import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SEO from "@/components/common/SEO";
import { ORGANIZATION_JSONLD } from "@/lib/seo";

export default function HomePage() {
  const { scrollY } = useScroll();
  
  // Strong Parallax values
  const heroBgY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroTextY = useTransform(scrollY, [0, 1000], [0, 200]);
  const welcomeBgY = useTransform(scrollY, [0, 2500], [0, 350]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#F5EDE3] font-sans overflow-hidden">
      <SEO
        title="Gli Archi — Siena Travel Guide & Accommodation"
        description="Plan your dream Tuscany trip with our interactive travel tools and book your stay at Affittacamere Gli Archi in Siena, Italy."
        path="/"
        schema={ORGANIZATION_JSONLD}
      />

      {/* Hero Section 4D - Intense Depth & Motion */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Layer 1: Parallax Video / Image with Slow Zoom */}
        <motion.div 
          style={{ y: heroBgY }} 
          className="absolute inset-0 w-full h-[130%]"
        >
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            {/* Using a reliable HD stock video URL if supported, otherwise falling back to image */}
            <video 
              autoPlay muted loop playsInline 
              className="w-full h-full object-cover opacity-80"
              poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1920&auto=format&fit=crop"
            >
              <source src="https://cdn.pixabay.com/video/2019/11/12/29080-373307687_large.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
        
        {/* Layer 2: Vignette / Cinematic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#FAF7F2] z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>
        
        {/* Layer 3: Floating Text */}
        <motion.div 
          style={{ y: heroTextY }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6 mt-10"
        >
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-5xl w-full">
            <motion.h1 variants={fadeInUp} className="text-8xl md:text-9xl font-serif leading-[0.9] mb-8 tracking-tighter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
              Plan Your Dream<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5EDE3] to-[#8A9A5B]">Tuscany Trip</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-3xl md:text-4xl text-[#F5EDE3] mb-12 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] font-light">
              Welcome to Gli Archi
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/travel-tools" className="bg-[#C65A3A] hover:bg-[#A84A2E] shadow-[0_0_40px_rgba(198,90,58,0.4)] hover:shadow-[0_0_60px_rgba(198,90,58,0.6)] hover:-translate-y-2 transition-all duration-500 px-14 py-6 rounded-full text-2xl font-semibold backdrop-blur-sm">
                Explore Tools 4D
              </Link>
              <a href="https://beds24.com/booking2.php?propid=215570" target="_blank" rel="noreferrer" className="border-2 border-white/80 bg-white/10 hover:bg-white hover:text-[#2C211B] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-2 transition-all duration-500 px-14 py-6 rounded-full text-2xl font-semibold backdrop-blur-md">
                Book Your Room
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Our Travel Tools 4D Section */}
      <section className="py-32 bg-[#FAF7F2] relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-6xl font-serif text-[#2C211B] mb-4">Our Travel Tools 4D</h2>
            <p className="text-xl text-[#8A9A5B] max-w-2xl mx-auto">Interactive planning tools designed for smart travelers.</p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <motion.div variants={fadeInUp} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">
              <div className="h-72 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552604617-2ba077db3d96?q=80&w=800&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-6 right-6 z-10">
                  <span className="bg-[#C65A3A] text-white text-xs px-4 py-1.5 rounded-full font-bold tracking-widest shadow-lg">NEW</span>
                </div>
                <div className="absolute bottom-6 left-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-serif mb-1 drop-shadow-md">AI Itinerary Builder</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[#8A9A5B] leading-relaxed mb-6">Day-by-day plan yang hidup dengan map interaktif & drag-drop.</p>
                <Link to="/travel-tools" className="inline-flex items-center gap-2 text-[#C65A3A] font-semibold hover:text-[#A84A2E] transition-colors group/link">
                  Coba Sekarang <span className="transform transition-transform group-hover/link:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">
              <div className="h-72 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=800&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-serif mb-1 drop-shadow-md">Budget & Expense</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[#8A9A5B] leading-relaxed mb-6">Hitung estimasi biaya real-time + catat pengeluaran harian perjalanan Anda.</p>
                <Link to="/travel-tools" className="inline-flex items-center gap-2 text-[#C65A3A] font-semibold hover:text-[#A84A2E] transition-colors group/link">
                  Coba Sekarang <span className="transform transition-transform group-hover/link:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">
              <div className="h-72 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-serif mb-1 drop-shadow-md">Smart Packing List</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[#8A9A5B] leading-relaxed mb-6">Ceklis cerdas auto-adjust berdasarkan musim di Tuscany + fitur Download PDF.</p>
                <Link to="/travel-tools" className="inline-flex items-center gap-2 text-[#C65A3A] font-semibold hover:text-[#A84A2E] transition-colors group/link">
                  Coba Sekarang <span className="transform transition-transform group-hover/link:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Welcome to Gli Archi 4D Section */}
      <section className="relative py-40 bg-[#1A1310] text-white overflow-hidden z-20">
        <motion.div 
          style={{ y: welcomeBgY }}
          className="absolute inset-0 bg-cover bg-center opacity-30 h-[130%]" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=1920&auto=format&fit=crop')" }}
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-20 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
            <h2 className="text-7xl font-serif leading-[1.1] mb-8 drop-shadow-xl">Welcome to<br/><span className="text-[#C65A3A]">Gli Archi</span></h2>
            <p className="text-2xl text-[#F5EDE3] max-w-lg mb-12 leading-relaxed opacity-90 drop-shadow-md font-light">
              Tempat sempurna untuk memulai petualangan Tuscany Anda. Kamar nyaman, pemandangan bukit, dan akses mudah ke jantung kota Siena.
            </p>
            <a href="https://beds24.com/booking2.php?propid=215570" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-[#C65A3A] hover:bg-[#A84A2E] shadow-[0_0_30px_rgba(198,90,58,0.3)] hover:shadow-[0_0_50px_rgba(198,90,58,0.6)] text-white px-12 py-6 rounded-full text-xl font-semibold hover:-translate-y-2 transition-all duration-500">
              Book Your Room Now &rarr;
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative perspective-1000"
          >
            <div className="absolute inset-0 border border-white/20 rounded-[3rem] z-10 pointer-events-none"></div>
            <img src="https://images.unsplash.com/photo-1618773928120-2e15dc3ce8aa?q=80&w=800&auto=format&fit=crop" alt="Gli Archi Room" className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]" />
          </motion.div>
        </div>
      </section>

      {/* Destinations in 4D */}
      <section className="py-32 bg-[#FAF7F2] relative z-30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-6xl font-serif text-[#2C211B] mb-4">Destinations in 4D</h2>
            <p className="text-xl text-[#8A9A5B] max-w-2xl mx-auto">Explore the rich history and beauty of Tuscany.</p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-10">
            {/* Siena */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-700 hover:-translate-y-4 block cursor-pointer">
              <Link to="/siena">
                <div className="h-[28rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552604617-2ba077db3d96?q=80&w=800&auto=format&fit=crop')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-700"></div>
                  <div className="absolute bottom-10 left-10 text-white transform transition-transform duration-700 group-hover:-translate-y-4">
                    <h3 className="text-5xl font-serif mb-2 drop-shadow-lg">Siena</h3>
                    <p className="text-[#F5EDE3] text-lg drop-shadow-md font-light opacity-90">The heart of Tuscany</p>
                  </div>
                </div>
                <div className="absolute top-8 right-8 bg-[#C65A3A] text-white text-sm px-6 py-2.5 rounded-full font-bold tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                  Explore
                </div>
              </Link>
            </motion.div>

            {/* Florence */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-700 hover:-translate-y-4 block cursor-pointer">
              <Link to="/florence">
                <div className="h-[28rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543627063-424a1e95690b?q=80&w=800&auto=format&fit=crop')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-700"></div>
                  <div className="absolute bottom-10 left-10 text-white transform transition-transform duration-700 group-hover:-translate-y-4">
                    <h3 className="text-5xl font-serif mb-2 drop-shadow-lg">Florence</h3>
                    <p className="text-[#F5EDE3] text-lg drop-shadow-md font-light opacity-90">Just 1 hour away</p>
                  </div>
                </div>
                <div className="absolute top-8 right-8 bg-[#C65A3A] text-white text-sm px-6 py-2.5 rounded-full font-bold tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                  Explore
                </div>
              </Link>
            </motion.div>

            {/* Tuscany Hilltowns */}
            <motion.div variants={fadeInUp} className="group relative overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-700 hover:-translate-y-4 block cursor-pointer">
              <Link to="/tuscany">
                <div className="h-[28rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-700"></div>
                  <div className="absolute bottom-10 left-10 text-white transform transition-transform duration-700 group-hover:-translate-y-4">
                    <h3 className="text-5xl font-serif mb-2 drop-shadow-lg leading-tight">Tuscany<br/>Hilltowns</h3>
                    <p className="text-[#F5EDE3] text-lg drop-shadow-md font-light opacity-90">San Gimignano & Volterra</p>
                  </div>
                </div>
                <div className="absolute top-8 right-8 bg-[#C65A3A] text-white text-sm px-6 py-2.5 rounded-full font-bold tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                  Explore
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
