import React, { useState } from "react";
import { FoodSpot, Inquiry } from "../types";
import { Utensils, MapPin, Clock, Search, Star, Heart, Flame, ShieldCheck, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FoodSectionProps {
  foodSpots: FoodSpot[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  searchQuery: string;
}

export function FoodSection({ foodSpots, addInquiry, searchQuery }: FoodSectionProps) {
  const [activeFoodCategory, setActiveFoodCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPlatter, setSelectedPlatter] = useState<{ id: string; name: string; price: number }[]>([]);
  const [showOrderSent, setShowOrderSent] = useState(false);

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
    <div className="space-y-12 animate-fade-in" id="food-trails-tab-view">
      
      {/* Editorial Food Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-sand-200">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-brand-gold-500 font-bold block">
            The Culinary Capital of Gujarat
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-brand-emerald-950 tracking-tight">
            Surat Food Trails & Locho Hubs
          </h1>
          <p className="text-sm text-brand-charcoal/65 max-w-2xl leading-relaxed">
            As the saying goes, <em className="text-brand-emerald-900 font-semibold font-serif">"Surat nu Jaman ne Kashi nu Maran"</em> (Eat in Surat, Die in Varanasi) is a testament to the glorious, rich street delicacies. Explore certified iconic spots.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFoodCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                activeFoodCategory === cat
                  ? "bg-brand-emerald-900 text-brand-sand-50 shadow-md border-b-2 border-brand-gold-400"
                  : "bg-brand-sand-200 text-brand-charcoal-light hover:bg-brand-sand-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Food Spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredSpots.map((spot) => (
            <motion.div
              layout
              key={spot.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-brand-sand-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-56 bg-brand-sand-100 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className="bg-brand-emerald-950 text-brand-sand-50 text-[10px] uppercase font-mono tracking-wider font-bold px-2.5 py-1 rounded shadow-md border border-white/10">
                    {spot.category}
                  </span>
                  <span className="bg-brand-gold-500 text-brand-emerald-950 font-bold font-mono text-[9px] px-2 py-1 rounded shadow uppercase">
                    {spot.priceLevel} Pricing
                  </span>
                </div>

                <button
                  onClick={() => toggleFavorite(spot.id)}
                  className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow border border-brand-sand-200 hover:scale-110 active:scale-95 transition-all text-rose-500"
                >
                  <Heart className={`w-4 h-4 transition-colors ${favorites.includes(spot.id) ? "fill-rose-500 text-rose-500" : "text-brand-charcoal/50"}`} />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-brand-emerald-950 group-hover:text-brand-emerald-900 transition-colors">
                    {spot.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs font-mono text-brand-charcoal/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold-500" />
                      {spot.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-gold-500" />
                      {spot.timings || "09:00 AM - 11:00 PM"}
                    </span>
                  </div>

                  <p className="text-xs text-brand-charcoal-light/95 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                {/* Mustard Colored 'Must Try' Section */}
                <div className="bg-brand-sand-100 p-4 rounded-xl border border-brand-sand-200 flex items-start gap-2.5">
                  <Flame className="w-4 h-4 text-orange-600 shrink-0 mt-0.5 animate-bounce" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-brand-gold-600 block">
                      Insider Must-Try Recommendation:
                    </span>
                    <p className="text-xs font-semibold text-brand-emerald-950">
                      {spot.mustTry}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSpots.length === 0 && (
          <div className="col-span-full py-16 bg-brand-sand-100/50 rounded-2xl border-2 border-dashed border-brand-sand-200 text-center flex flex-col items-center justify-center p-6">
            <Utensils className="w-12 h-12 text-brand-charcoal/30 mb-3" />
            <span className="font-serif text-[18px] font-bold text-brand-emerald-950">No Culinary Spots Found</span>
            <p className="text-xs text-brand-charcoal/60 mt-1 max-w-sm">
              We couldn't discover any spots matched with your active queries. Clear search or try typing "Locho".
            </p>
          </div>
        )}
      </div>

      {/* Surt Feast Platter Interactive Widget */}
      <div className="bg-brand-emerald-950/95 text-white rounded-3xl p-8 md:p-12 border border-brand-gold-500/20 shadow-2xl relative overflow-hidden">
        {/* Subtle glowing decorations */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-brand-gold-500/5 blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="bg-brand-gold-400 text-brand-emerald-950 text-[10px] font-mono tracking-widest font-bold uppercase px-3 py-1 rounded-full inline-block">
              Culinary Interactive Playground
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-brand-sand-50 leading-tight">
              Assemble Your Curated Surt Platter
            </h2>
            <p className="text-sm text-brand-sand-200 leading-relaxed max-w-lg font-light">
              Craft your custom legendary feast by adding Surati elements. Calculate pricing, check historical backgrounds, and book a customized delivery concierge program!
            </p>

            {/* Grid of options to build a plate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              {localSignatureItems.map((item) => {
                const isSelected = selectedPlatter.find(p => p.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => isSelected ? removeFromPlatter(item.id) : addToPlatter(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                      isSelected 
                        ? "bg-brand-gold-400/10 border-brand-gold-400 text-brand-gold-300" 
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold font-sans">{item.name}</h4>
                      <p className="text-[10px] opacity-70 truncate max-w-[150px] font-normal leading-tight">{item.desc}</p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded shrink-0">
                      ₹{item.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platter Billing Review Box */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 md:p-8 text-brand-charcoal shadow-2xl flex flex-col justify-between border border-brand-sand-200 h-full min-h-[350px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-brand-sand-200 pb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-brand-gold-500" />
                  <span className="font-serif font-bold text-brand-emerald-950">Feast Plate Assembly</span>
                </div>
                <span className="text-[10px] font-mono bg-brand-emerald-950/10 text-brand-emerald-950 py-0.5 px-2 rounded-full font-bold">
                  ITEMS: {selectedPlatter.length}
                </span>
              </div>

              {selectedPlatter.length === 0 ? (
                <div className="py-12 text-center text-brand-charcoal/40 flex flex-col items-center justify-center space-y-1.5">
                  <Flame className="w-8 h-8 text-brand-sand-200 animate-pulse" />
                  <p className="text-xs font-medium">Add items on the left to start cooking!</p>
                  <p className="text-[10px] max-w-xs leading-normal">Your virtual digestive journey adjusts rates, ingredients and local history tags.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedPlatter.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-xs bg-brand-sand-50 p-2.5 rounded border border-brand-sand-200">
                      <span className="font-semibold text-brand-emerald-950">🥞 {p.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-emerald-950">₹{p.price}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFromPlatter(p.id); }}
                          className="text-red-500 hover:text-red-700 font-bold px-1.5"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-brand-sand-200 pt-5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-brand-charcoal">Sum Estimated Platter Price:</span>
                <span className="font-mono text-lg font-black text-brand-emerald-950">
                  ₹{calculatePlatterTotal()}
                </span>
              </div>

              {selectedPlatter.length > 0 && (
                <>
                  {showOrderSent ? (
                    <div className="bg-emerald-900/15 text-emerald-800 p-3 rounded-xl border border-emerald-800/20 flex items-center gap-2 text-xs font-bold justify-center">
                      <Check className="w-4 h-4 text-emerald-800" />
                      Gastronomy trail booking saved! Our concierge will email you.
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowOrderSent(true);
                        setTimeout(() => {
                          setShowOrderSent(false);
                          setSelectedPlatter([]);
                        }, 5000);
                      }}
                      className="w-full bg-brand-emerald-950 hover:bg-brand-emerald-900 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-brand-gold-400" />
                      Reserve Culinary Concierge Trail
                    </button>
                  )}
                  <p className="text-[10px] text-brand-charcoal/50 text-center font-mono leading-normal">
                    *Tours are fully customized, catering for dietary needs, veganism and gluten-free.
                  </p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
