import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Map as MapIcon, 
  ArrowLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Tag,
  Compass,
  Sparkles,
  Command,
  X
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { FluidLandingCursor } from '../components/FluidLandingCursor';
import { 
  UNIFIED_DISCOVERY_DATA, 
  DISCOVERY_COLLECTIONS, 
  SMART_SUGGESTIONS,
  DiscoveryItem 
} from '../data/discovery';

const CATEGORY_COLORS: Record<string, string> = {
  Place: '#B8860B',
  Restaurant: '#FFD700',
  Hotel: '#E5E4E2',
  Shopping: '#FFFAF0',
  Experience: '#87CEEB',
  Event: '#FFB6C1'
};

export function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);

  const categories = ['Place', 'Restaurant', 'Hotel', 'Shopping', 'Experience', 'Event'];

  const filteredResults = useMemo(() => {
    if (!searchQuery && !selectedCategory) return [];
    
    return UNIFIED_DISCOVERY_DATA.filter(item => {
      const matchesQuery = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || item.type === selectedCategory;
      
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const showSuggestions = !searchQuery && !selectedCategory;

  const getTimeContext = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { label: "Morning Light", icon: "🌅" };
    if (hour < 17) return { label: "Afternoon Glow", icon: "☀️" };
    if (hour < 20) return { label: "Golden Hour", icon: "🌇" };
    return { label: "Surti Night", icon: "🌙" };
  };

  const timeContext = getTimeContext();

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#1A1614] flex flex-col font-sans overflow-hidden">
      <FluidLandingCursor theme="insider" />

      {/* Background Textures */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1A1614_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.02]" />
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#B8860B]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      </div>

      <Navbar currentTab="" setCurrentTab={() => {}} currentUserRole="Guest" setCurrentUserRole={() => {}} />

      <main className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Discovery Header */}
        <header className="mb-12 space-y-8">
          <div className="space-y-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-[#1A1614]/30 hover:text-[#B8860B] transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              The Portal
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] text-[8px] font-mono font-black uppercase tracking-[0.3em] flex items-center gap-2">
                {timeContext.icon} {timeContext.label}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#1A1614]/10" />
              <span className="text-[8px] font-mono font-black uppercase tracking-[0.3em] text-[#1A1614]/20">
                Live Curation
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Unified <span className="text-[#B8860B] italic font-normal">Discovery.</span>
            </h1>
          </div>

          {/* Search Bar & Categories */}
          <div className="space-y-6">
            <div className={`relative group transition-all duration-500 ${isFocused ? 'scale-[1.01]' : ''}`}>
              <div className="absolute inset-0 bg-[#1A1614]/5 blur-xl group-hover:bg-[#B8860B]/10 transition-colors rounded-[2.5rem]" />
              <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] p-2 flex items-center shadow-2xl border border-[#1A1614]/5">
                <div className="flex-1 flex items-center px-4 md:px-8">
                  <SearchIcon className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-[#B8860B]' : 'text-[#1A1614]/20'}`} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search places, flavors, or silk threads..."
                    className="w-full bg-transparent border-none focus:ring-0 text-lg md:text-xl py-4 md:py-6 px-4 placeholder:text-[#1A1614]/20 font-light"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-2 hover:bg-[#1A1614]/5 rounded-full text-[#1A1614]/40 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="hidden md:flex items-center gap-2 px-6 border-l border-[#1A1614]/10 text-[10px] font-mono text-[#1A1614]/40 uppercase tracking-widest">
                  <Command className="w-3 h-3" />
                  K
                </div>
              </div>
            </div>

                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                          selectedCategory === cat 
                            ? 'bg-[#1A1614] text-white border-[#1A1614]' 
                            : 'bg-white text-[#1A1614]/40 border-[#1A1614]/5 hover:border-[#B8860B]/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                    <button 
                      onClick={() => setShowMapOnMobile(!showMapOnMobile)}
                      className={`md:hidden px-6 py-2.5 rounded-full text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-500 border flex items-center gap-2 ${
                        showMapOnMobile ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-[#1A1614]/40 border-[#1A1614]/5'
                      }`}
                    >
                      <MapIcon className="w-3 h-3" />
                      {showMapOnMobile ? 'List View' : 'Map View'}
                    </button>
                  </div>
          </div>
        </header>

        {/* Results / Discovery Canvas */}
        <section className="flex-1">
          <AnimatePresence mode="wait">
            {showSuggestions ? (
              <motion.div 
                key="suggestions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-16"
              >
                {/* Smart Suggestions */}
                <div className="space-y-6">
                  <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-[#1A1614]/30 flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#B8860B]" />
                    Editorial Routes
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SMART_SUGGESTIONS.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchQuery(s.query)}
                        className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl"
                      >
                        <img 
                          src={s.image} 
                          alt={s.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-[#1A1614]/20 to-transparent" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end text-left space-y-2">
                          <h3 className="font-serif text-2xl font-bold text-white tracking-tight leading-none group-hover:text-[#B8860B] transition-colors">
                            {s.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[8px] font-mono text-white/40 uppercase tracking-widest">
                            Explore Route <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Discoveries */}
                <div className="space-y-6">
                  <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-[#1A1614]/30 flex items-center gap-3">
                    <Compass className="w-4 h-4 text-[#B8860B]" />
                    Discoveries of the Day
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(UNIFIED_DISCOVERY_DATA || []).slice(0, 2).map((item, idx) => (
                      <Link 
                        key={item.id}
                        to={`/${(item.type || "").toLowerCase() === 'place' ? 'attractions' : (item.type || "").toLowerCase()}/${item.slug || ""}`}
                        className="group relative h-64 rounded-[3rem] overflow-hidden shadow-xl"
                      >
                        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-[#1A1614]/40 group-hover:bg-[#1A1614]/20 transition-colors" />
                        <div className="absolute inset-0 p-10 flex flex-col justify-between items-start">
                          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-mono font-black uppercase tracking-widest text-white">
                            {item.type}
                          </span>
                          <div className="space-y-2">
                            <h3 className="font-serif text-3xl font-bold text-white leading-tight">{item.title}</h3>
                            <p className="text-white/60 text-xs font-light max-w-sm line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Collections */}
                <div className="space-y-8">
                  <div className="flex items-end justify-between border-b border-[#1A1614]/5 pb-4">
                    <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-[#1A1614]/30">
                      Curated Collections
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {DISCOVERY_COLLECTIONS.map((c) => (
                      <div 
                        key={c.id}
                        className="group bg-white rounded-[3.5rem] p-10 border border-[#1A1614]/5 shadow-xl hover:shadow-2xl transition-all duration-700 flex flex-col space-y-6"
                      >
                        <div className="aspect-[2/1] rounded-[2.5rem] overflow-hidden">
                          <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-serif text-3xl font-bold text-[#1A1614]">{c.title}</h3>
                          <p className="text-sm text-[#1A1614]/40 font-light leading-relaxed">{c.description}</p>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest text-[#B8860B] group-hover:gap-4 transition-all">
                          View Collection <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : filteredResults.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                {/* Search Results List */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-widest text-[#1A1614]/30 pb-4 border-b border-[#1A1614]/5">
                    <span>{filteredResults.length} Discoveries Found</span>
                    <span>Sort by: Relevance</span>
                  </div>
                  <div className="space-y-4">
                    {filteredResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/${item.type.toLowerCase() === 'place' ? 'attractions' : item.type.toLowerCase()}/${item.slug}`}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`group flex gap-6 bg-white p-6 rounded-[2.5rem] border transition-all duration-500 shadow-lg hover:shadow-2xl ${
                          hoveredId === item.id ? 'border-[#B8860B] scale-[1.02]' : 'border-[#1A1614]/5'
                        }`}
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="flex items-start justify-between">
                            <span 
                              className="text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded"
                              style={{ 
                                backgroundColor: `${CATEGORY_COLORS[item.type]}20`,
                                color: CATEGORY_COLORS[item.type]
                              }}
                            >
                              {item.type}
                            </span>
                            <div className="flex items-center gap-1 text-[#B8860B]">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-[10px] font-mono font-bold">{item.rating}</span>
                            </div>
                          </div>
                          <h3 className="font-serif text-xl font-bold text-[#1A1614] group-hover:text-[#B8860B] transition-colors">{item.title}</h3>
                          <p className="text-xs text-[#1A1614]/40 font-light line-clamp-2 leading-relaxed">{item.description}</p>
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#1A1614]/30 uppercase tracking-widest">
                              <MapPin className="w-3 h-3" />
                              {item.location || 'Surat'}
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#1A1614]/30 uppercase tracking-widest">
                              <Tag className="w-3 h-3" />
                              {item.tags[1] || 'Surati'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Supportive Map Component */}
                <div className={`${showMapOnMobile ? 'fixed inset-0 z-[60] bg-[#FDFCFB] p-4 md:p-0 pt-24' : 'hidden'} lg:block lg:col-span-5 lg:relative lg:z-10`}>
                  {showMapOnMobile && (
                    <button 
                      onClick={() => setShowMapOnMobile(false)}
                      className="lg:hidden absolute top-8 right-8 z-[70] w-12 h-12 bg-[#1A1614] text-white rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                  <div className="sticky top-24 aspect-[4/5] h-full lg:h-auto bg-white rounded-[3rem] md:rounded-[4rem] border border-[#1A1614]/5 shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
                    
                    {/* The Stylized Tapi Curve */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                      <path 
                        d="M -100,200 C 200,100 400,350 800,250 S 1200,500 1400,400" 
                        stroke="#1A1614" 
                        strokeWidth="40" 
                        fill="none" 
                        strokeLinecap="round"
                        className="blur-3xl"
                      />
                      <path 
                        d="M -100,200 C 200,100 400,350 800,250 S 1200,500 1400,400" 
                        stroke="#1A1614" 
                        strokeWidth="1" 
                        fill="none" 
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                      {/* Zari Thread Visualization for Current Results */}
                      <svg className="w-full h-full absolute inset-0">
                        <AnimatePresence>
                          {filteredResults.length > 1 && (
                            <motion.path
                              key="zari-thread"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                              d={`M ${(filteredResults || []).slice(0, 6).map(item => `${item.coords?.x}%,${item.coords?.y}%`).join(' L ')}`}
                              stroke="#B8860B"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              fill="none"
                              className="filter drop-shadow-[0_0_8px_rgba(184,134,11,0.3)]"
                            />
                          )}
                        </AnimatePresence>
                      </svg>
                      
                      {filteredResults.map((item) => (
                        <motion.div 
                          key={item.id}
                          layoutId={`marker-${item.id}`}
                          className="absolute"
                          style={{ 
                            left: `${item.coords?.x}%`, 
                            top: `${item.coords?.y}%` 
                          }}
                        >
                          <motion.div 
                            animate={hoveredId === item.id ? { scale: 1.5, zIndex: 50 } : { scale: 1 }}
                            className={`relative w-3 h-3 rounded-full transition-colors duration-500 ${
                              hoveredId === item.id ? 'bg-[#B8860B]' : 'bg-[#1A1614]/10'
                            }`}
                          >
                            <div className={`absolute inset-0 rounded-full animate-ping bg-[#B8860B]/40 ${hoveredId === item.id ? 'block' : 'hidden'}`} />
                          </motion.div>
                          
                          <AnimatePresence>
                            {hoveredId === item.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: 10, x: '-50%' }}
                                className="absolute top-6 left-1/2 whitespace-nowrap bg-[#1A1614] text-white px-4 py-2 rounded-xl text-[8px] font-mono font-black uppercase tracking-[0.2em] shadow-2xl z-50 border border-white/10"
                              >
                                {item.title}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1614] rotate-45 border-l border-t border-white/10" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>

                    <div className="absolute bottom-10 left-10 right-10 p-8 bg-[#1A1614] rounded-[2.5rem] text-white shadow-2xl border border-white/5 backdrop-blur-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#B8860B]/20 flex items-center justify-center border border-[#B8860B]/30">
                          <Compass className="w-4 h-4 text-[#B8860B] animate-spin-slow" />
                        </div>
                        <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-[#B8860B]">The Insider Guide</span>
                      </div>
                      <p className="text-[11px] font-light leading-relaxed text-white/50 italic">
                        "Notice the cluster near the riverbend. That's the heart of the old city, where silk and spice once ruled the world."
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center space-y-8"
              >
                <div className="w-24 h-24 rounded-full bg-[#B8860B]/5 border-2 border-dashed border-[#B8860B]/20 flex items-center justify-center">
                  <Compass className="w-10 h-10 text-[#B8860B] opacity-20" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl font-bold">Uncharted Territory</h2>
                  <p className="text-sm text-[#1A1614]/40 font-light max-w-md mx-auto">
                    The thread doesn't seem to lead there yet. <br />
                    Perhaps you'd enjoy these local favorites instead?
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSearchQuery('locho')}
                    className="px-6 py-3 rounded-full bg-[#1A1614] text-white text-[10px] font-mono font-black uppercase tracking-widest"
                  >
                    Explore Food
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('Place')}
                    className="px-6 py-3 rounded-full bg-white border border-[#1A1614]/10 text-[#1A1614] text-[10px] font-mono font-black uppercase tracking-widest"
                  >
                    Heritage Sites
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>

      <footer className="relative z-10 border-t border-[#1A1614]/5 bg-white py-12 text-center mt-auto">
        <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-[#1A1614]/20">
          Surat Insider • Discovery Engine Alpha
        </p>
      </footer>
    </div>
  );
}
