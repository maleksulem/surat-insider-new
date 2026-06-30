import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExperienceDetailModal } from "../components/ExperienceDetailModal";
import { HOTELS_DATA } from "../data/hotels";
import { FOOD_DATA } from "../data/food";
import { SHOPPING_DATA } from "../data/shopping";
import { DESTINATIONS_DATA } from "../data/destinations";
import { TOURS_DATA, EVENTS_DATA } from "../data/weekend";
import { BRIDAL_BOUTIQUES_DATA } from "../data/wedding";
import { STORIES_DATA } from "../data/stories";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { Inquiry } from "../types";

interface ExperienceDetailPageProps {
  destinations?: any[];
  shoppingGuides?: any[];
  hotels?: any[];
  tours?: any[];
  foodSpots?: any[];
  events?: any[];
  blogs?: any[];
  addInquiry: (inq: Omit<Inquiry, "id" | "date" | "status">) => void;
  triggerWhatsAppMessage: (text: string) => void;
}

export function ExperienceDetailPage({
  destinations = DESTINATIONS_DATA,
  shoppingGuides = SHOPPING_DATA,
  hotels = HOTELS_DATA,
  tours = TOURS_DATA,
  foodSpots = FOOD_DATA,
  events = EVENTS_DATA,
  blogs = STORIES_DATA,
  addInquiry,
  triggerWhatsAppMessage,
}: ExperienceDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Combine all items to find the clicked one
  const allItems: any[] = [
    ...hotels,
    ...foodSpots,
    ...shoppingGuides,
    ...destinations,
    ...tours,
    ...events,
    ...blogs,
    ...BRIDAL_BOUTIQUES_DATA,
  ];

  const item = allItems.find(
    (item) => item.id === id || item.slug === id
  );

  useDocumentMetadata({
    title: item ? `${item.title} • Curated Experience • Surat Insider` : "Curated Experience • Surat Insider",
    description: item ? item.shortDescription : "Curated travel, luxury textiles, and culinary experiences in Surat.",
  });

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF5] p-6 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#1A1614] mb-4">Curated Edit Not Found</h1>
        <p className="text-sm text-[#1A1614]/60 mb-6">The requested curated edit could not be retrieved.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#1A1614] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1A1614]/80 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Cast as normalized experience format
  const normalizedItem = {
    ...item,
    highlights: item.highlights || (item as any).nearbyAttractions || (item as any).amenities || [],
    tips: item.tips || ((item as any).insiderTips ? [(item as any).insiderTips] : []),
    category: item.category || "Curated Selection",
    gallery: item.gallery || [],
    inquiryType: item.inquiryType || "general",
    whatsappMessage: item.whatsappMessage || `I am interested in ${item.title}.`,
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFDF5]">
      <ExperienceDetailModal
        item={normalizedItem as any}
        onClose={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }}
        addInquiry={addInquiry}
        triggerWhatsAppMessage={triggerWhatsAppMessage}
      />
    </div>
  );
}
