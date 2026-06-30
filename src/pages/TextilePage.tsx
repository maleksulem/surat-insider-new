import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { FluidLandingCursor } from "../components/FluidLandingCursor";
import { 
  Building, 
  ArrowLeft, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Compass,
  CheckCircle,
  Briefcase
} from "lucide-react";
import { Role, Inquiry } from "../types";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

interface TextilePageProps {
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
      addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function TextilePage({
    currentUserRole,
  setCurrentUserRole,
      addInquiry,
}: TextilePageProps) {
  // Call Dynamic SEO and Schema markup hook
  useDocumentMetadata({
    title: "Surat Textile Sourcing Directory & Bulk Trade Consultation",
    description: "Connect directly with trusted Surat textile wholesale manufacturers. Pure georgette, silk, digital prints, export consultation, and commission-free procurement.",
    keywords: "Surat Textile Market, Wholesale Fabric Surat, Ring Road Sourcing, Surat Weavers Directory, Pure Georgette wholesale, Saree Manufacturer Surat, Textile Trade India",
    ogImage: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    schema: {
      "@context": "https://schema.org",
      "@type": "BusinessService",
      "name": "Surat Textile Sourcing Agency",
      "description": "B2B procurement service assisting national and international buyers in acquiring premium fabrics directly from Surat's weaving mills.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Surat Insider"
      },
      "areaServed": "Worldwide"
    }
  });

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    volumeNeeded: "Wholesale (Bulk Roll)",
    focusCategory: "Pure Fabrics & Georgette",
    licensing: "Need export consultation",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      itemId: "textile-bourse-portal",
      itemTitle: "Textile & Diamond Bourse B2B Procurment",
      itemType: "shopping",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `B2B Request. Company: ${formData.company}. Volume: ${formData.volumeNeeded}. Category: ${formData.focusCategory}. License Info: ${formData.licensing}. Notes: ${formData.notes}`,
    });
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        volumeNeeded: "Wholesale (Bulk Roll)",
        focusCategory: "Pure Fabrics & Georgette",
        licensing: "Need export consultation",
        notes: ""
      });
    }, 4500);
  };

  const tradeHighlights = [
    {
      title: "Surat Diamond Bourse (SDB)",
      desc: "Inside the world's largest single-office structure, boasting over 67,000 diamond merchants, clearing houses, and high-security exchanges.",
      stat: "99% of global diamonds cut here"
    },
    {
      title: "Ring Road Wholesale Hubs",
      desc: "Navigating the famous Surat Textile Markets (STM) where thousands of outlets manufacture, print, and distribute fabrics worldwide.",
      stat: "40 million meters woven daily"
    },
    {
      title: "Custom Weaving & Export",
      desc: "Leverage direct links with government certified mill clusters to design custom fabrics, secure dye safety, and streamline logistics.",
      stat: "Fast-track Custom Port logs"
    }
  ];

  return (
    <div 
      className="relative min-h-screen bg-[#F8F7F2] text-[#1A1614] flex flex-col font-sans selection:bg-[#1A1614] selection:text-white overflow-x-hidden"
    >
      <FluidLandingCursor theme="textile" />

      {/* Subtle Woven Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%231A1614' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      {/* Back CTA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 text-[#1A1614]/40 hover:text-[#1A1614] transition-all text-[10px] uppercase tracking-[0.4em] font-bold group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          The Imperial Portal
        </Link>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        
        {/* Editorial Narrative Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.5em] text-[#B8860B]">
                <Compass className="w-3 h-3" />
                The Silk Route
              </span>
              <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-[#1A1614] leading-[0.85]">
                Precision <br />
                <span className="italic font-normal">Heritage.</span>
              </h1>
              <p className="max-w-md text-lg text-[#4A423D] font-light leading-relaxed">
                Navigating the sovereign Bourse trade where 40 million meters of precision-woven Georgette and Silk are birthed daily.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-2"
          >
            <motion.img 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
              alt="Luxury Silk Texture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1614]/20 to-transparent" />
          </motion.div>
        </section>

        {/* Trade Bourse Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {tradeHighlights.map((hl, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="group space-y-6"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-[#1A1614]/5 shadow-inner mb-6 flex items-center justify-center p-12">
                <TrendingUp className="w-12 h-12 text-[#1A1614]/10 group-hover:text-[#B8860B] transition-colors group-hover:scale-125 duration-500" />
              </div>
              <div className="space-y-3 px-2">
                <h3 className="font-serif text-2xl font-bold text-[#1A1614]">{hl.title}</h3>
                <p className="text-sm text-[#4A423D] leading-relaxed font-light">{hl.desc}</p>
                <div className="pt-4 text-[9px] font-mono text-[#B8860B] tracking-[0.3em] uppercase font-black">
                  {hl.stat}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Dual layout with guidelines and dynamic inquiry form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start pt-12">
          
          {/* Rules and verification guidelines */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl font-extrabold text-[#1A1614] leading-tight">Trading inside <br />the <span className="italic font-normal">Bourse</span></h2>
              <p className="text-base text-[#4A423D] leading-relaxed font-light">
                The Surat Diamond Bourse is restricted to certified diamond merchants, buyers with official letters of invitation, and trade clearance agents with pre-authorized access.
              </p>
            </div>

            <div className="bg-[#1A1614] text-white rounded-[2rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 translate-x-16 -translate-y-16" />
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-bold text-white/40 block">
                  Merchant Protocol
                </span>
                <ul className="space-y-6">
                  {[
                    "Inspect wholesale GST registers for legitimate licensing.",
                    "Verify custom patterns directly in loom warehouses.",
                    "Negotiate prices excluding logistics brokerage for transparency."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-sm font-light text-white/80">
                      <span className="text-[#B8860B] font-mono">0{idx + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Catalog request and verification form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-xl border border-[#1A1614]/5 space-y-10">
              <div className="space-y-3">
                <h3 className="font-serif text-3xl font-bold text-[#1A1614]">
                  Direct Trade Loom
                </h3>
                <p className="text-sm text-[#4A423D]/60 font-light">
                  Submit corporate credentials to access verified mill clusters.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 text-sm">
                {formSent && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#B8860B]/5 border border-[#B8860B]/20 text-[#1A1614] rounded-2xl font-medium flex items-center gap-4"
                  >
                    <CheckCircle className="w-5 h-5 text-[#B8860B]" />
                    <span>Your corporate B2B query has been logged. Our trade manager will reach out.</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 border-b border-[#1A1614]/10 pb-2">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Vikram Singhania"
                      className="w-full bg-transparent text-[#1A1614] placeholder:text-[#1A1614]/20 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 border-b border-[#1A1614]/10 pb-2">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40">Enterprise</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Singhania Global LLC"
                      className="w-full bg-transparent text-[#1A1614] placeholder:text-[#1A1614]/20 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 border-b border-[#1A1614]/10 pb-2">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40">Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="trade@singhania.com"
                      className="w-full bg-transparent text-[#1A1614] placeholder:text-[#1A1614]/20 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 border-b border-[#1A1614]/10 pb-2">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-transparent text-[#1A1614] placeholder:text-[#1A1614]/20 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 block mb-2">Volume</label>
                    <select
                      value={formData.volumeNeeded}
                      onChange={(e) => setFormData({ ...formData, volumeNeeded: e.target.value })}
                      className="w-full bg-[#F8F7F2] border border-[#1A1614]/10 rounded-xl p-4 focus:outline-none focus:border-[#1A1614] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Wholesale (Bulk Roll)">Bulk Wholesale (100+ Rolls)</option>
                      <option value="Custom Motif Run">Custom Special Run</option>
                      <option value="Container Export">Container Load (Export)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 block mb-2">Category</label>
                    <select
                      value={formData.focusCategory}
                      onChange={(e) => setFormData({ ...formData, focusCategory: e.target.value })}
                      className="w-full bg-[#F8F7F2] border border-[#1A1614]/10 rounded-xl p-4 focus:outline-none focus:border-[#1A1614] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Pure Fabrics & Georgette">High-grade Georgette</option>
                      <option value="Brocade & Jacquard Silks">Brocade & Jacquard</option>
                      <option value="Uncut Diamonds / Spark Gems">Diamonds & Gems</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40">Specifications</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Describe material specs, GSM, width, certifications..."
                    rows={4}
                    className="w-full bg-[#F8F7F2] border border-[#1A1614]/10 rounded-[2rem] p-6 focus:outline-none focus:border-[#1A1614] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1A1614] hover:bg-[#B8860B] text-white text-[10px] font-bold uppercase tracking-[0.4em] py-6 rounded-2xl transition-all duration-500 shadow-xl"
                >
                  Initiate Trade Protocol
                </button>
              </form>
            </div>
          </div>

        </section>

      </main>

      <footer className="relative z-10 bg-[#1A1614] border-t border-white/5 shrink-0 text-center py-12 text-white/20 text-[9px] font-mono uppercase tracking-[0.5em] mt-auto">
        © {new Date().getFullYear()} Surat Insider • The Silk Route Merchant Guild
      </footer>
    </div>
  );
}
