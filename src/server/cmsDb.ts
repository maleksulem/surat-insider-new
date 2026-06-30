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
  AuditLog,
  MediaAsset,
  WebsiteImageConfig
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
  websiteImages?: WebsiteImageConfig[];
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
  media: [],
  websiteImages: [
    {
      id: "home_hero_bg",
      title: "Home Hero Background",
      section: "home",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
      description: "Primary large background image on the main page landing hero section.",
      usedIn: "Home Page Hero"
    },
    {
      id: "home_hero_overlay",
      title: "Home Hero Overlay",
      section: "home",
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      description: "Secondary decorative lighting overlay banner on the Home Page.",
      usedIn: "Home Page Backdrop"
    },
    {
      id: "portal_1_bg",
      title: "Portal 1 (The Wedding Edit)",
      section: "home",
      url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
      description: "Elegant background image for the luxury wedding and bridal wear portal link.",
      usedIn: "Home Page Portals & Zari Cards"
    },
    {
      id: "portal_2_bg",
      title: "Portal 2 (The 48-Hour Passport)",
      section: "home",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      description: "Background image for the high-end travel passport and fast tour portal link.",
      usedIn: "Home Page Portals & Zari Cards"
    },
    {
      id: "portal_3_bg",
      title: "Portal 3 (The Silk Route)",
      section: "home",
      url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
      description: "Background image for heritage looms, wholesale silk, and textile guides portal link.",
      usedIn: "Home Page Portals & Zari Cards"
    },
    {
      id: "portal_4_bg",
      title: "Portal 4 (The Tasting Table)",
      section: "home",
      url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
      description: "Background image for Surat's premier local foods and street food feast portal link.",
      usedIn: "Home Page Portals & Zari Cards"
    },
    {
      id: "portal_5_bg",
      title: "Portal 5 (The Insider Vault)",
      section: "home",
      url: "https://images.unsplash.com/photo-1585642398506-6c8f615e4a06?auto=format&fit=crop&w=1200&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1585642398506-6c8f615e4a06?auto=format&fit=crop&w=1200&q=80",
      description: "Background image for the private/exclusive bespoke membership portal link.",
      usedIn: "Home Page Portals & Zari Cards"
    },
    {
      id: "explore_hero_bg",
      title: "Explore Hero Background",
      section: "explore",
      url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=80",
      description: "Background banner on the Explore Section of South Gujarat and local attractions.",
      usedIn: "Explore Page Hero / Top Banner"
    },
    {
      id: "explore_card_1",
      title: "Explore Card 1 (Heritage)",
      section: "explore",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      description: "Scenic preview image for heritage monument tours.",
      usedIn: "Explore Page Heritage Showcase"
    },
    {
      id: "explore_card_2",
      title: "Explore Card 2 (Textile)",
      section: "explore",
      url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop",
      description: "Handloom weaving craft and master looms preview image.",
      usedIn: "Explore Page Craft Showcase"
    },
    {
      id: "explore_card_3",
      title: "Explore Card 3 (Scenic)",
      section: "explore",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
      description: "Waterfront and scenic attraction preview image.",
      usedIn: "Explore Page Scenic Showcase"
    },
    {
      id: "explore_banner_cta",
      title: "Explore CTA Banner",
      section: "explore",
      url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=80",
      description: "Stately banner behind the newsletter or travel query form in Explore.",
      usedIn: "Explore Guide CTA Banner"
    },
    {
      id: "food_hero_bg",
      title: "Food Route Hero",
      section: "food",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=2000&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=2000&auto=format&fit=crop",
      description: "Steaming hot local Locho and local delicacies background banner.",
      usedIn: "Tasting Table Guide Page Hero"
    },
    {
      id: "food_card_1",
      title: "Food Card 1 (Sweets & Ghari)",
      section: "food",
      url: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=800&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=800&auto=format&fit=crop",
      description: "Delicious sweet Surti Ghari presentation closeup card background.",
      usedIn: "Tasting Table Selection 1"
    },
    {
      id: "food_card_2",
      title: "Food Card 2 (Locho & Snacks)",
      section: "food",
      url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
      description: "Steaming hot savory locho snack closeup card background.",
      usedIn: "Tasting Table Selection 2"
    },
    {
      id: "hotel_hero_bg",
      title: "Hotel Hero Background",
      section: "hotels",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
      description: "Luxury hotel facade or premier grand lobby entrance backdrop.",
      usedIn: "Hotels Page Hero Banner"
    },
    {
      id: "hotel_card_1",
      title: "Hotel Card 1 (Luxury Bed)",
      section: "hotels",
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop",
      description: "Polished image of premium hotel suites and standard room layouts.",
      usedIn: "Hotels Page Selection 1"
    },
    {
      id: "hotel_card_2",
      title: "Hotel Card 2 (Lounge)",
      section: "hotels",
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
      description: "Elegant restaurant lounge or swimming pool setting.",
      usedIn: "Hotels Page Selection 2"
    },
    {
      id: "shopping_hero_bg",
      title: "Shopping Hero Background",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
      description: "Close-up of golden silk saree stitches and embroidery work.",
      usedIn: "Shopping Page Hero Banner"
    },
    {
      id: "shopping_zari_banner",
      title: "Zari Work Banner",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      description: "Rich threads, looms, and wholesale hand-craft highlight banner.",
      usedIn: "Zari Heritage Highlights"
    },
    {
      id: "shopping_jewellery_banner",
      title: "Jewellery Sourcing Banner",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      description: "Exquisite gold jewelry sets and diamond solitaire stones showcase banner.",
      usedIn: "Diamond & Jewelry Highlights"
    },
    {
      id: "bridal_mile_1",
      title: "Bridal Mile 1 (Heritage Weaves)",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      description: "High-contrast silk saree closeup showcasing gold threads and zari detailing.",
      usedIn: "Wedding - Bridal Saree Section"
    },
    {
      id: "bridal_mile_2",
      title: "Bridal Mile 2 (Royal Couture)",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80",
      description: "Designer bridal dress atelier showing custom embroideries and royal fabrics.",
      usedIn: "Wedding - Royal Couture Section"
    },
    {
      id: "bridal_mile_3",
      title: "Bridal Mile 3 (Diamond Sourcing)",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      defaultUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      description: "Luxury diamonds close-up showcasing elite solitaire work and gold jewelry.",
      usedIn: "Wedding - Jewelry Sourcing Section"
    },
    {
      id: "textile_hero_bg",
      title: "Silk Route Hero",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      description: "Rich backdrop of silk reels and fine fabrics inside the Silk Route guides page.",
      usedIn: "Silk Route Guide Page Hero"
    },
    {
      id: "wedding_hero_bg",
      title: "Wedding Hero",
      section: "shopping",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=2000&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=2000&auto=format&fit=crop",
      description: "Main background image in the luxury Wedding Shopping guide page.",
      usedIn: "Wedding Sourcing Guide Page Hero"
    },
    {
      id: "vault_card_1",
      title: "Vault: Diamond Sourcing",
      section: "vault",
      url: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=800&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=800&auto=format&fit=crop",
      description: "Background card inside the private membership vault for diamonds.",
      usedIn: "Insider Vault Card List"
    },
    {
      id: "vault_card_2",
      title: "Vault: Gaji Silk Weaving",
      section: "vault",
      url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
      description: "Background card inside the private membership vault for exclusive looms.",
      usedIn: "Insider Vault Card List"
    },
    {
      id: "vault_card_3",
      title: "Vault: Ghari Tasting Session",
      section: "vault",
      url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop",
      description: "Background card inside the private membership vault for master tastings.",
      usedIn: "Insider Vault Card List"
    },
    {
      id: "vault_card_4",
      title: "Vault: Dutch Secret Heritage",
      section: "vault",
      url: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800&auto=format&fit=crop",
      description: "Background card inside the private membership vault for historical tours.",
      usedIn: "Insider Vault Card List"
    },
    {
      id: "branding_logo",
      title: "Main Website Logo",
      section: "branding",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=100&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=100&auto=format&fit=crop",
      description: "Primary website logo shown in the navigation bar.",
      usedIn: "Navigation Navbar (Left)"
    },
    {
      id: "branding_footer_logo",
      title: "Footer Logo",
      section: "branding",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=100&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=100&auto=format&fit=crop",
      description: "Branding logo used in the bottom footer block.",
      usedIn: "Page Footer Layout"
    },
    {
      id: "branding_favicon",
      title: "Favicon Logo Icon",
      section: "branding",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=50&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=50&auto=format&fit=crop",
      description: "Website short favicon logo icon in the browser tab.",
      usedIn: "Browser Tab Favicon"
    },
    {
      id: "footer_banner",
      title: "Footer Banner background",
      section: "branding",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
      defaultUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
      description: "Decorative bottom backdrop behind footer links.",
      usedIn: "Page Footer Background Overlay"
    },
    {
      id: "placeholder_generic",
      title: "Placeholder: Generic",
      section: "system",
      url: "/images/generic.svg",
      defaultUrl: "/images/generic.svg",
      description: "Generic system fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_castle",
      title: "Placeholder: Surat Castle",
      section: "system",
      url: "/images/surat_castle.svg",
      defaultUrl: "/images/surat_castle.svg",
      description: "Castle and historical forts system fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_cemetery",
      title: "Placeholder: Cemeteries",
      section: "system",
      url: "/images/cemeteries.svg",
      defaultUrl: "/images/cemeteries.svg",
      description: "Dutch & Armenian historical cemetery monuments fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_beach",
      title: "Placeholder: Dumas Beach",
      section: "system",
      url: "/images/dumas_beach.svg",
      defaultUrl: "/images/dumas_beach.svg",
      description: "Dumas & Suvali beach scenic coastlines fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_lake",
      title: "Placeholder: Gopi Talav Lake",
      section: "system",
      url: "/images/gopi_talav.svg",
      defaultUrl: "/images/gopi_talav.svg",
      description: "Symmetrical historic Gopi Talav lakes and waterfronts fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_textile",
      title: "Placeholder: Textile Loom",
      section: "system",
      url: "/images/textile_guide.svg",
      defaultUrl: "/images/textile_guide.svg",
      description: "Bridal sarees, heritage looms and wholesale silk guide fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_hotel",
      title: "Placeholder: Elite Stays",
      section: "system",
      url: "/images/hotel.svg",
      defaultUrl: "/images/hotel.svg",
      description: "Lobbies, boutique hotels and grand residency fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_food",
      title: "Placeholder: Gastronomy",
      section: "system",
      url: "/images/food.svg",
      defaultUrl: "/images/food.svg",
      description: "Delicious street locho, sweet ghari and thali feasts fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_event",
      title: "Placeholder: Events & Festivals",
      section: "system",
      url: "/images/event.svg",
      defaultUrl: "/images/event.svg",
      description: "Garba expos, modern textiles and local festivals fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    },
    {
      id: "placeholder_diamond",
      title: "Placeholder: Diamonds & Jewels",
      section: "system",
      url: "/images/diamonds.svg",
      defaultUrl: "/images/diamonds.svg",
      description: "Precious diamonds, gold jewelry and elite merchants fallback image asset.",
      usedIn: "SafeImage System Core Fallbacks"
    }
  ]
};

function sanitizeUnsplashImages(db: CmsDatabase): CmsDatabase {
  const cleanUrl = (url: string | undefined): string => {
    if (!url) return "";
    if (url.includes("unsplash.com")) return "";
    return url;
  };

  const cleanGallery = (gallery: string[] | undefined): string[] => {
    if (!gallery) return [];
    return gallery.filter(item => !item.includes("unsplash.com"));
  };

  if (db.destinations) {
    db.destinations = db.destinations.map(d => ({
      ...d,
      image: cleanUrl(d.image),
      gallery: cleanGallery(d.gallery)
    }));
  }

  if (db.hotels) {
    db.hotels = db.hotels.map(h => ({
      ...h,
      image: cleanUrl(h.image),
      gallery: cleanGallery(h.gallery)
    }));
  }

  if (db.foodSpots) {
    db.foodSpots = db.foodSpots.map(f => ({
      ...f,
      image: cleanUrl(f.image),
      gallery: cleanGallery(f.gallery)
    }));
  }

  if (db.tours) {
    db.tours = db.tours.map(t => ({
      ...t,
      image: cleanUrl(t.image),
      gallery: cleanGallery(t.gallery)
    }));
  }

  if (db.events) {
    db.events = db.events.map(e => ({
      ...e,
      image: cleanUrl(e.image)
    }));
  }

  if (db.blogs) {
    db.blogs = db.blogs.map(b => ({
      ...b,
      image: cleanUrl(b.image)
    }));
  }

  if (db.homepage) {
    db.homepage.heroImage = cleanUrl(db.homepage.heroImage);
  }

  if (db.websiteImages) {
    db.websiteImages = db.websiteImages.map(w => ({
      ...w,
      url: cleanUrl(w.url),
      defaultUrl: cleanUrl(w.defaultUrl)
    }));
  }

  if (db.seo) {
    Object.keys(db.seo).forEach((key) => {
      const page = db.seo[key as keyof typeof db.seo];
      if (page) {
        page.openGraphImage = cleanUrl(page.openGraphImage);
      }
    });
  }

  return db;
}

function reconstructPhysicalFiles(db: CmsDatabase): void {
  if (!db.media || !Array.isArray(db.media)) return;

  const publicDir = path.join(process.cwd(), "public");
  const assetsDir = path.join(publicDir, "assets");
  const uploadsDir = path.join(assetsDir, "uploads");
  const mediaDir = path.join(publicDir, "media");

  if (!fs.existsSync(publicDir)) {
    try { fs.mkdirSync(publicDir); } catch (e) {}
  }
  if (!fs.existsSync(assetsDir)) {
    try { fs.mkdirSync(assetsDir); } catch (e) {}
  }
  if (!fs.existsSync(uploadsDir)) {
    try { fs.mkdirSync(uploadsDir); } catch (e) {}
  }
  if (!fs.existsSync(mediaDir)) {
    try { fs.mkdirSync(mediaDir); } catch (e) {}
  }

  db.media.forEach((item: any) => {
    if (item.url && item.base64) {
      const relativePath = item.url.startsWith("/") ? item.url.substring(1) : item.url;
      const targetPath = path.join(publicDir, relativePath);

      if (!fs.existsSync(targetPath)) {
        try {
          console.log(`[CMS Reconstruct] Reconstructing missing physical file: ${targetPath}`);
          const base64Payload = item.base64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Payload, "base64");
          
          const dir = path.dirname(targetPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(targetPath, buffer);
        } catch (error) {
          console.error(`[CMS Reconstruct Error] Failed to write reconstructed file for ${item.url}:`, error);
        }
      }
    }
  });
}

function removeDefaultExperiences(db: CmsDatabase): CmsDatabase {
  const isUserOwned = (item: any): boolean => {
    if (!item) return false;
    const id = item.id || "";
    const url = item.image || "";
    // Keep user-owned items or items with uploaded images
    const isIdUser = id.startsWith("item-");
    const isUrlUploaded = url.includes("/media/") || url.includes("/assets/uploads/");
    return isIdUser || isUrlUploaded;
  };

  if (db.destinations) {
    db.destinations = db.destinations.filter(isUserOwned);
  }
  if (db.hotels) {
    db.hotels = db.hotels.filter(isUserOwned);
  }
  if (db.foodSpots) {
    db.foodSpots = db.foodSpots.filter(isUserOwned);
  }
  if (db.tours) {
    db.tours = db.tours.filter(isUserOwned);
  }
  if (db.events) {
    db.events = db.events.filter(isUserOwned);
  }
  if (db.blogs) {
    db.blogs = db.blogs.filter(isUserOwned);
  }
  if (db.shoppingGuides) {
    db.shoppingGuides = db.shoppingGuides.filter(isUserOwned);
  }

  return db;
}

let dbCache: CmsDatabase | null = null;

export function getDb(): CmsDatabase {
  if (dbCache) return dbCache;

  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      dbCache = JSON.parse(content);
      
      // Ensure missing properties are merged in case the structure expanded
      dbCache = { ...defaultDb, ...dbCache };
      
      // Reconstruct missing physical files from persisted base64 data
      reconstructPhysicalFiles(dbCache);

      saveDb(dbCache);
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
