import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { FluidLandingCursor } from "../components/FluidLandingCursor";
import { 
  Compass, 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  Search, 
  CheckCircle,
  Gem
} from "lucide-react";
import { Role, Inquiry } from "../types";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

interface InsiderPageProps {
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
      addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function InsiderPage({
    currentUserRole,
  setCurrentUserRole,
      addInquiry,
}: InsiderPageProps) {
  // Call Dynamic SEO and Schema markup hook
  useDocumentMetadata({
    title: "Surat Insider Heritage Tours & Historical Sightseeing Walks",
    description: "Walk through history. Guided heritage tours of Surat Castle, Dutch & Armenian cemeteries, and Tapi river mysteries with expert local historians.",
    keywords: "Surat Castle History, Surat Heritage Walk, Dutch Cemetery Surat, Tapi River History, Surat Monuments, Surat Historical Sightseeing",
    ogImage: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    schema: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Surat Historical Heritage Tours",
      "description": "Deep-immersion historical sightseeing routes exploring European cemeteries, Surat Castle fortification structures, and early trading posts.",
      "touristType": "History Buffs & Culture Travelers",
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
    tourDate: "",
    visitors: "1",
    academicAffiliation: "None (Leisure Historian)",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      itemId: "insider-secrets-portal",
      itemTitle: "Generational Artisan Atelier Heritage Walk",
      itemType: "tour",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Historical walk booking. Date: ${formData.tourDate}. Visitors: ${formData.visitors}. Affiliation: ${formData.academicAffiliation}. Notes: ${formData.notes}`,
    });
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        tourDate: "",
        visitors: "1",
        academicAffiliation: "None (Leisure Historian)",
        notes: ""
      });
    }, 4500);
  };

  const hiddenAttractions = [
    {
      title: "Gopi Talav Octagonal Lake",
      desc: "An incredible massive 15th-century octagonal water reservoir built by local merchant baron Malik Gopi, showcasing stellar ancient Mughal masonry.",
      location: "Rustampura"
    },
    {
      title: "Mughal-Armenian Inscriptions",
      desc: "Delicate historical grave markers dating back to 1690, tracing how Surat was the gateway city to the holy shrines of Mecca.",
      location: "Katargam"
    },
    {
      title: "Subterranean Mughal Bastions",
      desc: "Uncovered underground artillery cellars inside Surat Castle, previously sealed for almost two centuries of colonial rule.",
      location: "Chowk Bazar"
    }
  ];

  return (
    <div 
      className="relative min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#B8860B]/30 selection:text-white overflow-x-hidden"
    >
      <FluidLandingCursor theme="insider" />

      {/* Atmospheric Vault Textures */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[80vh] bg-gradient-to-b from-[#B8860B]/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B8860B]/5 blur-[100px] rounded-full" />
      </div>

      {/* Back CTA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-left">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 text-white/20 hover:text-[#B8860B] transition-all text-[10px] uppercase tracking-[0.6em] font-black group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          The Portal
        </Link>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        
        {/* Editorial Heading Section */}
        <section className="relative pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 max-w-5xl"
          >
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-[0.5em] text-[#B8860B]">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                The Insider Vault
              </span>
              <h1 className="font-serif text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] text-white">
                Forgotten <br />
                <span className="text-[#B8860B] italic font-normal">Treaties.</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/40 leading-relaxed max-w-2xl font-light">
              Access the protected ateliers of silver-wire guilds and investigate the ancient colonial sanctuaries hidden beneath the modern city.
            </p>
          </motion.div>
        </section>

        {/* Informative Grid of Hidden Spots */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {hiddenAttractions.map((hl, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="group bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8 hover:border-[#B8860B]/30 transition-all duration-700 flex flex-col justify-between backdrop-blur-3xl shadow-2xl"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center border border-[#B8860B]/20 group-hover:bg-[#B8860B] transition-all duration-700">
                  <BookOpen className="w-6 h-6 text-[#B8860B] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-tight">{hl.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light">{hl.desc}</p>
              </div>
              <div className="text-[9px] font-mono text-[#B8860B] mt-4 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full w-fit uppercase tracking-widest font-black">
                <MapPin className="w-3.5 h-3.5" />
                {hl.location}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Dual layout with history and tour registration form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center px-4">
          
          {/* History of Malik Gopi */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="font-serif text-5xl font-black text-white leading-tight">The Merchant <br /><span className="text-[#B8860B] italic font-normal">Malik Gopi</span></h2>
              <p className="text-lg text-white/50 leading-relaxed font-light">
                Surat's prestige was built from maritime trade agreements. Long before the British East India company established its first factory, Malik Gopi laid out the octagonal Gopi Talav to supply visiting merchant navies.
              </p>
            </div>

            <div className="bg-[#B8860B]/5 border border-[#B8860B]/10 rounded-[3rem] p-12 space-y-8 backdrop-blur-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10 space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-[0.5em] font-black text-[#B8860B] block">
                  Vault Protocol
                </span>
                <ul className="space-y-6">
                  {[
                    "Walk Gopi Talav during the peaceful early morning hours.",
                    "Photograph the hybrid European-Mughal domed carvings.",
                    "Hire a registered local historical archivist."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-sm font-light text-white/60">
                      <Gem className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Heritage Walk Sign up */}
          <div className="lg:col-span-7">
            <div className="relative bg-white/[0.03] rounded-[4rem] p-8 md:p-20 border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#B8860B]/5 blur-[80px] rounded-full group-hover:bg-[#B8860B]/10 transition-all duration-1000" />
              
              <div className="space-y-6 text-center mb-16">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-[#B8860B]" />
                </div>
                <h3 className="font-serif text-4xl font-bold text-white tracking-tight">
                  Archivist Request
                </h3>
                <p className="text-base text-white/30 font-light italic">
                  Research-standard localized walks with academic historians.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 text-sm">
                {formSent && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-[#B8860B]/10 border border-[#B8860B]/20 text-white rounded-3xl font-medium text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-[#B8860B] mx-auto mb-3" />
                    <p className="text-lg">Your academic heritage slots are logged. Expect clearance shortly.</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 ml-4">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Meera Mehta"
                      className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 ml-4">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="meera@vault.com"
                      className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 ml-4">Walk Date</label>
                    <input
                      type="date"
                      required
                      value={formData.tourDate}
                      onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all invert brightness-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 ml-4">Access Count</label>
                    <select
                      value={formData.visitors}
                      onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all appearance-none cursor-pointer"
                    >
                      <option value="1">Solo Private (1)</option>
                      <option value="2">Duo Access (2)</option>
                      <option value="5">Academic Group (5)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 ml-4">Affiliation</label>
                    <select
                      value={formData.academicAffiliation}
                      onChange={(e) => setFormData({ ...formData, academicAffiliation: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all appearance-none cursor-pointer"
                    >
                      <option value="None (Leisure Historian)">Leisure Historian</option>
                      <option value="University Scholar / Researcher">University Scholar</option>
                      <option value="Local Resident Enthusiast">Resident Expert</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 ml-4">Direct Contact</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 ml-4">Specialized Interests</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Specific coin catalogs, Mughal fortification details..."
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-[2rem] p-6 focus:outline-none focus:border-[#B8860B] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B8860B] hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-[0.6em] py-6 rounded-2xl transition-all duration-700 shadow-2xl"
                >
                  Request Vault Clearance
                </button>
              </form>
            </div>
          </div>

        </section>

      </main>

      <footer className="relative z-10 bg-black border-t border-white/5 shrink-0 text-center py-16 text-white/10 text-[9px] font-mono uppercase tracking-[0.6em] mt-auto">
        © {new Date().getFullYear()} Surat Insider • The Heritage Protection Authority
      </footer>
    </div>
  );
}
