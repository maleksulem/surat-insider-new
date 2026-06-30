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

  if (currentTab === "admin" && (currentUserRole === "Super Admin" || currentUserRole === "Editor")) {
    return (
      <div className="w-full bg-[#FFFDF5] text-[#1A1614] flex flex-col font-sans min-h-screen pt-20">
        <AdminPanel
          currentUserRole={currentUserRole}
          destinations={destinations as any}
          setDestinations={setDestinations as any}
          shoppingGuides={shoppingGuides as any}
          setShoppingGuides={setShoppingGuides as any}
          hotels={hotels as any}
          setHotels={setHotels as any}
          tours={tours as any}
          setTours={setTours as any}
          foodSpots={foodSpots as any}
          setFoodSpots={setFoodSpots as any}
          events={events as any}
          setEvents={setEvents as any}
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
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFDF5] text-[#1A1614] flex flex-col font-sans overflow-x-hidden">
      <main className="flex-1 scroll-smooth">
        {/* Immersive Hero with Living Diamond Navigator */}
        <motion.section 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="h-[100dvh] w-full relative"
        >
          <SuratSOTYHero />
        </motion.section>

        {/* Imperial Portals */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 bg-[#FFFDF5]"
        >
          <ZariPortals 
            addInquiry={addInquiry}
            triggerWhatsAppMessage={triggerWhatsAppMessage}
          />
        </motion.div>

        {/* Combined Explore Page Content: Explore Section & Bridal Mile */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 bg-[#FFFDF5]"
        >
          <ExploreSection
            destinations={destinations}
            shoppingGuides={shoppingGuides}
            tours={tours}
            foodSpots={foodSpots as any}
            addInquiry={addInquiry}
            triggerWhatsAppMessage={triggerWhatsAppMessage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <BridalMileSection />
        </motion.div>
      </main>
    </div>
  );
}
