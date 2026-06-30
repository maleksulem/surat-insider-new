import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { FluidLandingCursor } from "../components/FluidLandingCursor";
import { SafeImage } from "../components/SafeImage";
import { 
  Sparkles, 
  ArrowLeft, 
  Gift, 
  MapPin, 
  Info, 
  Crown, 
  Heart, 
  Sparkle, 
  CheckCircle,
  Gem,
  Scissors
} from "lucide-react";
import { Role, Inquiry } from "../types";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

interface WeddingPageProps {
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
      addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function WeddingPage({
    currentUserRole,
  setCurrentUserRole,
      addInquiry,
}: WeddingPageProps) {
  // Call Dynamic SEO and Schema markup hook
  useDocumentMetadata({
    title: "Surat Royal Wedding Guide & Sourcing • Bridal Mile Saree Shopping",
    description: "Sourcing guide for royal bridal shopping in Surat. Connect directly with the finest authentic Gaji Silk weavers, Real 24K Silver Zari embroiderers, and premium textile designers.",
    keywords: "Surat Wedding Shopping, Bridal Saree Surat, Ring Road Wholesale, Genuine Zari, Gaji Silk, Surat Lehenga, Surat Designer Saree, Diamond Jewelry Surat",
    ogImage: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    schema: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Surat Bridal Sourcing Experience",
      "description": "Elite procurement map linking luxury bridal shoppers directly with handloom silk weavers, zari makers and jewelry experts.",
      "touristType": "Bridal Shoppers & Designers",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      }
    }
  });

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    brideName: "",
    weddingDate: "",
    textilePreference: "Gaji Silk",
    zariType: "Real 24K Pure Silver thread",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      itemId: "bridal-wedding-portal",
      itemTitle: "Imperial Bridal Court Bespoke Loom Guide",
      itemType: "shopping",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Bespoke Loom Request. Bride: ${formData.brideName}. Date: ${formData.weddingDate}. Preference: ${formData.textilePreference}. Zari wire spec: ${formData.zariType}. Details: ${formData.notes}`,
    });
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        brideName: "",
        weddingDate: "",
        textilePreference: "Gaji Silk",
        zariType: "Real 24K Pure Silver thread",
        notes: ""
      });
    }, 4500);
  };

  const bridalHighlights = [
    {
      title: "Salabatpura Handlooms",
      desc: "Generational weavers producing authentic heavy weaves, specialized in intricate pattern design and custom bridal weights.",
      place: "Salabatpura Textile Hub"
    },
    {
      title: "Gold-Tethered Gaji Silk",
      desc: "Pure mulberry silk with dense, mirror-like satin faces, tailored exclusively with traditional royal crimson brocade weaves.",
      place: "Navsari Loom Estates"
    },
    {
      title: "Genuine 24K Silver Zari Wire",
      desc: "Precious gold-plated silver wiring drawn to sub-human hair thinness, handwoven into classical motifs that never tarnish.",
      place: "Gopipura Guild Workshops"
    }
  ];

  return (
    <div 
      className="relative min-h-screen bg-[#FFFDF5] text-[#1A1614] flex flex-col font-sans selection:bg-[#B8860B]/20 selection:text-[#1A1614] overflow-x-hidden"
    >
      <FluidLandingCursor theme="wedding" />

      {/* Decorative Warm Gold Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#B8860B]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#B8860B]/3 blur-[120px] rounded-full" />
      </div>

      {/* Back Hero CTA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#B8860B] hover:text-[#B8860B]/80 transition-colors text-xs uppercase tracking-widest font-mono font-bold group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Imperial Portal
        </Link>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        
        {/* Immersive Atmospheric Hero */}
        <section className="relative h-[70vh] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-[#B8860B]/10">
          <SafeImage 
            src="https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=2000&auto=format&fit=crop" 
            alt="Surat Royal Bridal"
            fallbackType="shopping"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-6 text-white">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-[0.3em] text-white/90">
                <Crown className="w-3 h-3 text-[#B8860B]" />
                The Wedding Edit
              </span>
              <h1 className="font-serif text-5xl md:text-8xl font-black tracking-tight leading-[0.9]">
                Where Weddings wear <br />
                <span className="text-[#B8860B] italic font-normal">Pure Silver.</span>
              </h1>
              <p className="max-w-xl text-lg text-white/70 font-light leading-relaxed">
                Step into a world where luxury is hand-drawn through ruby dies and woven into mirror-like satin faces by the pre-eminent Salabatpura handlooms.
              </p>
            </motion.div>
          </div>

          {/* Sparkle Overlay */}
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40">
            <div className="absolute top-[20%] left-[30%] animate-pulse"><Sparkle className="text-white w-2 h-2" /></div>
            <div className="absolute top-[60%] left-[70%] animate-pulse delay-700"><Sparkle className="text-white w-3 h-3" /></div>
            <div className="absolute top-[40%] right-[20%] animate-pulse delay-300"><Sparkle className="text-white w-1.5 h-1.5" /></div>
          </div>
        </section>

        {/* Informative Grid of Artisan Specialties */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {bridalHighlights.map((hl, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="group relative bg-white/80 backdrop-blur-xl border border-[#B8860B]/10 rounded-3xl p-8 space-y-6 hover:border-[#B8860B]/40 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_30px_rgb(184,134,11,0.05)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#B8860B]/5 border border-[#B8860B]/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Sparkles className="w-6 h-6 text-[#B8860B]" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold text-[#1A1614] tracking-tight">{hl.title}</h3>
                <p className="text-sm text-[#4A423D] leading-relaxed font-light">{hl.desc}</p>
              </div>
              <div className="pt-4 border-t border-[#B8860B]/10 text-[10px] font-mono text-[#B8860B] flex items-center gap-2 tracking-widest uppercase font-bold">
                <MapPin className="w-3.5 h-3.5" />
                {hl.place}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Dual layout with historical facts and reservation engine */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center px-4">
          
          {/* Secrets of Gopipura guilds */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <h2 className="font-serif text-4xl font-extrabold text-[#1A1614] leading-tight">
                The Sacred Arts of <br />the <span className="text-[#B8860B] italic font-normal">Gopipura Guilds</span>
              </h2>
              <p className="text-base text-[#4A423D] leading-relaxed font-light">
                Real zari is not merely a fiber; it is high metal-craft. Each piece is drawn through ruby dies to attain a sub-human hair diameter of pure silver, then wrap-tethered on silk cores. 
              </p>
            </div>

            <div className="relative overflow-hidden bg-[#1A1614] text-white rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B]/20 blur-[60px] rounded-full" />
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-[#B8860B] block">
                  The Connoisseur's Checklist
                </span>
                <ul className="text-sm font-light text-white/70 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                    <span>Inspect the weave reversal to view the real wire cores — authenticity lives in the shadows.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                    <span>Engage directly with loom masters to bypass the middleman noise.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                    <span>Demand Govt-certified Pure Silver Hallmark cards for every major procurement.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Custom Bridal Loom Consultation Form */}
          <div className="lg:col-span-7 relative group">
            <div className="absolute inset-0 bg-[#B8860B]/10 blur-[100px] rounded-full -z-10 group-hover:bg-[#B8860B]/20 transition-all duration-700" />
            <div className="bg-white border border-[#B8860B]/10 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-10">
              <div className="space-y-3 text-center border-b border-[#B8860B]/10 pb-8">
                <div className="inline-flex w-16 h-16 rounded-full bg-[#B8860B]/5 border border-[#B8860B]/20 items-center justify-center mb-2">
                  <Gem className="w-8 h-8 text-[#B8860B]" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#1A1614]">
                  Tailor Your Royal Loom
                </h3>
                <p className="text-sm text-[#4A423D]/60 font-light italic">
                  Consult generational weavers for your bespoke bridal masterpiece.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-sm text-left">
                {formSent && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-[#B8860B]/10 border border-[#B8860B]/20 text-[#1A1614] rounded-2xl font-medium flex items-center gap-4 text-center"
                  >
                    <CheckCircle className="w-6 h-6 text-[#B8860B] shrink-0" />
                    <p>Your imperial bridal custom registry has been recorded. Generational masters will connect with you shortly.</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Priyanjali Sen"
                      className="w-full bg-[#FFFDF5] border border-[#B8860B]/10 text-[#1A1614] placeholder:text-[#1A1614]/30 rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@domain.com"
                      className="w-full bg-[#FFFDF5] border border-[#B8860B]/10 text-[#1A1614] placeholder:text-[#1A1614]/30 rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Textile Base</label>
                    <select
                      value={formData.textilePreference}
                      onChange={(e) => setFormData({ ...formData, textilePreference: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Gaji Silk">Prestige Heavy Gaji Satin</option>
                      <option value="Tanchoi Weave">Tanchoi Multi-Colored Weft</option>
                      <option value="Chiffon Crepe">Delicate Chiffon Crepe</option>
                      <option value="Banarasi Gilded">Traditional Brocade Silk</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Zari Specification</label>
                    <select
                      value={formData.zariType}
                      onChange={(e) => setFormData({ ...formData, zariType: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Real 24K Pure Silver thread">Gilded 24K Pure Silver thread</option>
                      <option value="Sterling Silver core">Sterling Silver Standard Wire</option>
                      <option value="Metallic Gold tested thread">Tested Metallic Gold</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Bespoke Requirements</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Custom borders, peacock motifs, traditional royal elements..."
                    rows={4}
                    className="w-full bg-[#FFFDF5] border border-[#B8860B]/10 text-[#1A1614] placeholder:text-[#1A1614]/30 rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B8860B] hover:bg-[#1A1614] text-white text-xs font-bold uppercase tracking-[0.2em] py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-xl hover:shadow-[#B8860B]/20"
                >
                  <Scissors className="w-5 h-5" />
                  Reserve Royal Loom Consultation
                </button>

              </form>
            </div>
          </div>

        </section>

      </main>

      <footer className="relative z-10 bg-[#1A1614] border-t border-white/5 shrink-0 text-center py-10 text-white/30 text-[10px] font-mono uppercase tracking-[0.3em] mt-auto">
        © {new Date().getFullYear()} Surat Insider • The Imperial Bridal Court Handlooms Association
      </footer>
    </div>
  );
}
