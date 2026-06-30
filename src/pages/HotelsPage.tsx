import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { FluidLandingCursor } from "../components/FluidLandingCursor";
import { SafeImage } from "../components/SafeImage";
import { 
  Hotel, 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Wifi, 
  Coffee, 
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import { Role, Inquiry, Hotel as HotelType } from "../types";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

interface HotelsPageProps {
  hotels: HotelType[];
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
}

export function HotelsPage({
  hotels,
  currentUserRole,
  setCurrentUserRole,
  addInquiry,
  triggerWhatsAppMessage
}: HotelsPageProps) {
  const navigate = useNavigate();

  useDocumentMetadata({
    title: "Luxury Hotels & Boutique Stays in Surat • Best Places to Stay",
    description: "Discover the finest luxury hotels and boutique accommodations in Surat. From river-view suites to heritage stays.",
    keywords: "Surat Hotels, Luxury Stay Surat, Courtyard Marriott Surat, Gateway Hotel Surat, Best Hotels in Surat",
  });

  return (
    <div className="relative min-h-screen bg-[#FFFDF5] text-[#1A1614] flex flex-col font-sans selection:bg-[#B8860B]/20 overflow-x-hidden pb-16">
      <FluidLandingCursor theme="hotels" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#B8860B] hover:text-[#B8860B]/80 transition-colors text-xs uppercase tracking-widest font-mono font-bold group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Imperial Portal
        </Link>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        <section className="space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-brand-gold-500 font-bold block">Sanctuary</span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#1A1614] tracking-tight">The Insider Vault: <span className="text-brand-gold-500 italic">Hotels</span></h1>
          <p className="text-lg text-[#1A1614]/40 font-light max-w-2xl leading-relaxed">
            A curated selection of the city's pre-eminent retreats. From global luxury to boutique heritage.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {hotels.map((hotel, idx) => (
            <motion.div 
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(`/hotel/${hotel.id}`)}
              className="group cursor-pointer space-y-6"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-[2rem] shadow-xl relative">
                <SafeImage src={hotel.image} alt={hotel.title} fallbackType="hotel" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(hotel.rating) ? 'text-brand-gold-400 fill-brand-gold-400' : 'text-white/20'}`} />
                    ))}
                  </div>
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] text-white font-mono uppercase tracking-widest">
                    Request Booking
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-3xl font-bold text-[#1A1614] group-hover:text-brand-gold-600 transition-colors">{hotel.title}</h3>
                  <div className="flex items-center gap-2 text-brand-gold-500">
                    <span className="text-xl font-serif font-bold">{hotel.pricePerNight ? `₹${hotel.pricePerNight}` : (hotel as any).priceRange}</span>
                    {hotel.pricePerNight && <span className="text-[10px] uppercase font-mono tracking-widest opacity-40">/night</span>}
                  </div>
                </div>
                <p className="text-sm text-[#1A1614]/50 leading-relaxed font-light line-clamp-2">{hotel.description || (hotel as any).shortDescription}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {(hotel.amenities || (hotel as any).highlights || []).slice(0, 3).map((amenity: any, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-[#1A1614]/40 uppercase tracking-widest">
                      <CheckCircle className="w-3 h-3 text-brand-gold-500" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
