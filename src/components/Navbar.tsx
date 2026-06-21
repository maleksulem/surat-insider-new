import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Compass, ShoppingBag, Hotel, Utensils, CalendarRange, UserCheck, 
  ShieldAlert, Sparkles, Image, Calendar, Lock, X, Key, Mail, ArrowRight, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  postcard: {
    hover: { 
      scale: [1, 1.35, 1.1, 1.2, 1], 
      rotate: [0, 180, 360], 
      transition: { duration: 1.1, ease: "easeInOut" } 
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
  activeTheme: "normal" | "wedding" | "vacation" | "weekend";
  setActiveTheme: (theme: "normal" | "wedding" | "vacation" | "weekend") => void;
}

export function Navbar({
  currentTab,
  setCurrentTab,
  currentUserRole,
  setCurrentUserRole,
  activeTheme,
  setActiveTheme,
}: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabAction = (tabId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { activeTab: tabId } });
    } else {
      setCurrentTab(tabId);
    }
  };

  const tabs = [
    { id: "explore", label: "Explore Surat", icon: Compass },
    { id: "shopping", label: "Shopping Hub", icon: ShoppingBag },
    { id: "planner", label: "Plan Vacation", icon: Calendar },
    { id: "hotels", label: "Hotels & Stays", icon: Hotel },
    { id: "food", label: "Food Trails", icon: Utensils },
    { id: "events-blogs", label: "Events & Stories", icon: CalendarRange },
    { id: "postcard", label: "AI Postcard", icon: Sparkles },
    ...(currentUserRole === "Super Admin" ? [{ id: "admin", label: "CMS Controls", icon: ShieldAlert }] : [])
  ];

  // Auth Protection States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Hook up global window-level trigger so footer staff link can open the modal safely
  React.useEffect(() => {
    const handleOpenAuth = () => {
      setEmailInput("");
      setPasswordInput("");
      setOtpInput("");
      setAuthError("");
      setOtpMessage("");
      setAuthStep(1);
      setShowAuthModal(true);
    };
    window.addEventListener("open-staff-auth", handleOpenAuth);
    return () => {
      window.removeEventListener("open-staff-auth", handleOpenAuth);
    };
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setLoading(true);
    setAuthError("");
    setOtpMessage("");

    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.toLowerCase().trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The entered security email is not registered in our CMS directory.");
      }

      setOtpMessage(data.message || "A secure 4-digit One-Time Passcode was generated.");
      setAuthStep(2);
      setAuthError("");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput || !otpInput) {
      setAuthError("Please fill out all verification inputs.");
      return;
    }

    setLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.toLowerCase().trim(),
          password: passwordInput,
          otp: otpInput
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "System rejected provided combination.");
      }

      setCurrentUserRole("Super Admin");
      setCurrentTab("admin");
      setShowAuthModal(false);
      
      // Reset flow state
      setEmailInput("");
      setPasswordInput("");
      setOtpInput("");
      setAuthStep(1);
      setAuthError("");
      setOtpMessage("");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-sand-50/95 backdrop-blur-md border-b border-brand-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              xmlns="http://www.w3.org/2000/svg"
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
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-brand-emerald-950 group-hover:text-brand-emerald-800 transition-colors">
                SURAT<span className="text-brand-gold-500">.</span>INSIDER
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.25em] text-brand-gold-500/90 -mt-1 font-semibold">
                Explore • Shop • Experience
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 relative" id="nav-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => handleTabAction(tab.id)}
                  whileHover="hover"
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors relative group select-none ${
                    isActive
                      ? "text-brand-emerald-950 font-bold"
                      : "text-brand-charcoal-light hover:text-brand-emerald-950"
                  }`}
                >
                  {/* Sliding active background highlight block in a wavy motion style */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderglow"
                      className="absolute inset-0 bg-brand-sand-100 rounded-lg -z-10"
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
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-brand-gold-600 font-bold stroke-[2.5px]" : "text-brand-charcoal/60 group-hover:text-brand-emerald-950"}`} />
                  </motion.div>
                  
                  <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">{tab.label}</span>

                  {/* Active bottom accent bar */}
                  {isActive && (
                    <motion.span
                      layoutId="activeTabAccentBar"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-gold-500 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

           {/* User & Admin Controls */}
          <div className="flex items-center gap-3">

            {/* Atmosphere Theme Selector */}
            <div className="flex items-center bg-brand-sand-200/60 rounded-xl p-1 border border-brand-sand-200">
              <span className="hidden xl:inline text-[11px] font-mono font-semibold px-2 text-brand-charcoal/60 uppercase">
                Vibe:
              </span>
              <select
                id="theme-select"
                value={activeTheme}
                onChange={(e) => setActiveTheme(e.target.value as any)}
                className="bg-brand-sand-50 border-none outline-none text-xs font-semibold py-1 px-2.5 rounded-lg text-brand-emerald-950 cursor-pointer focus:ring-1 focus:ring-brand-gold-400"
              >
                <option value="normal">🌿 Emerald Classic</option>
                <option value="wedding">✨ Surt Wedding (Gold/Red)</option>
                <option value="vacation">🏖️ Tapi Vacation (Blue)</option>
                <option value="weekend">🌆 Hazira Weekend (Sunset)</option>
              </select>
            </div>
            
            {/* Safe atmosphere selector */}

          </div>

        </div>
      </div>

      {/* Mobile Sticky Tab bar (Helper for mobile screens) */}
      <div className="lg:hidden flex justify-around border-t border-brand-sand-200 bg-brand-sand-50 p-1.5 overflow-x-auto gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabAction(tab.id)}
              whileTap={{ scale: 0.92 }}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg text-[10px] font-medium min-w-[70px] transition-all relative ${
                isActive ? "text-brand-emerald-950 font-bold bg-brand-sand-100" : "text-brand-charcoal-light/80"
              }`}
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="shrink-0"
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-gold-600" : "text-brand-charcoal/60"}`} />
              </motion.div>
              <span className="whitespace-nowrap">{tab.label.split(" ")[0]}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Beautiful Security Passcode Dialog Portal with 2FA verification stages */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-brand-sand-300 shadow-2xl p-6 relative overflow-hidden">
            
            {/* Top decorative lock strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-emerald-950 via-brand-gold-500 to-brand-emerald-950"></div>

            <button 
              onClick={() => {
                setShowAuthModal(false);
                setEmailInput("");
                setOtpInput("");
                setPasswordInput("");
                setAuthStep(1);
                setAuthError("");
                setOtpMessage("");
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-sand-100 transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header detail */}
            <div className="flex flex-col items-center text-center space-y-2 mt-2">
              <div className="w-12 h-12 rounded-full bg-brand-sand-100 text-brand-emerald-950 flex items-center justify-center border border-brand-sand-250 shrink-0 relative">
                <ShieldCheck className="w-6 h-6 text-brand-emerald-900" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-gold-500"></span>
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-emerald-950">
                Staff Authentication
              </h3>
              <p className="text-xs text-brand-charcoal/60 max-w-xs">
                Enter your catalogued work credentials to securely unlock Surat Insider CMS Controls.
              </p>
            </div>

            {/* Error notifications */}
            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-950 text-xs font-medium rounded-xl p-3.5 mt-4 space-y-1 font-sans">
                <p className="font-bold flex items-center gap-1.5">
                  ⚠️ Security Flagged:
                </p>
                <p className="opacity-90">{authError}</p>
              </div>
            )}

            {/* STEP 1: EMAIL VERIFICATION */}
            {authStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4 mt-5">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-brand-charcoal-light/95 mb-1.5 font-bold">
                    Primary Security Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-charcoal/40" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. staff@surat.insider"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-brand-sand-50/50 px-10 py-2.5 border border-brand-sand-250 text-sm rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald-950 focus:bg-white transition-all text-brand-charcoal font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-brand-sand-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal(false);
                      setAuthError("");
                    }}
                    className="flex-1 bg-brand-sand-100 hover:bg-brand-sand-200/80 text-brand-charcoal-light font-semibold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand-emerald-950 hover:bg-brand-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Request OTP"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PASSWORD + OTP PIN ENTRY */}
            {authStep === 2 && (
              <form onSubmit={handleVerify2FA} className="space-y-4 mt-5 animate-fade-in">
                
                {/* Simulated SMTP Delivery Alert Box */}
                <div className="bg-brand-emerald-950 text-brand-sand-100 p-4 rounded-xl border border-brand-gold-400/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-brand-sand-250/20 pb-1.5 font-mono text-[10px] text-brand-gold-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      2FA Passcode Dispatched
                    </span>
                    <span>Secure Gateway</span>
                  </div>
                  <p className="text-[11px] leading-relaxed select-none">
                    {otpMessage || "A temporary verification passcode was dispatched to your inbox."}
                  </p>
                  
                  <div className="text-[10px] text-brand-gold-400/80 border-t border-brand-sand-200/10 pt-1.5 leading-relaxed">
                    💡 If SMTP keys are not configured in your Google AI Studio Secrets panel, please locate the generated 4-digit code in your server's console runtime logs.
                  </div>
                </div>

                {/* Password field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-brand-charcoal-light mb-1 font-bold">
                      Master Passcode
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Admin Password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-brand-sand-50/50 px-3.5 py-2 border border-brand-sand-250 text-center font-mono text-xs rounded-xl outline-none focus:ring-1 focus:ring-brand-emerald-990 tracking-wider transition-all text-brand-charcoal"
                    />
                  </div>

                  {/* OTP verify pin code input */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-brand-charcoal-light mb-1 font-bold">
                      MFA 4-Digit Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      pattern="[0-9]*"
                      placeholder="OTP Code"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-brand-sand-50/50 px-3.5 py-2 border border-brand-sand-250 text-center font-mono text-sm rounded-xl outline-none focus:ring-1 focus:ring-brand-emerald-900 tracking-widest text-[#0c1717] font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-brand-sand-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep(1);
                      setAuthError("");
                      setOtpMessage("");
                    }}
                    className="bg-brand-sand-100 hover:bg-brand-sand-200/80 text-brand-charcoal-light font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand-emerald-950 hover:bg-brand-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase transition-colors disabled:opacity-50"
                  >
                    {loading ? "Authenticating..." : "Verify & Unlock CMS"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </header>
  );
}
