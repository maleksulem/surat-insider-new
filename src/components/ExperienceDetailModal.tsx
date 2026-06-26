import React, { useState, useEffect } from "react";
import { CuratedExperience, Inquiry } from "../types";
import { 
  MapPin, 
  Clock, 
  Sparkles, 
  Compass, 
  CheckCircle, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  X,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExperienceDetailModalProps {
  item: CuratedExperience & { images?: string[] };
  onClose: () => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
}

export function ExperienceDetailModal({
  item,
  onClose,
  addInquiry,
  triggerWhatsAppMessage
 }: ExperienceDetailModalProps) {
  const [formSent, setFormSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const handleShare = async () => {
    const descriptionText = item.shortDescription || (item as any).description || "";
    const shareText = `Explore "${item.title}" - ${descriptionText.slice(0, 100)}... Discover the best of Surat on Surat Insider!`;
    const shareUrl = window.location.origin + window.location.pathname + `?item=${item.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log("Web Share cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Could not copy text: ", err);
      }
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const highlights = item.highlights || (item as any).stores || (item as any).amenities || (item as any).nearbyAttractions || [];
  const tips = item.tips || ((item as any).insiderTips ? [(item as any).insiderTips] : []) || [];
  
  // Safe access to fields that might be missing for different item types
  const timings = item.timings || (item as any).visitingHours || "Check on arrival";
  const priceRange = item.priceRange || "N/A";
  const whatsappMessage = item.whatsappMessage || `I would like to know more about ${item.title}.`;
  const estimatedDuration = item.estimatedDuration || (item as any).suggestedItinerary || "N/A";
  
  const shortDesc = item.shortDescription || (item as any).story || (item as any).description || "";
  const fullDesc = item.fullDescription || (item as any).story || (item as any).description || "";
  
  // Use images array if available, otherwise fallback to item.image, up to 7 images
  const images = (item.images && item.images.length > 0) ? item.images.slice(0, 7) : [item.image];

  // Auto-play interval of 4 seconds, pauses on manual interaction
  useEffect(() => {
    if (isAutoplayPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isAutoplayPaused]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Submit inquiry statically inside state
    addInquiry({
      itemId: item.id,
      itemTitle: item.title,
      itemType: item.category.toLowerCase().includes("market") || item.category.toLowerCase().includes("shop") || item.category.toLowerCase().includes("wear")
        ? "shopping" 
        : item.category.toLowerCase().includes("hotel") || item.category.toLowerCase().includes("venue")
          ? "hotel"
          : "tour",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || `Curated consultation requested for ${item.title}. Details: ${shortDesc}`
    });

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      onClose(); // Auto close beautifully after showing success
    }, 4000);
  };

  const handleWhatsAppClick = () => {
    // Generate beautiful custom conversion message
    const customMessage = 
      `👋 *Hello Surat Insider Team!*\n\n` +
      `I am interested in exploring *${item.title}* (${item.category}).\n\n` +
      `📍 *Location:* ${item.location}\n` +
      `⏱️ *Timings:* ${timings}\n` +
      `💰 *Rates/Range:* ${priceRange}\n\n` +
      `💬 *Inquiry:* ${whatsappMessage}`;
    
    triggerWhatsAppMessage(customMessage);
  };

  return (
    <div id={`detail-modal-${item.id}`} className="fixed inset-0 z-[1000] h-[100dvh] w-full bg-[#FFFDF5] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#FFFDF5] w-full h-full flex flex-col"
      >
        {/* Sticky Header Actions */}
        <div className="sticky top-0 z-[60] w-full flex justify-end gap-2.5 p-4 pointer-events-none">
          {/* Share Button */}
          <button
            id="share-modal-btn"
            onClick={handleShare}
            className="pointer-events-auto bg-white/90 backdrop-blur hover:bg-white text-[#1A1614] rounded-full px-4 py-2.5 flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95 text-xs font-semibold select-none border border-[#1A1614]/5"
            aria-label="Share experience details"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>

          {/* Close Button */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="pointer-events-auto bg-white/90 backdrop-blur hover:bg-white text-[#1A1614] rounded-full px-4 py-2.5 flex items-center gap-2 transition-all shadow-md hover:scale-110 active:scale-95 text-xs font-semibold"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 pb-10 overflow-y-auto hide-scrollbar">
          
          {/* Swipeable Image Gallery with Framer Motion Drag Gestures */}
          <div className="relative w-full overflow-hidden">
            <motion.div 
              className="flex w-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragStart={() => setIsAutoplayPaused(true)}
              onDragEnd={(e, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold && activeIndex < images.length - 1) {
                  setActiveIndex(activeIndex + 1);
                } else if (info.offset.x > swipeThreshold && activeIndex > 0) {
                  setActiveIndex(activeIndex - 1);
                }
              }}
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {images.map((img, idx) => (
                <div key={idx} className="w-full shrink-0 relative h-72 md:h-[400px] select-none">
                  <img
                    src={img}
                    alt={`${item.title} ${idx + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Floating Category Tag (Only on first image) */}
                  {idx === 0 && (
                    <div className="absolute top-[88px] sm:top-5 left-5 z-10 flex gap-2">
                      <span className="bg-[#B8860B] text-slate-950 text-[10px] uppercase font-mono tracking-widest font-bold px-3 py-1 rounded-md shadow-md">
                        ★ {item.category}
                      </span>
                      <span className="bg-white/90 backdrop-blur-sm text-[#1A1614] text-[10px] uppercase font-mono tracking-widest font-bold px-3 py-1 rounded-md shadow-md border border-[#B8860B]">
                        {priceRange}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
            
            {images.length > 1 && (
              <>
                {/* Desktop controls */}
                <button 
                  onClick={() => {
                    setIsAutoplayPaused(true);
                    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
                  }}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1A1614] rounded-full p-2 transition-all shadow-md z-20 hover:scale-110 active:scale-95 ${activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setIsAutoplayPaused(true);
                    if (activeIndex < images.length - 1) setActiveIndex(activeIndex + 1);
                  }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1A1614] rounded-full p-2 transition-all shadow-md z-20 hover:scale-110 active:scale-95 ${activeIndex === images.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dots indicator with dynamic size accentuation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsAutoplayPaused(true);
                        setActiveIndex(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? "bg-[#B8860B] scale-125 px-1.5" : "bg-white/60 hover:bg-white"}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 md:p-10 space-y-10 text-left bg-[#FFFDF5]">
            
            {/* Title block */}
            <div className="space-y-2">
              <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight leading-tight text-[#1A1614]">
                {item.title}
              </h2>
              <p className="text-xs md:text-sm text-[#1A1614] flex items-center gap-1.5 font-mono">
                <MapPin className="w-4 h-4 shrink-0" />
                {item.location}
              </p>
            </div>

            {/* Editorial Description Block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-8 space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-extrabold text-[#1A1614] block">
                  The Curated Insider Narrative
                </span>
                <p className="font-sans text-base md:text-lg text-[#1A1614] leading-relaxed font-semibold italic text-justify">
                  "{shortDesc}"
                </p>
                <p className="font-sans text-sm md:text-base text-[#1A1614] leading-relaxed font-normal text-justify">
                  {fullDesc}
                </p>
              </div>

              {/* Quick Metadata Card */}
              <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-[#B8860B] space-y-4 shadow-sm shrink-0">
                <h4 className="text-xs uppercase font-mono tracking-wider font-extrabold text-[#1A1614] border-b border-[#B8860B] pb-2">
                  Logistics & Core Specs
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#1A1614] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#4A423D] font-mono block">Timings</span>
                      <strong className="text-[#1A1614]">{timings}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-[#1A1614] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#4A423D] font-mono block">Best Time to Visit</span>
                      <strong className="text-[#1A1614]">{item.bestTimeToVisit}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-[#1A1614] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#4A423D] font-mono block">Suggested Duration</span>
                      <strong className="text-[#1A1614]">{estimatedDuration}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights Checklist Section */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1A1614] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1A1614] shrink-0" />
                Signature Highlights & Experiences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight: string, index: number) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl border border-[#B8860B] p-4 flex items-start gap-3 shadow-sm hover:border-[#B8860B] transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-[#1A1614] shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-[#1A1614] leading-relaxed font-normal font-sans">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Tips Block */}
            <div className="bg-[#FFFDF5] border border-[#B8860B] rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1A1614] shrink-0" />
                <h4 className="text-xs uppercase font-mono tracking-wider font-extrabold text-[#1A1614]">
                  Surat Insider Pro Directives & Travel Tips
                </h4>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tips.map((tip: string, index: number) => (
                  <li key={index} className="text-xs text-[#1A1614] leading-relaxed font-normal list-disc list-inside">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Consultation Form (CTA Section) & WhatsApp Inquiry Dual Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-[#B8860B]">
              
              {/* Direct WhatsApp Instant Action */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-[#1A1614] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl border border-white/5">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#4A423D] font-extrabold block">
                    ● INSTANT RESPONSE GATEWAY
                  </span>
                  <h4 className="font-serif text-xl font-bold leading-tight text-white">
                    Connect Directly on WhatsApp
                  </h4>
                  <p className="text-xs text-[#4A423D] leading-relaxed font-normal">
                    Skip standard wait times and connect directly with Surat's certified generational guides, weaving masters, and culinary curators instantly.
                  </p>
                </div>

                <button
                  id="whatsapp-direct-btn"
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#FFFDF5] hover:bg-[#FFFDF5] active:scale-95 text-[#1A1614] font-mono text-xs uppercase tracking-wider font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  Launch WhatsApp Chat
                </button>
              </div>

              {/* Offline-Safe Lead Registration Form */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-[#B8860B] shadow-md space-y-5">
                <div className="space-y-1 pb-3 border-b border-[#B8860B]">
                  <h4 className="font-serif text-lg font-bold text-[#1A1614]">
                    Request Curated Sourcing & Booking
                  </h4>
                  <p className="text-xs text-[#4A423D] font-normal">
                    Submit details to generate a secure lead and receive custom itinerary packages.
                  </p>
                </div>

                {formSent ? (
                  <div className="p-5 bg-[#FFFDF5] border border-[#B8860B] text-[#1A1614] rounded-xl font-sans text-xs font-semibold flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1A1614] shrink-0" />
                    <div>
                      <span className="block font-bold">Inquiry Registered Successfully!</span>
                      Our destination curators are preparing your custom package.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-mono text-[#1A1614] block mb-1">Your Full Name*</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Priyanjali Sen"
                          className="w-full bg-[#FFFDF5] border border-[#B8860B] rounded-xl px-3.5 py-2.5 text-[#1A1614] outline-none focus:border-[#B8860B] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-mono text-[#1A1614] block mb-1">Email Address*</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. priya@outlook.com"
                          className="w-full bg-[#FFFDF5] border border-[#B8860B] rounded-xl px-3.5 py-2.5 text-[#1A1614] outline-none focus:border-[#B8860B] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-[#1A1614] block mb-1">Contact Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-[#FFFDF5] border border-[#B8860B] rounded-xl px-3.5 py-2.5 text-[#1A1614] outline-none focus:border-[#B8860B] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono text-[#1A1614] block mb-1">Sourcing Specifics or Custom Itinerary Details</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Share your travel dates, party size, custom textile requests, or particular budget guidelines..."
                        rows={3}
                        className="w-full bg-[#FFFDF5] border border-[#B8860B] rounded-xl px-3.5 py-2.5 text-[#1A1614] outline-none focus:border-[#B8860B] focus:bg-white transition-all resize-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FFFDF5] hover:bg-[#B8860B] active:scale-95 text-slate-950 font-mono text-xs uppercase tracking-wider font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Official Consultation Request
                    </button>
                  </form>
                )}
              </div>
            </div>
            
            {/* Modal Footer Bar (Mobile Hidden) */}
            <div className="hidden sm:flex p-4 border-t border-[#B8860B] justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#FFFDF5] hover:bg-[#FFFDF5] text-[#1A1614] rounded-xl text-xs font-bold tracking-wider transition-colors shadow-sm"
              >
                Close Explorer Trail
              </button>
            </div>
            
          </div>

        </div>
      </motion.div>
    </div>
  );
}

