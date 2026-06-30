import React, { useState } from "react";
import { Role, Destination, Hotel, FoodSpot, LocalEvent, Tour, BlogPost, Inquiry, PartnerRequest, AuditLog, MonetizationSetting } from "../types";
import { 
  ShieldCheck, Plus, Trash2, Edit2, CheckCircle, XCircle, 
  DollarSign, Activity, FileText, Sparkles, Image, Settings, 
  Upload, Trash, X, Save, Eye, ArrowUpRight, HelpCircle,
  FolderOpen, Search, Grid, List, Database, RotateCcw, Check, AlertTriangle, FileImage
} from "lucide-react";
import { useWebsiteImages } from "./SafeImage";

interface AdminPanelProps {
  currentUserRole: Role | "Guest";
  destinations: Destination[];
  setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
  shoppingGuides: any[];
  setShoppingGuides: React.Dispatch<React.SetStateAction<any[]>>;
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
  tours: Tour[];
  setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
  foodSpots: FoodSpot[];
  setFoodSpots: React.Dispatch<React.SetStateAction<FoodSpot[]>>;
  events: LocalEvent[];
  setEvents: React.Dispatch<React.SetStateAction<LocalEvent[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  partnerRequests: PartnerRequest[];
  setPartnerRequests: React.Dispatch<React.SetStateAction<PartnerRequest[]>>;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, targetType: string, targetName: string) => void;
  monetization: MonetizationSetting;
  setMonetization: (setting: MonetizationSetting) => void;

  // New CMS configurations
  homepageConfig?: any;
  chatbotConfig?: any;
  seoConfig?: any;
  mediaList?: any[];
  refreshCmsData?: () => void;
}

export function AdminPanel({
  currentUserRole,
  destinations,
  setDestinations,
  shoppingGuides,
  setShoppingGuides,
  hotels,
  setHotels,
  tours,
  setTours,
  foodSpots,
  setFoodSpots,
  events,
  setEvents,
  blogs,
  setBlogs,
  inquiries,
  setInquiries,
  partnerRequests,
  setPartnerRequests,
  auditLogs,
  addAuditLog,
  monetization,
  setMonetization,
  homepageConfig,
  chatbotConfig,
  seoConfig,
  mediaList = [],
  refreshCmsData,
}: AdminPanelProps) {
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];
  const safePartnerRequests = Array.isArray(partnerRequests) ? partnerRequests : [];

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<"cms" | "media" | "configs" | "partners" | "leads" | "monetization" | "security">("cms");
  const [cmsModelType, setCmsModelType] = useState<"destination" | "hotel" | "food" | "event" | "tour" | "shopping" | "blog">("destination");
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string>("");

  // Media manager state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaAlt, setMediaAlt] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaCategory, setMediaCategory] = useState("General");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  // UIMS Website Images CMS states
  const { websiteImages = [], refreshImages } = useWebsiteImages();
  const [activeImageSubTab, setActiveImageSubTab] = useState<string>("home");
  const [imagePickerModalForId, setImagePickerModalForId] = useState<string | null>(null);
  const [searchMediaPattern, setSearchMediaPattern] = useState("");
  const [filterMediaCategory, setFilterMediaCategory] = useState("All");
  
  // Local UIMS image draft states to support Shopify-style Save/Cancel changes per card
  const [draftUrls, setDraftUrls] = useState<Record<string, string>>({});
  const [editingUrlForId, setEditingUrlForId] = useState<string | null>(null);
  
  // Duplicate detection conflict state
  const [conflictUploadData, setConflictUploadData] = useState<{
    name: string;
    data: string;
    altText: string;
    caption: string;
    category: string;
    existingFile: any;
  } | null>(null);

  // Configurations forms states
  const [formHomepage, setFormHomepage] = useState({
    heroTitle: homepageConfig?.heroTitle || "",
    heroSubtitle: homepageConfig?.heroSubtitle || "",
    heroDescription: homepageConfig?.heroDescription || "",
  });

  const [formChatbot, setFormChatbot] = useState({
    messageLimit: chatbotConfig?.messageLimit || 5,
    customWelcomeMessage: chatbotConfig?.customWelcomeMessage || "",
    defaultPersona: chatbotConfig?.defaultPersona || "heritage",
  });

  const [formSeo, setFormSeo] = useState<any>(seoConfig || {});

  const [formMonetization, setFormMonetization] = useState({
    sponsoredAdCost: monetization?.sponsoredAdCost || 1500,
    premiumGuideAccessFee: monetization?.premiumGuideAccessFee || 2500,
    isFeaturedEnabled: monetization?.isFeaturedEnabled ?? true,
    isSponsoredEnabled: monetization?.isSponsoredEnabled ?? true,
    isPremiumEnabled: monetization?.isPremiumEnabled ?? true,
  });

  React.useEffect(() => {
    if (monetization) {
      setFormMonetization({
        sponsoredAdCost: monetization.sponsoredAdCost,
        premiumGuideAccessFee: monetization.premiumGuideAccessFee,
        isFeaturedEnabled: monetization.isFeaturedEnabled,
        isSponsoredEnabled: monetization.isSponsoredEnabled,
        isPremiumEnabled: monetization.isPremiumEnabled,
      });
    }
  }, [monetization]);

  const showToast = (message: string, type: "error" | "success" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const isGuest = currentUserRole === "Guest";
  
  const hasAccess = (requiredRoles: Role[]) => {
    if (isGuest) return false;
    return requiredRoles.includes(currentUserRole as Role);
  };

  const hasCmsAccess = () => hasAccess(["Super Admin", "Editor", "Content Manager"]);
  const hasPartnerAccess = () => hasAccess(["Super Admin", "Partner Manager"]);

  // CMS modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    images: [] as string[],
    category: "",
    location: "",
    rating: 4.8,
    status: "Published" as "Draft" | "Published",
    story: "",
    visitingHours: "",
    bestTimeToVisit: "",
    nearbyAttractions: "",
    pricePerNight: 4000,
    amenities: "",
    pricing: 3500,
    duration: "4 Hours",
    itinerarySteps: "",
    priceRange: "₹₹ (Mid-range)",
    specialty: "",
    contactInfo: "",
    mustTryName: "",
    priceLevel: "₹" as "₹" | "₹₹" | "₹₹₹",
    timings: "",
    readTime: "4 Mins",
    author: "Editorial Board"
  });

  // Safe server-authorized saving engine
  const saveCmsModule = async (key: string, data: any) => {
    try {
      const response = await fetch("/api/admin/cms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data })
      });
      const result = await response.json();
      if (result.success) {
        showToast(`Successfully saved ${key} changes to live website!`, "success");
        if (refreshCmsData) refreshCmsData();
        return true;
      } else {
        showToast(result.error || `Failed to save ${key} changes.`, "error");
        return false;
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Error syncing CMS changes: ${err.message}`, "error");
      return false;
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (!hasCmsAccess()) {
      showToast("Unauthorized. Only editors or super admins can create/edit items.", "error");
      return;
    }

    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Robust Image & Gallery Resolution Strategy
    // 1. Determine the primary cover image URL. Priority goes to manually pasted fallback cover url (formData.image),
    //    then uploaded images (formData.images[0]), and finally existing state values if any.
    let finalImage = formData.image || formData.images?.[0] || "";
    
    // 2. Determine the gallery images array, ensuring finalImage stays synced at index 0.
    let finalImages = formData.images && formData.images.length > 0 ? [...formData.images] : (finalImage ? [finalImage] : []);
    if (finalImage) {
      if (!finalImages.includes(finalImage)) {
        finalImages = [finalImage, ...finalImages];
      } else if (finalImages[0] !== finalImage) {
        finalImages = [finalImage, ...finalImages.filter(img => img !== finalImage)];
      }
    }

    if (isEditingId) {
      // EDITING EXISTING ITEM
      if (cmsModelType === "destination") {
        const nextList = destinations.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: finalImage || item.image,
          images: finalImages.length > 0 ? finalImages : (item.images || []),
          category: (formData.category as any) || "Heritage",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          story: formData.story || "A revised tourist spot.",
          visitingHours: formData.visitingHours,
          bestTimeToVisit: formData.bestTimeToVisit,
          nearbyAttractions: formData.nearbyAttractions ? formData.nearbyAttractions.split(",").map(s => s.trim()) : [],
        } : item);
        setDestinations(nextList);
        await saveCmsModule("destinations", nextList);
        addAuditLog("Edited Spot", "Destination", formData.title);
      } else if (cmsModelType === "hotel") {
        const nextList = hotels.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: finalImage || item.image,
          images: finalImages.length > 0 ? finalImages : (item.images || []),
          category: (formData.category as any) || "Luxury",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.7,
          status: formData.status,
          pricePerNight: Number(formData.pricePerNight) || 3500,
          amenities: formData.amenities ? formData.amenities.split(",").map(s => s.trim()) : [],
        } : item);
        setHotels(nextList);
        await saveCmsModule("hotels", nextList);
        addAuditLog("Edited Hotel", "Hotel Stay", formData.title);
      } else if (cmsModelType === "food") {
        const nextList = foodSpots.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: finalImage || item.image,
          images: finalImages.length > 0 ? finalImages : (item.images || []),
          category: (formData.category as any) || "Street Food",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          mustTry: formData.mustTryName || "Spiced Locho",
          priceLevel: (formData.priceLevel as any) || "₹",
          location: formData.location || "Surat, Gujarat",
          timings: formData.timings || "08:00 AM - 09:00 PM"
        } : item);
        setFoodSpots(nextList);
        await saveCmsModule("foodSpots", nextList);
        addAuditLog("Edited Food Spot", "Dining", formData.title);
      } else if (cmsModelType === "event") {
        const nextList = events.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: finalImage || item.image,
          images: finalImages.length > 0 ? finalImages : (item.images || []),
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          category: (formData.category as any) || "Festivals",
          venue: formData.location || "SIECC, Surat"
        } : item);
        setEvents(nextList);
        await saveCmsModule("events", nextList);
        addAuditLog("Edited Local Event", "Event", formData.title);
      } else if (cmsModelType === "tour") {
        const nextList = tours.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: finalImage || item.image,
          images: finalImages.length > 0 ? finalImages : (item.images || []),
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          pricing: Number(formData.pricing) || 2500,
          duration: formData.duration || "4 Hours",
          itinerary: formData.itinerarySteps ? formData.itinerarySteps.split("\n").map(s => s.trim()) : []
        } : item);
        setTours(nextList);
        await saveCmsModule("tours", nextList);
        addAuditLog("Edited Tour Details", "Tour", formData.title);
      } else if (cmsModelType === "shopping") {
        const nextList = shoppingGuides.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: finalImage || item.image,
          images: finalImages.length > 0 ? finalImages : (item.images || []),
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          priceRange: formData.priceRange,
          specialty: formData.specialty,
          location: formData.location,
          contactInfo: formData.contactInfo
        } : item);
        setShoppingGuides(nextList);
        await saveCmsModule("shoppingGuides", nextList);
        addAuditLog("Edited Shopping Guide", "Shopping", formData.title);
      } else if (cmsModelType === "blog") {
        const nextList = blogs.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: finalImage || item.image,
          images: finalImages.length > 0 ? finalImages : (item.images || []),
          status: formData.status,
          category: (formData.category as any) || item.category || "Hidden Gems",
          content: formData.story || formData.description,
          author: formData.author || item.author,
          publishedAt: item.publishedAt || new Date().toISOString().split("T")[0]
        } : item);
        setBlogs(nextList);
        await saveCmsModule("blogs", nextList);
        addAuditLog("Edited Blog Post", "Blog", formData.title);
      }
    } else {
      // ADDING BRAND NEW ITEM
      const randomId = `item-${Date.now()}`;
      if (cmsModelType === "destination") {
        const defaultPlaceholder = "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop";
        const resolvedImage = finalImage || defaultPlaceholder;
        const resolvedImages = finalImages.length > 0 ? finalImages : [resolvedImage];
        const newItem: Destination = {
          id: randomId,
          title: formData.title,
          description: formData.description,
          image: resolvedImage,
          images: resolvedImages,
          category: (formData.category as any) || "Heritage",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          story: formData.story || "A custom destination.",
          visitingHours: formData.visitingHours || "09:00 AM - 06:00 PM",
          bestTimeToVisit: formData.bestTimeToVisit || "October to March",
          nearbyAttractions: formData.nearbyAttractions ? formData.nearbyAttractions.split(",").map(s => s.trim()) : ["Surat Castle"],
          suggestedItinerary: formData.story || "Explore the surroundings and historic spots.",
        };
        const nextList = [newItem, ...destinations];
        setDestinations(nextList);
        await saveCmsModule("destinations", nextList);
        addAuditLog("Created Spot", "Destination", formData.title);
      } else if (cmsModelType === "hotel") {
        const defaultPlaceholder = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";
        const resolvedImage = finalImage || defaultPlaceholder;
        const resolvedImages = finalImages.length > 0 ? finalImages : [resolvedImage];
        const newItem: Hotel = {
          id: randomId,
          title: formData.title,
          description: formData.description,
          image: resolvedImage,
          images: resolvedImages,
          category: (formData.category as any) || "Luxury",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          pricePerNight: Number(formData.pricePerNight) || 4000,
          amenities: formData.amenities ? formData.amenities.split(",").map(s => s.trim()) : ["Free WiFi", "Pool"],
          nearbyAttractions: ["Surat Castle"],
          contactInfo: formData.contactInfo || "reservations@insider.com"
        };
        const nextList = [newItem, ...hotels];
        setHotels(nextList);
        await saveCmsModule("hotels", nextList);
        addAuditLog("Created Hotel", "Hotel Stay", formData.title);
      } else if (cmsModelType === "food") {
        const defaultPlaceholder = "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop";
        const resolvedImage = finalImage || defaultPlaceholder;
        const resolvedImages = finalImages.length > 0 ? finalImages : [resolvedImage];
        const newItem: FoodSpot = {
          id: randomId,
          title: formData.title,
          description: formData.description,
          image: resolvedImage,
          images: resolvedImages,
          category: (formData.category as any) || "Street Food",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          mustTry: formData.mustTryName || "Spiced Locho",
          priceLevel: formData.priceLevel || "₹",
          location: formData.location || "Surat, Gujarat",
          timings: formData.timings || "08:00 AM - 10:00 PM"
        };
        const nextList = [newItem, ...foodSpots];
        setFoodSpots(nextList);
        await saveCmsModule("foodSpots", nextList);
        addAuditLog("Created Food Spot", "Dining", formData.title);
      } else if (cmsModelType === "event") {
        const defaultPlaceholder = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop";
        const resolvedImage = finalImage || defaultPlaceholder;
        const resolvedImages = finalImages.length > 0 ? finalImages : [resolvedImage];
        const newItem: LocalEvent = {
          id: randomId,
          title: formData.title,
          description: formData.description,
          image: resolvedImage,
          images: resolvedImages,
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          category: (formData.category as any) || "Festivals",
          venue: formData.location || "SIECC, Surat",
          date: new Date().toISOString().split("T")[0]
        };
        const nextList = [newItem, ...events];
        setEvents(nextList);
        await saveCmsModule("events", nextList);
        addAuditLog("Created Local Event", "Event", formData.title);
      } else if (cmsModelType === "tour") {
        const defaultPlaceholder = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop";
        const resolvedImage = finalImage || defaultPlaceholder;
        const resolvedImages = finalImages.length > 0 ? finalImages : [resolvedImage];
        const newItem: Tour = {
          id: randomId,
          title: formData.title,
          description: formData.description,
          image: resolvedImage,
          images: resolvedImages,
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          pricing: Number(formData.pricing) || 3000,
          duration: formData.duration || "5 Hours",
          itinerary: formData.itinerarySteps ? formData.itinerarySteps.split("\n").map(s => s.trim()) : ["Arrive at Surat Castle", "Textile market tour"]
        };
        const nextList = [newItem, ...tours];
        setTours(nextList);
        await saveCmsModule("tours", nextList);
        addAuditLog("Created Tour Package", "Tour", formData.title);
      } else if (cmsModelType === "shopping") {
        const defaultPlaceholder = "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1200&auto=format&fit=crop";
        const resolvedImage = finalImage || defaultPlaceholder;
        const resolvedImages = finalImages.length > 0 ? finalImages : [resolvedImage];
        const newItem = {
          id: randomId,
          title: formData.title,
          description: formData.description,
          image: resolvedImage,
          images: resolvedImages,
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          priceRange: formData.priceRange || "₹₹ (Mid-range)",
          specialty: formData.specialty || "Zari Silks",
          location: formData.location || "Ring Road, Surat",
          contactInfo: formData.contactInfo || "sales@insider.com"
        };
        const nextList = [newItem, ...shoppingGuides];
        setShoppingGuides(nextList);
        await saveCmsModule("shoppingGuides", nextList);
        addAuditLog("Created Shopping Guide", "Shopping", formData.title);
      } else if (cmsModelType === "blog") {
        const defaultPlaceholder = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop";
        const resolvedImage = finalImage || defaultPlaceholder;
        const resolvedImages = finalImages.length > 0 ? finalImages : [resolvedImage];
        const newItem: BlogPost = {
          id: randomId,
          title: formData.title,
          description: formData.description,
          image: resolvedImage,
          images: resolvedImages,
          rating: Number(formData.rating) || 5.0,
          status: formData.status,
          slug,
          category: (formData.category as any) || "Things To Do",
          content: formData.story || formData.description,
          author: formData.author || "Editorial Board",
          publishedAt: new Date().toISOString().split("T")[0]
        };
        const nextList = [newItem, ...blogs];
        setBlogs(nextList);
        await saveCmsModule("blogs", nextList);
        addAuditLog("Created Blog Post", "Blog", formData.title);
      }
    }

    // Reset fields
    setIsEditingId(null);
    setShowAddModal(false);
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "",
      location: "",
      rating: 4.8,
      status: "Published",
      story: "",
      visitingHours: "",
      bestTimeToVisit: "",
      nearbyAttractions: "",
      pricePerNight: 4000,
      amenities: "",
      pricing: 3500,
      duration: "4 Hours",
      itinerarySteps: "",
      priceRange: "₹₹ (Mid-range)",
      specialty: "",
      contactInfo: "",
      mustTryName: "",
      priceLevel: "₹",
      timings: "",
      readTime: "4 Mins",
      author: "Editorial Board"
    });
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (!hasCmsAccess()) {
      showToast("Unauthorized. Required Role: Super Admin, Editor or Content Manager", "error");
      return;
    }

    setDeleteConfirmId(id);
    setDeleteConfirmName(name);
  };

  // Partner Approvals Handler
  const handlePartnerApproval = async (reqId: string, action: "Approved" | "Rejected") => {
    if (!hasPartnerAccess()) {
      showToast("Unauthorized Role session. Only Partner Manager or Super Admin can moderate applications.", "error");
      return;
    }

    const safePartnerRequests = Array.isArray(partnerRequests) ? partnerRequests : [];
    const matchedRequest = safePartnerRequests.find(r => r.id === reqId);
    if (!matchedRequest) return;

    const nextRequests = safePartnerRequests.map(r => r.id === reqId ? { ...r, status: action } : r);
    
    // Save updated requests
    try {
      const response = await fetch("/api/admin/partner-requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reqId, status: action })
      });
      const result = await response.json();
      if (result.success) {
        setPartnerRequests(nextRequests);
        addAuditLog(`${action} Partner Request`, "Partner Hub", matchedRequest.businessName);
        showToast(`Partner request successfully ${action.toLowerCase()}!`, "success");
      }
    } catch (err: any) {
      showToast("Failed to save partner request update: " + err.message, "error");
      return;
    }

    // If approved, automatically append to listings!
    if (action === "Approved") {
      const slug = matchedRequest.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (matchedRequest.businessType === "hotel") {
        const newHotel: Hotel = {
          id: `part-approved-${Date.now()}`,
          title: matchedRequest.businessName,
          description: matchedRequest.requestedUpdate || "A premium hospitality suite and boarding partner.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
          rating: 4.8,
          status: "Published",
          slug,
          category: "Mid-range",
          pricePerNight: 4500,
          amenities: ["Free Airport Shuttle", "Comfort Workspace", "Breakfast"],
          nearbyAttractions: ["Surat Castle"],
          contactInfo: matchedRequest.contactEmail,
          location: "Surat Central Core"
        };
        const nextList = [newHotel, ...hotels];
        setHotels(nextList);
        await saveCmsModule("hotels", nextList);
        addAuditLog("Auto-published Hotel from Partner Approval", "Hotel Stay", newHotel.title);
      } else if (matchedRequest.businessType === "restaurant") {
        const newFood: FoodSpot = {
          id: `part-approved-${Date.now()}`,
          title: matchedRequest.businessName,
          description: matchedRequest.requestedUpdate || "Surati authentic sweet and snack delicacies.",
          image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop",
          rating: 4.9,
          status: "Published",
          slug,
          category: "Local Favorites",
          mustTry: "Fresh Kesar Pistachio Ghari",
          priceLevel: "₹₹",
          location: "Bhagal area, Surat",
          timings: "09:00 AM - 10:00 PM"
        };
        const nextList = [newFood, ...foodSpots];
        setFoodSpots(nextList);
        await saveCmsModule("foodSpots", nextList);
        addAuditLog("Auto-published Snack Spot from Partner Approval", "Dining", newFood.title);
      }
    }
  };

  // Inquiry ticket close
  const resolveInquiry = async (id: string, name: string) => {
    if (!hasAccess(["Super Admin", "Partner Manager"])) {
      showToast("Unauthorized to resolve booking leads.", "error");
      return;
    }

    try {
      const response = await fetch("/api/admin/inquiries/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      if (result.success) {
        const safeInquiries = Array.isArray(inquiries) ? inquiries : [];
        setInquiries(safeInquiries.map(inq => inq.id === id ? { ...inq, status: "Closed" } : inq));
        addAuditLog("Closed User Lead Ticket", "Inquiry", name);
        showToast(`Lead ticket closed successfully!`, "success");
      }
    } catch (err: any) {
      showToast("Failed to resolve lead ticket: " + err.message, "error");
    }
  };

  const handleEditItem = (item: any) => {
    setIsEditingId(item.id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
      images: item.images || (item.image ? [item.image] : []),
      category: item.category || "",
      location: item.location || "",
      rating: item.rating || 4.8,
      status: item.status || "Published",
      story: item.story || "",
      visitingHours: item.visitingHours || "",
      bestTimeToVisit: item.bestTimeToVisit || "",
      nearbyAttractions: item.nearbyAttractions ? item.nearbyAttractions.join(", ") : "",
      pricePerNight: item.pricePerNight || 4000,
      amenities: item.amenities ? item.amenities.join(", ") : "",
      pricing: item.pricing || 3500,
      duration: item.duration || "4 Hours",
      itinerarySteps: item.itinerary ? item.itinerary.join("\n") : "",
      priceRange: item.priceRange || "₹₹ (Mid-range)",
      specialty: item.specialty || "",
      contactInfo: item.contactInfo || "",
      mustTryName: item.mustTry || "",
      priceLevel: item.priceLevel || "₹",
      timings: item.timings || "",
      readTime: item.readTime || "4 Mins",
      author: item.author || "Editorial Board"
    });
    setShowAddModal(true);
  };

  // Media manager handlers
  const uploadBase64 = async (name: string, base64Data: string, altText: string, caption: string, category: string, duplicateAction: string = "ask") => {
    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          data: base64Data,
          altText,
          caption,
          category,
          duplicateAction
        })
      });
      
      if (response.status === 409) {
        const result = await response.json();
        if (result.conflict) {
          setConflictUploadData({
            name,
            data: base64Data,
            altText,
            caption,
            category,
            existingFile: result.existingFile
          });
          return;
        }
      }

      const result = await response.json();
      if (result.success) {
        showToast(`Asset "${result.file?.filename || name}" uploaded successfully!`, "success");
        setConflictUploadData(null);
        setMediaFile(null);
        setMediaAlt("");
        setMediaCaption("");
        setMediaCategory("General");
        if (refreshCmsData) refreshCmsData();
        if (refreshImages) refreshImages();
      } else {
        showToast(result.error || "Upload failed.", "error");
      }
    } catch (err: any) {
      showToast("Error uploading file: " + err.message, "error");
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) {
      showToast("Please select a file to upload first.", "error");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      await uploadBase64(mediaFile.name, base64Data, mediaAlt, mediaCaption, mediaCategory, "ask");
      setIsUploading(false);
    };
    reader.readAsDataURL(mediaFile);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media file permanently?")) return;

    try {
      const response = await fetch("/api/admin/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      if (result.success) {
        showToast("Media file deleted successfully.", "success");
        setSelectedMediaId(null);
        if (refreshCmsData) refreshCmsData();
        if (refreshImages) refreshImages();
      } else {
        // Handle deletion warning block
        showToast(result.error || "Failed to delete file.", "error");
      }
    } catch (err: any) {
      showToast("Error deleting file: " + err.message, "error");
    }
  };

  // UIMS Website Images Assignment updater
  const handleUpdateAssignment = async (id: string, newUrl: string) => {
    const updatedList = websiteImages.map(img => {
      if (img.id === id) {
        return { ...img, url: newUrl };
      }
      return img;
    });

    try {
      const res = await fetch("/api/admin/cms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "websiteImages", data: updatedList })
      });
      const result = await res.json();
      if (result.success) {
        showToast(`Successfully assigned image!`, "success");
        if (refreshImages) refreshImages();
        if (refreshCmsData) refreshCmsData();
      } else {
        showToast(result.error || "Failed to save assignment.", "error");
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, "error");
    }
  };

  const handleDeviceUploadForCard = async (id: string, file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            data: base64Data,
            altText: file.name,
            category: "General",
            duplicateAction: "keep_both" // Auto rename keep both to be seamless
          })
        });
        const result = await response.json();
        if (result.success) {
          setDraftUrls(prev => ({ ...prev, [id]: result.file.url }));
          showToast("Image uploaded to draft! Click 'Save' on the card to commit.", "success");
        } else {
          showToast(result.error || "Device upload failed.", "error");
        }
      } catch (err: any) {
        showToast("Error uploading file: " + err.message, "error");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save configurations handlers
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveCmsModule("homepage", formHomepage);
    if (success) {
      addAuditLog("Saved Homepage settings", "Configs", "Hero Section Update");
    }
  };

  const handleSaveChatbot = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveCmsModule("aiChatbot", formChatbot);
    if (success) {
      addAuditLog("Saved AI Chatbot configurations", "Configs", `Limit: ${formChatbot.messageLimit}`);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent, pageKey: string) => {
    e.preventDefault();
    const nextSeo = {
      ...formSeo,
      [pageKey]: formSeo[pageKey]
    };
    const success = await saveCmsModule("seo", nextSeo);
    if (success) {
      setFormSeo(nextSeo);
      addAuditLog("Updated SEO configurations", "SEO", pageKey);
    }
  };

  const handleSaveMonetization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole === "Guest") {
      showToast("Access Denied. Guest accounts cannot modify monetization settings.", "error");
      return;
    }
    try {
      setMonetization(formMonetization);
      showToast("Successfully saved monetization settings to live database!", "success");
      addAuditLog("Updated Monetization Settings", "Monetization", `Ad Cost: ₹${formMonetization.sponsoredAdCost}, Sourcing Pass: ₹${formMonetization.premiumGuideAccessFee}`);
    } catch (err: any) {
      showToast("Failed to save monetization: " + err.message, "error");
    }
  };

  return (
    <div className="space-y-6 text-[#1A1614]">
      {/* Dynamic alert toast notification inside control panel */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border transition-all animate-bounce ${
          toast.type === "success" 
            ? "bg-[#FFFDF5] text-emerald-950 border-emerald-250" 
            : toast.type === "error" 
              ? "bg-red-50 text-red-950 border-red-200" 
              : "bg-[#FFFDF5] text-[#1A1614] border-brand-sand-300"
        }`}>
          <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF5]/70 backdrop-blur-lg border border-[#1A1614]/10 shadow-sm max-w-md w-full rounded-2xl p-6 space-y-4 animate-scale-in text-left">
            <h3 className="font-serif font-black text-lg text-[#1A1614] flex items-center gap-2 border-b border-brand-sand-200 pb-2">
              🚨 Permanent Delete Confirmation
            </h3>
            <p className="text-xs text-[#1A1614]/80 leading-relaxed">
              Are you absolutely sure you want to permanently delete <strong className="text-[#1A1614]">{deleteConfirmName}</strong> from the website's database? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(null);
                  setDeleteConfirmName("");
                }}
                className="px-4 py-2 border border-brand-sand-250 hover:bg-[#FFFDF5] rounded-xl text-xs font-semibold uppercase font-mono tracking-wider text-[#1A1614] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = deleteConfirmId;
                  const name = deleteConfirmName;
                  if (cmsModelType === "destination") {
                    const nextList = destinations.filter(d => d.id !== id);
                    setDestinations(nextList);
                    await saveCmsModule("destinations", nextList);
                    addAuditLog("Deleted Spot", "Destination", name);
                  } else if (cmsModelType === "hotel") {
                    const nextList = hotels.filter(h => h.id !== id);
                    setHotels(nextList);
                    await saveCmsModule("hotels", nextList);
                    addAuditLog("Deleted Hotel", "Hotel Stay", name);
                  } else if (cmsModelType === "food") {
                    const nextList = foodSpots.filter(f => f.id !== id);
                    setFoodSpots(nextList);
                    await saveCmsModule("foodSpots", nextList);
                    addAuditLog("Deleted Food Spot", "Dining", name);
                  } else if (cmsModelType === "event") {
                    const nextList = events.filter(e => e.id !== id);
                    setEvents(nextList);
                    await saveCmsModule("events", nextList);
                    addAuditLog("Deleted Local Event", "Event", name);
                  } else if (cmsModelType === "tour") {
                    const nextList = tours.filter(t => t.id !== id);
                    setTours(nextList);
                    await saveCmsModule("tours", nextList);
                    addAuditLog("Deleted Tour Package", "Tour", name);
                  } else if (cmsModelType === "shopping") {
                    const nextList = shoppingGuides.filter(s => s.id !== id);
                    setShoppingGuides(nextList);
                    await saveCmsModule("shoppingGuides", nextList);
                    addAuditLog("Deleted Shopping Guide", "Shopping", name);
                  } else if (cmsModelType === "blog") {
                    const nextList = blogs.filter(b => b.id !== id);
                    setBlogs(nextList);
                    await saveCmsModule("blogs", nextList);
                    addAuditLog("Deleted Blog Post", "Blog", name);
                  }
                  showToast(`Successfully deleted "${name}"`, "success");
                  setDeleteConfirmId(null);
                  setDeleteConfirmName("");
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-[#1A1614] rounded-xl text-xs font-semibold uppercase font-mono tracking-wider transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UIMS Central Image Picker Overlay Modal */}
      {imagePickerModalForId && (() => {
        const activeSlot = websiteImages.find(img => img.id === imagePickerModalForId);
        if (!activeSlot) return null;
        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFDF5] border border-[#1A1614]/15 shadow-2xl max-w-3xl w-full rounded-2xl flex flex-col h-[85vh] animate-scale-in text-left">
              {/* Header */}
              <div className="p-5 border-b border-brand-sand-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base text-[#1A1614]">
                    Select Media for: {activeSlot.title}
                  </h3>
                  <p className="text-[10px] text-[#1A1614]/65">
                    Choose an existing asset from your media library vault to assign.
                  </p>
                </div>
                <button 
                  onClick={() => setImagePickerModalForId(null)}
                  className="p-1.5 hover:bg-brand-sand-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#1A1614]/60 hover:text-[#1A1614]" />
                </button>
              </div>

              {/* Advanced Filters */}
              <div className="p-4 bg-brand-sand-50/60 border-b border-brand-sand-200 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#1A1614]/40" />
                  <input 
                    type="text"
                    placeholder="Search vault asset filenames..."
                    value={searchMediaPattern}
                    onChange={(e) => setSearchMediaPattern(e.target.value)}
                    className="w-full bg-white font-mono text-[11px] pl-9 pr-3 py-2 border border-brand-sand-250 rounded-lg outline-none"
                  />
                </div>
                <select
                  value={filterMediaCategory}
                  onChange={(e) => setFilterMediaCategory(e.target.value)}
                  className="bg-white font-mono text-[11px] px-3 py-2 border border-brand-sand-250 rounded-lg outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="General">General</option>
                  <option value="Destinations">Destinations</option>
                  <option value="Hotels">Hotels</option>
                  <option value="Foods">Foods</option>
                  <option value="Sarees">Sarees</option>
                  <option value="System">System</option>
                </select>
              </div>

              {/* Grid Content */}
              <div className="p-5 overflow-y-auto flex-1 bg-white">
                {(() => {
                  const items = mediaList.filter(m => {
                    const matchesSearch = !searchMediaPattern || m.filename.toLowerCase().includes(searchMediaPattern.toLowerCase());
                    const matchesCategory = filterMediaCategory === "All" || m.category === filterMediaCategory;
                    return matchesSearch && matchesCategory;
                  });

                  return items.length === 0 ? (
                    <div className="py-16 text-center text-xs text-[#1A1614]/40 font-mono border-2 border-dashed border-brand-sand-200 rounded-xl">
                      No matching assets found in the media library. Go to "Media Library Vault" to upload.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {items.map((m) => {
                        const isCurrentAssigned = activeSlot.url === m.url;
                        return (
                          <div 
                            key={m.id}
                            onClick={() => {
                              setDraftUrls(prev => ({ ...prev, [imagePickerModalForId]: m.url }));
                              setImagePickerModalForId(null);
                              showToast("Selected from Media Library! Click 'Save' on the card to commit.", "success");
                            }}
                            className={`group relative rounded-xl overflow-hidden border cursor-pointer aspect-square bg-[#FFFDF5] shadow-xs hover:shadow-md transition-all ${
                              isCurrentAssigned 
                                ? "ring-2 ring-brand-gold-500 border-transparent" 
                                : "border-brand-sand-200 hover:border-brand-sand-300"
                            }`}
                          >
                            <img src={m.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-brand-gold-500 text-[#1A1614] text-[10px] font-mono uppercase font-black px-2.5 py-1 rounded-lg">
                                Use This Image
                              </span>
                            </div>

                            {isCurrentAssigned && (
                              <div className="absolute top-1.5 right-1.5 bg-brand-gold-500 text-[#1A1614] p-1 rounded-full">
                                <Check className="w-3 h-3" />
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center text-[8px] font-mono text-white truncate">
                              {m.filename}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-brand-sand-200 bg-brand-sand-50/50 flex justify-end">
                <button
                  onClick={() => setImagePickerModalForId(null)}
                  className="px-4 py-2 border border-brand-sand-250 hover:bg-white rounded-xl text-xs font-bold uppercase font-mono tracking-wider text-[#1A1614] cursor-pointer"
                >
                  Close Vault
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* UIMS Duplicate Detection Conflict Modal */}
      {conflictUploadData && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF5] border border-red-200 shadow-2xl max-w-md w-full rounded-2xl p-6 space-y-4 animate-scale-in text-left">
            <div className="flex items-center gap-2 border-b border-red-100 pb-2 text-red-600">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
              <h3 className="font-serif font-black text-base">
                Duplicate File Detected
              </h3>
            </div>
            
            <p className="text-xs text-[#1A1614]/75 leading-relaxed">
              An asset named <strong className="text-red-700">{conflictUploadData.name}</strong> already exists in the media folder.
            </p>

            <div className="bg-red-50 p-3 rounded-xl border border-red-100 space-y-2">
              <span className="text-[10px] font-bold text-red-800 uppercase block">Existing Asset Preview:</span>
              <div className="flex gap-3 items-center">
                <img 
                  src={conflictUploadData.existingFile?.url} 
                  alt="Existing file" 
                  className="w-16 h-16 rounded-lg object-cover border border-red-200 shadow-xs"
                />
                <div className="font-mono text-[9px] text-red-900 space-y-0.5">
                  <div><strong>Size:</strong> {conflictUploadData.existingFile?.size || "Unknown"}</div>
                  <div><strong>Uploaded:</strong> {conflictUploadData.existingFile?.uploadedAt || "Unknown"}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={async () => {
                  setIsUploading(true);
                  await uploadBase64(
                    conflictUploadData.name, 
                    conflictUploadData.data, 
                    conflictUploadData.altText, 
                    conflictUploadData.caption, 
                    conflictUploadData.category, 
                    "replace"
                  );
                  setIsUploading(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-[#FFFDF5] font-mono text-[10px] uppercase font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Replace Existing Asset (Overwrite)</span>
              </button>

              <button
                onClick={async () => {
                  setIsUploading(true);
                  await uploadBase64(
                    conflictUploadData.name, 
                    conflictUploadData.data, 
                    conflictUploadData.altText, 
                    conflictUploadData.caption, 
                    conflictUploadData.category, 
                    "keep_both"
                  );
                  setIsUploading(false);
                }}
                className="w-full bg-[#1A1614] hover:bg-[#1A1614]/90 text-[#FFFDF5] font-mono text-[10px] uppercase font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Keep Both Files (Auto-Rename Copy)</span>
              </button>

              <button
                onClick={() => setConflictUploadData(null)}
                className="w-full border border-brand-sand-250 hover:bg-brand-sand-50 text-[#1A1614]/70 font-mono text-[10px] uppercase font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Cancel Upload</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-[#B8860B] p-6 rounded-2xl text-brand-sand-50 flex flex-col md:flex-row items-center justify-between border border-[#B8860B] shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-center md:justify-start">
            <ShieldCheck className="w-5 h-5 text-brand-gold-400 animate-pulse" />
            <h1 className="font-serif text-2xl font-bold tracking-tight">Internal Platform CMS Control</h1>
          </div>
          <p className="text-xs font-mono text-[#4A423D] uppercase tracking-widest text-brand-gold-300">
            Secure Server-Authorized Production Session
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0 font-mono text-xs">
          <span className="bg-[#B8860B] border border-[#B8860B] text-[#4A423D] px-3 py-1 rounded-full uppercase font-bold tracking-widest">
            {currentUserRole}
          </span>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.reload();
            }}
            className="bg-red-650 hover:bg-red-700 text-[#1A1614] px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ADMIN TABS SELECTOR */}
      <div className="flex items-center justify-between gap-4 border-b border-brand-sand-200 pb-3">
        <div className="flex gap-2 shrink-0 overflow-x-auto p-1 bg-[#B8860B]/40 rounded-xl border border-[#B8860B]/20">
          {(["cms", "media", "configs", "partners", "leads", "monetization", "security"] as const).map((tab) => (
            <button
              key={tab}
              id={`tab-btn-${tab}`}
              onClick={() => setActiveAdminSubTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase font-mono ${
                activeAdminSubTab === tab
                  ? "bg-[#B8860B] text-[#1A1614]"
                  : "text-brand-sand-50 hover:bg-[#B8860B]"
              }`}
            >
              {tab === "configs" ? "Site Settings" : tab === "cms" ? "Directories" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* WARNING NOTIFICATION IF GUEST TYPE */}
      {isGuest && (
        <div className="p-4 bg-[#B8860B]/10 border-2 border-[#B8860B]/20 text-[#1A1614] rounded-xl text-xs flex items-start gap-3">
          <Activity className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="font-bold uppercase font-mono">Simulated Guest / Visitor View Mode</h4>
            <p className="leading-relaxed">
              Super Admin, Editor, and Manager capabilities are protected. Switch your role using the top-right role selector to "Super Admin" or "Partner Mgr" to test dynamic inserting, deleting, editing, approving partner updates, and adjusting pricing monetization settings.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: CMS DIRECTORIES
          ========================================================================= */}
      {activeAdminSubTab === "cms" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm text-left">
          
          {/* Section banner and control actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-sand-200 pb-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1A1614]">Dynamic Listings Manager</h3>
              <p className="text-xs text-[#1A1614]/60">Select a catalog module below to add, edit or remove live experiences dynamically.</p>
            </div>

            <button
              onClick={() => {
                setIsEditingId(null);
                setFormData({
                  title: "",
                  description: "",
                  image: "",
                  category: "",
                  location: "",
                  rating: 4.8,
                  status: "Published",
                  story: "",
                  visitingHours: "",
                  bestTimeToVisit: "",
                  nearbyAttractions: "",
                  pricePerNight: 4000,
                  amenities: "",
                  pricing: 3500,
                  duration: "4 Hours",
                  itinerarySteps: "",
                  priceRange: "₹₹ (Mid-range)",
                  specialty: "",
                  contactInfo: "",
                  mustTryName: "",
                  priceLevel: "₹",
                  timings: "",
                  readTime: "4 Mins",
                  author: "Editorial Board"
                });
                setShowAddModal(true);
              }}
              className="bg-[#B8860B] hover:bg-[#B8860B] text-[#1A1614] font-mono uppercase text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-gold-400" />
              <span>Add New Item</span>
            </button>
          </div>

          {/* Catalog Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {(["destination", "shopping", "hotel", "food", "tour", "event", "blog"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setCmsModelType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide capitalize whitespace-nowrap ${
                  cmsModelType === type
                    ? "bg-[#B8860B] text-brand-sand-50"
                    : "bg-transparent hover:bg-brand-sand-100 text-[#1A1614]-light"
                }`}
              >
                {type === "food" ? "Food Spots" : type === "event" ? "Stories & Events" : type + "s"}
              </button>
            ))}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsModelType === "destination" && destinations.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-brand-sand-200 flex justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover shadow border border-brand-sand-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-[#1A1614]/50 mt-0.5">{item.category} • {item.location}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black inline-block mt-2 ${
                      item.status === "Published" ? "bg-[#FFFDF5] text-[#1A1614]" : "bg-[#1A1614]/5 text-[#1A1614]/50"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button onClick={() => handleEditItem(item)} className="p-1.5 bg-transparent hover:bg-brand-sand-100 rounded text-[#1A1614] transition-all cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}

            {cmsModelType === "hotel" && hotels.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-brand-sand-200 flex justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover shadow border border-brand-sand-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-[#1A1614]/50 mt-0.5">{item.category} • ₹{item.pricePerNight}/night • {item.location}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black inline-block mt-2 ${
                      item.status === "Published" ? "bg-[#FFFDF5] text-[#1A1614]" : "bg-[#1A1614]/5 text-[#1A1614]/50"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button onClick={() => handleEditItem(item)} className="p-1.5 bg-transparent hover:bg-brand-sand-100 rounded text-[#1A1614] transition-all cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}

            {cmsModelType === "food" && foodSpots.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-brand-sand-200 flex justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover shadow border border-brand-sand-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-[#1A1614]/50 mt-0.5">{item.category} • Must Try: {item.mustTry} • {item.location}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black inline-block mt-2 ${
                      item.status === "Published" ? "bg-[#FFFDF5] text-[#1A1614]" : "bg-[#1A1614]/5 text-[#1A1614]/50"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button onClick={() => handleEditItem(item)} className="p-1.5 bg-transparent hover:bg-brand-sand-100 rounded text-[#1A1614] transition-all cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}

            {cmsModelType === "tour" && tours.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-brand-sand-200 flex justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover shadow border border-brand-sand-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-[#1A1614]/50 mt-0.5">{item.duration} • Pricing: ₹{item.pricing}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black inline-block mt-2 ${
                      item.status === "Published" ? "bg-[#FFFDF5] text-[#1A1614]" : "bg-[#1A1614]/5 text-[#1A1614]/50"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button onClick={() => handleEditItem(item)} className="p-1.5 bg-transparent hover:bg-brand-sand-100 rounded text-[#1A1614] transition-all cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}

            {cmsModelType === "shopping" && shoppingGuides.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-brand-sand-200 flex justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover shadow border border-brand-sand-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-[#1A1614]/50 mt-0.5">{item.specialty} • {item.priceRange} • {item.location}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black inline-block mt-2 ${
                      item.status === "Published" ? "bg-[#FFFDF5] text-[#1A1614]" : "bg-[#1A1614]/5 text-[#1A1614]/50"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button onClick={() => handleEditItem(item)} className="p-1.5 bg-transparent hover:bg-brand-sand-100 rounded text-[#1A1614] transition-all cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}

            {cmsModelType === "event" && events.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-brand-sand-200 flex justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover shadow border border-brand-sand-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-[#1A1614]/50 mt-0.5">{item.category} • Venue: {item.venue}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black inline-block mt-2 ${
                      item.status === "Published" ? "bg-[#FFFDF5] text-[#1A1614]" : "bg-[#1A1614]/5 text-[#1A1614]/50"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button onClick={() => handleEditItem(item)} className="p-1.5 bg-transparent hover:bg-brand-sand-100 rounded text-[#1A1614] transition-all cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}

            {cmsModelType === "blog" && blogs.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-brand-sand-200 flex justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} className="w-16 h-16 rounded-lg object-cover shadow border border-brand-sand-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-[#1A1614]/50 mt-0.5">Author: {item.author} • Published: {item.publishedAt}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black inline-block mt-2 ${
                      item.status === "Published" ? "bg-[#FFFDF5] text-[#1A1614]" : "bg-[#1A1614]/5 text-[#1A1614]/50"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button onClick={() => handleEditItem(item)} className="p-1.5 bg-transparent hover:bg-brand-sand-100 rounded text-[#1A1614] transition-all cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: UNIVERSAL IMAGE MANAGEMENT SYSTEM (UIMS)
          ========================================================================= */}
      {activeAdminSubTab === "media" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm text-left">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-sand-200 pb-4 gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1A1614] flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-brand-gold-500" />
                <span>Universal Image Manager</span>
              </h3>
              <p className="text-xs text-[#1A1614]/60">
                Replace any image across the entire website instantly. Click to upload custom assets or select from your central media vault.
              </p>
            </div>
            
            {/* Storage Statistics Summary */}
            <div className="bg-[#FFFDF5]/80 border border-brand-sand-200 rounded-xl px-4 py-2.5 flex items-center gap-4 text-[11px] font-mono shrink-0">
              <div className="text-center">
                <span className="text-[#1A1614]/50 block uppercase text-[8px] font-bold">Total Assets</span>
                <span className="font-black text-brand-gold-600 text-sm">{mediaList.length} Items</span>
              </div>
              <div className="h-8 w-px bg-brand-sand-200"></div>
              <div className="text-center">
                <span className="text-[#1A1614]/50 block uppercase text-[8px] font-bold">UIMS Keys</span>
                <span className="font-black text-brand-gold-600 text-sm">{websiteImages.length} Slots</span>
              </div>
              <div className="h-8 w-px bg-brand-sand-200"></div>
              <div className="text-center">
                <span className="text-[#1A1614]/50 block uppercase text-[8px] font-bold">Storage Vol</span>
                <span className="font-black text-brand-gold-600 text-sm">Active</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center overflow-x-auto pb-1 gap-1 border-b border-brand-sand-150 scrollbar-none text-xs">
            {[
              { id: "home", label: "Home" },
              { id: "explore", label: "Explore" },
              { id: "food", label: "Food" },
              { id: "hotels", label: "Hotels" },
              { id: "shopping", label: "Shopping" },
              { id: "events", label: "Events" },
              { id: "vault", label: "Vault" },
              { id: "branding", label: "Branding" },
              { id: "system", label: "System & Placeholders" },
              { id: "library", label: "Media Library Vault" }
            ].map((subTab) => {
              const isActive = activeImageSubTab === subTab.id;
              return (
                <button
                  key={subTab.id}
                  onClick={() => {
                    setActiveImageSubTab(subTab.id);
                    setSelectedMediaId(null);
                  }}
                  className={`px-3 py-2 rounded-lg font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-brand-gold-500 text-[#1A1614] font-bold shadow-sm"
                      : "text-[#1A1614]/60 hover:text-[#1A1614] hover:bg-brand-sand-50"
                  }`}
                >
                  {subTab.label}
                </button>
              );
            })}
          </div>

          {/* Sub Tab View: Website Image Slots */}
          {activeImageSubTab !== "library" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteImages.filter(img => img.section === activeImageSubTab).length === 0 ? (
                <div className="col-span-full py-12 text-center text-xs text-[#1A1614]/40 font-mono border-2 border-dashed border-brand-sand-200 rounded-xl">
                  No image configurations mapped for this section.
                </div>
              ) : (
                websiteImages.filter(img => img.section === activeImageSubTab).map((slot) => {
                  const draftUrl = draftUrls[slot.id];
                  const hasDraft = draftUrl !== undefined && draftUrl !== slot.url;
                  const activeUrl = draftUrl !== undefined ? draftUrl : (slot.url || slot.defaultUrl);
                  const isSystemDefault = draftUrl !== undefined 
                    ? draftUrl === slot.defaultUrl 
                    : (!slot.url || slot.url === slot.defaultUrl);
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={`bg-[#FFFDF5] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                        hasDraft 
                          ? "ring-2 ring-brand-gold-500 shadow-lg border-brand-gold-200 scale-[1.01]" 
                          : "border-brand-sand-200 hover:shadow-md"
                      }`}
                    >
                      {/* Large Preview Window */}
                      <div 
                        onClick={() => setImagePickerModalForId(slot.id)}
                        className="relative aspect-video bg-[#1A1614]/5 border-b border-brand-sand-200 flex items-center justify-center overflow-hidden group cursor-pointer"
                        title="Click to Choose From Media Library"
                      >
                        {activeUrl ? (
                          <img 
                            src={activeUrl} 
                            alt={slot.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        ) : (
                          <div className="text-[11px] font-mono text-[#1A1614]/30">Empty Assignment</div>
                        )}
                        
                        {/* Status Pills */}
                        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                          {hasDraft && (
                            <div className="bg-brand-gold-500 text-[#1A1614] text-[9px] font-mono px-2.5 py-0.5 rounded-full font-black tracking-wider shadow-xs animate-pulse">
                              UNSAVED DRAFT
                            </div>
                          )}
                          <div className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-black shadow-xs ${
                            isSystemDefault 
                              ? "bg-[#1A1614]/85 text-[#FFFDF5]" 
                              : "bg-emerald-600 text-[#FFFDF5]"
                          }`}>
                            {isSystemDefault ? "DEFAULT SYSTEM" : "CUSTOM OVERRIDE"}
                          </div>
                        </div>

                        {/* Hover Overlay Guide */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                          <Database className="w-5 h-5 text-brand-gold-400 animate-bounce" />
                          <span className="font-mono text-[10px] font-bold tracking-wider uppercase">Choose From Library</span>
                          <span className="text-[8px] text-white/70 font-mono">Click anywhere on preview</span>
                        </div>
                      </div>

                      {/* Info and Actions */}
                      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1 text-left">
                          <h4 className="font-serif font-bold text-sm text-[#1A1614] leading-tight flex items-center justify-between gap-2">
                            <span>{slot.title}</span>
                            <span className="font-mono text-[8px] bg-brand-sand-150 px-1.5 py-0.5 rounded text-[#1A1614]/50 font-medium">
                              ID: {slot.id}
                            </span>
                          </h4>
                          <p className="text-[10px] text-[#1A1614]/60 leading-relaxed">{slot.description}</p>
                        </div>

                        {/* Current Image Input (Click to Edit manually) */}
                        <div className="space-y-1.5 text-left">
                          <label className="text-[9px] font-bold text-[#1A1614]/50 uppercase tracking-wider block font-mono">
                            Current Image Path:
                          </label>
                          <div className="flex gap-1.5">
                            <input 
                              type="text"
                              value={draftUrl !== undefined ? draftUrl : slot.url}
                              placeholder="Inherited system default URL..."
                              onChange={(e) => setDraftUrls(prev => ({ ...prev, [slot.id]: e.target.value }))}
                              className="flex-1 bg-brand-sand-50/50 font-mono text-[10px] p-2 border border-brand-sand-200 rounded-lg outline-none focus:bg-white focus:border-brand-gold-500 truncate"
                            />
                            <button
                              onClick={() => {
                                setDraftUrls(prev => ({ ...prev, [slot.id]: slot.url }));
                                showToast("Reset draft to currently saved URL", "info");
                              }}
                              title="Reset draft url input"
                              className="px-2 border border-brand-sand-200 hover:bg-brand-sand-50 rounded-lg font-mono text-[10px] text-[#1A1614]/55"
                            >
                              Reset
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-brand-sand-150">
                          {/* File input hooks */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Choose From Device option */}
                            <label className="bg-[#B8860B]/10 hover:bg-[#B8860B]/15 text-[#1A1614] font-mono text-[10px] font-black py-2 rounded-lg text-center cursor-pointer flex items-center justify-center gap-1.5 transition-colors border border-[#B8860B]/10">
                              <Upload className="w-3 h-3 text-[#1A1614]" />
                              <span>Choose From Device</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleDeviceUploadForCard(slot.id, f);
                                }}
                              />
                            </label>

                            {/* Choose From Media Library Trigger */}
                            <button
                              onClick={() => setImagePickerModalForId(slot.id)}
                              className="bg-[#1A1614] hover:bg-[#1A1614]/90 text-[#FFFDF5] font-mono text-[10px] font-black py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Database className="w-3 h-3 text-[#FFFDF5]" />
                              <span>Choose From Library</span>
                            </button>
                          </div>

                          {/* Secondary triggers: Clear, Restore Default, Save, Cancel */}
                          <div className="flex flex-col gap-2 pt-1">
                            <div className="flex gap-2">
                              {/* Restore Default */}
                              <button
                                onClick={() => {
                                  setDraftUrls(prev => ({ ...prev, [slot.id]: slot.defaultUrl }));
                                  showToast("Set slot draft to system default URL.", "info");
                                }}
                                className="flex-1 border border-brand-sand-250 hover:bg-brand-sand-50 text-[#1A1614]/75 font-mono text-[9px] py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                                <span>Restore Default</span>
                              </button>

                              {/* Clear Assignment */}
                              <button
                                onClick={() => {
                                  setDraftUrls(prev => ({ ...prev, [slot.id]: "" }));
                                  showToast("Set slot draft to empty.", "info");
                                }}
                                className="flex-1 border border-brand-sand-250 hover:bg-red-50 hover:text-red-600 text-[#1A1614]/60 font-mono text-[9px] py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                                <span>Clear Assignment</span>
                              </button>
                            </div>

                            {/* Commit buttons if changes exist */}
                            {hasDraft ? (
                              <div className="grid grid-cols-2 gap-2 pt-1 animate-scale-in">
                                <button
                                  onClick={() => {
                                    handleUpdateAssignment(slot.id, draftUrl);
                                    setDraftUrls(prev => {
                                      const copy = { ...prev };
                                      delete copy[slot.id];
                                      return copy;
                                    });
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-[#FFFDF5] font-mono text-[10px] py-2 rounded-lg font-black flex items-center justify-center gap-1 transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Save Draft</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setDraftUrls(prev => {
                                      const copy = { ...prev };
                                      delete copy[slot.id];
                                      return copy;
                                    });
                                    showToast("Changes canceled.", "info");
                                  }}
                                  className="bg-brand-sand-150 hover:bg-brand-sand-200 text-[#1A1614] font-mono text-[10px] py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Cancel</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled
                                className="bg-brand-sand-100 text-[#1A1614]/30 font-mono text-[10px] py-2 rounded-lg flex items-center justify-center gap-1 cursor-not-allowed border border-brand-sand-150"
                              >
                                <Check className="w-3 h-3 text-[#1A1614]/20" />
                                <span>All Changes Saved</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Sub Tab View: Media Library Vault */}
          {activeImageSubTab === "library" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Upload Form Panel */}
              <div className="bg-[#FFFDF5]/60 border border-brand-sand-200 rounded-xl p-5 space-y-4 h-fit">
                <h4 className="font-serif font-bold text-sm text-[#1A1614] flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-brand-gold-500 animate-pulse" />
                  <span>Vault Assets Upload</span>
                </h4>

                <form onSubmit={handleFileUpload} className="space-y-3 font-mono text-[11px]">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1A1614] uppercase">Select Local File:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                      className="w-full bg-white p-2 rounded-lg border border-brand-sand-250 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1A1614] uppercase">Alt Text:</label>
                    <input
                      type="text"
                      placeholder="Describe image for SEO..."
                      value={mediaAlt}
                      onChange={(e) => setMediaAlt(e.target.value)}
                      className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1A1614] uppercase">Caption:</label>
                    <input
                      type="text"
                      placeholder="Short photographer description..."
                      value={mediaCaption}
                      onChange={(e) => setMediaCaption(e.target.value)}
                      className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1A1614] uppercase">Category Tag:</label>
                    <select
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      className="w-full bg-white p-2 rounded-lg border border-brand-sand-250"
                    >
                      <option value="General">General</option>
                      <option value="Destinations">Destinations</option>
                      <option value="Hotels">Hotels</option>
                      <option value="Foods">Foods</option>
                      <option value="Sarees">Sarees</option>
                      <option value="System">System</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || !mediaFile}
                    className="w-full bg-[#B8860B] text-[#1A1614] font-mono uppercase text-xs font-bold py-3 rounded-xl hover:bg-[#B8860B] transition-colors disabled:bg-brand-charcoal/20 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow"
                  >
                    {isUploading ? "Uploading..." : "Save live to host"}
                  </button>
                </form>
              </div>

              {/* Right Media Assets Grid */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Advanced Grid Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF5]/50 border border-brand-sand-200 p-3 rounded-xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#1A1614]/40" />
                    <input 
                      type="text"
                      placeholder="Search asset filenames..."
                      value={searchMediaPattern}
                      onChange={(e) => setSearchMediaPattern(e.target.value)}
                      className="w-full bg-white font-mono text-[11px] pl-9 pr-3 py-2 border border-brand-sand-250 rounded-lg outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#1A1614]/50 shrink-0">Filter:</span>
                    <select
                      value={filterMediaCategory}
                      onChange={(e) => setFilterMediaCategory(e.target.value)}
                      className="bg-white font-mono text-[11px] px-2.5 py-2 border border-brand-sand-250 rounded-lg outline-none cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="General">General</option>
                      <option value="Destinations">Destinations</option>
                      <option value="Hotels">Hotels</option>
                      <option value="Foods">Foods</option>
                      <option value="Sarees">Sarees</option>
                      <option value="System">System</option>
                    </select>
                  </div>
                </div>

                {/* Filter and render list */}
                {(() => {
                  const items = mediaList.filter(m => {
                    const matchesSearch = !searchMediaPattern || m.filename.toLowerCase().includes(searchMediaPattern.toLowerCase());
                    const matchesCategory = filterMediaCategory === "All" || m.category === filterMediaCategory;
                    return matchesSearch && matchesCategory;
                  });

                  return items.length === 0 ? (
                    <div className="p-12 text-center text-xs text-[#1A1614]/40 font-mono border-2 border-dashed border-brand-sand-200 rounded-xl">
                      No matching media assets detected in directory.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {items.map((m) => {
                        const isSelected = selectedMediaId === m.id;
                        return (
                          <div 
                            key={m.id}
                            onClick={() => setSelectedMediaId(isSelected ? null : m.id)}
                            className={`relative rounded-xl overflow-hidden border cursor-pointer aspect-square bg-[#FFFDF5] shadow-xs transition-all ${
                              isSelected ? "ring-2 ring-brand-gold-500 border-transparent scale-95" : "border-brand-sand-200 hover:border-brand-sand-300"
                            }`}
                          >
                            <img src={m.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center text-[8px] font-mono text-[#FFFDF5] truncate">
                              {m.filename}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Dynamic Metadata & Usage details panel */}
                {selectedMediaId && (() => {
                  const item = mediaList.find(m => m.id === selectedMediaId);
                  if (!item) return null;

                  // Find active usages across website
                  const checkItem = (o: any, label: string) => {
                    const usages: string[] = [];
                    if (o.image === item.url) usages.push(`${label} "${o.title}" (Main Image)`);
                    if (Array.isArray(o.images) && o.images.includes(item.url)) usages.push(`${label} "${o.title}" (Secondary)`);
                    return usages;
                  };

                  const usages: string[] = [];
                  websiteImages.forEach(wi => {
                    if (wi.url === item.url) usages.push(`Website Images: "${wi.title}"`);
                  });

                  if (homepageConfig?.heroImage === item.url) usages.push("Home Hero Image");

                  destinations.forEach(d => usages.push(...checkItem(d, "Destination")));
                  hotels.forEach(h => usages.push(...checkItem(h, "Hotel Stay")));
                  foodSpots.forEach(f => usages.push(...checkItem(f, "Food Spot")));
                  events.forEach(e => usages.push(...checkItem(e, "Weekend Event")));

                  const isInUse = usages.length > 0;

                  return (
                    <div className="p-4 bg-[#FFFDF5]/50 border border-brand-sand-200 rounded-xl space-y-4 font-mono text-xs text-left animate-slide-in">
                      <div className="flex items-center justify-between border-b border-brand-sand-200 pb-2">
                        <h5 className="font-serif font-bold text-[#1A1614] uppercase text-[11px] flex items-center gap-1">
                          <FileImage className="w-3.5 h-3.5 text-brand-gold-500" />
                          <span>Advanced Metadata Info</span>
                        </h5>
                        <button onClick={() => setSelectedMediaId(null)} className="cursor-pointer">
                          <X className="w-4 h-4 text-[#1A1614]/50 hover:text-[#1A1614]" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px]">
                        <div>
                          <strong className="text-[#1A1614] block">Filename:</strong>
                          <span className="block text-[#1A1614]/70 mt-0.5 break-all">{item.filename}</span>
                        </div>
                        <div>
                          <strong className="text-[#1A1614] block">Folder:</strong>
                          <span className="block text-[#1A1614]/70 mt-0.5">/assets/uploads</span>
                        </div>
                        <div>
                          <strong className="text-[#1A1614] block">File Size:</strong>
                          <span className="block text-[#1A1614]/70 mt-0.5">{item.size || "Unknown"}</span>
                        </div>
                        <div className="md:col-span-3">
                          <strong className="text-[#1A1614] block">Relative URL (Reference Path):</strong>
                          <span className="bg-white px-2 py-1 rounded border select-all truncate block mt-1">{item.url}</span>
                        </div>
                      </div>

                      {/* Usage Tracker Block */}
                      <div className="border-t border-brand-sand-150 pt-3">
                        <strong className="text-[#1A1614] text-[10px] block mb-1">Image Usage Tracker:</strong>
                        {isInUse ? (
                          <div className="space-y-1 bg-[#B8860B]/5 border border-brand-gold-500/20 p-2.5 rounded-lg text-[10px]">
                            <div className="text-brand-gold-700 font-bold flex items-center gap-1 mb-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Actively in use ({usages.length} locations)</span>
                            </div>
                            <ul className="list-disc pl-4 space-y-0.5 text-[#1A1614]/70">
                              {usages.map((u, i) => (
                                <li key={i}>{u}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span className="text-green-600 font-bold text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            ✓ Unused (Safe to Delete)
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-brand-sand-150">
                        <span className="text-[9px] text-[#1A1614]/40 font-bold uppercase">
                          ID: {item.id}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isInUse 
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                              : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                          }`}
                          disabled={isInUse}
                          title={isInUse ? "Cannot delete active images. Reassign them first." : "Delete image permanently"}
                        >
                          <Trash className="w-3.5 h-3.5" />
                          <span>{isInUse ? "Active (Delete Protected)" : "Delete Permanently"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: SITE SETTINGS (CONFIGS)
          ========================================================================= */}
      {activeAdminSubTab === "configs" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-8 shadow-sm text-left">
          
          {/* Header */}
          <div className="space-y-1 border-b border-brand-sand-200 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#1A1614]">Global Configurations</h3>
            <p className="text-xs text-[#1A1614]/60">Govern SEO schemas, landing texts, and conversational limits without redeploying code.</p>
          </div>

          <div className="space-y-8">
            
            {/* Subsection 1: Homepage Hero Setup */}
            <div className="bg-[#FFFDF5]/40 border border-brand-sand-200 rounded-xl p-5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#1A1614] flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-brand-gold-500 animate-pulse" />
                <span>Homepage Hero Display Setup</span>
              </h4>

              <form onSubmit={handleSaveHomepage} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-[#1A1614]">Hero Title (Opening Heading):</label>
                  <input
                    type="text"
                    value={formHomepage.heroTitle}
                    onChange={(e) => setFormHomepage({ ...formHomepage, heroTitle: e.target.value })}
                    placeholder="e.g. WHY ARE YOU IN SURAT?"
                    className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250 outline-none text-[#1A1614]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1614]">Hero Subtitle (Gold Tag):</label>
                  <input
                    type="text"
                    value={formHomepage.heroSubtitle}
                    onChange={(e) => setFormHomepage({ ...formHomepage, heroSubtitle: e.target.value })}
                    placeholder="e.g. SURAT INSIDER CUSTOM EXPERIENCE"
                    className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1614]">Hero Description (Fade-in Loader Subtitle):</label>
                  <input
                    type="text"
                    value={formHomepage.heroDescription}
                    onChange={(e) => setFormHomepage({ ...formHomepage, heroDescription: e.target.value })}
                    placeholder="e.g. The Living Zari Thread is drafting your portal..."
                    className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250 outline-none"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#B8860B] text-[#1A1614] font-mono uppercase text-[10px] font-bold py-2.5 px-4 rounded-xl hover:bg-[#B8860B] transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-brand-gold-400" />
                    <span>Save Hero Setup</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Subsection 2: Chatbot Tuning */}
            <div className="bg-[#FFFDF5]/40 border border-brand-sand-200 rounded-xl p-5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#1A1614] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-gold-500 animate-pulse" />
                <span>Conversational AI Guide Tuning</span>
              </h4>

              <form onSubmit={handleSaveChatbot} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1614]">Free Conversation Message Limit:</label>
                  <input
                    type="number"
                    value={formChatbot.messageLimit}
                    onChange={(e) => setFormChatbot({ ...formChatbot, messageLimit: Number(e.target.value) })}
                    className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250 outline-none text-[#1A1614] font-bold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1614]">Default AI Persona:</label>
                  <select
                    value={formChatbot.defaultPersona}
                    onChange={(e) => setFormChatbot({ ...formChatbot, defaultPersona: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250"
                  >
                    <option value="heritage">Heritage (Jayesh)</option>
                    <option value="shopping">Shopping (Radhika)</option>
                    <option value="food">Culinary (Jignesh)</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-[#1A1614]">Custom Chat Welcome Message:</label>
                  <textarea
                    rows={2}
                    value={formChatbot.customWelcomeMessage}
                    onChange={(e) => setFormChatbot({ ...formChatbot, customWelcomeMessage: e.target.value })}
                    placeholder="Add greeting description..."
                    className="w-full bg-white p-2.5 rounded-lg border border-brand-sand-250 outline-none text-[#1A1614]"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#B8860B] text-[#1A1614] font-mono uppercase text-[10px] font-bold py-2.5 px-4 rounded-xl hover:bg-[#B8860B] transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-brand-gold-400" />
                    <span>Save Chatbot Setup</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Subsection 3: Search Engine Optimization (SEO) */}
            <div className="bg-[#FFFDF5]/40 border border-brand-sand-200 rounded-xl p-5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#1A1614] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-gold-500 animate-pulse" />
                <span>Search Engine Optimization (SEO) Metadata</span>
              </h4>

              <div className="space-y-6">
                {["home", "textile", "wedding", "food", "weekend", "insider"].map((page) => {
                  const pConfig = formSeo[page] || { pageTitle: "", metaDescription: "", keywords: "" };
                  return (
                    <div key={page} className="bg-white p-4 rounded-xl border border-brand-sand-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-brand-sand-100 pb-1.5">
                        <span className="font-mono text-xs font-bold uppercase text-brand-gold-600">Route: /{page === "home" ? "" : page}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1 md:col-span-2">
                          <label className="font-medium text-[#1A1614]/70">Page Title:</label>
                          <input
                            type="text"
                            value={pConfig.pageTitle}
                            onChange={(e) => {
                              const updated = { ...formSeo };
                              if (!updated[page]) updated[page] = {};
                              updated[page].pageTitle = e.target.value;
                              setFormSeo(updated);
                            }}
                            className="w-full bg-[#FFFDF5] p-2 rounded border border-brand-sand-200 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-medium text-[#1A1614]/70">Meta Description:</label>
                          <textarea
                            rows={2}
                            value={pConfig.metaDescription}
                            onChange={(e) => {
                              const updated = { ...formSeo };
                              if (!updated[page]) updated[page] = {};
                              updated[page].metaDescription = e.target.value;
                              setFormSeo(updated);
                            }}
                            className="w-full bg-[#FFFDF5] p-2 rounded border border-brand-sand-200 outline-none text-[11px]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-medium text-[#1A1614]/70">Meta Keywords:</label>
                          <textarea
                            rows={2}
                            value={pConfig.keywords}
                            onChange={(e) => {
                              const updated = { ...formSeo };
                              if (!updated[page]) updated[page] = {};
                              updated[page].keywords = e.target.value;
                              setFormSeo(updated);
                            }}
                            className="w-full bg-[#FFFDF5] p-2 rounded border border-brand-sand-200 outline-none text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={(e) => handleSaveSeo(e, page)}
                          className="bg-[#B8860B] text-brand-sand-50 hover:bg-[#B8860B] text-[9px] font-mono font-black tracking-widest px-3 py-1.5 rounded uppercase flex items-center gap-1 transition-all"
                        >
                          <Save className="w-3 h-3 text-brand-gold-400" />
                          <span>Save /{page === "home" ? "" : page} SEO</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PARTNERS HUB
          ========================================================================= */}
      {activeAdminSubTab === "partners" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1 text-left">
            <h3 className="font-serif text-xl font-bold text-[#1A1614]">Operator Approvals Hub</h3>
            <p className="text-xs text-[#1A1614]/60">Review, approve, or reject incoming business operator coordination requests.</p>
          </div>

          <div className="space-y-4">
            {safePartnerRequests.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#1A1614]/40 font-mono border-2 border-dashed border-brand-sand-200 rounded-xl">
                No active partnership applications found.
              </div>
            ) : (
              safePartnerRequests.map((req) => (
                <div key={req.id} className="p-5 bg-[#FFFDF5]/50 rounded-xl border border-brand-sand-200 text-left space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-brand-sand-200 pb-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1614]">{req.businessName}</h4>
                      <p className="text-[10px] text-[#1A1614]/50 mt-0.5">Type: {req.businessType} • Date: {req.date}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      req.status === "Approved" 
                        ? "bg-[#FFFDF5] text-[#1A1614]" 
                        : req.status === "Rejected" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-[#B8860B]/20 text-brand-gold-600 animate-pulse"
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded border border-brand-sand-200 text-[#1A1614]/80 leading-relaxed">
                    <strong className="text-[#1A1614] block text-[10px] uppercase tracking-wider">Requested Description / updates:</strong>
                    <p className="font-sans text-[11px] mt-1">{req.requestedUpdate}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] pt-1">
                    <div className="space-x-4 text-[#1A1614]/60">
                      <span>Email: <strong>{req.contactEmail}</strong></span>
                    </div>

                    {req.status === "Pending Approval" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePartnerApproval(req.id, "Rejected")}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => handlePartnerApproval(req.id, "Approved")}
                          className="px-3 py-1.5 bg-[#FFFDF5] hover:bg-brand-sand-200 text-[#1A1614] rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: USER LEADS (INQUIRIES)
          ========================================================================= */}
      {activeAdminSubTab === "leads" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1 text-left">
            <h3 className="font-serif text-xl font-bold text-[#1A1614]">Concierge Booking Inquiries</h3>
            <p className="text-xs text-[#1A1614]/60">Inbound leads routing from custom itineraries, shopping sourcing, and luxury hotel queries.</p>
          </div>

          <div className="space-y-4">
            {safeInquiries.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#1A1614]/40 font-mono border-2 border-dashed border-brand-sand-200 rounded-xl">
                No active coordination booking inquiries.
              </div>
            ) : (
              safeInquiries.map((inq) => (
                <div key={inq.id} className="p-5 bg-[#FFFDF5]/50 rounded-xl border border-brand-sand-200 text-left space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-brand-sand-200 pb-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1614]">Lead Ticket: {inq.itemTitle}</h4>
                      <p className="text-[10px] text-[#1A1614]/50 mt-0.5">Sourcing: {inq.inquiryType || inq.itemType} • Client: {inq.name}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      inq.status === "Closed" ? "bg-[#FFFDF5]/55 text-[#1A1614]/50" : "bg-[#FFFDF5] text-[#1A1614] font-bold"
                    }`}>
                      {inq.status}
                    </span>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded border border-brand-sand-200 leading-relaxed font-sans text-[#1A1614] text-[11px]">
                    <strong className="text-[10px] font-mono font-bold block uppercase text-[#1A1614] tracking-wider">Client Message Request:</strong>
                    <p className="mt-1">"{inq.message}"</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] pt-1">
                    <div className="space-x-4 text-[#1A1614]/60">
                      <span>Email: <strong>{inq.email}</strong></span>
                      <span>Phone: <strong>{inq.phone}</strong></span>
                      <span>Timestamp: <strong>{inq.timestamp || inq.date}</strong></span>
                    </div>

                    {inq.status === "New" && (
                      <button
                        onClick={() => resolveInquiry(inq.id, inq.itemTitle)}
                        className="px-3 py-1.5 bg-[#FFFDF5] text-[#1A1614] hover:bg-[#FFFDF5] rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-brand-gold-400" />
                        Resolve & Archive
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: MONETIZATION ENGINE
          ========================================================================= */}
      {activeAdminSubTab === "monetization" && (
        <form onSubmit={handleSaveMonetization} className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm text-left animate-slide-in">
          <div className="space-y-1 border-b border-brand-sand-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1A1614]">Monetization setup settings</h3>
              <p className="text-xs text-[#1A1614]/60">Manage direct ad sponsorship placards, commission structures, and luxury shopping passport pass pricing fees.</p>
            </div>
            <button
              type="submit"
              className="bg-[#B8860B] text-[#1A1614] font-mono uppercase text-[11px] font-bold py-2.5 px-4 rounded-xl hover:bg-[#B8860B] transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-brand-gold-400" />
              <span>Save Monetization Setup</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left pricing controls */}
            <div className="bg-[#FFFDF5]/50 p-5 rounded-xl space-y-4 border border-brand-sand-200">
              <div className="flex items-center gap-1.5 border-b border-brand-sand-200 pb-2">
                <DollarSign className="w-5 h-5 text-brand-gold-500" />
                <h4 className="font-serif font-bold text-sm text-[#1A1614]">Concierge Cost Matrices</h4>
              </div>

              <div className="space-y-3 font-mono">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1A1614]">Lead Generation Cost (₹ per client contact):</label>
                  <input
                    type="number"
                    value={formMonetization.sponsoredAdCost}
                    onChange={(e) => setFormMonetization({ ...formMonetization, sponsoredAdCost: Number(e.target.value) })}
                    className="w-full bg-white border border-brand-sand-200 p-2.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500 text-[#1A1614] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#1A1614]">Premium Guide Access Cost (₹ per guide pack):</label>
                  <input
                    type="number"
                    value={formMonetization.premiumGuideAccessFee}
                    onChange={(e) => setFormMonetization({ ...formMonetization, premiumGuideAccessFee: Number(e.target.value) })}
                    className="w-full bg-white border border-brand-sand-200 p-2.5 rounded-lg text-xs tracking-wide text-[#1A1614] font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right status toggles */}
            <div className="bg-[#FFFDF5]/50 p-5 rounded-xl space-y-4 border border-brand-sand-200">
              <div className="flex items-center gap-1.5 border-b border-brand-sand-200 pb-2">
                <DollarSign className="w-5 h-5 text-brand-gold-500" />
                <h4 className="font-serif font-bold text-sm text-[#1A1614]">Active Revenue Toggles</h4>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-[#1A1614]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formMonetization.isFeaturedEnabled}
                    onChange={(e) => setFormMonetization({ ...formMonetization, isFeaturedEnabled: e.target.checked })}
                    className="h-4 w-4 text-[#1A1614] rounded focus:ring-0"
                  />
                  Enable Premium Featured Sponsoring Placards
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formMonetization.isSponsoredEnabled}
                    onChange={(e) => setFormMonetization({ ...formMonetization, isSponsoredEnabled: e.target.checked })}
                    className="h-4 w-4 text-[#1A1614] rounded focus:ring-0"
                  />
                  Enable Inbound Lead commissions fees
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formMonetization.isPremiumEnabled}
                    onChange={(e) => setFormMonetization({ ...formMonetization, isPremiumEnabled: e.target.checked })}
                    className="h-4 w-4 text-[#1A1614] rounded focus:ring-0"
                  />
                  Enable Paid Shopping Passports Gate
                </label>
              </div>

              <div className="pt-3 border-t border-brand-sand-200 text-[11px] text-[#1A1614]/50 leading-relaxed font-mono">
                💡 Click the "Save Monetization Setup" button above to commit settings to the live database.
              </div>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 7: SECURITY AUDIT LEDGER
          ========================================================================= */}
      {activeAdminSubTab === "security" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1 text-left">
            <h3 className="font-serif text-xl font-bold text-[#1A1614]">RBAC Security Audit Ledger</h3>
            <p className="text-xs text-[#1A1614]/60">Strict log records tracking every create, update, delete or partner moderation event on the live website.</p>
          </div>

          <div className="overflow-x-auto no-scrollbar border border-brand-sand-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#B8860B] text-brand-sand-50 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">ID Log</th>
                  <th className="p-3">User Admin</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Target / Item Modified</th>
                  <th className="p-3">Timestamp (IST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand-200 font-mono text-[11px] text-[#1A1614]">
                {safeAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FFFDF5]/55 transition-colors">
                    <td className="p-3 text-brand-gold-600 font-bold">{log.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#1A1614]">{log.user}</div>
                      <div className="text-[9px]  font-bold uppercase">{log.role}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-brand-emerald-50 text-[#1A1614] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-semibold font-sans">{log.targetName} ({log.targetType})</td>
                    <td className="p-3 text-[#1A1614]/70">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DYNAMIC CREATION & EDIT MODAL
          ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-white h-full max-w-xl w-full shadow-2xl flex flex-col border-l border-brand-sand-200 text-left animate-slide-in">
            <div className="bg-[#B8860B] p-6 text-brand-sand-50 flex items-center justify-between border-b border-[#B8860B] shrink-0">
              <div>
                <h3 className="font-serif font-black text-lg text-brand-sand-50">
                  {isEditingId ? `Edit Selected ${cmsModelType}` : `Create New ${cmsModelType}`}
                </h3>
                <p className="text-[10px] font-mono text-brand-gold-400 uppercase tracking-wider">Content Editor Sandbox</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[#4A423D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#1A1614]">Item Name / Title:</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter custom title..."
                  className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none focus:ring-1 focus:ring-brand-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1A1614]">Item Images (Up to 7):</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []).slice(0, 7) as File[];
                    if (files.length === 0) return;
                    
                    setIsUploading(true);
                    const uploadedUrls: string[] = [];
                    
                    for (const file of files) {
                      try {
                        const base64Data = await new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => resolve(reader.result as string);
                          reader.onerror = reject;
                          reader.readAsDataURL(file);
                        });
                        
                        const response = await fetch("/api/admin/media/upload", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: file.name,
                            data: base64Data,
                            altText: file.name,
                            caption: "Uploaded via Experience form",
                            category: "General"
                          })
                        });
                        const result = await response.json();
                        if (result.success && result.file?.url) {
                          uploadedUrls.push(result.file.url);
                        } else {
                          console.error("Server upload error:", result.error);
                        }
                      } catch (err) {
                        console.error("Failed to upload image", file.name, err);
                      }
                    }
                    
                    setIsUploading(false);
                    if (uploadedUrls.length > 0) {
                      setFormData(prev => {
                        const currentImages = prev.images && prev.images.length > 0 ? prev.images : [];
                        const nextImages = [...currentImages, ...uploadedUrls];
                        return {
                          ...prev,
                          images: nextImages,
                          image: prev.image || nextImages[0]
                        };
                      });
                      showToast(`Successfully uploaded and stored ${uploadedUrls.length} image(s) on server.`, "success");
                    } else {
                      showToast("Failed to upload selected image(s) to server.", "error");
                    }
                  }}
                  className="w-full bg-[#FFFDF5] p-2 rounded-lg border border-brand-sand-200 outline-none cursor-pointer"
                />
                {isUploading && (
                  <div className="text-xs text-brand-gold-600 animate-pulse font-mono flex items-center gap-1">
                    <span>●</span> uploading and processing image assets on host server...
                  </div>
                )}
                {/* Preview Grid */}
                {formData.images && formData.images.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#1A1614]/60 uppercase font-mono">Current Uploaded Assets:</span>
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, images: [], image: "" }))} 
                        className="text-[10px] text-red-600 hover:underline uppercase font-mono"
                      >
                        [Clear All]
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-2">
                      {formData.images.map((imgUrl: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-brand-sand-200 group">
                          <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => {
                                const nextImages = (prev.images || []).filter((_, i) => i !== idx);
                                return {
                                  ...prev,
                                  images: nextImages,
                                  image: nextImages[0] || ""
                                };
                              });
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or fallback external cover url..."
                  className="w-full bg-[#FFFDF5] p-2.5 mt-2 rounded-lg border border-brand-sand-200 outline-none focus:ring-1 focus:ring-brand-gold-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1A1614]">Detailed Narrative Description:</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe details of the offering..."
                  className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none focus:ring-1 focus:ring-brand-gold-500 text-xs"
                />
              </div>

              {/* Conditionally reveal fields based on cmsModelType */}
              {cmsModelType === "destination" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Heritage Category:</label>
                      <select
                        value={["Heritage", "Colonial", "Textile", "Diamond", "Beaches"].includes(formData.category) ? formData.category : "custom_category"}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "custom_category") {
                            setFormData({ ...formData, category: "" });
                          } else {
                            setFormData({ ...formData, category: val });
                          }
                        }}
                        className="w-full bg-[#FFFDF5] p-2 rounded-lg border border-brand-sand-200"
                      >
                        <option value="Heritage">Heritage & Castle</option>
                        <option value="Colonial">Colonial Gardens</option>
                        <option value="Textile">Saree Sourcing</option>
                        <option value="Diamond">Boutique Diamonds</option>
                        <option value="Beaches">Marine Outings</option>
                        <option value="custom_category">Custom / Write My Own...</option>
                      </select>
                      {!["Heritage", "Colonial", "Textile", "Diamond", "Beaches"].includes(formData.category) && (
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Type custom category (e.g. Textile Looms, Food Walks)..."
                          className="w-full bg-[#FFFDF5] p-2 mt-1.5 rounded-lg border border-brand-sand-200 outline-none text-xs"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Specific Location Address:</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Chowk Bazar, Surat"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1A1614]">Detailed Historical Origin Story:</label>
                    <textarea
                      rows={2}
                      value={formData.story}
                      onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                      placeholder="e.g. Crafted in 1540 by Sultan Mahmud III..."
                      className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none focus:ring-1 focus:ring-brand-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Visiting Hours:</label>
                      <input
                        type="text"
                        value={formData.visitingHours}
                        onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
                        placeholder="e.g. 10:00 AM - 06:00 PM"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Best Time to Visit:</label>
                      <input
                        type="text"
                        value={formData.bestTimeToVisit}
                        onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                        placeholder="e.g. October to March"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1A1614]">Nearby Attractions (Comma separated):</label>
                    <input
                      type="text"
                      value={formData.nearbyAttractions}
                      onChange={(e) => setFormData({ ...formData, nearbyAttractions: e.target.value })}
                      placeholder="Surat Castle, Gopi Talav, Dutch Tombs"
                      className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                    />
                  </div>
                </>
              )}

              {cmsModelType === "hotel" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Lodging Class:</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#FFFDF5] p-2 rounded-lg border border-brand-sand-200"
                      >
                        <option value="Luxury">Five Star Luxury</option>
                        <option value="Boutique">Heritage Boutique</option>
                        <option value="Mid-range">Premium Corporate</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Price Per Night (₹ INR):</label>
                      <input
                        type="number"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Location / Quarter:</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Dumas Road, Surat"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Contact Email / Reservations:</label>
                      <input
                        type="email"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                        placeholder="hotel@insider.com"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1A1614]">Amenities Offered (Comma separated):</label>
                    <input
                      type="text"
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      placeholder="Outdoor Infinity Pool, Fine Dining Grill, Valet, Gym"
                      className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                    />
                  </div>
                </>
              )}

              {cmsModelType === "food" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Gastronomy Category:</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#FFFDF5] p-2 rounded-lg border border-brand-sand-200"
                      >
                        <option value="Street Food">Surati Street Food</option>
                        <option value="Traditional">Heritage Sweet Houses</option>
                        <option value="Fine Dining">Luxury Dining Hall</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Cost Level:</label>
                      <select
                        value={formData.priceLevel}
                        onChange={(e) => setFormData({ ...formData, priceLevel: e.target.value as any })}
                        className="w-full bg-[#FFFDF5] p-2 rounded-lg border border-brand-sand-200"
                      >
                        <option value="₹">₹ (Budget)</option>
                        <option value="₹₹">₹₹ (Moderate)</option>
                        <option value="₹₹₹">₹₹₹ (Premium)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Must-Try Dish Name:</label>
                      <input
                        type="text"
                        value={formData.mustTryName}
                        onChange={(e) => setFormData({ ...formData, mustTryName: e.target.value })}
                        placeholder="e.g. Special Italian Locho"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Service Timings:</label>
                      <input
                        type="text"
                        value={formData.timings}
                        onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                        placeholder="e.g. 07:00 AM - 11:30 PM"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1A1614]">Neighborhood location:</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Bhagal Bazar, Surat"
                      className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                    />
                  </div>
                </>
              )}

              {cmsModelType === "tour" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Tour Duration:</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g. 6 Hours"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Price Per Package (₹ INR):</label>
                      <input
                        type="number"
                        value={formData.pricing}
                        onChange={(e) => setFormData({ ...formData, pricing: Number(e.target.value) })}
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1A1614]">Daily Itinerary Schedule Plan (One step per line):</label>
                    <textarea
                      rows={4}
                      value={formData.itinerarySteps}
                      onChange={(e) => setFormData({ ...formData, itinerarySteps: e.target.value })}
                      placeholder="09:00 AM - Pick up from Dumas hotel&#10;10:00 AM - Historic exploration inside Castle&#10;01:30 PM - Authentics Surati Locho lunch stop"
                      className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {cmsModelType === "shopping" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Textile Sourcing / Specialty Type:</label>
                      <input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        placeholder="e.g. Tanchoi & Zari Silks"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Market Price Range Tag:</label>
                      <input
                        type="text"
                        value={formData.priceRange}
                        onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                        placeholder="e.g. ₹₹ (Mid-range)"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Location / Wholesale Market:</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Ring Road Saree Market"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Merchant Contact Info / Website:</label>
                      <input
                        type="text"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                        placeholder="sales@sareeops.com"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {cmsModelType === "blog" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Estimated Read Time:</label>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        placeholder="e.g. 5 Mins"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#1A1614]">Author Profile:</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Editorial Board"
                        className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Shared parameters */}
              <div className="grid grid-cols-2 gap-3 border-t border-brand-sand-200 pt-3">
                {cmsModelType !== "blog" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-[#1A1614]">Rating Score (1.0 - 5.0):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full bg-[#FFFDF5] p-2.5 rounded-lg border border-brand-sand-200 outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-[#1A1614]">Publish Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#FFFDF5] p-2 rounded-lg border border-brand-sand-200"
                  >
                    <option value="Published">Published Live</option>
                    <option value="Draft">Draft (Invisible)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-brand-sand-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-brand-sand-250 py-3 rounded-xl hover:bg-brand-sand-100 transition-colors uppercase font-mono font-bold text-[#1A1614] text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#B8860B] hover:bg-[#B8860B] text-[#1A1614] font-mono uppercase text-xs font-bold py-3 rounded-xl transition-all shadow text-center"
                >
                  {isEditingId ? "Save Live Changes" : "Publish Live Now"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
