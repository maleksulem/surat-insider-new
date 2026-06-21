import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, Calendar, MapPin, CheckCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
import Hero from "../components/Hero";
import ExhibitionRail from "../components/ExhibitionRail";
import BentoFeatures from "../components/BentoFeatures";
import { ExploreSection } from "../components/ExploreSection";
import { ShoppingSection } from "../components/ShoppingSection";
import { HotelSection } from "../components/HotelSection";
import { FoodSection } from "../components/FoodSection";
import { PostcardGenerator } from "../components/PostcardGenerator";
import { PlannerSection } from "../components/PlannerSection";
import { AdminPanel } from "../components/AdminPanel";
import { BridalMileSection } from "../components/BridalMileSection";
import { GeminiChat } from "../components/GeminiChat";

import { Role, Destination, ShoppingGuide, Hotel, Tour, FoodSpot, LocalEvent, BlogPost, Inquiry, PartnerRequest, AuditLog, MonetizationSetting } from "../types";

interface HomePageProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
  setActiveTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
  getThemeStyles: () => string;
  destinations: Destination[];
  setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
  shoppingGuides: ShoppingGuide[];
  setShoppingGuides: React.Dispatch<React.SetStateAction<ShoppingGuide[]>>;
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
  tours: Tour[];
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
  foodSpots: FoodSpot[];
  setFoodSpots: React.Dispatch<React.SetStateAction<FoodSpot[]>>;
  events: LocalEvent[];
  setEvents: React.Dispatch<React.SetStateAction<LocalEvent[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  partnerRequests: PartnerRequest[];
  setPartnerRequests: React.Dispatch<React.SetStateAction<PartnerRequest[]>>;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, targetType: string, targetName: string) => void;
  monetization: MonetizationSetting;
  setMonetization: (setting: MonetizationSetting) => void;
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
}

export function HomePage({
  currentTab,
  setCurrentTab,
  currentUserRole,
  setCurrentUserRole,
  searchQuery,
  setSearchQuery,
  activeTheme,
  setActiveTheme,
  getThemeStyles,
  destinations,
  setDestinations,
  shoppingGuides,
  setShoppingGuides,
  hotels,
  setHotels,
  tours,
  setTours,
  foodSpots,
  setFoodSpots,
  events,
  setEvents,
  blogs,
  setBlogs,
  inquiries,
  setInquiries,
  partnerRequests,
  setPartnerRequests,
  auditLogs,
  addAuditLog,
  monetization,
  setMonetization,
  addInquiry,
  triggerWhatsAppMessage,
}: HomePageProps) {
  // Partner Form State Localized
  const [partnerForm, setPartnerForm] = useState({
    businessName: "",
    businessType: "shop" as "hotel" | "shop" | "restaurant" | "tour_operator",
    contactEmail: "",
    requestedUpdate: "",
  });
  const [partnerFormSuccess, setPartnerFormSuccess] = useState(false);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.businessName || !partnerForm.contactEmail) return;

    const newRequest: PartnerRequest = {
      id: `part-${Date.now()}`,
      businessName: partnerForm.businessName,
      businessType: partnerForm.businessType,
      contactEmail: partnerForm.contactEmail,
      requestedUpdate: partnerForm.requestedUpdate || `Add listing to platform guide.`,
      status: "Pending Approval",
      date: new Date().toISOString().split("T")[0],
    };

    setPartnerRequests((prev) => [newRequest, ...prev]);

    // Format a gorgeous WhatsApp message for partners
    const waText = `🤝 *NEW PARTNER APPLICATION ON SURAT INSIDER* 🤝\n\n` +
      `🏢 *Business Name:* ${partnerForm.businessName}\n` +
      `🏷️ *Classification:* ${partnerForm.businessType.replace("_", " ").toUpperCase()}\n` +
      `📧 *Contact Email:* ${partnerForm.contactEmail}\n\n` +
      `📝 *Requested Listing Details:* \n"${newRequest.requestedUpdate}"\n\n` +
      `📅 *Date:* ${newRequest.date}\n` +
      `🔗 SENT VIA PARTNER HUB. TAP TO REPLY!`;

    triggerWhatsAppMessage(waText);

    setPartnerForm({ businessName: "", businessType: "shop", contactEmail: "", requestedUpdate: "" });
    setPartnerFormSuccess(true);
    setTimeout(() => setPartnerFormSuccess(false), 5000);
    addAuditLog("Partner Application Submitted", "Partner Request", newRequest.businessName);
  };

  return (
    <div className="min-h-screen bg-brand-sand-50 selection:bg-brand-gold-500/30 text-brand-charcoal flex flex-col font-sans">
      
      {/* Dynamic Theme overrides stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: getThemeStyles() }} />

      {/* Lagging Ring Custom Cursor */}
      <CustomCursor theme={activeTheme} />

      {/* Top Banner Navigation bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 flex flex-col"
        >
          {/* Cinematic National Geographic Style Hero (Exclusively on explore tab) */}
          {currentTab === "explore" ? (
            <>
              <Hero />
              <ExhibitionRail />
              <BentoFeatures />

              {/* Dynamic Search Bar elevated directly with generous spacing */}
              <div className="max-w-xl mx-auto pt-16 px-4">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-2.5 shadow-xl flex items-center gap-3 border border-brand-sand-200">
                  <div className="flex-1 flex items-center gap-2 px-3 text-brand-charcoal-light">
                    <Search className="w-5 h-5 text-[#c5a059]" />
                    <input
                      type="text"
                      placeholder="Search Fort, Tanchoi Saree, Diamond stores, Locho..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-sm placeholder:text-brand-charcoal/50 text-brand-emerald-950 font-medium"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-brand-charcoal/50 hover:text-brand-charcoal font-semibold px-2"
                    >
                      Clear
                    </button>
                  )}
                  <button className="bg-brand-emerald-900 hover:bg-brand-emerald-800 text-brand-sand-50 px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors">
                    Search
                  </button>
                </div>
              </div>

              {/* Quick Search Filtering Notice */}
              {searchQuery && (
                <div className="bg-brand-gold-500/10 p-3 mt-4 text-center text-xs font-medium text-brand-emerald-950 border-b border-brand-gold-500/20">
                  Showing results matched with "{searchQuery}" across the active dynamic database catalogs.
                </div>
              )}

              {/* Core Tabs Content Router Grid */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ExploreSection
                  destinations={destinations}
                  tours={tours}
                  foodSpots={foodSpots}
                  addInquiry={addInquiry}
                  searchQuery={searchQuery}
                />
              </main>
              <BridalMileSection />
            </>
          ) : (
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Optional Search Filtering Notice when search is filled on inner tabs */}
              {searchQuery && currentTab !== "postcard" && currentTab !== "admin" && (
                <div className="bg-brand-gold-500/15 p-4 mb-8 rounded-2xl text-center text-xs font-medium text-brand-emerald-950 border border-brand-gold-500/25 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold-500 animate-pulse" />
                  Filtering resources by active search key matching: <strong className="text-brand-emerald-900">"{searchQuery}"</strong>
                </div>
              )}

              {currentTab === "shopping" && (
                <ShoppingSection
                  shoppingGuides={shoppingGuides}
                  addInquiry={addInquiry}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === "hotels" && (
                <HotelSection
                  hotels={hotels}
                  addInquiry={addInquiry}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === "food" && (
                <FoodSection
                  foodSpots={foodSpots}
                  addInquiry={addInquiry}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === "postcard" && (
                <PostcardGenerator />
              )}

              {currentTab === "planner" && (
                <PlannerSection
                  destinations={destinations}
                  hotels={hotels}
                  foodSpots={foodSpots}
                  shoppingGuides={shoppingGuides}
                  tours={tours}
                  events={events}
                  addInquiry={addInquiry}
                  theme={activeTheme}
                />
              )}

              {currentTab === "admin" && (
                <AdminPanel
                  currentUserRole={currentUserRole}
                  destinations={destinations}
                  setDestinations={setDestinations}
                  shoppingGuides={shoppingGuides}
                  setShoppingGuides={setShoppingGuides}
                  hotels={hotels}
                  setHotels={setHotels}
                  tours={tours}
                  setTours={setTours}
                  foodSpots={foodSpots}
                  setFoodSpots={setFoodSpots}
                  events={events}
                  setEvents={setEvents}
                  blogs={blogs}
                  setBlogs={setBlogs}
                  inquiries={inquiries}
                  setInquiries={setInquiries}
                  partnerRequests={partnerRequests}
                  setPartnerRequests={setPartnerRequests}
                  auditLogs={auditLogs}
                  addAuditLog={addAuditLog}
                  monetization={monetization}
                  setMonetization={setMonetization}
                />
              )}

              {currentTab === "events-blogs" && (
                <div className="space-y-12">
                  <div className="border-b border-brand-sand-200 pb-5">
                    <h2 className="font-serif text-3xl font-extrabold text-brand-emerald-950">Events & National Geographic Stories</h2>
                    <p className="text-sm text-brand-charcoal/60 mt-1">Festivals, expo markets and local advice column diaries updated by editors daily.</p>
                  </div>

                  {/* Events lists block */}
                  <div className="space-y-6">
                    <h3 className="text-sm uppercase font-mono tracking-wider font-bold text-brand-gold-500">Upcoming Trade Shows & Festivals</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {events.map((evt) => (
                        <div key={evt.id} className="bg-white rounded-xl overflow-hidden border border-brand-sand-200 flex flex-col sm:flex-row shadow-sm">
                          <img src={evt.image} className="sm:w-1/3 h-44 object-cover" />
                          <div className="p-5 sm:w-2/3 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <span className="text-[10px] bg-brand-emerald-950 text-white font-mono px-2 py-0.5 rounded uppercase">
                                {evt.category}
                              </span>
                              <h4 className="font-serif font-bold text-lg text-brand-emerald-950">{evt.title}</h4>
                              <p className="text-xs text-brand-charcoal-light leading-relaxed">{evt.description}</p>
                            </div>
                            <div className="pt-3 text-[11px] font-mono text-brand-charcoal/60 flex justify-between">
                              <span>📅 {evt.date}</span>
                              <span>📍 {evt.venue}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Blogs lists section */}
                  <div className="space-y-6 pt-6">
                    <h3 className="text-sm uppercase font-mono tracking-wider font-bold text-brand-gold-500">Editorial Stories & Columns</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {blogs.map((post) => (
                        <div key={post.id} className="space-y-4">
                          <div className="aspect-[2/1] bg-brand-sand-100 rounded-xl overflow-hidden">
                            <img src={post.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] text-brand-gold-500 font-mono uppercase tracking-wider">{post.category} • {post.publishedAt}</span>
                            <h4 className="font-serif text-xl font-bold text-brand-emerald-950 leading-tight">{post.title}</h4>
                            <p className="text-xs text-brand-charcoal/50 font-mono">By {post.author}</p>
                            <p className="text-xs text-brand-charcoal-light leading-relaxed text-justify">{post.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </main>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dynamic Local Business Partner submission portal */}
      <section className="bg-brand-sand-100 border-t border-brand-sand-200 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-brand-sand-200 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-4 text-brand-charcoal">
            <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gold-500 font-bold block">
              Direct Partnership Hub
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-brand-emerald-950 leading-tight">
              Partner with Surat Insider
            </h3>
            <p className="text-xs text-brand-charcoal/70 leading-relaxed font-sans font-light">
              Are you are hotel operator, custom saree loom director, diamond craftsman, or restaurant owner? Submit details here to register your interest. Admins will review, authorize, and sync your details dynamically.
            </p>
          </div>

          <form onSubmit={handlePartnerSubmit} className="md:col-span-7 space-y-4 text-xs">
            {partnerFormSuccess && (
              <div className="p-4 bg-emerald-900/15 border border-emerald-800/30 text-emerald-950 rounded-xl font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-800" />
                Submitted successfully! Pending Admin verification in CMS.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Business Name*</label>
                <input
                  type="text"
                  required
                  value={partnerForm.businessName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, businessName: e.target.value })}
                  placeholder="e.g. Radhe Silk Mills"
                  className="w-full bg-brand-sand-50/50 px-3.5 py-2.5 border border-brand-sand-200 rounded-xl outline-none focus:ring-1 focus:ring-brand-emerald-800"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Business Classification*</label>
                <select
                  value={partnerForm.businessType}
                  onChange={(e) => setPartnerForm({ ...partnerForm, businessType: e.target.value as any })}
                  className="w-full bg-brand-sand-50/50 px-3.5 py-2.5 border border-brand-sand-200 rounded-xl outline-none focus:ring-1 focus:ring-brand-emerald-800"
                >
                  <option value="shop">Silk & Saree Shop</option>
                  <option value="hotel">Hotel Suite / Stay</option>
                  <option value="restaurant">Traditional Thali Hook / Cafe</option>
                  <option value="tour_operator">Local Tour Guide unit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Contact Address Email*</label>
              <input
                type="email"
                required
                value={partnerForm.contactEmail}
                onChange={(e) => setPartnerForm({ ...partnerForm, contactEmail: e.target.value })}
                placeholder="owner@radhesilk.com"
                className="w-full bg-brand-sand-50/50 px-3.5 py-2.5 border border-brand-sand-200 rounded-xl outline-none focus:ring-1 focus:ring-brand-emerald-800"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-brand-charcoal opacity-75">Description of requested changes / list details</label>
              <textarea
                value={partnerForm.requestedUpdate}
                onChange={(e) => setPartnerForm({ ...partnerForm, requestedUpdate: e.target.value })}
                placeholder="Provide address, pricing brackets, specific weaves or hotel room counts to verify..."
                rows={3}
                className="w-full bg-brand-sand-50/50 px-3.5 py-2.5 border border-brand-sand-200 rounded-xl outline-none focus:ring-1 focus:ring-brand-emerald-800 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-emerald-950 text-white font-semibold py-3 rounded-xl hover:bg-brand-emerald-900 transition-colors uppercase tracking-wider"
            >
              Submit Partner Request
            </button>
          </form>
        </div>
      </section>

      {/* Footnote and fine-print */}
      <footer className="bg-brand-emerald-950 text-brand-sand-200 border-t border-brand-emerald-900 shrink-0 text-center py-8">
        <p className="text-xs font-mono opacity-60">
          © {new Date().getFullYear()} Surat Insider Global Platform • Crafted with Google AI Studio Integration
        </p>
        <div className="mt-3">
          <button
            onClick={() => window.dispatchEvent(new Event("open-staff-auth"))}
            className="text-[10px] uppercase tracking-widest font-mono font-bold text-brand-gold-500/40 hover:text-brand-gold-500 hover:underline transition-all cursor-pointer"
            title="Authorized Staff Portal (Secure 2-Step Verification Gate)"
          >
            🔒 Staff Portal
          </button>
        </div>
      </footer>

      {/* Chatbot module */}
      <GeminiChat />

    </div>
  );
}
