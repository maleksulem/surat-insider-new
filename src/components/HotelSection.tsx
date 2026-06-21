import React, { useState } from "react";
import { Hotel, Inquiry } from "../types";
import { Coffee, MapPin, Phone, Star, Tag, Check, ArrowRight, Wifi, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HotelSectionProps {
  hotels: Hotel[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  searchQuery: string;
}

export function HotelSection({
  hotels,
  addInquiry,
  searchQuery,
}: HotelSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
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
      hotel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "All" || hotel.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent, hotel: Hotel) => {
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
          <h2 className="font-serif text-3xl font-bold text-brand-emerald-950">
            Hotel Recommendations & Stays
          </h2>
          <p className="text-sm text-brand-charcoal/60 mt-1">
            Vetted safe, hospitality-driven stays ideal for shoppers, business traders, and luxury seekers.
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
                  ? "bg-brand-emerald-900 text-brand-sand-50"
                  : "bg-brand-sand-200 text-brand-charcoal hover:bg-brand-sand-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHotels.map((hotel) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl border border-brand-sand-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative h-56 bg-brand-sand-100">
                <img
                  src={hotel.image}
                  alt={hotel.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-3 left-3 bg-brand-emerald-950/90 text-brand-sand-50 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
                  {hotel.category}
                </div>

                <div className="absolute top-3 right-3 bg-brand-sand-50/90 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1 border border-brand-sand-200 text-xs font-bold text-brand-emerald-950">
                  <Star className="w-3 h-3 fill-brand-gold-500 text-brand-gold-500" />
                  {hotel.rating}
                </div>

                <div className="absolute bottom-3 right-3 bg-brand-emerald-950 text-brand-sand-100 px-3 py-1 rounded text-xs font-bold font-mono">
                  From ₹{hotel.pricePerNight} / Night
                </div>
              </div>

              {/* Info content */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-brand-emerald-950">{hotel.title}</h3>
                  <p className="text-xs text-brand-charcoal/50 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-brand-gold-500 shrink-0" />
                    {hotel.location}
                  </p>
                </div>

                <p className="text-xs text-brand-charcoal-light leading-relaxed line-clamp-3">
                  {hotel.description}
                </p>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1">
                  {hotel.amenities?.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-brand-sand-100 text-brand-emerald-900 border border-brand-sand-200 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md"
                    >
                      ✓ {amenity}
                    </span>
                  )) || <span className="text-[10px] text-brand-charcoal/40">Free Wifi, Dining</span>}
                </div>
              </div>
            </div>

            {/* Inquiry form prompt block */}
            <div className="p-5 bg-brand-sand-100 border-t border-brand-sand-200 space-y-3">
              {inquirySent === hotel.id ? (
                <div className="bg-emerald-900/15 border border-emerald-800/30 p-3 rounded-lg text-emerald-900 text-[11px] font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Room inquiry dispatched!
                </div>
              ) : (
                <button
                  onClick={() => setSelectedHotel(hotel)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-emerald-950 hover:bg-brand-emerald-900 text-brand-sand-50 rounded-xl text-xs font-semibold tracking-wide transition-colors"
                >
                  Book / Request Rates Inquiry
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="text-[10px] text-brand-charcoal/50 text-center flex items-center justify-center gap-1">
                <Coffee className="w-3 h-3 text-brand-gold-500" />
                In-house restaurant options available
              </div>
            </div>
          </motion.div>
        ))}

        {filteredHotels.length === 0 && (
          <div className="col-span-full py-16 text-center bg-brand-sand-100/50 rounded-2xl border-2 border-dashed border-brand-sand-200">
            <p className="font-serif text-lg font-bold text-brand-emerald-950">No Listings matches filters</p>
            <p className="text-xs text-brand-charcoal/50 mt-1">Try another search terms or select "All".</p>
          </div>
        )}
      </div>

      {/* Hotel Reservation / Inquiry Form Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 bg-brand-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-sand-50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-brand-sand-200">
            <div className="bg-brand-emerald-950 p-6 text-brand-sand-50 flex items-center justify-between border-b border-brand-emerald-900">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand-gold-400">
                  Secure Partner Pricing Inquiry
                </span>
                <h3 className="font-serif text-xl font-bold tracking-tight">
                  Inquire rooms: {selectedHotel.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="text-brand-sand-100/80 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-brand-gold-500/10 p-3.5 rounded-lg border border-brand-gold-400/20 text-xs text-brand-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-brand-gold-500" />
                  Why Book via Surat Insider VIP?
                </div>
                <p className="text-brand-charcoal-light text-[11px] leading-relaxed">
                  Get complimentary airport shuttle service, early check-in, and exclusive discounts for textile market travelers.
                </p>
              </div>

              {inquirySent === selectedHotel.id ? (
                <div className="bg-emerald-900/15 border border-emerald-800/30 p-4 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  Your booking request has been successfully dispatch to {selectedHotel.title}. The sales head will email dynamic quotes within hours!
                </div>
              ) : (
                <form
                  onSubmit={(e) => handleSubmit(e, selectedHotel)}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Full Name*</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Email to reach*</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+91"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Expected Guests</label>
                      <select
                        value={formData.hcount}
                        onChange={(e) => setFormData({ ...formData, hcount: e.target.value })}
                        className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500"
                      >
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>3 - 5 Guests</option>
                        <option>Group Booking (&gt; 5 rooms)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Dates & Requirements</label>
                    <textarea
                      placeholder="Check-in, Check-out dates and any required airport pickup or thali reservations..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-emerald-950 text-brand-sand-50 hover:bg-brand-emerald-900 transition-colors py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
                  >
                    Send Rate Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
