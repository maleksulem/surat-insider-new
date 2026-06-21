import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { WeddingPage } from "./pages/WeddingPage";
import { WeekendPage } from "./pages/WeekendPage";
import { TextilePage } from "./pages/TextilePage";
import { FoodPage } from "./pages/FoodPage";
import { InsiderPage } from "./pages/InsiderPage";
import { HomePage } from "./pages/HomePage";

import {
  INITIAL_DESTINATIONS,
  INITIAL_SHOPPING,
  INITIAL_HOTELS,
  INITIAL_TOURS,
  INITIAL_FOOD,
  INITIAL_EVENTS,
  INITIAL_BLOGS,
  INITIAL_INQUIRIES,
  INITIAL_PARTNERS,
  INITIAL_AUDIT,
  INITIAL_MONETIZATION,
} from "./data";

import { Role, Destination, ShoppingGuide, Hotel, Tour, FoodSpot, LocalEvent, BlogPost, Inquiry, PartnerRequest, AuditLog, MonetizationSetting } from "./types";

// =========================================================================
// 👉 CENTRAL WHATSAPP GATEWAY CONFIGURATION 👈
// Change this value to your exact WhatsApp phone number (with country code, 
// no spaces, no plus signs, e.g. "919099123456" for India).
// =========================================================================
export const WHATSAPP_CONTACT_NUMBER = "919879198671"; 

export function triggerWhatsAppMessage(text: string) {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${encodedText}`;
  
  // Safe, cross-platform anchor click simulation to break out of iframe limits securely
  const link = document.createElement("a");
  link.href = whatsappUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Elegant, magazine-style page transition wrapper with a smooth slide-and-fade response
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
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} // Polished custom ease-out cubic bezier curve
      className="min-h-screen flex flex-col justify-between"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string>("explore");
  const [currentUserRole, setCurrentUserRole] = useState<Role | "Guest">("Super Admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<"normal" | "wedding" | "vacation" | "weekend">("normal");

  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setCurrentTab((location.state as any).activeTab);
      // Clean state after using it to prevent infinite loop or re-triggering upon reload
      const stateCopy = { ...location.state as any };
      delete stateCopy.activeTab;
      window.history.replaceState(stateCopy, "");
    }
  }, [location.state]);

  const getThemeStyles = () => {
    switch (activeTheme) {
      case "wedding":
        return `
          :root {
            --color-brand-emerald-950: #4a0404 !important; /* Deep Royal Red */
            --color-brand-emerald-900: #7a0c1a !important; /* Crimson Red */
            --color-brand-emerald-800: #961124 !important; /* Rich Scarlet */
            --color-brand-emerald-700: #b91c1c !important; /* Shiny Red */
            
            --color-brand-sand-50: #fffdf5 !important; /* Soft Ivory Cream */
            --color-brand-sand-100: #fbf5e6 !important; /* Warm Champagne */
            --color-brand-sand-200: #ebdcb9 !important; /* Gold sand */
            
            --color-brand-gold-300: #ffd700 !important; /* Pure Gold */
            --color-brand-gold-400: #d4af37 !important; /* Metallic Gold */
            --color-brand-gold-500: #c5a059 !important; /* Ochre Royal Gold */
            
            --color-brand-charcoal: #200d07 !important; /* Deep Mahogany */
          }
        `;
      case "vacation":
        return `
          :root {
            --color-brand-emerald-950: #082f49 !important; /* Deep Oceanic Sky */
            --color-brand-emerald-900: #0369a1 !important; /* Wave Teal/Blue */
            --color-brand-emerald-800: #0284c7 !important; /* Sea Coral Sky */
            --color-brand-emerald-700: #0ea5e9 !important; /* Sky Blue */
            
            --color-brand-sand-50: #f0f9ff !important; /* Breezy White Lagoon */
            --color-brand-sand-100: #e0f2fe !important; /* Light Wave Lagoon */
            --color-brand-sand-200: #bae6fd !important; /* Light Azure */
            
            --color-brand-gold-300: #38bdf8 !important; /* Bright Sky Spark */
            --color-brand-gold-400: #0284c7 !important; /* Warm Aqua Blue */
            --color-brand-gold-500: #0ea5e9 !important; /* Sky Accent */
            
            --color-brand-charcoal: #0f172a !important; /* Slate Dark */
          }
        `;
      case "weekend":
        return `
          :root {
            --color-brand-emerald-950: #2e1065 !important; /* Velvet Purple */
            --color-brand-emerald-900: #4c1d95 !important; /* Grape Indigo */
            --color-brand-emerald-800: #6d28d9 !important; /* Royal Violet */
            --color-brand-emerald-700: #7c3aed !important; /* Deep Orchid */
            
            --color-brand-sand-50: #faf5ff !important; /* Soft Lavender Creame */
            --color-brand-sand-100: #f3e8ff !important; /* Light Purple Mist */
            --color-brand-sand-200: #e9d5ff !important; /* Pale Amethyst */
            
            --color-brand-gold-300: #fb7185 !important; /* Sunset Rose Pink */
            --color-brand-gold-400: #f43f5e !important; /* Sizzling Strawberry */
            --color-brand-gold-500: #e11d48 !important; /* Vivid Coral */
            
            --color-brand-charcoal: #1e1b4b !important; /* Deep Indigo Midnight */
          }
        `;
      case "normal":
      default:
        return ``;
    }
  };

  // Live State Database (allows client-side adding, editing and deleting from CMS UI)
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [shoppingGuides, setShoppingGuides] = useState<ShoppingGuide[]>(INITIAL_SHOPPING);
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [tours, setTours] = useState<Tour[]>(INITIAL_TOURS);
  const [foodSpots, setFoodSpots] = useState<FoodSpot[]>(INITIAL_FOOD);
  const [events, setEvents] = useState<LocalEvent[]>(INITIAL_EVENTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>(INITIAL_PARTNERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT);
  const [monetization, setMonetization] = useState<MonetizationSetting>(INITIAL_MONETIZATION);

  // Global Helpers
  const addAuditLog = (action: string, targetType: string, targetName: string) => {
    const timestamp = new Date().toISOString();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: currentUserRole === "Guest" ? "Anonymous Client" : "itxghost111@gmail.com",
      role: currentUserRole === "Guest" ? "Editor" : (currentUserRole as Role),
      action,
      targetType,
      targetName,
      timestamp,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addInquiry = (inq: Omit<Inquiry, "id" | "date" | "status">) => {
    const newInquire: Inquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "New",
    };
    setInquiries((prev) => [newInquire, ...prev]);
    addAuditLog(`Created Tour/Hotel/Shopping Lead`, "Lead Inquiry", inq.itemTitle);

    // Formulate a beautiful WhatsApp summary message automatically
    const waText = `✨ *NEW INQUIRY FROM SURAT INSIDER* ✨\n\n` +
      `👤 *Name:* ${inq.name}\n` +
      `📧 *Email:* ${inq.email}\n` +
      `📞 *Phone:* ${inq.phone || "Not specified"}\n\n` +
      `🏷️ *Product/Experience:* ${inq.itemTitle} (${inq.itemType.toUpperCase()})\n` +
      `💬 *Requirements/Message:* \n"${inq.message}"\n\n` +
      `📅 *Date:* ${newInquire.date}\n` +
      `🔗 _Sent via Surat Insider Experience Map. Tap to reply directly!_`;

    triggerWhatsAppMessage(waText);
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={
          <PageTransition key={location.pathname}>
            <HomePage
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              currentUserRole={currentUserRole}
              setCurrentUserRole={setCurrentUserRole}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTheme={activeTheme}
              setActiveTheme={setActiveTheme}
              getThemeStyles={getThemeStyles}
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
            />
          </PageTransition>
        } />

        <Route path="/wedding" element={
          <PageTransition key={location.pathname}>
            <WeddingPage 
              onMount={() => setActiveTheme("wedding")} 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              activeTheme={activeTheme} 
              setActiveTheme={setActiveTheme} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/weekend" element={
          <PageTransition key={location.pathname}>
            <WeekendPage 
              onMount={() => setActiveTheme("vacation")} 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              activeTheme={activeTheme} 
              setActiveTheme={setActiveTheme} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/textile" element={
          <PageTransition key={location.pathname}>
            <TextilePage 
              onMount={() => setActiveTheme("normal")} 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              activeTheme={activeTheme} 
              setActiveTheme={setActiveTheme} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/food" element={
          <PageTransition key={location.pathname}>
            <FoodPage 
              onMount={() => setActiveTheme("weekend")} 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              activeTheme={activeTheme} 
              setActiveTheme={setActiveTheme} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
        <Route path="/insider" element={
          <PageTransition key={location.pathname}>
            <InsiderPage 
              onMount={() => setActiveTheme("normal")} 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
              activeTheme={activeTheme} 
              setActiveTheme={setActiveTheme} 
              addInquiry={addInquiry} 
            />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}
