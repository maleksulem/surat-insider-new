import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingGuide, Inquiry, CuratedExperience } from "../types";
import { Sparkles, MapPin, Check, Info, ShieldCheck, Phone, Mail, ShoppingBag, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useImageModal } from "../context/ImageModalContext";

interface ShoppingSectionProps {
  shoppingGuides: CuratedExperience[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
  searchQuery: string;
}

export function ShoppingSection({
  shoppingGuides,
  addInquiry,
  triggerWhatsAppMessage,
  searchQuery,
}: ShoppingSectionProps) {
  const navigate = useNavigate();
  const [inquirySent, setInquirySent] = useState<string | null>(null);
  const { openImage } = useImageModal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const filteredGuides = shoppingGuides.filter((guide) => {
    return (
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guide.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleInquirySubmit = (e: React.FormEvent, guide: CuratedExperience) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addInquiry({
      itemId: guide.id,
      itemTitle: guide.title,
      itemType: "shopping",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || `Need bridal/textile procurement arrangement at ${guide.title}.`,
    });

    setInquirySent(guide.id);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => {
      setInquirySent(null);
    }, 4000);
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 3000], [0, -120]);
  const y2 = useTransform(scrollY, [0, 3000], [0, 80]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
      {/* Editorial Header Moment */}
      <section className="space-y-12">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono uppercase tracking-[0.35em] text-brand-gold-500 font-bold block mb-4"
          >
            The Sourcing Collective
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-black text-[#1A1614] tracking-tight"
          >
            The Wedding Edit
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-[#1A1614]/50 mt-6 leading-relaxed font-light"
          >
            Bypass the traditional supply chain. Access the looms where India's finest silks and diamonds are born. A curated directive for the discerning buyer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {filteredGuides.map((guide, idx) => (
            <motion.div 
              key={guide.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, type: "spring", stiffness: 50, damping: 15 }}
              onClick={() => navigate(`/experience/${guide.id}`)}
              className="group cursor-pointer space-y-8"
            >
              <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-2xl shadow-sm group-hover:shadow-2xl transition-all duration-700 relative bg-brand-sand-100">
                <motion.img 
                  src={guide.image} 
                  alt={guide.title} 
                  style={{ y: idx % 2 === 0 ? y1 : y2 }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 cursor-pointer" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-700" />
                <div className="absolute top-6 right-6">
                  <span className="bg-brand-gold-500 text-[#1A1614] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-500">
                    Access Loom
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl font-bold text-[#1A1614]">{guide.title}</h3>
                  <span className="text-brand-gold-500 font-mono text-xs font-bold tracking-widest">{guide.priceRange}</span>
                </div>
                <p className="text-sm text-[#1A1614]/50 leading-relaxed font-light max-w-md">
                  {guide.shortDescription}
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-brand-sand-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-gold-500" />
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#1A1614] font-bold">Direct Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-emerald-900" />
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#1A1614] font-bold">Wholesale Value</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sourcing Help Moment */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-brand-sand-100 rounded-3xl p-12 md:p-24 flex flex-col items-center text-center space-y-10"
      >
        <div className="space-y-4 max-w-2xl">
          <Sparkles className="w-10 h-10 text-brand-gold-500 mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1614] tracking-tight">Need a Private Sourcing Guide?</h2>
          <p className="text-lg text-[#1A1614]/50 font-light leading-relaxed">
            Our master chroniclers provide direct access to non-public inventory and heritage weavers. Bespoke procurement for high-value bridal and diamond acquisitions.
          </p>
        </div>
        <button className="px-16 py-5 bg-[#1A1614] text-white rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-brand-gold-600 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
          Request Sourcing Specialist
        </button>
      </motion.section>
    </div>
  );
}
