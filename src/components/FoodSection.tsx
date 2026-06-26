import React, { useState } from "react";
import { FoodSpot, Inquiry, CuratedExperience } from "../types";
import { Utensils, MapPin, Clock, Search, Star, Heart, Flame, ShieldCheck, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ExperienceDetailModal } from "./ExperienceDetailModal";
import { useImageModal } from "../context/ImageModalContext";

interface FoodSectionProps {
  foodSpots: FoodSpot[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
  searchQuery: string;
}

export function FoodSection({ foodSpots, addInquiry, triggerWhatsAppMessage, searchQuery }: FoodSectionProps) {
  const [activeFoodCategory, setActiveFoodCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPlatter, setSelectedPlatter] = useState<{ id: string; name: string; price: number }[]>([]);
  const [showOrderSent, setShowOrderSent] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<CuratedExperience | null>(null);
  const { openImage } = useImageModal();

  // Filter spots
  const categories = ["All", "Street Food", "Local Favorites", "Cafes", "Fine Dining", "Family Restaurants"];

  const filteredSpots = foodSpots.filter((spot) => {
    const matchesSearch =
      spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.mustTry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeFoodCategory === "All" || spot.category === activeFoodCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addToPlatter = (item: { id: string; name: string; price: number }) => {
    if (selectedPlatter.find(p => p.id === item.id)) return;
    setSelectedPlatter(prev => [...prev, item]);
  };

  const removeFromPlatter = (itemId: string) => {
    setSelectedPlatter(prev => prev.filter(p => p.id !== itemId));
  };

  const calculatePlatterTotal = () => {
    return selectedPlatter.reduce((sum, p) => sum + p.price, 0);
  };

  // Sample items for the Surt Platter Simulator
  const localSignatureItems = [
    { id: "s1", name: "Surati Butter Locho", price: 80, desc: "Soft chickpea flour steamed dumpling with spices" },
    { id: "s2", name: "Randeri Khavsa", price: 120, desc: "Surat style coconut soup noodles topped with crispies" },
    { id: "s3", name: "Duma Tomato Bhajiya", price: 90, desc: "Aromatic tomato fritters recipe served on Dumas beachfront" },
    { id: "s4", name: "Madanlal Ghari Sweet", price: 250, desc: "Rich condensed-milk wedding pastry fried in pure ghee" },
    { id: "s5", name: "Farsan Cold Coco drink", price: 60, desc: "Signature thick rich chocolate cooling elixir of Surat" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
      {/* Culinary Soul Moment */}
      <section className="space-y-12">
        <div className="max-w-xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-brand-gold-500 font-bold block mb-4">
            The Culinary Soul
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-[#1A1614] tracking-tight">
            Taste Surat
          </h1>
          <p className="text-base text-[#1A1614]/50 mt-6 leading-relaxed font-light">
            A legendary culinary heritage where every flavor tells a story of the Silk Road. From roadside lochos to heritage thalis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(filteredSpots || []).slice(0, 6).map((spot, idx) => (
            <motion.div 
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedSpot(spot as any)}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500 relative bg-brand-sand-100">
                <img 
                  src={spot.image} 
                  alt={spot.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 cursor-pointer" 
                  onClick={() => setSelectedSpot(spot as any)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold-400 font-bold mb-1 block">{spot.category}</span>
                  <h3 className="text-white font-serif text-2xl font-bold">{spot.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Tasting Table Moment */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative bg-[#1A1614] rounded-3xl overflow-hidden p-8 md:p-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8 text-brand-sand-50">
            <div className="space-y-4">
              <span className="text-brand-gold-500 text-[10px] font-mono tracking-widest font-bold uppercase block">Interactive Experience</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                The Tasting Table
              </h2>
              <p className="text-base text-brand-sand-50/40 font-light leading-relaxed max-w-sm">
                Architect your ideal Surati feast. An interactive exploration of regional delicacies and heritage flavors.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {localSignatureItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      onClick={() => addToPlatter(item)}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl transition-colors text-left group cursor-pointer"
                    >
                  <div className="w-8 h-8 rounded-full bg-brand-gold-500/10 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                    🍛
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-brand-sand-50 block truncate">{item.name}</span>
                    <span className="text-[9px] text-brand-gold-500/50 font-mono">Add Plate</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
             <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-[1px] border-brand-gold-500/20 flex items-center justify-center p-8 bg-gradient-to-br from-brand-gold-500/5 to-transparent">
                <div className="absolute inset-8 border border-brand-gold-500/10 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />
                <AnimatePresence>
                   {selectedPlatter.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-2"
                      >
                         <Utensils className="w-12 h-12 text-brand-gold-500/20 mx-auto" />
                         <span className="text-[10px] font-mono text-brand-gold-500/30 uppercase tracking-[0.3em]">Awaiting Selection</span>
                      </motion.div>
                   ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                         {selectedPlatter.map((item, idx) => {
                            const angle = (idx / selectedPlatter.length) * Math.PI * 2;
                            const radius = selectedPlatter.length > 3 ? 100 : 60;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            
                            return (
                              <motion.div
                                key={`${item.id}-${idx}`}
                                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                                animate={{ scale: 1, opacity: 1, x, y }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 120, 
                                  damping: 12, 
                                  mass: 0.8 
                                }}
                                className="absolute w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-2xl shadow-2xl border border-white/20 group cursor-pointer"
                                whileHover={{ scale: 1.2, zIndex: 50 }}
                                onClick={() => removeFromPlatter(item.id)}
                              >
                                 <motion.span
                                   animate={{ rotate: [0, 5, -5, 0] }}
                                   transition={{ duration: 4, repeat: Infinity }}
                                 >
                                   🥘
                                 </motion.span>
                              </motion.div>
                            );
                         })}
                         <motion.div 
                           animate={{ scale: [1, 1.1, 1] }}
                           transition={{ duration: 4, repeat: Infinity }}
                           className="w-24 h-24 md:w-32 md:h-32 bg-brand-gold-500/10 rounded-full blur-2xl" 
                         />
                      </div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Categorical Experience Moment */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1614] tracking-tight">The Culinary Edit</h2>
          <p className="text-base text-[#1A1614]/40 font-light">From heritage traditions to modern interpretations.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Street Legends", "Traditional Thalis", "Modern Bistros", "Confectionary"].map((cat, idx) => (
            <motion.div 
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="aspect-square border border-brand-sand-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:bg-brand-sand-50 transition-all duration-500 cursor-pointer"
            >
              <div className="w-14 h-14 bg-brand-gold-500/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-gold-500/10 transition-all">
                <Star className="w-6 h-6 text-brand-gold-500/40 group-hover:text-brand-gold-500 transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1614]">{cat}</h3>
              <span className="text-[10px] font-mono text-brand-gold-500 mt-4 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <ExperienceDetailModal
          item={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          addInquiry={addInquiry}
          triggerWhatsAppMessage={triggerWhatsAppMessage}
        />
      )}
    </div>
  );
}
