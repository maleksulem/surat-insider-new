import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Compass, ShoppingBag, Hotel, Utensils, CalendarRange, UserCheck, 
  ShieldAlert, Sparkles, Image, Calendar, Lock, X, Key, Mail, ArrowRight, ShieldCheck,
  Eye, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Role } from "../types";

// =========================================================================
// Staff gatekeeper configuration details (Loaded via Server API dynamically)
// =========================================================================

// High-performance micro-interaction variants for category icons
const iconVariants = {
  explore: {
    hover: { 
      rotate: [0, -25, 400, 360], 
      scale: 1.25, 
      transition: { duration: 0.85, ease: "easeInOut" } 
    }
  },
  shopping: {
    hover: { 
      rotate: [-14, 14, -10, 10, -5, 5, 0], 
      y: -3, 
      scale: 1.2,
      transition: { duration: 0.65, ease: "easeOut" } 
    }
  },
  planner: {
    hover: { 
      y: [0, -6, 2, -2, 0], 
      scale: [1, 1.2, 0.95, 1.1, 1],
      transition: { duration: 0.55 } 
    }
  },
  hotels: {
    hover: { 
      scale: 1.22, 
      y: -3, 
      rotate: [-6, 6, -3, 3, 0],
      transition: { duration: 0.5 } 
    }
  },
  food: {
    hover: { 
      rotate: [0, -22, 22, -15, 15, 0], 
      scale: 1.3, 
      y: -2,
      transition: { duration: 0.6 } 
    }
  },
  "events-blogs": {
    hover: { 
      y: [0, -4, 0],
      scale: 1.2,
      rotate: [0, 8, -8, 0],
      transition: { duration: 0.5 } 
    }
  },
  admin: {
    hover: { 
      scale: 1.25, 
      rotate: [0, -12, 12, 0],
      transition: { duration: 0.55 } 
    }
  }
};

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
    }

export function Navbar({
  currentTab,
  setCurrentTab,
  currentUserRole,
  setCurrentUserRole,
    }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabAction = (tabId: string) => {
    if (tabId === "admin") {
      navigate("/insiderbyharundaryaee5313");
      return;
    }
    if (tabId === "planner") {
      navigate("/plan");
      return;
    }
    if (tabId === "explore") {
      if (location.pathname === "/") {
        setCurrentTab("explore");
      } else {
        navigate("/");
      }
      return;
    }
    if (tabId === "shopping") {
      navigate("/textile");
      return;
    }
    if (tabId === "hotels") {
      navigate("/hotels");
      return;
    }
    if (tabId === "food") {
      navigate("/food");
      return;
    }
    if (tabId === "events-blogs") {
      navigate("/weekend");
      return;
    }
    
    if (location.pathname !== "/") {
      navigate("/", { state: { activeTab: tabId } });
    } else {
      setCurrentTab(tabId);
    }
  };

  const tabs = [
    { id: "explore", label: "Explore", icon: Compass },
    { id: "shopping", label: "Shop", icon: ShoppingBag },
    { id: "planner", label: "Plan", icon: Sparkles },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "food", label: "Food", icon: Utensils },
    { id: "events-blogs", label: "Events", icon: CalendarRange },
    ...(currentUserRole === "Super Admin" ? [{ id: "admin", label: "CMS", icon: ShieldAlert }] : [])
  ];

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#FFFDF5]/85 backdrop-blur-md border-b border-[#1A1614]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div 
              onClick={() => handleTabAction("explore")}
              className="flex items-center gap-3 cursor-pointer group select-none"
              id="nav-logo"
              title="Surat Insider Home"
            >
              {/* Elegant SVG "IS" Logo matching the user's provided mockup image */}
              <svg 
                className="w-10 h-10 rounded-xl shadow-md border border-brand-sand-200/50 flex-shrink-0 transition-transform group-hover:scale-105" 
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2500/svg"
              >
                <rect width="100" height="100" rx="22" fill="#0c1717"/>
                <text 
                  x="50" 
                  y="81" 
                  fontFamily="'Times New Roman', 'Playfair Display', 'Georgia', serif" 
                  fontSize="80" 
                  fill="#fcf9f2" 
                  textAnchor="middle" 
                  fontWeight="300"
                >
                  I
                </text>
                <text 
                  x="50" 
                  y="66" 
                  fontFamily="'Times New Roman', 'Playfair Display', 'Georgia', serif" 
                  fontSize="58" 
                  fill="#dfcba5" 
                  textAnchor="middle" 
                  fontWeight="400"
                >
                  S
                </text>
              </svg>

              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A1614] group-hover:text-[#1a3a2a] transition-all duration-300 group-hover:tracking-wider group-hover:[text-shadow:0_0_12px_rgba(197,160,89,0.4)]">
                  SURAT<span className="text-brand-gold-500 inline-block group-hover:scale-150 transition-transform duration-300 font-extrabold select-none">.</span>INSIDER
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.25em] text-brand-gold-500/90 -mt-1 font-semibold transition-all duration-300 group-hover:text-brand-gold-600 group-hover:tracking-[0.3em]">
                  The Insider's Edit
                </span>
              </div>
            </div>

            {/* User & Admin Controls */}
            <div className="flex items-center gap-3">
              
              {/* Secures system by only rendering Admin Status details if authenticated */}
              {currentUserRole !== "Guest" ? (
                <div className="flex items-center gap-2 bg-[#FFFDF5] border border-[#B8860B]/40 text-[#4A423D] py-1.5 px-3 rounded-xl text-xs font-medium font-mono">
                  <span className="text-[#4A423D] shrink-0">●</span> 
                  <span className="hidden sm:inline">Admin Mode</span>
                </div>
              ) : null}

            </div>

          </div>
        </div>
      </header>


      {/* =========================================================================
          PERSISTENT FLOATING BOTTOM NAV BAR (FOR HIGH-END APP FEEL & ACCESSIBILITY)
          Handles both mobile and desktop beautiful screen views at the very bottom
          ========================================================================= */}
      <div className="fixed bottom-0 sm:bottom-6 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-fit px-2 sm:px-4 pointer-events-none pb-[env(safe-area-inset-bottom,0)]">
        
        {/* Desktop View Floating Pill (Glassmorphic Glow Dock) */}
        <nav 
          role="tablist"
          aria-label="Experience Discovery Navigation"
          className="hidden lg:flex bg-[#FFFDF5]/70 backdrop-blur-lg border border-[#1A1614]/10 px-4 py-2.5 rounded-full shadow-sm items-center gap-1.5 pointer-events-auto transition-all duration-300" 
          id="nav-tabs-bottom-desktop"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => handleTabAction(tab.id)}
                role="tab"
                aria-selected={isActive}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors relative group select-none ${
                  isActive
                    ? "text-[#1A1614] font-bold"
                    : "text-[#1A1614]-light hover:text-[#1A1614]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderglowBottom"
                    className="absolute inset-0 bg-[#FFFDF5]00/50 backdrop-blur-sm rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                )}
                
                <motion.div
                  variants={iconVariants[tab.id as keyof typeof iconVariants]}
                  className="shrink-0"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-brand-gold-600 stroke-[2.5px]" : "text-[#1A1614]/60 group-hover:text-[#1A1614]"}`} />
                </motion.div>
                
                <span className="relative z-10 font-sans">{tab.label}</span>

                {isActive && (
                  <motion.span
                    layoutId="activeTabAccentBarBottom"
                    className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-[#B8860B] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Mobile View Bottom bar (Safe Inset Backlit Tab menu) */}
        <div 
          role="tablist"
          aria-label="Mobile Experience Discovery Navigation"
          className="lg:hidden flex items-center justify-between border border-[#1A1614]/10 bg-[#FFFDF5]/70 backdrop-blur-lg py-1.5 px-2 cursor-pointer shadow-sm pointer-events-auto rounded-full mx-4 my-3 gap-0.5"
          id="nav-tabs-bottom-mobile"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabAction(tab.id)}
                role="tab"
                aria-selected={isActive}
                whileTap={{ scale: 0.92 }}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-full text-[9px] font-bold tracking-tight flex-1 min-w-0 font-sans transition-all relative ${
                  isActive ? "text-[#1A1614] bg-[#FFFDF5]00/70 shadow-sm" : "text-[#1A1614]-light/95 hover:text-[#1A1614]"
                }`}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="shrink-0 flex items-center justify-center"
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-gold-600 stroke-[2.5px]" : "text-[#1A1614]/60"}`} />
                </motion.div>
                <span className="whitespace-nowrap font-sans text-center leading-none scale-90 origin-center">{tab.label.split(" ")[0]}</span>
              </motion.button>
            );
          })}
        </div>

      </div>
    </>
  );
}
