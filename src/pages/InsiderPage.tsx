import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
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

interface InsiderPageProps {
  onMount: () => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
  setActiveTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function InsiderPage({
  onMount,
  currentUserRole,
  setCurrentUserRole,
  activeTheme,
  setActiveTheme,
  addInquiry,
}: InsiderPageProps) {
  useEffect(() => {
    onMount();
  }, [onMount]);

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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-stone-800 selection:text-white">
      <CustomCursor theme={activeTheme} />

      {/* Dynamic Theme Injector */}
      <style>{`
        :root {
          --color-brand-emerald-950: #1c1917 !important;
          --color-brand-emerald-900: #292524 !important;
          --color-brand-emerald-800: #44403c !important;
          --color-brand-emerald-700: #78716c !important;
          --color-brand-sand-50: #fafaf9 !important;
          --color-brand-sand-100: #f5f5f4 !important;
          --color-brand-sand-200: #e7e5e4 !important;
          --color-brand-gold-300: #d6d3d1 !important;
          --color-brand-gold-400: #a8a29e !important;
          --color-brand-gold-500: #c5a059 !important;
          --color-brand-charcoal: #1c1917 !important;
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
          className="inline-flex items-center gap-2 text-stone-300 hover:text-white transition-colors text-xs uppercase tracking-widest font-mono font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Imperial Portal
        </Link>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Editorial Heading Section */}
        <section className="relative rounded-3xl overflow-hidden border border-stone-500/20 bg-gradient-to-br from-stone-900 via-[#1e1e24] to-slate-950 p-8 md:p-14 shadow-2xl space-y-6">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)] bg-[size:48px_48px] z-0"></div>
          
          <div className="relative z-10 space-y-4 max-w-4xl text-left">
            <span className="inline-flex items-center gap-1.5 bg-stone-900/40 border border-stone-400/30 text-stone-300 text-[10px] font-mono uppercase tracking-[0.25em] px-3 py-1 rounded-full">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Sovereign Sanctuary • Generational Artisan Gopi Talav & Ateliers
            </span>
            <h1 className="font-serif text-4xl md:text-7xl font-black tracking-tight text-white leading-none">
              The City of <span className="text-amber-400 font-serif font-light italic">Forgotten Treaties</span>.
            </h1>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Walk past rain-washed Gopi Talav lakeside walls, investigate ancient colonial merchant grave sanctuaries, and view the protected ateliers of silver-wire guilds.
            </p>
          </div>
        </section>

        {/* Informative Grid of Hidden Spots */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {hiddenAttractions.map((hl, i) => (
            <div 
              key={i}
              className="bg-stone-900/30 border border-stone-500/10 rounded-2xl p-6 md:p-8 space-y-4 hover:border-amber-400/30 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-stone-950/80 border border-stone-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-stone-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#e7e5e4]">{hl.title}</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">{hl.desc}</p>
              </div>
              <div className="text-[10px] font-mono text-stone-400 mt-4 flex items-center gap-1 bg-stone-950/40 px-2 py-1 rounded w-fit capitalize font-bold">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {hl.location}
              </div>
            </div>
          ))}
        </section>

        {/* Dual layout with history and tour registration form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* History of Malik Gopi */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">The Merchant Malik Gopi</h2>
            <p className="text-xs text-stone-350/90 leading-relaxed font-light">
              Surat's prestige was built from maritime trade agreements. Long before the British East India company established its very first factory in Surat, Malik Gopi laid out the octagonal Gopi Talav to supply precious water to visiting merchant navies.
              <br /><br />
              He invited silk artisans, jewelry crafters, and diamond lapidaries to make the city their permanent home. The resulting hybrid Mughal-European architecture stands as a quiet monument to this golden trading era.
            </p>

            <div className="bg-stone-400/5 border border-stone-500/20 rounded-xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-300 block">
                Artisan Explorer Checklist
              </span>
              <ul className="text-xs font-mono text-stone-300 space-y-1">
                <li>✓ Walk Gopi Talav during the peaceful early morning hours</li>
                <li>✓ Photograph the hybrid European-Mughal domed carvings</li>
                <li>✓ Hire a registered local historical archivist</li>
              </ul>
            </div>
          </div>

          {/* Heritage Walk Sign up */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-stone-500/30 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
            <div className="space-y-1 text-left border-b border-stone-500/10 pb-4">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-500" />
                Book Private Heritage Walk
              </h3>
              <p className="text-xs text-stone-300 font-light">
                Register for a specialized research-standard localized walk with academic historians.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              {formSent && (
                <div className="p-4 bg-stone-900/20 border border-stone-5s0/30 text-stone-300 rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  Your academic heritage exploration slots are logged! Our guide manager will contact you.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">Your Full Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Meera Mehta"
                    className="w-full bg-slate-950 border border-stone-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">Email Address*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. meera@outlook.com"
                    className="w-full bg-slate-950 border border-stone-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">Tour Date*</label>
                  <input
                    type="date"
                    required
                    value={formData.tourDate}
                    onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                    className="w-full bg-slate-950 border border-stone-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">Visitors Count*</label>
                  <select
                    value={formData.visitors}
                    onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                    className="w-full bg-slate-950 border border-stone-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-stone-400"
                  >
                    <option value="1">1 Person (Private standard)</option>
                    <option value="2">2 Persons (Couple standard)</option>
                    <option value="5">5 Persons (Academic/study group)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">Academic Affiliation</label>
                  <select
                    value={formData.academicAffiliation}
                    onChange={(e) => setFormData({ ...formData, academicAffiliation: e.target.value })}
                    className="w-full bg-slate-950 border border-stone-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-stone-400"
                  >
                    <option value="None (Leisure Historian)">None (Leisure Historian)</option>
                    <option value="University Scholar / Researcher">University Scholar / Researcher</option>
                    <option value="Local Resident Enthusiast">Local Resident Enthusiast</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">Any special historical interests or details</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Interested in particular coin catalogs, Mughal fortification details, ancient ship logistics..."
                  rows={3}
                  className="w-full bg-slate-950 border border-stone-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-stone-400 resize-none font-sans"
                />
              </div>

              <div className="flex flex-col text-left gap-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-300">Contact Phone Number*</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-950 border border-stone-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-stone-400 mb-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-300 hover:bg-stone-200 text-slate-950 text-xs font-semibold uppercase tracking-wider py-3.5 rounded-xl transition-all"
              >
                Inquire For Archivist Walk
              </button>
            </form>
          </div>

        </section>

      </main>

      <footer className="bg-[#1c1917] border-t border-stone-500/10 shrink-0 text-center py-6 text-stone-400/60 text-xs">
        © {new Date().getFullYear()} Surat Insider • Old Surat Heritage Protection Association
      </footer>
    </div>
  );
}
