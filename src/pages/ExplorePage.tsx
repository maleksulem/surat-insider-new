import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { ExploreSection } from "../components/ExploreSection";
import { BridalMileSection } from "../components/BridalMileSection";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { CuratedExperience, Tour, FoodSpot, Inquiry } from "../types";

interface ExplorePageProps {
  destinations: CuratedExperience[];
  shoppingGuides: CuratedExperience[];
  tours: CuratedExperience[];
  foodSpots: FoodSpot[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function ExplorePage({
  destinations,
  shoppingGuides,
  tours,
  foodSpots,
  addInquiry,
  triggerWhatsAppMessage,
  searchQuery,
  setSearchQuery,
}: ExplorePageProps) {
  const navigate = useNavigate();
  useDocumentMetadata({
    title: "Explore Surat • Heritage Trails, Diamonds & Curated Experiences",
    description: "Unveil the cultural wonders of Surat. Browse private heritage expeditions, high-jewelry diamond showrooms, and premium South Gujarat attractions.",
    keywords: "Surat tourism, Surat heritage, Surat castle, Gopi Talav, Dumas beach, Chintamani Parswanath",
  });

  return (
    <div className="w-full">
      {/* Back to Portal Shortcut Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1A1614]/10 bg-white text-[#1A1614] text-xs font-mono font-black uppercase tracking-[0.2em] hover:bg-[#1A1614] hover:text-white hover:border-[#1A1614] transition-all group shadow-sm hover:shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" />
          Back to Portal
        </motion.button>
      </div>

      <ExploreSection
        destinations={destinations}
        shoppingGuides={shoppingGuides}
        tours={tours}
        foodSpots={foodSpots}
        addInquiry={addInquiry}
        triggerWhatsAppMessage={triggerWhatsAppMessage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <BridalMileSection />
    </div>
  );
}
