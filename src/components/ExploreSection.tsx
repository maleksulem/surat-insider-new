import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Destination, Tour, FoodSpot, Inquiry, CuratedExperience } from "../types";
import { MapPin, Clock, Compass, HelpCircle, Utensils, Star, Info, MessageSquare, ChevronRight, Check, Search, X, ArrowUpRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SafeImage } from "./SafeImage";

interface ExploreSectionProps {
  destinations: CuratedExperience[];
  shoppingGuides?: CuratedExperience[];
  tours: CuratedExperience[];
  foodSpots: FoodSpot[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function ExploreSection({
  destinations,
  shoppingGuides = [],
  tours,
  foodSpots,
  addInquiry,
  triggerWhatsAppMessage,
  searchQuery,
  setSearchQuery,
}: ExploreSectionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // All destination categories
  const categories = ["All", "Heritage", "Nature", "Family Activities", "Religious Places", "Food Experiences"];

  // Search filter and category filter
  const filteredDestinations = (destinations || []).filter((dest) => {
    const matchesSearch =
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || dest.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isFilteringActive = searchQuery.length > 0 || activeCategory !== "All";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
      {/* Search & Category Filter Command Bar */}
      <section className="space-y-8 bg-brand-sand-100/50 p-8 md:p-12 rounded-[2.5rem] border border-[#1A1614]/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-brand-gold-500 font-bold block">Discovery Portal</span>
            <h2 className="font-serif text-3xl font-black text-[#1A1614] tracking-tight">Search Curated Experiences</h2>
          </div>
          
          {/* Elegant Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1614]/30" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search beaches, temples, old forts..."
              className="w-full pl-11 pr-10 py-3.5 bg-white rounded-full border border-[#1A1614]/10 text-sm placeholder:text-[#1A1614]/30 focus:outline-none focus:ring-1 focus:ring-brand-gold-500 focus:border-brand-gold-500 transition-all font-light"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-sand-100 rounded-full text-[#1A1614]/40 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Selector */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1A1614] text-white border-[#1A1614] shadow-md scale-105"
                  : "bg-white text-[#1A1614]/50 border-[#1A1614]/5 hover:border-brand-gold-500/30 hover:text-[#1A1614]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Render Filtered Search Results directly if any filter is active */}
      <AnimatePresence mode="wait">
        {isFilteringActive ? (
          <motion.section 
            key="filtered-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between border-b border-[#1A1614]/5 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1614]/40">
                Found {filteredDestinations.length} experiences in "{activeCategory}"
              </span>
              {isFilteringActive && (
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="text-xs font-mono text-brand-gold-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredDestinations.map((site, idx) => (
                  <motion.div 
                    key={site.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/experience/${site.id}`)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#1A1614]/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <SafeImage 
                        src={site.image} 
                        alt={site.title} 
                        fallbackType="destination"
                        className="block w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-brand-gold-600 font-bold border border-[#1A1614]/5">
                        {site.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-bold text-[#1A1614] group-hover:text-brand-gold-600 transition-colors">
                          {site.title}
                        </h3>
                        <p className="text-xs text-[#1A1614]/50 leading-relaxed font-light line-clamp-3">
                          {site.shortDescription || (site as any).description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-brand-sand-200/50 text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/40">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {site.location?.split(",")[0] || "Surat"}</span>
                        <span className="flex items-center gap-1 text-brand-gold-500 font-bold"><Star className="w-3 h-3 fill-current" /> {site.rating || "4.5"}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-brand-sand-50 rounded-2xl border border-dashed border-[#1A1614]/10">
                <Compass className="w-12 h-12 text-brand-gold-400 animate-spin-slow" />
                <h3 className="font-serif text-2xl font-bold">No Experiences Found</h3>
                <p className="text-sm text-[#1A1614]/40 max-w-sm font-light">
                  No curated experiences match "{searchQuery}" in category "{activeCategory}". Try general terms like "beach" or "castle".
                </p>
              </div>
            )}
          </motion.section>
        ) : (
          <motion.div 
            key="default-editorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-32"
          >
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
                    onClick={() => navigate(`/experience/${site.id}`)}
                    className={`${idx === 0 ? 'md:col-span-7' : idx === 1 ? 'md:col-span-5' : 'md:col-span-12'} group relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-sand-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700`}
                  >
                    <SafeImage 
                      src={site.image} 
                      alt={site.title} 
                      fallbackType="destination"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 cursor-pointer" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-45 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-brand-gold-400 font-bold mb-3 block">Discovery • {site.location?.split(",")[1] || "Surat"}</span>
                      <h3 className="text-brand-sand-50 font-serif text-3xl font-bold flex items-center gap-4">
                        {site.title}
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0" />
                      </h3>
                      <p className="text-brand-sand-50/60 text-sm mt-3 max-w-sm font-light leading-relaxed">{site.shortDescription || (site as any).description}</p>
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
              <SafeImage 
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=80" 
                className="block absolute inset-0 w-full h-full object-cover"
                alt="Expert Edit"
                fallbackType="tour"
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
                  <button className="px-12 py-4 bg-brand-gold-500 text-[#1A1614] rounded-full text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl cursor-pointer">
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
                    onClick={() => navigate(`/experience/${site.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                      <SafeImage 
                        src={site.image} 
                        alt={site.title} 
                        fallbackType="destination"
                        className="block w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 cursor-pointer"
                      />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1A1614] group-hover:text-brand-gold-600 transition-colors">{site.title}</h3>
                    <p className="text-sm text-[#1A1614]/40 mt-1 font-mono tracking-wider uppercase text-[10px]">{site.location}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* All Curated Chronicles (Solves the "only four / max capacity is 4" issue completely) */}
            <section className="space-y-12 pt-8 border-t border-[#1A1614]/5">
              <div className="max-w-xl space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-brand-gold-500 font-bold block">Bespoke Collection</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1614] tracking-tight">
                  All Curated Experiences
                </h2>
                <p className="text-base text-[#1A1614]/50 leading-relaxed font-light">
                  A comprehensive directory of every premium nature refuge, historical relic, and urban sanctuary. Fully browsable and updated live from our chronicles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {(destinations || []).map((site, idx) => (
                  <motion.div 
                    key={site.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, type: "spring", stiffness: 60 }}
                    onClick={() => navigate(`/experience/${site.id}`)}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-[#1A1614]/5 hover:shadow-lg transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="aspect-[16/11] overflow-hidden relative">
                      <SafeImage 
                        src={site.image} 
                        alt={site.title} 
                        fallbackType="destination"
                        className="block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute bottom-3 left-3 bg-[#1A1614]/90 text-brand-sand-50 px-2.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest font-black">
                        {site.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#1A1614] group-hover:text-brand-gold-600 transition-colors line-clamp-1">{site.title}</h4>
                        <p className="text-xs text-[#1A1614]/50 leading-relaxed font-light line-clamp-2 mt-1">
                          {site.shortDescription || (site as any).description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest text-[#1A1614]/40 pt-2 border-t border-[#1A1614]/5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {site.location?.split(",")[0] || "Surat"}</span>
                        <span className="flex items-center gap-1 text-brand-gold-500"><Star className="w-2.5 h-2.5 fill-current" /> {site.rating || "4.5"}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shortcuts & Quick-Teaser Grid (Combination of Explore and Main Portal Pages) */}
      <section className="space-y-12 pt-16 border-t border-[#1A1614]/10">
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-brand-gold-500 font-bold block">Quick Shortcuts</span>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-[#1A1614] tracking-tight">
            Curated Sourcing & Culinary Trails
          </h2>
          <p className="text-sm text-[#1A1614]/50 font-light leading-relaxed">
            Shortcuts to our partner catalogs. Explore a curated snippet of Surat's premier shopping centers and gourmet hotspots, then jump to the full registers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Sourcing/Shopping Shortcuts */}
          <div className="bg-brand-sand-100/40 p-8 rounded-[2rem] border border-[#1A1614]/5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-gold-100 flex items-center justify-center text-brand-gold-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1614]">The Sourcing Edit</h3>
              </div>
              <p className="text-xs text-[#1A1614]/50 font-light leading-relaxed">
                Direct pipelines to the city's celebrated textile hubs, master lehenga artisans, and legendary diamond merchants.
              </p>
            </div>

            {/* Snippet Cards (1-2 Guides) */}
            <div className="space-y-4">
              {(shoppingGuides || []).slice(0, 2).map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => navigate(`/experience/${guide.id}`)}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-[#1A1614]/5 hover:border-brand-gold-500/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <SafeImage src={guide.image} alt={guide.title} fallbackType="shopping" className="block w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-[#1A1614] truncate group-hover:text-brand-gold-600 transition-colors">{guide.title}</h4>
                    <p className="text-xs text-[#1A1614]/40 font-light truncate mt-0.5">{guide.shortDescription}</p>
                  </div>
                  <div className="flex items-center shrink-0 text-brand-gold-500">
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate("/textile")}
              className="w-full py-3.5 bg-[#1A1614] hover:bg-brand-gold-500 text-white hover:text-[#1A1614] rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              Browse Sourcing Guides
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Culinary/Food Shortcuts */}
          <div className="bg-brand-sand-100/40 p-8 rounded-[2rem] border border-[#1A1614]/5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-gold-100 flex items-center justify-center text-brand-gold-600">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1614]">The Culinary Trail</h3>
              </div>
              <p className="text-xs text-[#1A1614]/50 font-light leading-relaxed">
                The authentic taste of Surat—from spicy Surati Locho stalls at Chowk to legacy sweet shops dating back centuries.
              </p>
            </div>

            {/* Snippet Cards (1-2 Food Spots) */}
            <div className="space-y-4">
              {(foodSpots || []).slice(0, 2).map((spot) => (
                <div 
                  key={spot.id}
                  onClick={() => navigate(`/food/${spot.id}`)}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-[#1A1614]/5 hover:border-brand-gold-500/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <SafeImage src={spot.image} alt={spot.title} fallbackType="food" className="block w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-[#1A1614] truncate group-hover:text-brand-gold-600 transition-colors">{spot.title}</h4>
                    <p className="text-xs text-[#1A1614]/40 font-light truncate mt-0.5">{spot.description || spot.mustTry}</p>
                  </div>
                  <div className="flex items-center shrink-0 text-brand-gold-500">
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate("/food")}
              className="w-full py-3.5 bg-[#1A1614] hover:bg-brand-gold-500 text-white hover:text-[#1A1614] rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              Browse Food Spots
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* Unified Collaboration Invitation */}
      <section className="py-16 bg-brand-sand-50 rounded-[3rem] border border-[#1A1614]/5">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center space-y-8 p-12 md:p-20"
        >
          <div className="space-y-6 max-w-2xl">
            <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-brand-gold-500 font-bold block mb-4">Collaboration</span>
            <h3 className="font-serif text-4xl md:text-5xl font-black text-[#1A1614] tracking-tight leading-tight">
              Join the Collective
            </h3>
            <p className="text-sm text-[#1A1614]/40 font-light leading-relaxed">
              A direct channel for hotel operators, master weavers, and culinary directors to join the Surat Insider collective.
            </p>
          </div>
          <motion.button 
            onClick={() => navigate("/work-with-us")}
            whileHover={{ scale: 1.05, backgroundColor: "#B8860B" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="px-16 py-5 bg-[#1A1614] text-white rounded-full text-xs font-bold tracking-[0.4em] uppercase transition-colors shadow-2xl flex items-center gap-4 group cursor-pointer"
          >
            Work With Us
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
