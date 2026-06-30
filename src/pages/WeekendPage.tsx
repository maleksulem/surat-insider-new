import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { FluidLandingCursor } from "../components/FluidLandingCursor";
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
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

interface WeekendPageProps {
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
      addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function WeekendPage({
    currentUserRole,
  setCurrentUserRole,
      addInquiry,
}: WeekendPageProps) {
  // Call Dynamic SEO and Schema markup hook
  useDocumentMetadata({
    title: "Custom 48-Hour Surat Weekend Itineraries • Premium Sightseeing Tour",
    description: "Plan a seamless 48-hour premium holiday experience in Surat. Curated heritage walk guides, luxury stays, private SUV drivers, and direct WhatsApp guides.",
    keywords: "Surat Weekend Itinerary, Surat 48-Hour Trip, Surat Castle Tour, Private Driver Surat, Dumas Beach Visit, Dutch Cemetery, Surat Sightseeing",
    ogImage: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    schema: {
      "@context": "https://schema.org",
      "@type": "TouristInformationCenter",
      "name": "Surat Insider Custom Weekend Planner",
      "description": "Itinerary mapping tool designed to assemble luxurious 24-48 hour sightseeing agendas in and around Surat.",
      "url": "https://suratinsider.com/weekend",
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
    <div 
      className="relative min-h-screen bg-[#FDFCFB] text-[#1A1614] flex flex-col font-sans selection:bg-[#B8860B]/20 selection:text-[#1A1614] overflow-x-hidden"
    >
      <FluidLandingCursor theme="vacation" />

      {/* Abstract Map Grid Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1A1614_1px,transparent_1px)] bg-[size:40px_40px]" />
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <path d="M-100,200 C200,100 400,300 1200,150" stroke="#1A1614" strokeWidth="1" fill="none" className="animate-draw" />
        </svg>
      </div>

      {/* Back CTA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-left">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 text-[#1A1614]/30 hover:text-[#B8860B] transition-all text-[10px] uppercase tracking-[0.5em] font-black group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Imperial Portal
        </Link>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        
        {/* Editorial Heading Section */}
        <section className="relative group">
          <div className="absolute -inset-4 bg-[#B8860B]/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-8 max-w-5xl text-left"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1614]/5 border border-[#1A1614]/10 text-[10px] font-mono uppercase tracking-[0.4em] text-[#1A1614]/60">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                Sovereign Expedition
              </span>
              <h1 className="font-serif text-6xl md:text-9xl font-black tracking-tighter text-[#1A1614] leading-[0.85]">
                The 48-Hour <br />
                <span className="text-[#B8860B] italic font-normal">Passport.</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-[#4A423D] leading-relaxed max-w-2xl font-light">
              Don't waste a single hour. Walk the historical high points of the golden Tapi delta, investigate Dutch garden tombs, and experience sunset at Dumas coast.
            </p>
          </motion.div>
        </section>

        {/* 48-Hour Itinerary Timeline Row */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 border-b border-[#1A1614]/10 pb-6">
            <Sunset className="w-6 h-6 text-[#B8860B]" />
            <h2 className="font-serif text-3xl font-bold text-[#1A1614] tracking-tight">The Chronology of Discovery</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1A1614]/10 to-transparent -translate-y-1/2 -z-10" />
            
            {itinerarySteps.map((step, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                key={idx}
                className="group relative bg-white border border-[#1A1614]/5 rounded-[2.5rem] p-8 space-y-6 shadow-xl hover:shadow-2xl hover:border-[#B8860B]/20 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="inline-flex px-3 py-1 rounded-full bg-[#B8860B]/10 text-[9px] font-mono font-black text-[#B8860B] tracking-widest uppercase border border-[#B8860B]/10">
                    {step.time}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#1A1614] leading-tight group-hover:text-[#B8860B] transition-colors">{step.title}</h3>
                  <p className="text-sm text-[#4A423D] font-light leading-relaxed">{step.desc}</p>
                </div>
                <div className="pt-6 border-t border-[#1A1614]/5 text-[9px] font-mono text-[#1A1614]/40 flex items-center gap-2 uppercase tracking-widest font-black">
                  <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
                  {step.location}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dual layout booking and helper text */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl font-extrabold text-[#1A1614] leading-tight">Surviving <br />the <span className="text-[#B8860B] italic font-normal">Dumas Coast</span></h2>
              <p className="text-lg text-[#4A423D] leading-relaxed font-light">
                Dumas Beach is legendary for black volcanic mud sand and unique ghost stories. In direct sunlight, the sands are hot to touch, but at dusk, they cool rapidly to invite peaceful tides.
              </p>
            </div>

            <div className="bg-[#1A1614] text-white rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#B8860B]/10 blur-[80px] rounded-full" />
              <div className="relative z-10 space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-[0.4em] font-black text-[#B8860B] block">
                  Expedition Protocol
                </span>
                <ul className="space-y-6">
                  {[
                    "Book secure private local rides before 08:00 AM for peak mobility.",
                    "Prepare lightweight linen clothing for coastal mist and shifting temps.",
                    "Engage only with beach hut locho masters for authentic safety."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-sm font-light text-white/70">
                      <div className="w-6 h-6 rounded-full border border-[#B8860B]/30 flex items-center justify-center text-[10px] font-mono text-[#B8860B] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Guide and car arrangement form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[4rem] p-8 md:p-16 shadow-2xl border border-[#1A1614]/5 space-y-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B]/5 -translate-y-16 translate-x-16 rounded-full" />
              
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-[#FDFCFB] border border-[#1A1614]/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Car className="w-10 h-10 text-[#B8860B]" />
                </div>
                <h3 className="font-serif text-4xl font-bold text-[#1A1614]">
                  Charter Expedition
                </h3>
                <p className="text-base text-[#4A423D]/60 font-light">
                  Secure private travel and localized audio guides.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 text-sm">
                {formSent && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-[#B8860B]/5 border border-[#B8860B]/10 text-[#1A1614] rounded-3xl font-medium text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-[#B8860B] mx-auto mb-3" />
                    <p className="text-lg">Your 48-Hour expedition checklist is logged. An expert will be in touch.</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-4">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Advait Desai"
                      className="w-full bg-[#FDFCFB] border border-[#1A1614]/10 rounded-2xl p-5 focus:outline-none focus:border-[#1A1614] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-4">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="advait@domain.com"
                      className="w-full bg-[#FDFCFB] border border-[#1A1614]/10 rounded-2xl p-5 focus:outline-none focus:border-[#1A1614] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-4">Arrival</label>
                    <input
                      type="date"
                      required
                      value={formData.arrivalDate}
                      onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                      className="w-full bg-[#FDFCFB] border border-[#1A1614]/10 rounded-2xl p-5 focus:outline-none focus:border-[#1A1614] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-4">Span</label>
                    <select
                      value={formData.hoursCount}
                      onChange={(e) => setFormData({ ...formData, hoursCount: e.target.value })}
                      className="w-full bg-[#FDFCFB] border border-[#1A1614]/10 rounded-2xl p-5 focus:outline-none focus:border-[#1A1614] transition-all appearance-none cursor-pointer"
                    >
                      <option value="24">Rapid (24h)</option>
                      <option value="48">Standard (48h)</option>
                      <option value="72">Extended (72h)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-4">Bespoke Focus</label>
                    <select
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      className="w-full bg-[#FDFCFB] border border-[#1A1614]/10 rounded-2xl p-5 focus:outline-none focus:border-[#1A1614] transition-all appearance-none cursor-pointer"
                    >
                      <option value="History & Sightseeing">History & Forts</option>
                      <option value="Coastal Relaxation">Coastal Walks</option>
                      <option value="Colonial Food Tasting">Culinary Expeditions</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-4">Charter Class</label>
                    <select
                      value={formData.driverClass}
                      onChange={(e) => setFormData({ ...formData, driverClass: e.target.value })}
                      className="w-full bg-[#FDFCFB] border border-[#1A1614]/10 rounded-2xl p-5 focus:outline-none focus:border-[#1A1614] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Premium SUV">Premium SUV (Gold)</option>
                      <option value="Standard Sedan">Comfort Sedan</option>
                      <option value="Local TukTuk">Guided TukTuk</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-4">Special Requests</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Medical details, child seats, language preferences..."
                    rows={4}
                    className="w-full bg-[#FDFCFB] border border-[#1A1614]/10 rounded-[2rem] p-6 focus:outline-none focus:border-[#1A1614] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1A1614] hover:bg-[#B8860B] text-white text-[10px] font-black uppercase tracking-[0.5em] py-6 rounded-2xl transition-all duration-700 shadow-xl"
                >
                  Confirm Charter Pack
                </button>
              </form>
            </div>
          </div>

        </section>

      </main>

      <footer className="relative z-10 bg-[#1A1614] border-t border-white/5 shrink-0 text-center py-12 text-white/20 text-[9px] font-mono uppercase tracking-[0.5em] mt-auto">
        © {new Date().getFullYear()} Surat Insider • The Coastal Expedition Authority
      </footer>
    </div>
  );
}
