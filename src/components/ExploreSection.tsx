import React, { useState } from "react";
import { Destination, Tour, FoodSpot, Inquiry } from "../types";
import { MapPin, Clock, Compass, HelpCircle, Utensils, Star, Info, MessageSquare, ChevronRight, Check } from "lucide-react";
import { motion } from "motion/react";

interface ExploreSectionProps {
  destinations: Destination[];
  tours: Tour[];
  foodSpots: FoodSpot[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  searchQuery: string;
}

export function ExploreSection({
  destinations,
  tours,
  foodSpots,
  addInquiry,
  searchQuery,
}: ExploreSectionProps) {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Destination category filter
  const categories = ["All", "Heritage", "Nature", "Family Activities", "Religious Places", "Food Experiences"];

  // Search filter and category filter
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  return (
    <div className="space-y-12" id="world-discovery-system-header">
      {/* Category Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand-200 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-brand-emerald-950">
            Heritage, Nature & Sights
          </h2>
          <p className="text-sm text-brand-charcoal/60 mt-1">
            Carefully curated local master-trail detailing iconic sights of historic Surat.
          </p>
        </div>
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-brand-emerald-900 text-brand-sand-50 shadow-md"
                  : "bg-brand-sand-200 text-brand-charcoal-light hover:bg-brand-sand-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="destinations-grid">
        {filteredDestinations.map((dest) => (
          <motion.div
            key={dest.id}
            id={`dest-card-${dest.id}`}
            onClick={() => setSelectedDest(dest)}
            className="group cursor-pointer bg-white rounded-2xl border border-brand-sand-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-64 overflow-hidden bg-brand-sand-100">
              <img
                src={dest.image}
                alt={dest.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-emerald-950/90 text-brand-sand-50 text-[10px] uppercase font-mono tracking-wider font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                  {dest.category}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-brand-sand-50/95 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 border border-brand-sand-200">
                <Star className="w-3.5 h-3.5 fill-brand-gold-500 text-brand-gold-500" />
                <span className="text-xs font-bold text-brand-emerald-950 font-mono">{dest.rating}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-emerald-950 group-hover:text-brand-emerald-800 transition-colors">
                  {dest.title}
                </h3>
                <p className="text-xs text-brand-charcoal/50 mt-1 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-brand-gold-500 text-brand-gold-400 shrink-0" />
                  {dest.location}
                </p>
                <p className="text-sm text-brand-charcoal-light/90 mt-3 line-clamp-3 leading-relaxed">
                  {dest.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-brand-sand-100 flex items-center justify-between">
                <span className="text-xs font-mono text-brand-gold-500 font-semibold group-hover:underline">
                  View Curated Itinerary
                </span>
                <ChevronRight className="w-4 h-4 text-brand-gold-500 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDestinations.length === 0 && (
          <div className="col-span-full py-16 bg-brand-sand-100/50 rounded-2xl border-2 border-dashed border-brand-sand-200 flex flex-col items-center justify-center p-6 text-center">
            <Compass className="w-12 h-12 text-brand-emerald-900/35 mb-3" />
            <span className="font-serif text-lg font-bold text-brand-emerald-950">No Spots Discovered</span>
            <p className="text-xs text-brand-charcoal/60 mt-1 max-w-sm">
              We couldn't find items matches "{searchQuery}". Search for landmarks, street dishes or wedding stores.
            </p>
          </div>
        )}
      </div>

      {/* Destination Detailed Itinerary Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 bg-brand-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-sand-50 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up border border-brand-sand-200">
            {/* Header */}
            <div className="relative h-64 md:h-80 shrink-0 bg-brand-sand-200">
              <img
                src={selectedDest.image}
                alt={selectedDest.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <button
                onClick={() => setSelectedDest(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all shadow-md z-10"
              >
                ✕
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-brand-gold-500 text-brand-emerald-950 text-[10px] font-mono tracking-widest font-bold uppercase px-3 py-1 rounded inline-block">
                  {selectedDest.category}
                </span>
                <h3 className="font-serif text-2xl md:text-4xl font-extrabold tracking-tight">
                  {selectedDest.title}
                </h3>
                <p className="text-sm opacity-90 flex items-center gap-1.5 font-sans font-medium">
                  <MapPin className="w-4 h-4 text-brand-gold-300" />
                  {selectedDest.location}
                </p>
              </div>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Story */}
              <div className="space-y-3">
                <span className="text-xs text-brand-gold-500 font-mono uppercase tracking-[0.2em] font-semibold block">
                  The Curated Story
                </span>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-charcoal-light font-normal text-justify">
                  {selectedDest.story || selectedDest.description}
                </p>
              </div>

              {/* Specifications Block - Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-brand-sand-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-emerald-800 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs text-brand-charcoal/60 uppercase font-mono font-semibold tracking-wider">
                        Visiting Hours & Admission
                      </h4>
                      <p className="text-sm font-semibold text-brand-emerald-950 mt-0.5">
                        {selectedDest.visitingHours || "08:00 AM - 06:00 PM"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Compass className="w-5 h-5 text-brand-emerald-800 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs text-brand-charcoal/60 uppercase font-mono font-semibold tracking-wider">
                        Best Time to Visit
                      </h4>
                      <p className="text-sm font-semibold text-brand-emerald-950 mt-0.5">
                        {selectedDest.bestTimeToVisit || "October to March (Winds)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs text-brand-charcoal/60 uppercase font-mono font-semibold tracking-wider">
                    Nearby Sights & Treasures
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDest.nearbyAttractions?.map((attr) => (
                      <span
                        key={attr}
                        className="bg-brand-sand-100 text-brand-emerald-950 text-xs font-medium px-2.5 py-1 rounded"
                      >
                        📍 {attr}
                      </span>
                    )) || <span className="text-xs text-brand-charcoal/50">Dutch Gardens, Chauta Bazar</span>}
                  </div>
                </div>
              </div>

              {/* Hourly Itinerary */}
              <div className="bg-brand-emerald-950 text-brand-sand-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-gold-400" />
                  <h4 className="font-serif text-lg font-bold tracking-wide">
                    Suggested Hour-by-Hour Trail
                  </h4>
                </div>
                <p className="text-xs opacity-80 leading-relaxed font-sans font-light">
                  {selectedDest.suggestedItinerary || "We recommend starting in the early hours around 8 AM. Grab delicious Surati Locho at Jani's, and then stroll into the historic core of Surat Castle by 10 AM. Carry a high resolution camera."}
                </p>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 bg-brand-sand-100 border-t border-brand-sand-200 flex justify-end">
              <button
                onClick={() => setSelectedDest(null)}
                className="px-6 py-2.5 bg-brand-emerald-950 text-brand-sand-50 hover:bg-brand-emerald-900 rounded-xl text-xs font-semibold tracking-wider transition-colors"
              >
                Close Trail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Tours Packages */}
      <div className="bg-brand-sand-100/60 rounded-3xl p-8 md:p-12 border border-brand-sand-200 mt-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-brand-gold-500 font-bold block">
            Custom Curator Programs
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-brand-emerald-950">
            Private Curated Expeditions
          </h2>
          <p className="text-sm text-brand-charcoal/60 leading-relaxed">
            Direct specialized tours guided by master textile operators and resident chroniclers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tours.map((tour) => (
            <motion.div
              key={tour.id}
              className="bg-white rounded-2xl overflow-hidden border border-brand-sand-200/80 shadow-md flex flex-col md:flex-row hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, scale: 1.012 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="md:w-2/5 relative h-48 md:h-auto bg-brand-sand-100">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-brand-gold-500 text-brand-emerald-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  ★ Popular Tour
                </div>
              </div>

              <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-gold-500 uppercase font-mono font-bold">
                      ⏱️ {tour.duration}
                    </span>
                    <span className="text-sm font-bold text-brand-emerald-950 font-mono">
                      From ₹{tour.pricing} / head
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-emerald-950">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-brand-charcoal-light/90 leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTour(tour)}
                    className="flex-1 bg-brand-sand-100 hover:bg-brand-sand-200 text-brand-emerald-950 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    View Itinerary Map
                  </button>
                  <button
                    onClick={() => setSelectedTour(tour)}
                    className="flex-1 bg-brand-emerald-900 hover:bg-brand-emerald-800 text-brand-sand-50 font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    Inquire Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tour Detail & Inquiry Modal */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 bg-brand-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-sand-50 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up border border-brand-sand-200">
            <div className="bg-brand-emerald-950 p-6 text-brand-sand-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold-400 font-mono">
                  Curated Tour Itinerary • {selectedTour.duration}
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedTour.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTour(null)}
                className="text-brand-sand-100 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-mono text-brand-gold-500 font-semibold">
                  Scheduled Program Progression
                </h4>
                
                <div className="space-y-3">
                  {selectedTour.itinerary?.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-white p-3.5 rounded-lg border border-brand-sand-200">
                      <span className="bg-brand-gold-500/10 text-brand-emerald-950 text-xs font-bold font-mono h-6 w-6 rounded-full flex items-center justify-center shrink-0 border border-brand-gold-400/20">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-brand-charcoal-light leading-relaxed">{step}</p>
                    </div>
                  )) || (
                    <p className="text-xs text-brand-charcoal/50">Itinerary content being formulated by expert travel managers.</p>
                  )}
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-brand-sand-100 p-5 rounded-xl border border-brand-sand-200 space-y-3">
                <h4 className="text-xs uppercase font-semibold text-brand-emerald-950 font-mono tracking-wider">
                  Make a Custom Guided Inquiry
                </h4>
                <p className="text-[11px] text-brand-charcoal/60 leading-normal">
                  Send details. Our partner tour operators will arrange personalized cars, guides, hotel pick-ups.
                </p>

                {inquirySent === selectedTour.id ? (
                  <div className="bg-emerald-900/15 border border-emerald-800/30 p-3.5 rounded-lg flex items-center gap-2 text-emerald-900 text-xs font-semibold">
                    <Check className="w-4 h-4 shrink-0" />
                    Inquiry submitted! Admin will contact you via email shortly.
                  </div>
                ) : (
                  <form onSubmit={(e) => handleInquirySubmit(e, { id: selectedTour.id, title: selectedTour.title, type: "tour" })} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Your Name*</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white text-xs px-3 py-2 border border-brand-sand-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Your Email*</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white text-xs px-3 py-2 border border-brand-sand-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Contact Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91"
                        className="w-full bg-white text-xs px-3 py-2 border border-brand-sand-200 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Special Request</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Dates, headcount and specific language requested..."
                        rows={2}
                        className="w-full bg-white text-xs px-3 py-2 border border-brand-sand-200 rounded-lg outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-emerald-950 text-brand-sand-50 hover:bg-brand-emerald-900 transition-colors py-2 rounded-xl text-xs font-semibold"
                    >
                      Process Tour Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Food Discovery Trails */}
      <div className="space-y-6 pt-8">
        <div className="space-y-1">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-brand-gold-500 font-bold block">
            Guaranteed Taste Masterclasses
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-brand-emerald-950">
            Surati Street Food Trails
          </h2>
          <p className="text-xs md:text-sm text-brand-charcoal/60">
            Why Surat's culinary treasures are celebrated throughout the length of India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodSpots.map((spot) => (
            <motion.div
              key={spot.id}
              className="bg-white rounded-xl border border-brand-sand-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, scale: 1.012 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="h-40 bg-brand-sand-100 rounded-lg overflow-hidden relative">
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-brand-emerald-950 text-brand-sand-50 text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                  {spot.category}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-brand-emerald-950">{spot.title}</h3>
                  <span className="text-brand-gold-500 font-mono text-xs font-bold">{spot.priceLevel}</span>
                </div>

                <p className="text-xs text-brand-charcoal/50 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-brand-gold-500" />
                  {spot.location}
                </p>

                <p className="text-xs text-brand-charcoal-light leading-relaxed line-clamp-3">
                  {spot.description}
                </p>
              </div>

              <div className="bg-brand-sand-100 p-3 rounded-lg border border-brand-sand-200">
                <span className="text-[9px] uppercase font-mono text-brand-gold-500 font-extrabold block">Must Try Pairing:</span>
                <p className="text-xs font-medium text-brand-emerald-950 mt-0.5">{spot.mustTry}</p>
              </div>

              <div className="text-[10px] font-mono text-brand-charcoal/50">
                🕐 Timings: {spot.timings || "07:00 AM - 10:00 PM"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
