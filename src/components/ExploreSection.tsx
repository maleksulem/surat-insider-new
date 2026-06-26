import React, { useState } from "react";
import { Destination, Tour, FoodSpot, Inquiry, CuratedExperience } from "../types";
import { MapPin, Clock, Compass, HelpCircle, Utensils, Star, Info, MessageSquare, ChevronRight, Check, Search, X, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { ExperienceDetailModal } from "./ExperienceDetailModal";

interface ExploreSectionProps {
  destinations: CuratedExperience[];
  tours: CuratedExperience[];
  foodSpots: FoodSpot[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function ExploreSection({
  destinations,
  tours,
  foodSpots,
  addInquiry,
  triggerWhatsAppMessage,
  searchQuery,
  setSearchQuery,
}: ExploreSectionProps) {
  const [selectedDest, setSelectedDest] = useState<CuratedExperience | null>(null);
  const [selectedTour, setSelectedTour] = useState<CuratedExperience | null>(null);
  const [selectedFoodSpot, setSelectedFoodSpot] = useState<CuratedExperience | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Destination category filter
  const categories = ["All", "Heritage", "Nature", "Family Activities", "Religious Places", "Food Experiences"];

  // Search filter and category filter
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || dest.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Hot Itinerary states & forms
  const [inquirySent, setInquirySent] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInquirySubmit = (e: React.FormEvent, item: { id: string; title: string; type: "hotel" | "tour" | "general" }) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addInquiry({
      itemId: item.id,
      itemTitle: item.title,
      itemType: item.type,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || `Hi, I am interested in ${item.title}. Please provide more details.`,
    });

    setInquirySent(item.id);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setInquirySent(null), 4000);
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 100]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
      {/* Heritage & Landmarks Moment */}
      <section className="space-y-12">
        <div className="max-w-xl">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="font-serif text-4xl md:text-5xl font-bold text-[#1A1614] tracking-tight"
          >
            Heritage & Landmarks
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="text-base text-[#1A1614]/50 mt-4 leading-relaxed font-light"
          >
            Traces of the Dutch, Portuguese, and British legacies woven into the modern fabric of the city.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {(destinations || []).filter(d => d.category === "Heritage").slice(0, 3).map((site, idx) => (
            <motion.div 
              key={site.id}
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                delay: idx * 0.15, 
                type: "spring", 
                stiffness: 50, 
                damping: 15,
                mass: 1.2
              }}
              onClick={() => setSelectedDest(site)}
              className={`${idx === 0 ? 'md:col-span-7' : idx === 1 ? 'md:col-span-5' : 'md:col-span-12'} group relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-sand-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700`}
            >
              <motion.img 
                src={site.image} 
                alt={site.title} 
                style={{ y: idx % 2 === 0 ? y1 : y2 }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 cursor-pointer" 
                onClick={() => setSelectedDest(site)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-brand-gold-400 font-bold mb-3 block">Discovery • {site.location}</span>
                <h3 className="text-brand-sand-50 font-serif text-3xl font-bold flex items-center gap-4">
                  {site.title}
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0" />
                </h3>
                <p className="text-brand-sand-50/60 text-sm mt-3 max-w-sm font-light leading-relaxed">{site.shortDescription}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Expert Edit - Full Bleed Moment */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative h-[60vh] md:h-[80vh] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-3xl"
      >
        <img 
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=80" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Expert Edit"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-6">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase font-mono tracking-[0.4em] text-brand-gold-400 font-bold">
                Private Expeditions
              </span>
              <h2 className="font-serif text-5xl md:text-7xl font-bold text-brand-sand-50 leading-tight">
                The Expert Edit
              </h2>
              <p className="text-lg text-brand-sand-50/80 font-light max-w-lg mx-auto leading-relaxed">
                Immersive journeys led by master chroniclers and textile experts. Beyond the reachable.
              </p>
            </div>
            <button className="px-12 py-4 bg-brand-gold-500 text-[#1A1614] rounded-full text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl">
              Request Access
            </button>
          </div>
        </div>
      </motion.section>

      {/* The Coastline Moment */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1614] tracking-tight">
              The Coastline
            </h2>
            <p className="text-base text-[#1A1614]/50 mt-4 leading-relaxed font-light">
              Where the Tapi meets the Arabian Sea. Quiet horizons and black sands.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(destinations || []).filter(d => d.category === "Nature").slice(0, 3).map((site, idx) => (
            <motion.div 
              key={site.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedDest(site)}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                <img 
                  src={site.image} 
                  alt={site.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 cursor-pointer"
                  onClick={() => setSelectedDest(site)}
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1A1614] group-hover:text-brand-gold-600 transition-colors">{site.title}</h3>
              <p className="text-sm text-[#1A1614]/40 mt-1 font-mono tracking-wider uppercase text-[10px]">{site.location}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modals */}
      {selectedDest && (
        <ExperienceDetailModal
          item={selectedDest}
          onClose={() => setSelectedDest(null)}
          addInquiry={addInquiry}
          triggerWhatsAppMessage={triggerWhatsAppMessage}
        />
      )}
      {selectedTour && (
        <ExperienceDetailModal
          item={selectedTour}
          onClose={() => setSelectedTour(null)}
          addInquiry={addInquiry}
          triggerWhatsAppMessage={triggerWhatsAppMessage}
        />
      )}
      {selectedFoodSpot && (
        <ExperienceDetailModal
          item={selectedFoodSpot}
          onClose={() => setSelectedFoodSpot(null)}
          addInquiry={addInquiry}
          triggerWhatsAppMessage={triggerWhatsAppMessage}
        />
      )}

      {/* Unified Collaboration Invitation */}
      <section className="py-32 bg-brand-sand-50">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-[#1A1614]/5 rounded-[3rem] p-12 md:p-24 shadow-2xl shadow-brand-sand-300/50 flex flex-col items-center text-center space-y-12"
        >
          <div className="space-y-6 max-w-2xl">
            <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-brand-gold-500 font-bold block mb-4">Collaboration</span>
            <h3 className="font-serif text-4xl md:text-6xl font-black text-[#1A1614] tracking-tight leading-tight">
              Join the Collective
            </h3>
            <p className="text-lg text-[#1A1614]/40 font-light leading-relaxed">
              A direct channel for hotel operators, master weavers, and culinary directors to join the Surat Insider collective.
            </p>
          </div>
          <motion.button 
            onClick={() => window.location.href = "/work-with-us"}
            whileHover={{ scale: 1.05, backgroundColor: "#B8860B" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="px-16 py-6 bg-[#1A1614] text-white rounded-full text-xs font-bold tracking-[0.4em] uppercase transition-colors shadow-2xl flex items-center gap-4 group"
          >
            Work With Us
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
