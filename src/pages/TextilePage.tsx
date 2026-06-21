import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
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

interface TextilePageProps {
  onMount: () => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
  setActiveTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function TextilePage({
  onMount,
  currentUserRole,
  setCurrentUserRole,
  activeTheme,
  setActiveTheme,
  addInquiry,
}: TextilePageProps) {
  useEffect(() => {
    onMount();
  }, [onMount]);

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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      <CustomCursor theme={activeTheme} />

      {/* Dynamic Theme Injector */}
      <style>{`
        :root {
          --color-brand-emerald-950: #022c22 !important;
          --color-brand-emerald-900: #064e3b !important;
          --color-brand-emerald-800: #047857 !important;
          --color-brand-emerald-700: #10b981 !important;
          --color-brand-sand-50: #f0fdf4 !important;
          --color-brand-sand-100: #dcfce7 !important;
          --color-brand-sand-200: #bbf7d0 !important;
          --color-brand-gold-300: #34d399 !important;
          --color-brand-gold-400: #059669 !important;
          --color-brand-gold-500: #10b981 !important;
          --color-brand-charcoal: #022c22 !important;
        }
      `}</style>

      {/* Global Navbar */}
      <Navbar
        currentTab=""
        setCurrentTab={() => {}}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
      />

      {/* Back CTA */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-left">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-emerald-300 hover:text-[#bbf7d0] transition-colors text-xs uppercase tracking-widest font-mono font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Imperial Portal
        </Link>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Editorial Heading Section */}
        <section className="relative rounded-3xl overflow-hidden border border-emerald-400/20 bg-gradient-to-br from-emerald-950 via-[#012519] to-slate-950 p-8 md:p-14 shadow-2xl space-y-6">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:48px_48px] z-0"></div>
          
          <div className="relative z-10 space-y-4 max-w-4xl text-left">
            <span className="inline-flex items-center gap-1.5 bg-emerald-900/40 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono uppercase tracking-[0.25em] px-3 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5" />
              Sovereign B2B Portal • Global Textile & Gem Exchange
            </span>
            <h1 className="font-serif text-4xl md:text-7xl font-black tracking-tight text-white leading-none">
              High-Security <span className="text-[#bbf7d0] font-serif font-light italic">Bourse Trade</span>.
            </h1>
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Weave direct partnerships with global fabric mill clusters, wholesale Georgette dealers, and certified diamond suppliers inside Surat's high-tech business districts.
            </p>
          </div>
        </section>

        {/* Informative Grid of Artisan Specialties */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {tradeHighlights.map((hl, i) => (
            <div 
              key={i}
              className="bg-slate-950 border border-emerald-400/15 rounded-2xl p-6 md:p-8 space-y-4 hover:border-emerald-400/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">{hl.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{hl.desc}</p>
              </div>
              <div className="text-[10px] font-mono text-emerald-200 mt-4 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-400/10 inline-block w-fit">
                Stat: {hl.stat}
              </div>
            </div>
          ))}
        </section>

        {/* Dual layout with guidelines and dynamic inquiry form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Rules and verification guidelines */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">How to trade inside SDB</h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed font-light">
              The Surat Diamond Bourse is restricted to certified diamond merchants, buyers with official letters of invitation, and trade clearance agents with pre-authorized access.
              <br /><br />
              <strong>Wholesale Clothing Markets:</strong> Ring Road outlets sell only in multi-piece bundles (matching catalogs). To inspect weaves or negotiate, hire an official broker registered under Surat Chamber of Commerce to guarantee absolute safety and avoid inflated prices.
            </p>

            <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-300 block">
                Trade Checklist
              </span>
              <ul className="text-xs font-mono text-emerald-200 space-y-1">
                <li>✓ Inspect wholesale GST registers for legitimate licensing</li>
                <li>✓ Verify custom patterns directly in loom warehouses</li>
                <li>✓ Always negotiate prices excluding logistics brokerage</li>
              </ul>
            </div>
          </div>

          {/* Catalog request and verification form */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-emerald-400/30 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
            <div className="space-y-1 text-left border-b border-emerald-400/10 pb-4">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-300" />
                Connect Direct Trade Loom
              </h3>
              <p className="text-xs text-emerald-200 font-light">
                Submit corporate details to requests verified catalog matches and secure customs export clearance notes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              {formSent && (
                <div className="p-4 bg-emerald-950 border border-emerald-800/30 text-emerald-250 rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Your corporate B2B query has been logged. Our dedicated trade partner manager will sync with you.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Contact Person Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Singhania"
                    className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Company / Enterprise Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Singhania Global Fabric LLC"
                    className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Corporate Email*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. import@singhania.com"
                    className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Phone Number*</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Target Volume*</label>
                  <select
                    value={formData.volumeNeeded}
                    onChange={(e) => setFormData({ ...formData, volumeNeeded: e.target.value })}
                    className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                  >
                    <option value="Wholesale (Bulk Roll)">Wholesale Packs (100+ Rolls)</option>
                    <option value="Custom Motif Run">Custom Special Design Wefts (Limited Run)</option>
                    <option value="Container Export">Full Shipping Container Load (Export)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Material Classification*</label>
                  <select
                    value={formData.focusCategory}
                    onChange={(e) => setFormData({ ...formData, focusCategory: e.target.value })}
                    className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                  >
                    <option value="Pure Fabrics & Georgette">High-grade Georgette & Crepe</option>
                    <option value="Brocade & Jacquard Silks">Brocade, Jacquard, & Satin</option>
                    <option value="Uncut Diamonds / Spark Gems">Pure Diamonds and Gemstones</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Export Licensing Support*</label>
                  <select
                    value={formData.licensing}
                    onChange={(e) => setFormData({ ...formData, licensing: e.target.value })}
                    className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400"
                  >
                    <option value="Need export consultation">Need full Export Consulting & Customs clearance pack</option>
                    <option value="Already certified buyer">Company already has valid Import/Export Certificate (IEC)</option>
                    <option value="Interstate trade only">Domestic interstate trade only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Description of requested fabrics or gems spec</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Provide details on gms weight, width dimensions, custom dye certifications or direct loom references..."
                  rows={3}
                  className="w-full bg-emerald-950 border border-emerald-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold uppercase tracking-wider py-3.5 rounded-xl transition-all"
              >
                Connect To Trade Mill Clusters
              </button>
            </form>
          </div>

        </section>

      </main>

      <footer className="bg-[#022c22] border-t border-emerald-400/10 shrink-0 text-center py-6 text-emerald-300/60 text-xs">
        © {new Date().getFullYear()} Surat Insider • B2B Chamber of Commerce & Fabric Guild
      </footer>
    </div>
  );
}
