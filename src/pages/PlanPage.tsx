import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { PlannerSection } from "../components/PlannerSection";
import { Role, Destination, Hotel, FoodSpot, ShoppingGuide, Tour, LocalEvent, Inquiry } from "../types";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";

interface PlanPageProps {
  destinations: Destination[];
  hotels: Hotel[];
  foodSpots: FoodSpot[];
  shoppingGuides: ShoppingGuide[];
  tours: Tour[];
  events: LocalEvent[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
}

export function PlanPage({
  destinations,
  hotels,
  foodSpots,
  shoppingGuides,
  tours,
  events,
  addInquiry,
  currentUserRole,
  setCurrentUserRole,
}: PlanPageProps) {
  useDocumentMetadata({
    title: "Plan Your Journey • Surat Insider Itinerary Builder",
    description: "Compose your perfect Surat experience. Our interactive planner helps you schedule heritage tours, gourmet dining, and luxury shopping into a seamless journey.",
  });

  return (
    <div className="min-h-screen bg-brand-sand-50 flex flex-col font-sans">
      <main className="flex-1 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-black text-[#1A1614] tracking-tight leading-tight">
              The Golden Journey <span className="text-brand-gold-500 italic font-normal">Composer</span>
            </h1>
            <p className="text-lg text-[#1A1614]/40 mt-6 leading-relaxed font-light">
              Craft your bespoke Surati narrative. Every choice is a thread in your own living tapestry of discovery.
            </p>
          </motion.div>
        </div>

        <PlannerSection
          destinations={destinations}
          hotels={hotels}
          foodSpots={foodSpots}
          shoppingGuides={shoppingGuides}
          tours={tours}
          events={events}
          addInquiry={addInquiry}
        />
      </main>

      <footer className="bg-[#1A1614] text-brand-sand-50/20 shrink-0 text-center py-12 mt-24">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] font-bold">
          Surat Insider • Journey Management
        </p>
      </footer>
    </div>
  );
}
