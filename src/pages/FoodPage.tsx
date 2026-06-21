import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
import { 
  Utensils, 
  ArrowLeft, 
  Flame, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle,
  Coffee
} from "lucide-react";
import { Role, Inquiry } from "../types";

interface FoodPageProps {
  onMount: () => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
  setActiveTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function FoodPage({
  onMount,
  currentUserRole,
  setCurrentUserRole,
  activeTheme,
  setActiveTheme,
  addInquiry,
}: FoodPageProps) {
  useEffect(() => {
    onMount();
  }, [onMount]);

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tourDate: "",
    spotsCount: "2",
    diet: "Vegetarian",
    spiceTolerance: "Medium Surt Heat",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      itemId: "food-safari-portal",
      itemTitle: "Bespoke Street Food Safari",
      itemType: "tour",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Street food crawl reservation. Date: ${formData.tourDate}. Size: ${formData.spotsCount}. Diet: ${formData.diet}. SpiceLevel: ${formData.spiceTolerance}. Notes: ${formData.notes}`,
    });
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        tourDate: "",
        spotsCount: "2",
        diet: "Vegetarian",
        spiceTolerance: "Medium Surt Heat",
        notes: ""
      });
    }, 4500);
  };

  const localDelicacies = [
    {
      title: "The Legendary Surti Locho",
      desc: "Steaming hot chickpea flour cakes served deliberately crumpled, topped with nylon sev, special locho powder, and thick drafts of pure butter.",
      spots: "Jani Locho (Chowk Bazar) • Gopal Locho"
    },
    {
      title: "Rich Surti Ghari",
      desc: "Precious white flour medallions packed tightly with pistachio-hazelnut mawa, toasted deep in pure ghee, and coated with delicious cooling cream.",
      spots: "Shah Jamnadas Ghariwalla • Thakkar Halwas"
    },
    {
      title: "Famous Cold Coco",
      desc: "A rich, velvety draft of premium thick chocolate milk served ice-cold, representing the beloved evening treat for local couples.",
      spots: "A-One Coco (Chowk) • Mahendra Coco"
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-800 selection:text-white">
      <CustomCursor theme={activeTheme} />

      {/* Dynamic Theme Injector */}
      <style>{`
        :root {
          --color-brand-emerald-950: #2e1065 !important;
          --color-brand-emerald-900: #4c1d95 !important;
          --color-brand-emerald-800: #6d28d9 !important;
          --color-brand-emerald-700: #7c3aed !important;
          --color-brand-sand-50: #faf5ff !important;
          --color-brand-sand-100: #f3e8ff !important;
          --color-brand-sand-200: #e9d5ff !important;
          --color-brand-gold-300: #fb7185 !important;
          --color-brand-gold-400: #f43f5e !important;
          --color-brand-gold-500: #f59e0b !important;
          --color-brand-charcoal: #1e1b4b !important;
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
          className="inline-flex items-center gap-2 text-rose-300 hover:text-amber-300 transition-colors text-xs uppercase tracking-widest font-mono font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Imperial Portal
        </Link>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Editorial Heading Section */}
        <section className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-violet-950 via-[#37114c] to-slate-950 p-8 md:p-14 shadow-2xl space-y-6">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f59e0b_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b_1px,transparent_1px)] bg-[size:48px_48px] z-0"></div>
          
          <div className="relative z-10 space-y-4 max-w-4xl text-left">
            <span className="inline-flex items-center gap-1.5 bg-amber-900/40 border border-amber-400/30 text-amber-300 text-[10px] font-mono uppercase tracking-[0.25em] px-3 py-1 rounded-full">
              <Utensils className="w-3.5 h-3.5 animate-pulse" />
              Sovereign Gastronomy • Tactile Street Locho & Ghari
            </span>
            <h1 className="font-serif text-4xl md:text-7xl font-black tracking-tight text-white leading-none">
              A City Styled by <span className="text-amber-400 font-serif font-light italic">Butter and Spice</span>.
            </h1>
            <p className="text-purple-100 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              In Surat, dinner is a luxury feast celebrated directly on the streets. Experience generational sweet ghari and sizzling buttery chickpea locho, crafted with passion.
            </p>
          </div>
        </section>

        {/* Informative Grid of Taste Specialties */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {localDelicacies.map((hl, i) => (
            <div 
              key={i}
              className="bg-slate-900/60 border border-amber-500/10 rounded-2xl p-6 md:p-8 space-y-4 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-amber-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#e9d5ff]">{hl.title}</h3>
                <p className="text-xs text-brand-sand-200 leading-relaxed font-light">{hl.desc}</p>
              </div>
              <div className="text-[10px] font-mono text-amber-300 mt-4 flex items-center gap-1 bg-purple-950/40 px-2 py-1 rounded w-fit capitalize font-bold">
                <MapPin className="w-3.5 h-3.5" />
                {hl.spots}
              </div>
            </div>
          ))}
        </section>

        {/* Dual layout with history and tour registration form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Secrets of Surat Locho */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">The Nocturnal Bazaar Culture</h2>
            <p className="text-xs text-[#e9d5ff]/90 leading-relaxed font-light">
              Suratis believe that life is meant to be feasted. When the sun dips, families migrate to Dumas Road and Chowk Bazar to consume Butter Locho, sizzling garlic khaman, and giant thalis.
              <br /><br />
              <strong>The Secret of Locho:</strong> Locho was born of an accident! A local halwai over-watered a batch of khaman batter. Unwilling to waste it, he spiced and steamed it anyway, serving it hot with oil and nylon sev. Locals fell in love with this crumpled "locho" (accident) and it quickly became the city's signature comfort food.
            </p>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400 block">
                Gastronomy Checklist
              </span>
              <ul className="text-xs font-mono text-amber-200/80 space-y-1">
                <li>✓ Look for bubbling hot steam vents to verify freshness</li>
                <li>✓ Always enjoy locho immediately — cold locho is forbidden</li>
                <li>✓ Try authentic spicy garlic mint chutney pairing</li>
              </ul>
            </div>
          </div>

          {/* Crawl registration form */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-amber-500/30 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
            <div className="space-y-1 text-left border-b border-amber-500/10 pb-4">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-500 animate-bounce" />
                Book Midnight Street Food Safari
              </h3>
              <p className="text-xs text-[#e9d5ff] font-light">
                Secure a guided nocturnal food tour with local food historians and tasting permits.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              {formSent && (
                <div className="p-4 bg-purple-900/20 border border-amber-500/30 text-[#e9d5ff] rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  Your secret Midnight Food Crawl seats are locked in! Our food guide will send meeting coordinates.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Full Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Neil Patel"
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Email Address*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. neil@live.com"
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Crawl Date*</label>
                  <input
                    type="date"
                    required
                    value={formData.tourDate}
                    onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Spots Count*</label>
                  <select
                    value={formData.spotsCount}
                    onChange={(e) => setFormData({ ...formData, spotsCount: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="1">1 Person (Solo Explorer)</option>
                    <option value="2">2 Persons (Couple standard)</option>
                    <option value="4">4 Persons (Family/group suite)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Dietary Requirements*</label>
                  <select
                    value={formData.diet}
                    onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Vegetarian">Pure Vegetarian (Surt Standard)</option>
                    <option value="Jain Food">Strictly Jain (No root vegetables)</option>
                    <option value="Everything">No dietary limits</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Spice Preference*</label>
                  <select
                    value={formData.spiceTolerance}
                    onChange={(e) => setFormData({ ...formData, spiceTolerance: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Low Heat">Mild (Keep it gentle)</option>
                    <option value="Medium Surt Heat">Medium (Traditional local kick)</option>
                    <option value="Extreme Surt Locho Spice">Absolute Surt Heat (Nylon Sev + Chutney flood)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Allergies or custom food requests</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Allergic to nuts, dairy-free coco requests, custom hotel pick up required..."
                  rows={3}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400 resize-none font-sans"
                />
              </div>

              <input
                type="hidden"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="flex flex-col text-left gap-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#e9d5ff]">Enter Contact Phone*</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400 mb-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all"
              >
                Register For Midnight Food Crawl
              </button>
            </form>
          </div>

        </section>

      </main>

      <footer className="bg-[#1e1b4b] border-t border-amber-500/10 shrink-0 text-center py-6 text-amber-300/60 text-xs">
        © {new Date().getFullYear()} Surat Insider • Surati Food Guild Association
      </footer>
    </div>
  );
}
