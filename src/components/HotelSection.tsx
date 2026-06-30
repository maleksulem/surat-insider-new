import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel, Inquiry, CuratedExperience } from "../types";
import { Coffee, MapPin, Phone, Star, Tag, Check, ArrowRight, Wifi, ShieldAlert, Sparkles, Bed } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SafeImage } from "./SafeImage";

interface HotelSectionProps {
  hotels: CuratedExperience[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
  searchQuery: string;
}

export function HotelSection({
  hotels,
  addInquiry,
  triggerWhatsAppMessage,
  searchQuery,
}: HotelSectionProps) {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    hcount: "2 Guests",
  });
  const [inquirySent, setInquirySent] = useState<string | null>(null);

  const filters = ["All", "Luxury", "Mid-range", "Business", "Budget"];

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hotel.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "All" || hotel.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent, hotel: any) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addInquiry({
      itemId: hotel.id,
      itemTitle: hotel.title,
      itemType: "hotel",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `${formData.message || "Hi, I would like to inquire about a reservation."} (Headcount: ${formData.hcount})`,
    });

    setInquirySent(hotel.id);
    setFormData({ name: "", email: "", phone: "", message: "", hcount: "2 Guests" });
    setTimeout(() => {
      setInquirySent(null);
    }, 4000);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-sand-200 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#1A1614]">
            Curated Stays
          </h2>
          <p className="text-sm text-[#1A1614]/60 mt-1">
            A selection of hospitality-driven residences, from boutique heritage stays to world-class luxury.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === f
                  ? "bg-[#B8860B] text-brand-sand-50"
                  : "bg-transparent text-[#1A1614] hover:bg-brand-sand-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHotels.map((hotel, idx) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-2xl border border-brand-sand-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group"
          >
            <div>
              {/* Photo */}
              <div 
                onClick={() => navigate(`/hotel/${hotel.id}`)}
                className="relative h-64 bg-brand-sand-100 cursor-pointer overflow-hidden"
              >
                <SafeImage
                  src={hotel.image}
                  alt={hotel.title}
                  fallbackType="hotel"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-brand-sand-50 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                  {hotel.category}
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-brand-sand-200 text-xs font-bold text-[#1A1614]">
                  <Star className="w-3 h-3 fill-brand-gold-500 text-brand-gold-500" />
                  {hotel.rating}
                </div>

                <div className="absolute bottom-4 right-4 bg-brand-gold-500 text-[#1A1614] px-4 py-1.5 rounded-full text-xs font-bold font-mono shadow-xl">
                  {hotel.priceRange || `From ₹${(hotel as any).pricePerNight}`}
                </div>
              </div>

              {/* Info content */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#1A1614]">{hotel.title}</h3>
                  <p className="text-xs text-[#4A423D] flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-brand-gold-500 shrink-0" />
                    {hotel.location}
                  </p>
                </div>

                <p className="text-xs text-[#1A1614]-light leading-relaxed line-clamp-3">
                  {hotel.shortDescription || (hotel as any).description}
                </p>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1">
                  {(hotel.highlights || (hotel as any).amenities)?.map((amenity: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-transparent text-[#1A1614] border border-brand-sand-200 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md"
                    >
                      ✓ {amenity}
                    </span>
                  )) || <span className="text-[10px] text-[#1A1614]/40">Free Wifi, Dining</span>}
                </div>
              </div>
            </div>

            {/* Inquiry form prompt block */}
            <div className="p-5 bg-transparent border-t border-brand-sand-200 space-y-3">
              {inquirySent === hotel.id ? (
                <div className="bg-[#FFFDF5] border border-[#B8860B] p-3 rounded-lg text-[#1A1614] text-[11px] font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Room inquiry dispatched!
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#B8860B] hover:bg-[#B8860B] text-brand-sand-50 rounded-xl text-xs font-semibold tracking-wide transition-colors"
                >
                  Inquire
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="text-[10px] text-[#4A423D] text-center flex items-center justify-center gap-1">
                <Coffee className="w-3 h-3 text-brand-gold-500" />
                In-house restaurant options available
              </div>
            </div>
          </motion.div>
        ))}

        {filteredHotels.length === 0 && (
          <div className="col-span-full py-16 text-center bg-[#FFFDF5]/50 rounded-2xl border-2 border-dashed border-brand-sand-200">
            <p className="font-serif text-lg font-bold text-[#1A1614]">No Listings matches filters</p>
            <p className="text-xs text-[#4A423D] mt-1">Try another search terms or select "All".</p>
          </div>
        )}
      </div>
    </div>
  );
}
