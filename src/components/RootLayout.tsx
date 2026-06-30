import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { GeminiChat } from "./GeminiChat";
import { CustomCursor } from "./CustomCursor";
import { Role } from "../types";

interface RootLayoutProps {
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  chatbotConfig: any;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function RootLayout({
  currentUserRole,
  setCurrentUserRole,
  chatbotConfig,
  currentTab,
  setCurrentTab,
}: RootLayoutProps) {
  const location = useLocation();

  // Automatically scroll to top on every path change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-brand-sand-50 text-[#1A1614] selection:bg-brand-gold-500 selection:text-[#1A1614] flex flex-col font-sans overflow-x-hidden">
      {/* Lagging Ring Custom Cursor */}
      <CustomCursor />

      {/* Persistent Navigation bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <footer className="bg-[#1A1614] text-brand-sand-50/20 shrink-0 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
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
              <li><Link to="/explore" className="hover:text-brand-gold-500 transition-colors">Explore</Link></li>
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

      {/* AI Chatbot module */}
      <GeminiChat chatbotConfig={chatbotConfig} />
    </div>
  );
}
