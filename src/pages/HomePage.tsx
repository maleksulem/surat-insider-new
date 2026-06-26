import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "motion/react";
import { Search, Sparkles, Calendar, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CustomCursor } from "../components/CustomCursor";
import { SuratSOTYHero } from "../components/SuratSOTYHero";
import { ZariPortals } from "../components/ZariPortals";
import { ExploreSection } from "../components/ExploreSection";
import { ShoppingSection } from "../components/ShoppingSection";
import { HotelSection } from "../components/HotelSection";
import { FoodSection } from "../components/FoodSection";
import { PlannerSection } from "../components/PlannerSection";
import { AdminPanel } from "../components/AdminPanel";
import { BridalMileSection } from "../components/BridalMileSection";
import { GeminiChat } from "../components/GeminiChat";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { ExperienceDetailModal } from "../components/ExperienceDetailModal";


import { Role, Destination, ShoppingGuide, Hotel, Tour, FoodSpot, LocalEvent, BlogPost, Inquiry, PartnerRequest, AuditLog, MonetizationSetting, CuratedExperience } from "../types";

interface HomePageProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  destinations: CuratedExperience[];
  setDestinations: React.Dispatch<React.SetStateAction<any[]>>;
  shoppingGuides: CuratedExperience[];
  setShoppingGuides: React.Dispatch<React.SetStateAction<any[]>>;
  hotels: CuratedExperience[];
  setHotels: React.Dispatch<React.SetStateAction<any[]>>;
  tours: CuratedExperience[];
  setTours: React.Dispatch<React.SetStateAction<any[]>>;
  foodSpots: CuratedExperience[];
  setFoodSpots: React.Dispatch<React.SetStateAction<any[]>>;
  events: CuratedExperience[];
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
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
  homepageConfig?: any;
  chatbotConfig?: any;
  seoConfig?: any;
  mediaList?: any[];
  refreshCmsData?: () => void;
}

export function HomePage({
  currentTab,
  setCurrentTab,
  currentUserRole,
  setCurrentUserRole,
  searchQuery,
  setSearchQuery,
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
  homepageConfig,
  chatbotConfig,
  seoConfig,
  mediaList,
  refreshCmsData,
}: HomePageProps) {
  const navigate = useNavigate();
  // Call Dynamic SEO and Schema markup hook from the CMS DB
  const seoTitle = seoConfig?.home?.pageTitle || "Surat Insider • Explore, Shop, Experience";
  const seoDesc = seoConfig?.home?.metaDescription || "Explore the hidden secrets of Surat. Your curated guide to premium heritage tourism, gourmet food spots, world-class textile hubs, diamond boutiques, and custom weekend itineraries.";
  const seoKeywords = seoConfig?.home?.keywords || "Surat Tourism, Surat Insider, Surat Saree Shopping, Surat Locho, Surat Diamond, Gujarat Travel, Surat Castle, Ring Road Market Sourcing";
  const seoOgImage = seoConfig?.home?.openGraphImage || "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop";

  useDocumentMetadata({
    title: seoTitle,
    description: seoDesc,
    keywords: seoKeywords,
    ogImage: seoOgImage,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Surat Insider",
        "description": "Premium experience-discovery and lead-generation platform for Surat. Browse local heritage guides, wholesale textile hubs, diamond boutiques, street food tours, and custom itineraries.",
        "url": "https://suratinsider.com",
        "telephone": "+919999999999",
        "image": "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Surat",
          "addressRegion": "Gujarat",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 21.1702,
          "longitude": 72.8311
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": "Surat Castle",
        "description": "Historical 16th-century fortress situated on the banks of Tapi river, constructed to repel invasion forces.",
        "location": {
          "@type": "Place",
          "name": "Surat Castle",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Surat",
            "addressRegion": "Gujarat",
            "addressCountry": "IN"
          }
        }
      }
    ]
  });

  // Partner Form State Removed - Moved to WorkWithUsPage
  const [selectedEventItem, setSelectedEventItem] = useState<CuratedExperience | null>(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);
  const contentY = useTransform(scrollY, [0, 1000], [0, -100]);
  
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-brand-sand-50 text-[#1A1614] selection:bg-brand-gold-500 selection:text-[#1A1614] flex flex-col font-sans overflow-x-hidden">
      
      {/* Lagging Ring Custom Cursor */}
      <CustomCursor />

      {/* Top Banner Navigation bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
      />

      <main className="flex-1 overflow-y-auto scroll-smooth perspective-1000">
        {/* Immersive Hero with Living Diamond Navigator */}
        <motion.section 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="h-screen w-full relative shrink-0"
        >
          <SuratSOTYHero />
        </motion.section>

        {/* Imperial Portals - Only visible on Explore tab */}
        {currentTab === "explore" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ZariPortals />
          </motion.div>
        )}


        {/* Dynamic Experience Portals (Tab Content) */}
        <motion.div 
          style={{ y: contentY }}
          className="min-h-screen relative z-10" 
          id="tab-content-portal"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.98 }}
              transition={{ 
                duration: 0.9, 
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 50,
                damping: 20
              }}
            >
              {currentTab === "explore" && (
                <>
                  <ExploreSection
                    destinations={destinations as any}
                    tours={tours as any}
                    foodSpots={foodSpots as any}
                    addInquiry={addInquiry}
                    triggerWhatsAppMessage={triggerWhatsAppMessage}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <BridalMileSection />
                </>
              )}

              {currentTab === "shopping" && (
                <ShoppingSection
                  shoppingGuides={shoppingGuides as any}
                  addInquiry={addInquiry}
                  triggerWhatsAppMessage={triggerWhatsAppMessage}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === "hotels" && (
                <HotelSection
                  hotels={hotels as any}
                  addInquiry={addInquiry}
                  triggerWhatsAppMessage={triggerWhatsAppMessage}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === "food" && (
                <FoodSection
                  foodSpots={foodSpots as any}
                  addInquiry={addInquiry}
                  triggerWhatsAppMessage={triggerWhatsAppMessage}
                  searchQuery={searchQuery}
                />
              )}

              {currentTab === "planner" && (
                <PlannerSection
                  destinations={destinations as any}
                  hotels={hotels as any}
                  foodSpots={foodSpots as any}
                  shoppingGuides={shoppingGuides as any}
                  tours={tours as any}
                  events={events as any}
                  addInquiry={addInquiry}
                />
              )}

              {currentTab === "admin" && (
                <AdminPanel
                  currentUserRole={currentUserRole}
                  destinations={destinations as any}
                  setDestinations={setDestinations}
                  shoppingGuides={shoppingGuides as any}
                  setShoppingGuides={setShoppingGuides}
                  hotels={hotels as any}
                  setHotels={setHotels}
                  tours={tours as any}
                  setTours={setTours}
                  foodSpots={foodSpots as any}
                  setFoodSpots={setFoodSpots}
                  events={events as any}
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
                  homepageConfig={homepageConfig}
                  chatbotConfig={chatbotConfig}
                  seoConfig={seoConfig}
                  mediaList={mediaList}
                  refreshCmsData={refreshCmsData}
                />
              )}

              {currentTab === "events-blogs" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
                  <div className="max-w-2xl">
                    <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-brand-gold-500 font-bold block mb-4">Editorial Dispatches</span>
                    <h2 className="font-serif text-4xl md:text-6xl font-black text-[#1A1614] tracking-tight">The Journal</h2>
                    <p className="text-base text-[#1A1614]/50 mt-6 leading-relaxed font-light">Curated dispatches from the frontlines of Surati culture, from trade expo calendars to heritage columns.</p>
                  </div>

                  {/* Events Moment */}
                  <section className="space-y-12">
                    <h3 className="text-[10px] uppercase font-mono tracking-[0.3em] font-bold text-[#1A1614]/30">Live Calendar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {events.map((evt, idx) => (
                        <motion.div 
                          key={evt.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-8 group cursor-pointer"
                        >
                          <div className="w-24 h-24 bg-brand-sand-100 rounded-3xl flex flex-col items-center justify-center border border-brand-sand-200 shrink-0 group-hover:bg-[#1A1614] group-hover:text-brand-sand-50 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
                            <span className="text-2xl font-serif font-black">{evt.timings?.split(' ')[0] || "12"}</span>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-50">{evt.timings?.split(' ')[1] || "OCT"}</span>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-serif text-2xl font-bold text-[#1A1614] group-hover:text-brand-gold-600 transition-colors">{evt.title}</h4>
                            <p className="text-sm text-[#1A1614]/40 font-light line-clamp-2 leading-relaxed">{evt.shortDescription}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Blogs Moment */}
                  <section className="space-y-12">
                     <h3 className="text-[10px] uppercase font-mono tracking-[0.3em] font-bold text-[#1A1614]/30">The Vault</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                       {blogs.map((post, idx) => (
                         <motion.div 
                           key={post.id}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: idx * 0.1 }}
                           className="space-y-8 group cursor-pointer"
                         >
                           <div className="aspect-[16/9] overflow-hidden rounded-3xl bg-brand-sand-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                             <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                           </div>
                           <div className="space-y-4">
                             <div className="flex items-center gap-4">
                               <span className="text-[10px] font-mono font-bold text-brand-gold-500 uppercase tracking-widest">{post.category}</span>
                               <div className="w-1 h-1 rounded-full bg-brand-sand-300" />
                               <span className="text-[10px] font-mono font-bold text-brand-sand-400 uppercase tracking-widest">{post.publishedAt}</span>
                             </div>
                             <h4 className="font-serif text-3xl font-bold text-[#1A1614] leading-tight group-hover:text-brand-gold-600 transition-colors">{post.title}</h4>
                             <p className="text-base text-[#1A1614]/40 font-light line-clamp-3 leading-relaxed">{post.content}</p>
                           </div>
                         </motion.div>
                       ))}
                     </div>
                  </section>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </main>

      {/* Footnote and fine-print */}
      <footer className="bg-[#1A1614] text-brand-sand-50/20 shrink-0 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-bold tracking-tight text-brand-sand-50">
                SURAT<span className="text-brand-gold-500 font-extrabold">.</span>INSIDER
              </span>
              <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-brand-gold-500/90 mt-1 font-bold">
                The Imperial Edit
              </span>
            </div>
            <p className="text-sm font-light text-brand-sand-50/40 max-w-sm leading-relaxed">
              Step into South Gujarat's premier portal for luxury textile curation, heritage explorations, and culinary marvels.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.4em] text-brand-gold-500 font-bold">Directory</h4>
            <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-brand-sand-50/60">
              <li><button onClick={() => setCurrentTab("explore")} className="hover:text-brand-gold-500 transition-colors">Explore</button></li>
              <li><Link to="/textile" className="hover:text-brand-gold-500 transition-colors">Shop</Link></li>
              <li><Link to="/plan" className="hover:text-brand-gold-500 transition-colors">Plan</Link></li>
              <li><Link to="/hotels" className="hover:text-brand-gold-500 transition-colors">Hotels</Link></li>
              <li><Link to="/food" className="hover:text-brand-gold-500 transition-colors">Food</Link></li>
              <li><Link to="/weekend" className="hover:text-brand-gold-500 transition-colors">Events</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.4em] text-brand-gold-500 font-bold">Partnerships</h4>
            <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-brand-sand-50/60">
              <li><Link to="/work-with-us" className="hover:text-brand-gold-500 transition-colors">Work With Us</Link></li>
              <li><Link to="/insiderbyharundaryaee5313" className="hover:text-brand-gold-500 transition-colors">Staff Access</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] font-bold">
            Surat Insider Collective • {new Date().getFullYear()}
          </p>
          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-[0.3em]">
            <span className="text-brand-sand-50/20">Privacy Protocol</span>
            <span className="text-brand-sand-50/20">Visitor Terms</span>
          </div>
        </div>
      </footer>

      {/* Chatbot module */}
      <GeminiChat chatbotConfig={chatbotConfig} />

      {selectedEventItem && (
        <ExperienceDetailModal
          item={selectedEventItem}
          onClose={() => setSelectedEventItem(null)}
          addInquiry={addInquiry}
          triggerWhatsAppMessage={triggerWhatsAppMessage}
        />
      )}

    </div>
  );
}
