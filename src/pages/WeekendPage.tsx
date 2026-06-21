import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
import { 
  Compass, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Car, 
  ShieldCheck, 
  Sparkles, 
  Coffee,
  CheckCircle,
  Sunset
} from "lucide-react";
import { Role, Inquiry } from "../types";

interface WeekendPageProps {
  onMount: () => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
  setActiveTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function WeekendPage({
  onMount,
  currentUserRole,
  setCurrentUserRole,
  activeTheme,
  setActiveTheme,
  addInquiry,
}: WeekendPageProps) {
  useEffect(() => {
    onMount();
  }, [onMount]);

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    arrivalDate: "",
    hoursCount: "48",
    interests: "History & Sightseeing",
    driverClass: "Premium SUV",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      itemId: "weekend-expedition-portal",
      itemTitle: "Heritage Fort & Sea Coast 48hr Itinerary",
      itemType: "tour",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `48hr Itinerary request. Arrival: ${formData.arrivalDate}. Span: ${formData.hoursCount}hrs. Interest: ${formData.interests}. Car option: ${formData.driverClass}. Notes: ${formData.notes}`,
    });
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        arrivalDate: "",
        hoursCount: "48",
        interests: "History & Sightseeing",
        driverClass: "Premium SUV",
        notes: ""
      });
    }, 4500);
  };

  const itinerarySteps = [
    {
      time: "Day 1 — 09:30 AM",
      title: "Tactile Ramparts of Surat Castle",
      desc: "Touch the authentic Mughal defensive walls that guarded the harbor against high seas raids. Uncover coins from Dutch trade.",
      location: "Chowk Bazar"
    },
    {
      time: "Day 1 — 03:00 PM",
      title: "Dutch & Armenian Garden Monuments",
      desc: "Inspect beautiful Mughal-Hybrid domes built for European governors during the spice trade peak.",
      location: "Katargam Road"
    },
    {
      time: "Day 2 — 06:30 AM",
      title: "Quiet Dawn at Dumas Pine Forest",
      desc: "Tranquil walk on black volcanic beach sand. Indulge in classic hot tomato locho and piping-hot chai.",
      location: "Dumas Beach"
    },
    {
      time: "Day 2 — 04:00 PM",
      title: "Tapi Riverfront Gilded Twilight",
      desc: "Watch local wooden ships trace down the Tapi flow as the golden hours frame Hope Bridge.",
      location: "Tapi Riverfront"
    }
  ];

  return (
    <div className="relative min-h-screen bg-sky-950 text-slate-100 flex flex-col font-sans selection:bg-sky-800 selection:text-white">
      <CustomCursor theme={activeTheme} />
      
      {/* Dynamic Theme Injector */}
      <style>{`
        :root {
          --color-brand-emerald-950: #082f49 !important;
          --color-brand-emerald-945: #0c4a6e !important;
          --color-brand-emerald-900: #0369a1 !important;
          --color-brand-emerald-800: #0284c7 !important;
          --color-brand-emerald-700: #0ea5e9 !important;
          --color-brand-sand-50: #f0f9ff !important;
          --color-brand-sand-100: #e0f2fe !important;
          --color-brand-sand-200: #bae6fd !important;
          --color-brand-gold-300: #38bdf8 !important;
          --color-brand-gold-400: #0284c7 !important;
          --color-brand-gold-500: #0ea5e9 !important;
          --color-brand-charcoal: #0f172a !important;
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
          className="inline-flex items-center gap-2 text-sky-300 hover:text-[#bae6fd] transition-colors text-xs uppercase tracking-widest font-mono font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Imperial Portal
        </Link>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Editorial Heading Section */}
        <section className="relative rounded-3xl overflow-hidden border border-sky-400/20 bg-gradient-to-br from-sky-950 via-[#033c5a] to-slate-950 p-8 md:p-14 shadow-2xl space-y-6">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:48px_48px] z-0"></div>
          
          <div className="relative z-10 space-y-4 max-w-4xl text-left">
            <span className="inline-flex items-center gap-1.5 bg-sky-900/40 border border-sky-400/30 text-sky-300 text-[10px] font-mono uppercase tracking-[0.25em] px-3 py-1 rounded-full">
              <Compass className="w-3 h-3 animate-spin-slow" />
              Sovereign Expedition • Rapid Heritage Guided Experience
            </span>
            <h1 className="font-serif text-4xl md:text-7xl font-black tracking-tight text-white leading-none animate-fade-in">
              The 48-Hour <span className="text-[#bae6fd] font-serif font-light italic">Coastal Chronology</span>.
            </h1>
            <p className="text-sky-100 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Don't waste a single hour. Walk the historical high points of the golden Tapi delta, investigate Dutch garden tombs, and experience sunset at Dumas coast.
            </p>
          </div>
        </section>

        {/* 48-Hour Itinerary Timeline Row */}
        <section className="space-y-8 text-left">
          <div className="flex items-center gap-2 border-b border-sky-400/10 pb-3">
            <Sunset className="w-5 h-5 text-sky-300" />
            <h2 className="font-serif text-2xl font-bold text-[#bae6fd]">Hour-By-Hour Rapid Plan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {itinerarySteps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/50 border border-sky-400/15 rounded-2xl p-6 space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-400/10 inline-block">
                    {step.time}
                  </span>
                  <h3 className="font-serif font-bold text-base text-white">{step.title}</h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">{step.desc}</p>
                </div>
                <div className="text-[10px] font-mono text-sky-200 mt-4 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {step.location}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dual layout booking and helper text */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">How to Survive Dumas</h2>
            <p className="text-xs text-sky-100/80 leading-relaxed font-light">
              Dumas Beach is legendary for black volcanic mud sand and unique ghost stories in regional Gujarati culture. In direct sunlight, the black sands are hot to touch, but at dusk, they cool rapidly to invite peaceful sea tides.
              <br /><br />
              <strong>Insider Advice:</strong> Walk further south towards the quieter salt marshes to escape public noise. Avoid random snacks unless they are hot Chickpea Locho on order from the beach huts.
            </p>

            <div className="bg-sky-400/5 border border-sky-400/20 rounded-xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-sky-300 block">
                Expedition Checklist
              </span>
              <ul className="text-xs font-mono text-sky-200 space-y-1">
                <li>✓ Book secure private local rides before 08:00 AM</li>
                <li>✓ Prepare lightweight linen clothing for coastal mist</li>
                <li>✓ Ask about special local street varieties of locho</li>
              </ul>
            </div>
          </div>

          {/* Booking Guide and car arrangement form */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-sky-400/30 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
            <div className="space-y-1 text-left border-b border-sky-400/10 pb-4">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-sky-300" />
                Charter Private Tour & Drive
              </h3>
              <p className="text-xs text-sky-200 font-light">
                Secure comfortable private travel, localized audio booklets, and entry permits dynamically.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              {formSent && (
                <div className="p-4 bg-sky-900/20 border border-sky-400/30 text-sky-100 rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-300" />
                  Your 48-Hour rapid tour checklist has been logged. An expert local guide will contact you shortly.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-sky-200">Full Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Advait Desai"
                    className="w-full bg-sky-950 border border-sky-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-sky-200">Email Address*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. advait@gmail.com"
                    className="w-full bg-sky-950 border border-sky-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-sky-200">Travel Date*</label>
                  <input
                    type="date"
                    required
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                    className="w-full bg-sky-950 border border-sky-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-sky-200">Available Span*</label>
                  <select
                    value={formData.hoursCount}
                    onChange={(e) => setFormData({ ...formData, hoursCount: e.target.value })}
                    className="w-full bg-sky-950 border border-sky-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-400"
                  >
                    <option value="24">Rapid 24 Hours Express</option>
                    <option value="48">Standard 48 Hours Leisure</option>
                    <option value="72">Extended 72 Hours Slower Pace</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-sky-200">Bespoke Focus*</label>
                  <select
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    className="w-full bg-sky-950 border border-sky-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-400"
                  >
                    <option value="History & Sightseeing">Historial Castle & Gardens</option>
                    <option value="Coastal Relaxation">Dumas Coastline & Pine walks</option>
                    <option value="Colonial Food Tasting">Culinary Harbor locho expeditions</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-sky-200">Car Preference*</label>
                  <select
                    value={formData.driverClass}
                    onChange={(e) => setFormData({ ...formData, driverClass: e.target.value })}
                    className="w-full bg-sky-950 border border-sky-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-400"
                  >
                    <option value="Premium SUV">Gold Standard Premium SUV (with Wi-Fi)</option>
                    <option value="Standard Sedan">Comfort Sedan</option>
                    <option value="Local TukTuk">Traditional Guided Open Auto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-sky-200">Any specialized medical/dietary details</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Need wheelchair ramps, child seats, English/Gujarati speaking driver, or hotel transfers..."
                  rows={3}
                  className="w-full bg-sky-950 border border-sky-400/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-400 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-semibold uppercase tracking-wider py-3.5 rounded-xl transition-all"
              >
                Book Personal 48-Hour Expedition Pack
              </button>
            </form>
          </div>

        </section>

      </main>

      <footer className="bg-[#0f172a] border-t border-sky-400/10 shrink-0 text-center py-6 text-sky-300/60 text-xs">
        © {new Date().getFullYear()} Surat Insider • Rapid Tourism Delta Association
      </footer>
    </div>
  );
}
