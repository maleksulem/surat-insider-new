import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
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

interface WeddingPageProps {
  onMount: () => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
  setActiveTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function WeddingPage({
  onMount,
  currentUserRole,
  setCurrentUserRole,
  activeTheme,
  setActiveTheme,
  addInquiry,
}: WeddingPageProps) {
  useEffect(() => {
    onMount();
  }, [onMount]);

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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-800 selection:text-white">
      <CustomCursor theme={activeTheme} />
      
      {/* Dynamic Theme Injector */}
      <style>{`
        :root {
          --color-brand-emerald-950: #4a0404 !important;
          --color-brand-emerald-900: #7a0c1a !important;
          --color-brand-emerald-800: #961124 !important;
          --color-brand-emerald-700: #b91c1c !important;
          --color-brand-sand-50: #fffdf5 !important;
          --color-brand-sand-100: #fbf5e6 !important;
          --color-brand-sand-200: #ebdcb9 !important;
          --color-brand-gold-300: #ffd700 !important;
          --color-brand-gold-400: #d4af37 !important;
          --color-brand-gold-500: #c5a059 !important;
          --color-brand-charcoal: #200d07 !important;
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

      {/* Back Hero CTA */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-rose-300 hover:text-amber-300 transition-colors text-xs uppercase tracking-widest font-mono font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Imperial Portal
        </Link>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Editorial Heading Section */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-400/20 bg-gradient-to-br from-rose-950 via-[#3a0202] to-slate-950 p-8 md:p-14 shadow-2xl space-y-6">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#dfcba5_1px,transparent_1px),linear-gradient(to_bottom,#dfcba5_1px,transparent_1px)] bg-[size:48px_48px] z-0"></div>
          
          <div className="relative z-10 space-y-4 max-w-4xl text-left">
            <span className="inline-flex items-center gap-1.5 bg-rose-900/40 border border-amber-400/30 text-amber-300 text-[10px] font-mono uppercase tracking-[0.25em] px-3 py-1 rounded-full">
              <Crown className="w-3 h-3" />
              Sovereign Bridal Portal • Imperial Bridal Court
            </span>
            <h1 className="font-serif text-4xl md:text-7xl font-black tracking-tight text-white leading-none">
              Where Weddings wear <span className="text-amber-400 font-serif font-light italic">Pure Silver</span>.
            </h1>
            <p className="text-brand-sand-100 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Surat's legendary weavers supply the royalty of India with authentic heavy sarees, dense satin Gaji silk, and pure sterling silver zari handwoven directly at pre-eminent Salabatpura handlooms.
            </p>
          </div>
        </section>

        {/* Informative Grid of Artisan Specialties */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bridalHighlights.map((hl, i) => (
            <div 
              key={i}
              className="bg-stone-900/40 border border-amber-400/10 rounded-2xl p-6 md:p-8 space-y-4 hover:border-amber-400/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-amber-400/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#dfcba5]">{hl.title}</h3>
              <p className="text-xs text-brand-sand-200/80 leading-relaxed font-light">{hl.desc}</p>
              <div className="text-[10px] font-mono text-rose-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {hl.place}
              </div>
            </div>
          ))}
        </section>

        {/* Dual layout with historical facts and reservation engine */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Secrets of Gopipura guilds */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h2 className="font-serif text-3xl font-extrabold text-white">
              The Gopipura Guild Secret
            </h2>
            <p className="text-xs text-brand-sand-200/90 leading-relaxed font-light space-y-4">
              Real zari is not merely a fiber; it is high metal-craft. Each piece is drawn through ruby dies to attain a sub-human hair diameter of pure silver, then wrap-tethered on silk cores. 
              <br /><br />
              At local workshops, families have protected the exact tempers of these wires for 400 years. If the wire is too temperamental, it snaps on the warp; if too soft, it fails to shimmer.
            </p>

            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-5 space-y-2 mt-4">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400 block">
                Vistor Checklist
              </span>
              <ul className="text-xs font-mono text-brand-sand-200 space-y-1">
                <li>✓ Inspect the weave reversal to view the real wire cores</li>
                <li>✓ Avoid middleman rickshaws charging commission fees</li>
                <li>✓ Demand Govt-certified Pure Silver Hallmark cards</li>
              </ul>
            </div>
          </div>

          {/* Interactive Custom Bridal Loom Consultation Form */}
          <div className="lg:col-span-7 bg-stone-900/80 border border-amber-400/30 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
            <div className="space-y-1.5 text-left border-b border-amber-400/10 pb-4">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Gem className="w-5 h-5 text-amber-400" />
                Tailor Your Royal Loom
              </h3>
              <p className="text-xs text-[#dfcba5] font-light">
                Submit your preferences to consult certified generational loom weavers directly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              {formSent && (
                <div className="p-4 bg-rose-900/20 border border-amber-400/30 text-[#dfcba5] rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  Your imperial bridal custom registry has been recorded. Generational Surat weavers will connect with you.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#dfcba5]/80">Your Full Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priyanjali Sen"
                    className="w-full bg-slate-950 border border-amber-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#dfcba5]/80">Email Address*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. priya@outlook.com"
                    className="w-full bg-slate-950 border border-amber-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#dfcba5]/80">Contact Phone Num*</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-slate-950 border border-amber-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#dfcba5]/80">Bride Name (if different)</label>
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    placeholder="Bride Name"
                    className="w-full bg-slate-950 border border-amber-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#dfcba5]/80">Textile Framework*</label>
                  <select
                    value={formData.textilePreference}
                    onChange={(e) => setFormData({ ...formData, textilePreference: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Gaji Silk">Prestige Heavy Gaji Satin</option>
                    <option value="Tanchoi Weave">Tanchoi Multi-Colored Weft</option>
                    <option value="Chiffon Crepe">Delicate Chiffon Crepe</option>
                    <option value="Banarasi Gilded">Traditional Brocade Silk</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#dfcba5]/80">Zari Specification*</label>
                  <select
                    value={formData.zariType}
                    onChange={(e) => setFormData({ ...formData, zariType: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Real 24K Pure Silver thread">Gilded 24K Pure Silver thread</option>
                    <option value="Sterling Silver core">Sterling Silver standard wire Core</option>
                    <option value="Metallic Gold tested thread">Tested Metallic Gold Thread (Affordable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#dfcba5]/80">Design specifications or custom motif requirements</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Need customized borders, peacock motifs, traditional royal elephants, custom lengths, fallback color cards..."
                  rows={4}
                  className="w-full bg-slate-950 border border-amber-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                Submit Royal Loom Reservation Request
              </button>

            </form>
          </div>

        </section>

      </main>

      <footer className="bg-[#200d07] border-t border-amber-400/10 shrink-0 text-center py-6 text-brand-sand-200/60 text-xs">
        © {new Date().getFullYear()} Surat Insider • Imperial Bridal Court Handlooms Association Digital Portal
      </footer>
    </div>
  );
}
