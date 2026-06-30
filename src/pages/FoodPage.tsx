import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { FluidLandingCursor } from "../components/FluidLandingCursor";
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
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

interface FoodPageProps {
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
      addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
}

export function FoodPage({
    currentUserRole,
  setCurrentUserRole,
      addInquiry,
}: FoodPageProps) {
  // Call Dynamic SEO and Schema markup hook
  useDocumentMetadata({
    title: "Surat Street Food & Fine Dining Culinary Tour Guide",
    description: "The definitive foodie tour of Surat. Discover the most iconic spots for Surati Locho, butter Khaman, ghari, Undhiyu, and street food feasts.",
    keywords: "Surati Locho, Surat Food Tour, Surat Street Food, Ghari Sweet, Undhiyu, Dumas Road Food Plaza, Surat Restaurants",
    ogImage: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    schema: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Surat Culinary Food Tour",
      "description": "Premium guided culinary tour exploring the legendary authentic street foods of Surat including Locho, Ghari and Ponk.",
      "touristType": "Foodies & Culinary Tourists",
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
    <div 
      className="relative min-h-screen bg-[#FFFBF0] text-[#1A1614] flex flex-col font-sans selection:bg-[#B8860B]/30 selection:text-[#1A1614] overflow-x-hidden"
    >
      <FluidLandingCursor theme="food" />

      {/* Warm Ambient Glows simulating candlelight/street lamps */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[#FFD700]/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#B8860B]/10 blur-[150px] rounded-full" />
      </div>

      {/* Back CTA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-left">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 text-[#1A1614]/40 hover:text-[#B8860B] transition-all text-[10px] uppercase tracking-[0.4em] font-black group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          The Imperial Portal
        </Link>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        
        {/* Editorial Food Hero */}
        <section className="relative h-[80vh] rounded-[3rem] overflow-hidden group shadow-2xl">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=2000&auto=format&fit=crop" 
            alt="Authentic Surti Cuisine"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-[#1A1614]/20 to-transparent" />
          
          {/* Subtle "Steam" Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-30 mix-blend-overlay animate-pulse" />

          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-20 space-y-8 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-mono uppercase tracking-[0.4em] text-white/90">
                <Utensils className="w-3.5 h-3.5 text-[#B8860B]" />
                The Tasting Table
              </span>
              <h1 className="font-serif text-6xl md:text-9xl font-black tracking-tighter leading-[0.8]">
                Butter <br />
                <span className="text-[#B8860B] italic font-normal">& Spice.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-2xl">
                Experience a city styled by its nocturnal bazaar culture, where life is feasted upon directly from the streets.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Informative Grid of Taste Specialties */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          {localDelicacies.map((hl, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="group space-y-8"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#B8860B]/10">
                <div className="absolute inset-0 bg-[#B8860B]/5 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame className="w-12 h-12 text-[#B8860B]/20 group-hover:text-[#B8860B] transition-all duration-500 group-hover:scale-125" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-3xl font-bold text-[#1A1614] tracking-tight">{hl.title}</h3>
                <p className="text-base text-[#4A423D] leading-relaxed font-light">{hl.desc}</p>
                <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-[#B8860B] tracking-widest uppercase bg-[#B8860B]/5 px-3 py-1.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5" />
                  {hl.spots}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Dual layout with history and tour registration form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center px-4">
          
          {/* Secrets of Surat Locho */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="font-serif text-5xl font-black text-[#1A1614] leading-[1.1]">The <span className="text-[#B8860B] italic font-normal">Nocturnal</span> <br />Bazaar Culture</h2>
              <p className="text-lg text-[#4A423D] leading-relaxed font-light">
                When the sun dips, families migrate to Chowk Bazar to consume Butter Locho, sizzling garlic khaman, and giant thalis under the neon glow.
              </p>
            </div>

            <div className="bg-[#1A1614] text-white rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8860B]/10 blur-[80px] rounded-full group-hover:bg-[#B8860B]/20 transition-all duration-700" />
              <div className="relative z-10 space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-[0.4em] font-black text-[#B8860B] block">
                  Gastronomy Checklist
                </span>
                <ul className="space-y-6">
                  {[
                    "Look for bubbling hot steam vents to verify freshness.",
                    "Always enjoy locho immediately — cold locho is forbidden.",
                    "Try the authentic spicy garlic mint chutney pairing."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-sm font-light text-white/70">
                      <CheckCircle className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Crawl registration form */}
          <div className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-[#B8860B]/10 blur-[120px] rounded-full -z-10" />
            <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl border border-[#B8860B]/5 space-y-12">
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-[#B8860B]/5 border border-[#B8860B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-10 h-10 text-[#B8860B]" />
                </div>
                <h3 className="font-serif text-4xl font-bold text-[#1A1614]">
                  Midnight Safari
                </h3>
                <p className="text-base text-[#4A423D]/60 font-light italic">
                  Guided nocturnal food tours with local historians.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 text-sm">
                {formSent && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-[#B8860B]/5 border border-[#B8860B]/20 text-[#1A1614] rounded-[2rem] font-medium text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-[#B8860B] mx-auto mb-3" />
                    <p className="text-lg">Your secret Midnight Food Crawl seats are locked! Watch for coordinates.</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Neil Patel"
                      className="w-full bg-[#FFFBF0] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="neil@domain.com"
                      className="w-full bg-[#FFFBF0] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-2">Tour Date</label>
                    <input
                      type="date"
                      required
                      value={formData.tourDate}
                      onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                      className="w-full bg-[#FFFBF0] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-2">Party Size</label>
                    <select
                      value={formData.spotsCount}
                      onChange={(e) => setFormData({ ...formData, spotsCount: e.target.value })}
                      className="w-full bg-[#FFFBF0] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all appearance-none cursor-pointer"
                    >
                      <option value="1">Solo Explorer (1)</option>
                      <option value="2">Couple (2)</option>
                      <option value="4">Group Suite (4+)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-2">Diet</label>
                    <select
                      value={formData.diet}
                      onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                      className="w-full bg-[#FFFBF0] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Vegetarian">Pure Vegetarian</option>
                      <option value="Jain Food">Strictly Jain</option>
                      <option value="Everything">No dietary limits</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-2">Spice Level</label>
                    <select
                      value={formData.spiceTolerance}
                      onChange={(e) => setFormData({ ...formData, spiceTolerance: e.target.value })}
                      className="w-full bg-[#FFFBF0] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Low Heat">Mild</option>
                      <option value="Medium Surt Heat">Medium (Surt Standard)</option>
                      <option value="Extreme Surt Locho Spice">Absolute Surt Heat</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#1A1614]/40 ml-2">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[#FFFBF0] border border-[#B8860B]/10 text-[#1A1614] rounded-2xl p-5 focus:outline-none focus:border-[#B8860B] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B8860B] hover:bg-[#1A1614] text-white text-[10px] font-black uppercase tracking-[0.5em] py-6 rounded-2xl transition-all duration-700 shadow-xl"
                >
                  Register For Midnight Safari
                </button>
              </form>
            </div>
          </div>

        </section>

      </main>

      <footer className="relative z-10 bg-[#1A1614] border-t border-white/5 shrink-0 text-center py-12 text-white/30 text-[10px] font-mono uppercase tracking-[0.5em] mt-auto">
        © {new Date().getFullYear()} Surat Insider • The Surati Food Guild Association
      </footer>
    </div>
  );
}
