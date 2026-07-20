import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import NewsletterForm from "@/components/common/NewsletterForm";
import SEO from "@/components/common/SEO";
import { breadcrumbSchema } from "@/lib/schema";
import AIRecommendedBadge from "@/components/common/AIRecommendedBadge";

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      <SEO
        title="About Archi Travel Guide"
        description="Archi Travel Guide is a new, independent editorial travel platform. Learn how we work, why we started in Italy, and what Archi is and isn't."
        path="/about/"
        schema={breadcrumbSchema([{ label: 'Home', to: '/' }, { label: 'About' }])}
      />
      
      {/* 4D Header */}
      <section className="relative py-32 bg-[#2C211B] text-white overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-[#2C211B] z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-serif mb-6 drop-shadow-xl text-white">
              An independent <span className="text-[#C65A3A]">global</span> travel guide.
            </motion.h1>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={staggerContainer}
            className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#2C211B] prose-p:text-[#8A9A5B] prose-a:text-[#C65A3A] prose-strong:text-[#2C211B]"
          >
            <motion.div variants={fadeInUp} className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-[#F5EDE3] mb-16">
              <p className="text-2xl leading-relaxed text-[#2C211B] font-medium font-serif italic mb-0">
                Archi Travel Guide is a new, independent editorial travel platform. We publish practical planning
                frameworks, itineraries and destination guides for smart travelers, families, digital nomads and
                budget-conscious tourists.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mb-16">
              <h2 className="text-4xl mb-6">Why we started in Italy</h2>
              <p>
                The domain <em>affittacameregliarchi.com</em> has decades of heritage around accommodation and travel in Siena.
                Our team decided to honor that history by making Italy — and specifically Tuscany and Siena — our first editorial pillar.
                From there we expand carefully: Europe next, then Asia.
              </p>
              <p>
                We are not affiliated with, and do not claim to represent, any previous business associated with this domain.
                This is a new brand with independent editorial ownership.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-16 grid md:grid-cols-2 gap-10">
              <div className="bg-[#F5EDE3] p-10 rounded-[2rem]">
                <h2 className="text-3xl mb-4 mt-0">How we work</h2>
                <p className="text-[#2C211B] leading-relaxed">
                  Our guides are written by travelers, checked against local sources, and updated on a visible schedule. We prefer
                  saying "we don't know yet" over publishing thin content.
                </p>
              </div>
              <div className="bg-[#2C211B] text-white p-10 rounded-[2rem]">
                <h2 className="text-3xl mb-4 mt-0 text-white">What Archi is not</h2>
                <ul className="text-[#F5EDE3] space-y-3 pl-4">
                  <li>Not a booking engine. We link to specialists who do that well.</li>
                  <li>Not an AI content farm. Every article is human-written and reviewed.</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
            className="mt-24"
          >
            <div className="rounded-[3rem] bg-white border border-[#F5EDE3] p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <AIRecommendedBadge />
              </div>
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8A9A5B] mb-4">Stay in touch</p>
                <h3 className="font-serif text-4xl md:text-5xl mb-6 text-[#2C211B]">One thoughtful email a month.</h3>
                <p className="text-lg text-[#8A9A5B] mb-10">New guides, seasonal tips, and a small list of things we found that month.</p>
                <NewsletterForm source="about" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
