import React, { useState } from "react";
import { ShoppingGuide, Inquiry } from "../types";
import { Sparkles, MapPin, Check, Info, ShieldCheck, Phone, Mail, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

interface ShoppingSectionProps {
  shoppingGuides: ShoppingGuide[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  searchQuery: string;
}

export function ShoppingSection({
  shoppingGuides,
  addInquiry,
  searchQuery,
}: ShoppingSectionProps) {
  const [selectedGuide, setSelectedGuide] = useState<ShoppingGuide | null>(null);
  const [inquirySent, setInquirySent] = useState<string | null>(null);
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
      guide.whatToBuy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleInquirySubmit = (e: React.FormEvent, guide: ShoppingGuide) => {
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

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-brand-sand-200 pb-5">
        <h2 className="font-serif text-3xl font-extrabold text-brand-emerald-950">
          The Bridal & Textile Shopping Bible
        </h2>
        <p className="text-sm text-brand-charcoal/60 mt-1 max-w-2xl leading-relaxed">
          Surat supplies 40% of India's luxurious wedding silk, Tanchois, and diamonds. Skip the middlemen and access certified, wholesale-price looms directly with our curated directives.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {filteredGuides.map((guide) => (
          <motion.div
            key={guide.id}
            className="bg-white rounded-2xl border border-brand-sand-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              {/* Cover Photo */}
              <div className="relative h-64 bg-brand-sand-100">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-emerald-950 text-brand-sand-50 uppercase text-[9px] font-mono font-bold tracking-wider px-3 py-1 rounded">
                    {guide.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-brand-sand-50/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-brand-emerald-950 border border-brand-sand-200">
                  Price: <span className="text-brand-gold-500 font-mono font-bold">{guide.priceRange}</span>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 md:p-8 space-y-5">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-brand-emerald-950">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-brand-charcoal/60 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-4 h-4 text-brand-gold-500 shrink-0" />
                    {guide.location}
                  </p>
                </div>

                <p className="text-sm text-brand-charcoal-light/90 leading-relaxed">
                  {guide.description}
                </p>

                {/* What to buy */}
                <div className="bg-brand-sand-100 p-4.5 rounded-xl border border-brand-sand-200 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-gold-500 font-bold block">
                    Curated Specialties:
                  </span>
                  <p className="text-xs text-brand-emerald-900 font-medium leading-relaxed">
                    {guide.whatToBuy}
                  </p>
                </div>

                {/* Insider Warning Badge */}
                <div className="bg-brand-emerald-950 text-brand-sand-50 p-4.5 rounded-xl border border-brand-emerald-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-brand-gold-300">
                      Insider Directives:
                    </h4>
                    <p className="text-xs opacity-90 mt-0.5 leading-relaxed font-sans">
                      {guide.insiderTips}
                    </p>
                  </div>
                </div>

                {/* Hand-selected Outlets */}
                <div className="space-y-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-brand-charcoal/50 block">
                    Vetted Outlets & Multi-brand Stands:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-brand-emerald-950 font-semibold">
                    {guide.stores?.map((store, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-brand-sand-100/50 p-2.5 rounded border border-brand-sand-200">
                        <span className="h-2 w-2 rounded-full bg-brand-gold-500 shrink-0"></span>
                        <span className="truncate">{store}</span>
                      </div>
                    )) || <span className="text-brand-charcoal/40 text-xs">Loading outlets...</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Trigger Bar */}
            <div className="p-6 bg-brand-sand-100 border-t border-brand-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-brand-charcoal/60 text-center sm:text-left flex items-center gap-1">
                <ShoppingBag className="w-4 h-4 text-brand-gold-500 shrink-0" />
                Planning bridal buying or wholesale haul?
              </span>
              <button
                onClick={() => setSelectedGuide(guide)}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-emerald-950 hover:bg-brand-emerald-900 text-brand-sand-50 rounded-xl text-xs font-semibold tracking-wide transition-colors"
              >
                Inquire Vetted Sourcing Guide
              </button>
            </div>
          </motion.div>
        ))}

        {filteredGuides.length === 0 && (
          <div className="col-span-full py-16 text-center bg-brand-sand-100/50 rounded-2xl border-2 border-dashed border-brand-sand-200">
            <p className="font-serif text-lg font-bold text-brand-emerald-950">No Sourcing Guides Found</p>
            <p className="text-xs text-brand-charcoal/50 mt-1">Try another search terms like "bridal" or "textiles".</p>
          </div>
        )}
      </div>

      {/* Sourcing Help Form Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-brand-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-sand-50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-brand-sand-200">
            <div className="bg-brand-emerald-950 p-6 text-brand-sand-50 flex items-center justify-between border-b border-brand-emerald-900">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand-gold-400">
                  Vetted Bridal & Textile Sourcing Concierge
                </span>
                <h3 className="font-serif text-xl font-bold tracking-tight">
                  Arrange procurement: {selectedGuide.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="text-brand-sand-100 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                Connect directly with certified craft guilds and authentic weaving heads. Our team schedules direct showroom viewings, transport, and custom embroidery designers.
              </p>

              {inquirySent === selectedGuide.id ? (
                <div className="bg-emerald-900/15 border border-emerald-800/30 p-4 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  Your procurement request has been registered under VIP Sourcing. An expert will reach out within 24 hours.
                </div>
              ) : (
                <form
                  onSubmit={(e) => handleInquirySubmit(e, selectedGuide)}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Your Name*</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Your Email*</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Phone Connection</label>
                    <input
                      type="text"
                      placeholder="+91"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white px-3 py-2 border border-brand-sand-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-mono text-brand-charcoal/80 font-bold">Procurement Specifics & Expected Budget</label>
                    <textarea
                      placeholder="e.g. Sourcing 3 bridal lehengas, 15 bridesmaid sarees. Expected budget: ₹2 Lakhs."
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
                    Confirm Concierge Brief
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
