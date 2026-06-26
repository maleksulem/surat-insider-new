export type Role = "Super Admin" | "Editor" | "Content Manager" | "Partner Manager";

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  gallery?: string[];
  rating: number;
  status: "Draft" | "Published";
  slug: string;
}

export interface CuratedExperience {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  timings: string;
  bestTimeToVisit: string;
  estimatedDuration: string;
  priceRange: string;
  highlights: string[];
  tips: string[];
  image: string;
  images?: string[];
  gallery: string[];
  inquiryType: string;
  whatsappMessage: string;
  rating?: number;
  status?: "Draft" | "Published";
}

export interface Destination extends BaseItem {
  category: "Attractions" | "Nature" | "Heritage" | "Museums" | "Religious Places" | "Family Activities" | "Nightlife" | "Food Experiences";
  story: string;
  visitingHours: string;
  bestTimeToVisit: string;
  nearbyAttractions: string[];
  suggestedItinerary: string;
  location: string;
}

export interface ShoppingGuide extends BaseItem {
  category: "Bridal Shopping" | "Sarees" | "Designer Wear" | "Menswear" | "Sherwani" | "Jewellery" | "Textiles" | "Wholesale Markets" | "Festival Shopping";
  priceRange: "₹" | "₹₹" | "₹₹₹" | "₹₹₹₹";
  whatToBuy: string;
  insiderTips: string;
  stores: string[]; // List of specific highly curated outlets/shops
  location: string;
}

export interface Hotel extends BaseItem {
  category: "Budget" | "Mid-range" | "Luxury" | "Family" | "Business";
  pricePerNight: number;
  amenities: string[];
  nearbyAttractions: string[];
  contactInfo: string;
  location: string;
}

export interface Tour extends BaseItem {
  pricing: number;
  duration: string;
  itinerary: string[]; // Steps of the tour
}

export interface FoodSpot extends BaseItem {
  category: "Street Food" | "Local Favorites" | "Cafes" | "Fine Dining" | "Family Restaurants";
  mustTry: string;
  priceLevel: "₹" | "₹₹" | "₹₹₹";
  location: string;
  timings: string;
}

export interface LocalEvent extends BaseItem {
  category: "Festivals" | "Exhibitions" | "Shopping Fairs" | "Cultural Programs";
  date: string;
  venue: string;
}

export interface BlogPost extends BaseItem {
  category: "Things To Do" | "Shopping Guides" | "Weekend Trips" | "Food Trails" | "Hidden Gems";
  content: string;
  author: string;
  publishedAt: string;
}

export interface Inquiry {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: "hotel" | "tour" | "shopping" | "general";
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "New" | "Contacted" | "Closed";
  sourcePage?: string;
  category?: string;
  inquiryType?: string;
  timestamp?: string;
}

export interface PartnerRequest {
  id: string;
  businessName: string;
  businessType: "hotel" | "shop" | "restaurant" | "tour_operator";
  contactEmail: string;
  requestedUpdate: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  date: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: Role;
  action: string;
  targetType: string;
  targetName: string;
  timestamp: string;
}

export interface MonetizationSetting {
  featuredListingFee: number;
  sponsoredAdCost: number;
  premiumGuideAccessFee: number;
  isFeaturedEnabled: boolean;
  isSponsoredEnabled: boolean;
  isPremiumEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
