import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { WeddingPage } from "./pages/WeddingPage";
import { WeekendPage } from "./pages/WeekendPage";
import { TextilePage } from "./pages/TextilePage";
import { FoodPage } from "./pages/FoodPage";
import { InsiderPage } from "./pages/InsiderPage";
import { PlanPage } from "./pages/PlanPage";
import { WorkWithUsPage } from "./pages/WorkWithUsPage";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { HotelsPage } from "./pages/HotelsPage";
import { HomePage } from "./pages/HomePage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { trackPageVisit, trackInquirySubmitted, trackWhatsAppClick } from "./lib/analytics";
import { ScrollToTop } from "./components/ScrollToTop";

import {
  INITIAL_INQUIRIES,
  INITIAL_PARTNERS,
  INITIAL_AUDIT,
  INITIAL_MONETIZATION,
} from "./data";

import { DESTINATIONS_DATA } from "./data/destinations";
import { FOOD_DATA } from "./data/food";
import { SHOPPING_DATA } from "./data/shopping";
import { HOTELS_DATA } from "./data/hotels";
import { STORIES_DATA } from "./data/stories";
import { TOURS_DATA, EVENTS_DATA } from "./data/weekend";

import { Role, Destination, ShoppingGuide, Hotel, Tour, FoodSpot, LocalEvent, BlogPost, Inquiry, PartnerRequest, AuditLog, MonetizationSetting } from "./types";

export const WHATSAPP_CONTACT_NUMBER = (import.meta as any).env.VITE_WHATSAPP_CONTACT_NUMBER || "919999999999"; 

export function triggerWhatsAppMessage(text: string) {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${encodedText}`;
  
  const link = document.createElement("a");
  link.href = whatsappUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface PageTransitionProps {
  children: React.ReactNode;
  key?: any;
}

function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FFFDF5] text-[#1A1614] selection:bg-[#B8860B] selection:text-[#1A1614] flex flex-col justify-between"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<string>("explore");
  const [currentUserRole, setCurrentUserRole] = useState<Role | "Guest">("Guest");
  const [searchQuery, setSearchQuery] = useState("");
  

  // Dynamic CMS database states (Initialized with pre-compiled defaults)
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS_DATA);
  const [shoppingGuides, setShoppingGuides] = useState<any[]>(SHOPPING_DATA);
  const [hotels, setHotels] = useState<Hotel[]>(HOTELS_DATA);
  const [tours, setTours] = useState<Tour[]>(TOURS_DATA);
  const [foodSpots, setFoodSpots] = useState<FoodSpot[]>(FOOD_DATA);
  const [events, setEvents] = useState<LocalEvent[]>(EVENTS_DATA);
  const [blogs, setBlogs] = useState<BlogPost[]>(STORIES_DATA);
  
  const [homepageConfig, setHomepageConfig] = useState<any>(null);
  const [chatbotConfig, setChatbotConfig] = useState<any>(null);
  const [seoConfig, setSeoConfig] = useState<any>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);

  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>(INITIAL_PARTNERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT);
  const [monetization, setRawMonetization] = useState<MonetizationSetting>(INITIAL_MONETIZATION);

  // Load and apply tab states
  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setCurrentTab((location.state as any).activeTab);
      const stateCopy = { ...location.state as any };
      delete stateCopy.activeTab;
      window.history.replaceState(stateCopy, "");
    }
  }, [location.state]);

  // Dynamic Page SEO Metadata & Visitor Tracking
  useEffect(() => {
    let pageTitle = "Surat Insider • Explore, Shop, Experience";
    let metaDescription = "Step into South Gujarat's premier portal for luxury textile curation, heritage explorations, diamonds, and culinary marvels.";
    let keywords = "surat, travel, gujarat, tourism, textile, diamonds, locho, history, silk, castle";

    // Grab SEO settings from CMS dynamically if loaded
    const pKey = location.pathname === "/" ? "home" : location.pathname.substring(1);
    if (seoConfig && seoConfig[pKey]) {
      pageTitle = seoConfig[pKey].pageTitle;
      metaDescription = seoConfig[pKey].metaDescription;
      keywords = seoConfig[pKey].keywords;
    }

    document.title = pageTitle;
    
    // Dynamically inject meta tags
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", metaDescription);
    setMeta("keywords", keywords);

    trackPageVisit(location.pathname, pageTitle);
  }, [location.pathname, seoConfig]);

  // Sync core CMS database and session states
  const refreshCmsData = () => {
    fetch("/api/cms/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.destinations) setDestinations(data.destinations);
        if (data.shoppingGuides) setShoppingGuides(data.shoppingGuides);
        if (data.hotels) setHotels(data.hotels);
        if (data.tours) setTours(data.tours);
        if (data.foodSpots) setFoodSpots(data.foodSpots);
        if (data.events) setEvents(data.events);
        if (data.blogs) setBlogs(data.blogs);
        if (data.homepage) setHomepageConfig(data.homepage);
        if (data.aiChatbot) setChatbotConfig(data.aiChatbot);
        if (data.seo) setSeoConfig(data.seo);
        if (data.media) setMediaList(data.media);
      })
      .catch((err) => console.error("Error fetching dynamic CMS content:", err));
  };

  useEffect(() => {
    // 1. Fetch dynamic CMS values on load
    refreshCmsData();

    // 2. Fetch session status
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.role === "Super Admin") {
          setCurrentUserRole("Super Admin");
        } else {
          setCurrentUserRole("Guest");
        }
      })
      .catch((err) => console.error("Session check error:", err));

    // 3. Fetch monetization settings
    fetch("/api/monetization")
      .then((res) => res.json())
      .then((data) => setRawMonetization(data))
      .catch((err) => console.error("Error fetching monetization:", err));
  }, []);

  // Fetch administrator states if validated
  useEffect(() => {
    if (currentUserRole === "Super Admin") {
      fetch("/api/admin/inquiries")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setInquiries(data);
          } else {
            console.warn("Inquiries response is not an array:", data);
            setInquiries(INITIAL_INQUIRIES);
          }
        })
        .catch((err) => {
          console.error("Error fetching inquiries:", err);
          setInquiries(INITIAL_INQUIRIES);
        });

      fetch("/api/admin/partner-requests")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setPartnerRequests(data);
          } else {
            console.warn("Partner requests response is not an array:", data);
            setPartnerRequests(INITIAL_PARTNERS);
          }
        })
        .catch((err) => {
          console.error("Error fetching partner requests:", err);
          setPartnerRequests(INITIAL_PARTNERS);
        });

      fetch("/api/admin/audit-logs")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAuditLogs(data);
          } else {
            console.warn("Audit logs response is not an array:", data);
            setAuditLogs(INITIAL_AUDIT);
          }
        })
        .catch((err) => {
          console.error("Error fetching audit logs:", err);
          setAuditLogs(INITIAL_AUDIT);
        });
    } else {
      setInquiries(INITIAL_INQUIRIES);
      setPartnerRequests(INITIAL_PARTNERS);
      setAuditLogs(INITIAL_AUDIT);
    }
  }, [currentUserRole]);

  // Handle Dynamic CMS Updates
  const setMonetization = (newSetting: MonetizationSetting | ((prev: MonetizationSetting) => MonetizationSetting)) => {
    setRawMonetization((prev) => {
      const next = typeof newSetting === "function" ? newSetting(prev) : newSetting;
      if (currentUserRole === "Super Admin") {
        fetch("/api/admin/monetization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next)
        }).catch((e) => console.error("Failed to sync monetization settings: ", e));
      }
      return next;
    });
  };

  

  const addAuditLog = (action: string, targetType: string, targetName: string) => {
    if (currentUserRole === "Super Admin") {
      fetch("/api/admin/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetType, targetName })
      })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAuditLogs(data);
        } else {
          console.warn("Audit logs response from log action is not an array:", data);
        }
      })
      .catch((err) => console.error("Error logging audit:", err));
    } else {
      const timestamp = new Date().toISOString();
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        user: "Anonymous Client",
        role: "Editor",
        action,
        targetType,
        targetName,
        timestamp,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  const addInquiry = (inq: Omit<Inquiry, "id" | "date" | "status"> & { sourcePage?: string; category?: string; inquiryType?: string }) => {
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const sourcePage = inq.sourcePage || window.location.pathname;
    const category = inq.category || "General Experiences";
    const inquiryType = inq.inquiryType || (inq.itemType === "shopping" ? "Custom Shopping Tour Sourcing" : inq.itemType === "tour" ? "Curated Itinerary Booking" : inq.itemType === "hotel" ? "Luxury Stay Coordination" : "General Travel Consultation");

    const newInquire: Inquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "New",
      sourcePage,
      category,
      inquiryType,
      timestamp,
    };

    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInquire)
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.inquiry) {
        setInquiries((prev) => [data.inquiry, ...prev]);
      }
    })
    .catch((err) => {
      console.error("Error creating inquiry on server:", err);
      setInquiries((prev) => [newInquire, ...prev]);
    });

    addAuditLog(`Created Lead Inquiry`, "Lead Inquiry", inq.itemTitle);

    trackInquirySubmitted(inq.itemTitle, inq.itemType, { name: inq.name });
    trackWhatsAppClick(inq.itemTitle, category, { item_type: inq.itemType });

    const waText = 
      `✨ *OFFICIAL INQUIRY • SURAT INSIDER* ✨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 *USER PROFILE*\n` +
      `  • *Name:* ${inq.name}\n` +
      `  • *Phone:* ${inq.phone || "Not specified"}\n` +
      `  • *Email:* ${inq.email}\n\n` +
      `🏷️ *INQUIRY DETAILS*\n` +
      `  • *Item/Product:* ${inq.itemTitle}\n` +
      `  • *Category:* ${category}\n` +
      `  • *Inquiry Type:* ${inquiryType}\n` +
      `  • *Source Page:* ${sourcePage}\n\n` +
      `💬 *USER MESSAGE*\n` +
      `"${inq.message}"\n\n` +
      `⏰ *TIMESTAMP*\n` +
      `  • ${timestamp} (IST)\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔗 _Sent via Surat Insider Gateway. Tap to reply directly to ${inq.name}!_`;

    triggerWhatsAppMessage(waText);
  };

  const handleAdminLoginSuccess = (role: string) => {
    setCurrentUserRole("Super Admin");
    setCurrentTab("admin");
    navigate("/");
  };

  return (
    <>
      <ScrollToTop currentTab={currentTab} />
      <AnimatePresence mode="wait">
        <Routes location={location}>
        {/* Standalone Administrative Login Gateway (Hidden) */}
        <Route path="/insiderbyharundaryaee5313" element={
          <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
        } />

        <Route path="/" element={
          <PageTransition key={location.pathname}>
            <HomePage
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              currentUserRole={currentUserRole}
              setCurrentUserRole={setCurrentUserRole}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
              triggerWhatsAppMessage={triggerWhatsAppMessage}
              auditLogs={auditLogs}
              addAuditLog={addAuditLog}
              monetization={monetization}
              setMonetization={setMonetization}
              addInquiry={addInquiry}
              homepageConfig={homepageConfig}
              chatbotConfig={chatbotConfig}
              seoConfig={seoConfig}
              mediaList={mediaList}
              refreshCmsData={refreshCmsData}
            />
          </PageTransition>
        } />

        <Route path="/wedding" element={
          <PageTransition key={location.pathname}>
            <WeddingPage 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/weekend" element={
          <PageTransition key={location.pathname}>
            <WeekendPage 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/textile" element={
          <PageTransition key={location.pathname}>
            <TextilePage 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/food" element={
          <PageTransition key={location.pathname}>
            <FoodPage 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/hotels" element={
          <PageTransition key={location.pathname}>
            <HotelsPage 
              hotels={hotels}
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              addInquiry={addInquiry} 
              triggerWhatsAppMessage={(txt) => window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(txt)}`)}
            />
          </PageTransition>
        } />
        <Route path="/insider-vault" element={
          <PageTransition key={location.pathname}>
            <InsiderPage 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/plan" element={
          <PageTransition key={location.pathname}>
            <PlanPage 
              destinations={destinations}
              hotels={hotels}
              foodSpots={foodSpots}
              shoppingGuides={shoppingGuides}
              tours={tours}
              events={events}
              addInquiry={addInquiry}
              currentUserRole={currentUserRole}
              setCurrentUserRole={setCurrentUserRole}
            />
          </PageTransition>
        } />
        <Route path="/work-with-us" element={
          <PageTransition key={location.pathname}>
            <WorkWithUsPage 
              currentUserRole={currentUserRole}
              setCurrentUserRole={setCurrentUserRole}
              setPartnerRequests={setPartnerRequests}
              addAuditLog={addAuditLog}
            />
          </PageTransition>
        } />
        <Route path="/discover" element={
          <PageTransition key={location.pathname}>
            <DiscoveryPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
    </>
  );
}
