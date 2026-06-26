import fs from "fs";
import path from "path";
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_SHOPPING, 
  INITIAL_HOTELS, 
  INITIAL_TOURS, 
  INITIAL_FOOD, 
  INITIAL_EVENTS, 
  INITIAL_BLOGS,
  INITIAL_MONETIZATION,
  INITIAL_INQUIRIES,
  INITIAL_PARTNERS,
  INITIAL_AUDIT
} from "../data";
import { 
  Destination, 
  ShoppingGuide, 
  Hotel, 
  Tour, 
  FoodSpot, 
  LocalEvent, 
  BlogPost, 
  MonetizationSetting, 
  Inquiry, 
  PartnerRequest, 
  AuditLog 
} from "../types";

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaText: string;
  heroImage: string;
  heroVideo: string;
  heroBadges: string[];
}

export interface ChatbotConfig {
  prompt: string;
  personas: {
    shopping: string;
    food: string;
    heritage: string;
  };
  greeting: string;
  faq: { question: string; answer: string }[];
  messageLimit: number;
}

export interface SeoPageConfig {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  openGraphImage: string;
  twitterCard: string;
  structuredSchema: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  altText: string;
  caption: string;
  category: string;
  size: string;
}

export interface CmsDatabase {
  destinations: Destination[];
  shoppingGuides: ShoppingGuide[];
  hotels: Hotel[];
  tours: Tour[];
  foodSpots: FoodSpot[];
  events: LocalEvent[];
  blogs: BlogPost[];
  monetization: MonetizationSetting;
  homepage: HomepageConfig;
  aiChatbot: ChatbotConfig;
  seo: Record<string, SeoPageConfig>;
  media: MediaAsset[];
  inquiries: Inquiry[];
  partners: PartnerRequest[];
  auditLogs: AuditLog[];
}

const DB_PATH = path.join(process.cwd(), "cms_database.json");

const defaultDb: CmsDatabase = {
  destinations: INITIAL_DESTINATIONS,
  shoppingGuides: INITIAL_SHOPPING,
  hotels: INITIAL_HOTELS,
  tours: INITIAL_TOURS,
  foodSpots: INITIAL_FOOD,
  events: INITIAL_EVENTS,
  blogs: INITIAL_BLOGS,
  monetization: INITIAL_MONETIZATION,
  inquiries: INITIAL_INQUIRIES,
  partners: INITIAL_PARTNERS,
  auditLogs: INITIAL_AUDIT,
  homepage: {
    heroTitle: "SURAT INSIDER",
    heroSubtitle: "THE SOUL OF THE EMERALD CITY",
    heroDescription: "Step into South Gujarat's premier portal for luxury textile curation, heritage explorations, diamonds, and culinary marvels.",
    ctaText: "Explore the Guides",
    heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    heroVideo: "",
    heroBadges: ["100% Curated", "Local Heritage", "Diamond District Approved"]
  },
  aiChatbot: {
    prompt: "You are Surat Insider AI, the ultimate luxury concierge for Surat.",
    personas: {
      shopping: "You are Radhika, Surat Insider's elite Wedding Shopping & Textile Market Expert. You have deep knowledge of Ring Road's wholesale hubs, STM, Ghod Dod Road's diamond jewelery boutiques, and where to secure authentic Tanchoi, Gaji Silk, and high-end embroidered work. Keep your tone extremely premium, insider-focused, elegant, and helpful. Guide users with budget wisdom, secret shopping hubs, and tips to avoid commission middlemen.",
      food: "You are Jignesh, Surat Insider's passionate Culinary Historian and Street Food Guide. Surat's food represents luxury through street feast. You know everything about Locho (butter, garlic, Schezwan), Khaman, Ghari, Undhiyu, and the local street-faring culture. Your tone is warm, enthusiastic, slightly mouth-watering, and full of pride for Surati food treasures.",
      heritage: "You are Jayesh, Surat Insider's Head of Cultural Heritage and Local Travel Guide. You represent the historical, architectural, and tourism heartbeat of Surat and South Gujarat (including Saputara and Statue of Unity). You explain Surat Castle's defense walls, Dutch/Armenian monuments, Tapi River mysteries, and general itinerary guides with historical flair. Keep your tone polished, scholarly yet accessible, and deeply welcoming."
    },
    greeting: "Namaste! Welcome to Surat Insider's elite concierge. Select an expert persona below or ask me any question about our legendary silk, street food, or 16th-century bastions.",
    faq: [
      { question: "Where is the best place to buy authentic sarees?", answer: "Ghod Dod Road and Ring Road wholesale markets are highly recommended." },
      { question: "What is Surat's most famous dish?", answer: "Surati Locho and Ghari are absolute must-tries!" }
    ],
    messageLimit: 5
  },
  seo: {
    home: {
      pageTitle: "Surat Insider • Explore, Shop, Experience",
      metaDescription: "Step into South Gujarat's premier portal for luxury textile curation, heritage explorations, diamonds, and culinary marvels.",
      keywords: "surat, travel, gujarat, tourism, textile, diamonds, locho, history, silk, castle",
      canonicalUrl: "https://suratinsider.com",
      openGraphImage: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
      twitterCard: "summary_large_image",
      structuredSchema: "{}"
    },
    wedding: {
      pageTitle: "Royal Wedding Sourcing & Saree Shopping Guide",
      metaDescription: "The ultimate curated roadmap to Surat's bridal wear, couture collections, legendary silk sarees, and high-end wedding jewelers.",
      keywords: "wedding shopping, sarees, silk, bridal wear, designer, couture",
      canonicalUrl: "https://suratinsider.com/wedding",
      openGraphImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
      twitterCard: "summary_large_image",
      structuredSchema: "{}"
    }
  },
  media: []
};

let dbCache: CmsDatabase | null = null;

export function getDb(): CmsDatabase {
  if (dbCache) return dbCache;

  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      dbCache = JSON.parse(content);
      
      // Ensure missing properties are merged in case the structure expanded
      dbCache = { ...defaultDb, ...dbCache };
      return dbCache!;
    }
  } catch (error) {
    console.error("Failed to read CMS database file. Initializing defaults.", error);
  }

  dbCache = { ...defaultDb };
  saveDb(dbCache);
  return dbCache;
}

export function saveDb(data: CmsDatabase): void {
  dbCache = data;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to CMS database file:", error);
  }
}
