import React, { useState } from "react";
import { Role, Destination, Hotel, FoodSpot, LocalEvent, Tour, BlogPost, Inquiry, PartnerRequest, AuditLog, MonetizationSetting } from "../types";
import { ShieldCheck, Plus, Trash2, Edit2, CheckCircle, XCircle, DollarSign, Activity, FileText, Bell, Sparkles } from "lucide-react";

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
  setMonetization: React.Dispatch<React.SetStateAction<MonetizationSetting>>;
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
}: AdminPanelProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<"cms" | "partners" | "leads" | "monetization" | "security">("cms");
  const [cmsModelType, setCmsModelType] = useState<"destination" | "hotel" | "food" | "event" | "tour" | "shopping">("destination");
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem("adminEmail") || "itxghost111@gmail.com");

  // Show detailed error if guest tries to edit
  const isGuest = currentUserRole === "Guest";
  
  // Role permission checker helper
  const hasAccess = (requiredRoles: Role[]) => {
    if (isGuest) return false;
    return requiredRoles.includes(currentUserRole as Role);
  };

  const hasCmsAccess = () => hasAccess(["Super Admin", "Editor", "Content Manager"]);
  const hasPartnerAccess = () => hasAccess(["Super Admin", "Partner Manager"]);
  const hasSuperAccess = () => hasAccess(["Super Admin"]);

  // CMS dynamic inserting form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
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
    mustTryName: "",
    priceLevel: "₹₹",
    timings: "",
    whatToBuy: "",
    insiderTips: "",
    priceRange: "₹₹₹" as "₹" | "₹₹" | "₹₹₹" | "₹₹₹₹",
    stores: "",
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (!hasCmsAccess()) {
      alert("Unauthorized Role context. Only Editor, Content Manager or Super Admin can create/edit items.");
      return;
    }

    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (isEditingId) {
      // EDITING EXISTING ITEM
      if (cmsModelType === "destination") {
        setDestinations(prev => prev.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: formData.image || item.image,
          category: (formData.category as any) || "Heritage",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          story: formData.story || "A revised tourist spot.",
          visitingHours: formData.visitingHours,
          bestTimeToVisit: formData.bestTimeToVisit,
          nearbyAttractions: formData.nearbyAttractions ? formData.nearbyAttractions.split(",").map(s => s.trim()) : [],
        } : item));
        addAuditLog("Edited Spot", "Destination", formData.title);
      } else if (cmsModelType === "hotel") {
        setHotels(prev => prev.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: formData.image || item.image,
          category: (formData.category as any) || "Luxury",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.7,
          status: formData.status,
          pricePerNight: Number(formData.pricePerNight) || 3500,
          amenities: formData.amenities ? formData.amenities.split(",").map(s => s.trim()) : [],
        } : item));
        addAuditLog("Edited Hotel", "Hotel Stay", formData.title);
      } else if (cmsModelType === "food") {
        setFoodSpots(prev => prev.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: formData.image || item.image,
          category: (formData.category as any) || "Street Food",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          mustTry: formData.mustTryName || "Spiced Locho",
          priceLevel: (formData.priceLevel as any) || "₹",
          location: formData.location || "Surat, Gujarat",
          timings: formData.timings || "08:00 AM - 09:00 PM"
        } : item));
        addAuditLog("Edited Food Spot", "Dining", formData.title);
      } else if (cmsModelType === "event") {
        setEvents(prev => prev.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: formData.image || item.image,
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          category: (formData.category as any) || "Festivals",
          venue: formData.location || "SIECC, Surat"
        } : item));
        addAuditLog("Edited Local Event", "Event", formData.title);
      } else if (cmsModelType === "tour") {
        setTours(prev => prev.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: formData.image || item.image,
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          pricing: Number(formData.pricing) || 2500,
          duration: formData.duration || "4 Hours",
          itinerary: formData.itinerarySteps ? formData.itinerarySteps.split("\n").map(s => s.trim()) : []
        } : item));
        addAuditLog("Edited Tour Details", "Tour", formData.title);
      } else if (cmsModelType === "shopping") {
        setShoppingGuides(prev => prev.map(item => item.id === isEditingId ? {
          ...item,
          title: formData.title,
          description: formData.description,
          image: formData.image || item.image,
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          category: (formData.category as any) || "Bridal Shopping",
          priceRange: (formData.priceRange as any) || "₹₹₹",
          whatToBuy: formData.whatToBuy || "Silk textiles",
          insiderTips: formData.insiderTips || "No tips",
          stores: formData.stores ? formData.stores.split(",").map(s => s.trim()) : [],
          location: formData.location || "Surat Core Saree Hub"
        } : item));
        addAuditLog("Edited Shopping Guide", "Shopping", formData.title);
      }
    } else {
      // CREATING NEW ITEM
      const uniqueId = `cms-${Date.now()}`;
      if (cmsModelType === "destination") {
        const newItem: Destination = {
          id: uniqueId,
          title: formData.title,
          description: formData.description,
          image: formData.image || "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
          category: (formData.category as any) || "Heritage",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          story: formData.story || "A newly added tourist spot with unique local history.",
          visitingHours: formData.visitingHours || "09:00 AM - 06:00 PM",
          bestTimeToVisit: formData.bestTimeToVisit || "October to March",
          nearbyAttractions: formData.nearbyAttractions ? formData.nearbyAttractions.split(",").map(s => s.trim()) : ["Chauta Bazar"],
          suggestedItinerary: "Start from a morning walk at 8:00 AM, capture images, take refreshments."
        };
        setDestinations([newItem, ...destinations]);
        addAuditLog("Created Spot", "Destination", newItem.title);
      } else if (cmsModelType === "hotel") {
        const newItem: Hotel = {
          id: uniqueId,
          title: formData.title,
          description: formData.description,
          image: formData.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
          category: (formData.category as any) || "Luxury",
          location: formData.location || "Surat, Gujarat",
          rating: Number(formData.rating) || 4.7,
          status: formData.status,
          slug,
          pricePerNight: Number(formData.pricePerNight) || 3500,
          amenities: formData.amenities ? formData.amenities.split(",").map(s => s.trim()) : ["Free Wifi", "Room Service"],
          nearbyAttractions: ["Surat Castle", "Textile Hub"],
          contactInfo: "+91 261 444 1234 | reservations@suratinsider.com",
        };
        setHotels([newItem, ...hotels]);
        addAuditLog("Created Hotel", "Hotel Stay", newItem.title);
      } else if (cmsModelType === "food") {
        const newItem: FoodSpot = {
          id: uniqueId,
          title: formData.title,
          description: formData.description,
          image: formData.image || "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=1200&auto=format&fit=crop",
          category: (formData.category as any) || "Street Food",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          mustTry: formData.mustTryName || "Spiced Locho with Sev",
          priceLevel: (formData.priceLevel as any) || "₹",
          location: formData.location || "Bhagal Chowk, Surat",
          timings: formData.timings || "08:00 AM - 09:00 PM"
        };
        setFoodSpots([newItem, ...foodSpots]);
        addAuditLog("Created Food Spot", "Dining", newItem.title);
      } else if (cmsModelType === "event") {
        const newItem: LocalEvent = {
          id: uniqueId,
          title: formData.title,
          description: formData.description,
          image: formData.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          slug,
          category: (formData.category as any) || "Festivals",
          date: "October 12 - 20, 2026",
          venue: formData.location || "SIECC Sarsana, Surat"
        };
        setEvents([newItem, ...events]);
        addAuditLog("Created Local Event", "Event", newItem.title);
      } else if (cmsModelType === "tour") {
        const newItem: Tour = {
          id: uniqueId,
          title: formData.title,
          description: formData.description,
          image: formData.image || "https://images.unsplash.com/photo-1524295981977-62f3a4794939?q=80&w=1200&auto=format&fit=crop",
          rating: Number(formData.rating) || 4.9,
          status: formData.status,
          slug,
          pricing: Number(formData.pricing) || 2500,
          duration: formData.duration || "4 Hours",
          itinerary: formData.itinerarySteps ? formData.itinerarySteps.split("\n").map(s => s.trim()) : ["09:00 AM - Gather guides", "10:00 AM - Heritage walk exploring tombs", "12:00 PM - Sweet Tasting"]
        };
        setTours([newItem, ...tours]);
        addAuditLog("Created Tour Package", "Tour", newItem.title);
      } else if (cmsModelType === "shopping") {
        const newItem = {
          id: uniqueId,
          title: formData.title,
          description: formData.description,
          image: formData.image || "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=1200&auto=format&fit=crop",
          rating: Number(formData.rating) || 4.8,
          status: formData.status,
          slug,
          category: (formData.category as any) || "Bridal Shopping",
          priceRange: (formData.priceRange as any) || "₹₹₹",
          whatToBuy: formData.whatToBuy || "Tanchoi sarees and Brocades",
          insiderTips: formData.insiderTips || "Walk directly into mills for best discount rates",
          stores: formData.stores ? formData.stores.split(",").map(s => s.trim()) : ["Millennium Textile Market"],
          location: formData.location || "Ring Road Textile Area, Surat"
        };
        setShoppingGuides([newItem, ...shoppingGuides]);
        addAuditLog("Created Saree/Wedding loom Shop Guide", "Shopping", newItem.title);
      }
    }

    // Reset Form
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
      mustTryName: "",
      priceLevel: "₹₹",
      timings: "",
      whatToBuy: "",
      insiderTips: "",
      priceRange: "₹₹₹",
      stores: "",
    });
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (!hasCmsAccess()) {
      alert("Unauthorized. Required Role: Super Admin, Editor or Content Manager");
      return;
    }

    if (window.confirm(`Are you absolutely sure you want to permanently delete "${name}"?`)) {
      if (cmsModelType === "destination") {
        setDestinations(destinations.filter(d => d.id !== id));
        addAuditLog("Deleted Spot", "Destination", name);
      } else if (cmsModelType === "hotel") {
        setHotels(hotels.filter(h => h.id !== id));
        addAuditLog("Deleted Hotel", "Hotel Stay", name);
      } else if (cmsModelType === "food") {
        setFoodSpots(foodSpots.filter(f => f.id !== id));
        addAuditLog("Deleted Food Spot", "Dining", name);
      } else if (cmsModelType === "event") {
        setEvents(events.filter(e => e.id !== id));
        addAuditLog("Deleted Local Event", "Event", name);
      } else if (cmsModelType === "tour") {
        setTours(tours.filter(t => t.id !== id));
        addAuditLog("Deleted Tour Package", "Tour", name);
      } else if (cmsModelType === "shopping") {
        setShoppingGuides(shoppingGuides.filter(s => s.id !== id));
        addAuditLog("Deleted Shopping Guide", "Shopping", name);
      }
    }
  };

  // Partner Approvals Handler
  const handlePartnerApproval = (reqId: string, action: "Approved" | "Rejected") => {
    if (!hasPartnerAccess()) {
      alert("Unauthorized Role session. Only Partner Manager or Super Admin can moderate applications.");
      return;
    }

    const matchedRequest = partnerRequests.find(r => r.id === reqId);
    if (!matchedRequest) return;

    setPartnerRequests(partnerRequests.map(r => r.id === reqId ? { ...r, status: action } : r));
    addAuditLog(`${action} Partner Request`, "Partner Hub", matchedRequest.businessName);

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
        setHotels([newHotel, ...hotels]);
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
        setFoodSpots([newFood, ...foodSpots]);
        addAuditLog("Auto-published Snack Spot from Partner Approval", "Dining", newFood.title);
      }
    }
  };

  // Inquiry ticket close
  const resolveInquiry = (id: string, name: string) => {
    if (!hasAccess(["Super Admin", "Partner Manager"])) {
      alert("Unauthorized to resolve booking leads.");
      return;
    }
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: "Closed" } : inq));
    addAuditLog("Closed User Lead Ticket", "Inquiry", name);
  };

  const handleEditItem = (item: any) => {
    setIsEditingId(item.id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
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
      mustTryName: item.mustTry || "",
      priceLevel: item.priceLevel || "₹₹",
      timings: item.timings || "",
      whatToBuy: item.whatToBuy || "",
      insiderTips: item.insiderTips || "",
      priceRange: item.priceRange || "₹₹₹",
      stores: item.stores ? item.stores.join(", ") : "",
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in text-brand-charcoal">
      {/* Header Info */}
      <div className="bg-brand-emerald-950 p-6 rounded-2xl text-brand-sand-50 flex flex-col md:flex-row items-center justify-between border border-brand-emerald-900 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-brand-gold-400" />
            <h1 className="font-serif text-2xl font-bold tracking-tight">Internal Platform CMS Control</h1>
          </div>
          <p className="text-xs text-brand-sand-150 opacity-80">
            Active Role session: <strong className="text-brand-gold-300 underline font-mono uppercase">{currentUserRole}</strong>
          </p>
        </div>

        <div className="flex gap-2 shrink-0 overflow-x-auto p-1 bg-brand-emerald-900/40 rounded-xl border border-brand-emerald-800/20">
          {(["cms", "partners", "leads", "monetization", "security"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveAdminSubTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase font-mono ${
                activeAdminSubTab === tab
                  ? "bg-brand-gold-500 text-brand-emerald-950"
                  : "text-brand-sand-50 hover:bg-brand-emerald-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* WARNING NOTIFICATION IF GUEST TYPE */}
      {isGuest && (
        <div className="p-4 bg-brand-gold-500/10 border-2 border-brand-gold-500/20 text-brand-emerald-950 rounded-xl text-xs flex items-start gap-3">
          <Activity className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="font-bold uppercase font-mono">Simulated Guest / Visitor View Mode</h4>
            <p className="leading-relaxed">
              Super Admin, Editor, and Manager capabilities are protected. Switch your role using the top-right role selector to "Super Admin" or "Partner Mgr" to test dynamic inserting, deleting, editing, approving partner updates, and adjusting pricing monetization settings.
            </p>
          </div>
        </div>
      )}

      {/* Role Management Matrix Matrix panel */}
      {activeAdminSubTab === "cms" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-brand-emerald-950">CMS Content Inventories</h3>
              <p className="text-xs text-brand-charcoal/60">Manage destinations, tours, events or local spots dynamically inside the live platform database.</p>
            </div>

            {/* Model select pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {(["destination", "shopping", "hotel", "food", "event", "tour"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCmsModelType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide capitalize whitespace-nowrap ${
                    cmsModelType === type
                      ? "bg-brand-emerald-900 text-white"
                      : "bg-brand-sand-100 hover:bg-brand-sand-200 text-brand-charcoal-light"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center bg-brand-sand-100 p-4 rounded-xl border border-brand-sand-200">
            <span className="text-xs text-brand-charcoal/70">
              Active Inventory: <strong className="capitalize text-brand-emerald-900">{cmsModelType} Lists ({
                cmsModelType === "destination" ? destinations.length :
                cmsModelType === "shopping" ? shoppingGuides.length :
                cmsModelType === "hotel" ? hotels.length :
                cmsModelType === "food" ? foodSpots.length :
                cmsModelType === "event" ? events.length :
                tours.length
              } entities)</strong>
            </span>

            <button
              onClick={() => {
                if (isGuest) {
                  alert("Please switch role to Super Admin/Editor at the top right to create items.");
                  return;
                }
                setShowAddModal(true);
              }}
              className="bg-brand-emerald-950 hover:bg-brand-emerald-900 text-brand-sand-50 rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New {cmsModelType}
            </button>
          </div>

          {/* Grid Cards displaying live list for visual edit deletion */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-wider text-brand-charcoal/50 block">Registered listings (Click Trash to delete instantly from UI):</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="cms-list">
              {cmsModelType === "destination" && destinations.map(item => (
                <div key={item.id} className="p-4 bg-brand-sand-50 rounded-xl border border-brand-sand-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded object-cover shadow" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-brand-emerald-950">{item.title}</h4>
                      <p className="text-[10px] text-brand-charcoal/50">{item.category} • Rating {item.rating} • {item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditItem(item)} className="text-brand-emerald-900 hover:bg-brand-emerald-950/10 p-2 rounded" title="Edit Item">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id, item.title)} className="text-red-800 hover:bg-red-900/10 p-2 rounded" title="Delete Item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cmsModelType === "shopping" && shoppingGuides.map(item => (
                <div key={item.id} className="p-4 bg-brand-sand-50 rounded-xl border border-brand-sand-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded object-cover shadow" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-brand-emerald-950">{item.title}</h4>
                      <p className="text-[10px] text-brand-charcoal/50">{item.category} • {item.priceRange} • {item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditItem(item)} className="text-brand-emerald-900 hover:bg-brand-emerald-950/10 p-2 rounded" title="Edit Item">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id, item.title)} className="text-red-800 hover:bg-red-900/10 p-2 rounded" title="Delete Item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cmsModelType === "hotel" && hotels.map(item => (
                <div key={item.id} className="p-4 bg-brand-sand-50 rounded-xl border border-brand-sand-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded object-cover shadow" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-brand-emerald-950">{item.title}</h4>
                      <p className="text-[10px] text-brand-charcoal/50">{item.category} • ₹{item.pricePerNight}/night • {item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditItem(item)} className="text-brand-emerald-900 hover:bg-brand-emerald-950/10 p-2 rounded" title="Edit Hotel">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id, item.title)} className="text-red-800 hover:bg-red-900/10 p-2 rounded" title="Delete Hotel">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cmsModelType === "food" && foodSpots.map(item => (
                <div key={item.id} className="p-4 bg-brand-sand-50 rounded-xl border border-brand-sand-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded object-cover shadow" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-brand-emerald-950">{item.title}</h4>
                      <p className="text-[10px] text-brand-charcoal/50">{item.category} • Must Try: {item.mustTry} • {item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditItem(item)} className="text-brand-emerald-900 hover:bg-brand-emerald-950/10 p-2 rounded" title="Edit Dining">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id, item.title)} className="text-red-800 hover:bg-red-900/10 p-2 rounded" title="Delete Dining">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cmsModelType === "event" && events.map(item => (
                <div key={item.id} className="p-4 bg-brand-sand-50 rounded-xl border border-brand-sand-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded object-cover shadow" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-brand-emerald-950">{item.title}</h4>
                      <p className="text-[10px] text-brand-charcoal/50">{item.category} • {item.date} • {item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditItem(item)} className="text-brand-emerald-900 hover:bg-brand-emerald-950/10 p-2 rounded" title="Edit Event">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id, item.title)} className="text-red-800 hover:bg-red-900/10 p-2 rounded" title="Delete Event">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cmsModelType === "tour" && tours.map(item => (
                <div key={item.id} className="p-4 bg-brand-sand-50 rounded-xl border border-brand-sand-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded object-cover shadow" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-brand-emerald-950">{item.title}</h4>
                      <p className="text-[10px] text-brand-charcoal/50">{item.duration} • ₹{item.pricing} • {item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditItem(item)} className="text-brand-emerald-900 hover:bg-brand-emerald-950/10 p-2 rounded" title="Edit Tour">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id, item.title)} className="text-red-800 hover:bg-red-900/10 p-2 rounded" title="Delete Tour">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Partner Requests Applications list  */}
      {activeAdminSubTab === "partners" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-brand-emerald-950">Partner Operations Board</h3>
            <p className="text-xs text-brand-charcoal/60">Review update requests submitted by local restaurants and hotels under approval logs.</p>
          </div>

          <div className="space-y-3">
            {partnerRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-brand-sand-50 border border-brand-sand-200 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-brand-sand-200 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-emerald-950">{req.businessName}</h4>
                    <span className="text-[10px] bg-brand-emerald-950 text-white font-mono uppercase px-2 py-0.5 rounded">
                      {req.businessType}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase ${
                    req.status === "Pending Approval" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                    req.status === "Approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                    "bg-red-100 text-red-800 border border-red-300"
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-charcoal/50">Requested update:</span>
                  <p className="text-xs text-brand-charcoal-light leading-relaxed">{req.requestedUpdate}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-brand-charcoal/50">
                  <span>Contact: {req.contactEmail}</span>
                  <span>Date: {req.date}</span>
                </div>

                {req.status === "Pending Approval" && (
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => handlePartnerApproval(req.id, "Rejected")}
                      className="px-3.5 py-1.5 bg-red-900/10 hover:bg-red-900/20 text-red-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline Request
                    </button>
                    <button
                      onClick={() => handlePartnerApproval(req.id, "Approved")}
                      className="px-3.5 py-1.5 bg-brand-emerald-900 hover:bg-brand-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve & Auto-Publish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Leads Inbox queue */}
      {activeAdminSubTab === "leads" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-brand-emerald-950">Inbound Guest leads Inbox</h3>
            <p className="text-xs text-brand-charcoal/60">Sales pipeline inquiries. Resolve, contact, or file for private bookings.</p>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 bg-brand-sand-50 border border-brand-sand-200 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-brand-sand-200 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-emerald-950">{inq.name}</h4>
                    <p className="text-[10px] text-brand-charcoal/50">Item: {inq.itemTitle} ({inq.itemType})</p>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    inq.status === "New" ? "bg-blue-100 text-blue-800" :
                    inq.status === "Contacted" ? "bg-amber-100 text-amber-800" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-brand-charcoal/50">Message details:</span>
                  <p className="text-xs text-brand-charcoal-light leading-relaxed font-sans">{inq.message}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] font-mono text-brand-charcoal/50 gap-2">
                  <span>Phone: {inq.phone || "N/A"} | Email: {inq.email}</span>
                  <span>Date: {inq.date}</span>
                </div>

                {inq.status !== "Closed" && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => resolveInquiry(inq.id, inq.name)}
                      className="px-4 py-1.5 bg-brand-emerald-950 text-white hover:bg-brand-emerald-900 rounded-lg text-xs font-semibold"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monetization control screen */}
      {activeAdminSubTab === "monetization" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-brand-emerald-950">Future-Ready Monetization Engine</h3>
            <p className="text-xs text-brand-charcoal/60">Model settings configured for sponsored partner placements, lead fees, and VIP features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left sliders and pricing inputs */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-mono font-bold text-brand-emerald-950">Sponsorship Tariffs</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-brand-charcoal">Featured partner Listing Fee (₹ per listing):</label>
                  <input
                    type="number"
                    value={monetization.featuredListingFee}
                    onChange={(e) => setMonetization({ ...monetization, featuredListingFee: Number(e.target.value) })}
                    className="w-full bg-brand-sand-100 p-2.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500 text-brand-emerald-950 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-brand-charcoal">Lead Generation Cost (₹ per client contact):</label>
                  <input
                    type="number"
                    value={monetization.sponsoredAdCost}
                    onChange={(e) => setMonetization({ ...monetization, sponsoredAdCost: Number(e.target.value) })}
                    className="w-full bg-brand-sand-100 p-2.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-gold-500 text-brand-emerald-950 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-brand-charcoal">Premium Guide Access Cost (₹ per guide pack):</label>
                  <input
                    type="number"
                    value={monetization.premiumGuideAccessFee}
                    onChange={(e) => setMonetization({ ...monetization, premiumGuideAccessFee: Number(e.target.value) })}
                    className="w-full bg-brand-sand-100 p-2.5 rounded-lg text-xs tracking-wide text-brand-emerald-950 font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right status toggles */}
            <div className="bg-brand-sand-100 p-5 rounded-xl space-y-4 border border-brand-sand-200">
              <div className="flex items-center gap-1.5 border-b border-brand-sand-200 pb-2">
                <DollarSign className="w-5 h-5 text-brand-gold-500" />
                <h4 className="font-serif font-bold text-sm text-brand-emerald-950">Active Revenue Toggles</h4>
              </div>

              <div className="space-y-3.5">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={monetization.isFeaturedEnabled}
                    onChange={(e) => setMonetization({ ...monetization, isFeaturedEnabled: e.target.checked })}
                    className="h-4 w-4 text-brand-emerald-900 rounded focus:ring-0"
                  />
                  Enable Premium Featured Sponsoring Placards
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={monetization.isSponsoredEnabled}
                    onChange={(e) => setMonetization({ ...monetization, isSponsoredEnabled: e.target.checked })}
                    className="h-4 w-4 text-brand-emerald-900 rounded focus:ring-0"
                  />
                  Enable Inbound Lead commissions fees
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={monetization.isPremiumEnabled}
                    onChange={(e) => setMonetization({ ...monetization, isPremiumEnabled: e.target.checked })}
                    className="h-4 w-4 text-brand-emerald-900 rounded focus:ring-0"
                  />
                  Enable Paid Shopping Passports Gate
                </label>
              </div>

              <div className="pt-3 border-t border-brand-sand-200 text-[11px] text-brand-charcoal/50 leading-relaxed font-mono">
                💡 Settings automatically persist to active application state.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Audit logs list */}
      {activeAdminSubTab === "security" && (
        <div className="bg-white rounded-2xl border border-brand-sand-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-brand-emerald-950">RBAC Security Audit Ledger</h3>
            <p className="text-xs text-brand-charcoal/60">Strict log records tracking every create, update, delete or partner moderation event.</p>
          </div>

          <div className="overflow-x-auto no-scrollbar border border-brand-sand-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-emerald-950 text-brand-sand-50 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Modifier User</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Action Completed</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand-200 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-sand-100/50">
                    <td className="p-3 font-semibold text-brand-emerald-950">{log.user}</td>
                    <td className="p-3 text-brand-gold-500 font-bold">{log.role}</td>
                    <td className="p-3 font-sans text-brand-charcoal-light">{log.action}</td>
                    <td className="p-3 text-brand-charcoal-light">{log.targetType}: {log.targetName}</td>
                    <td className="p-3 text-[10px] text-brand-charcoal/50">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic adding component Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-brand-emerald-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-sand-50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up border border-brand-sand-200">
            <div className="bg-brand-emerald-950 p-6 text-brand-sand-50 flex items-center justify-between border-b border-brand-emerald-900">
              <h3 className="font-serif text-lg font-bold">{isEditingId ? "Edit" : "Add"} Spot to Live Catalog ({cmsModelType})</h3>
              <button 
                type="button"
                onClick={() => {
                  setIsEditingId(null);
                  setShowAddModal(false);
                }} 
                className="text-brand-sand-100 hover:text-white font-bold"
              >✕</button>
            </div>

            <form onSubmit={handleCreateItem} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold">Entity Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dutch Garden Gate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">Description Brief</label>
                <textarea
                  required
                  placeholder="Summarize features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5 resize-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold">Image Cover URL</label>
                  <span className="text-[10px] text-brand-emerald-800 font-bold">Or upload directly from phone ↓</span>
                </div>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-white border border-brand-sand-200 rounded-lg p-2 flex-grow text-xs font-mono"
                />
                <div className="pt-1.5 flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1 text-[10px] bg-brand-emerald-950 text-white hover:bg-brand-emerald-950/90 active:scale-95 px-3 py-1.5 rounded-md font-mono font-bold tracking-wider transition-all shadow-sm">
                    <span>📤 UPLOAD PHOTO FROM DEVICE</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                              setFormData({ ...formData, image: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {formData.image && formData.image.startsWith("data:") && (
                    <span className="text-[9px] text-green-700 font-mono font-bold bg-green-50 border border-green-200/80 rounded px-2.5 py-1">
                      ✓ loaded ({Math.round(formData.image.length / 1024)} KB)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Category</label>
                  {cmsModelType === "destination" ? (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                    >
                      <option value="Heritage">Heritage</option>
                      <option value="Nature">Nature</option>
                      <option value="Family Activities">Family Activities</option>
                      <option value="Religious Places">Religious Places</option>
                    </select>
                  ) : cmsModelType === "hotel" ? (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                    >
                      <option value="Luxury">Luxury</option>
                      <option value="Mid-range">Mid-range</option>
                      <option value="Budget">Budget</option>
                    </select>
                  ) : cmsModelType === "shopping" ? (
                    <select
                      value={formData.category || "Bridal Shopping"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                    >
                      <option value="Bridal Shopping">Bridal Shopping</option>
                      <option value="Sarees & Brocades">Sarees & Brocades</option>
                      <option value="Diamond Solitaires">Diamond Solitaires</option>
                      <option value="Textile Mills">Textile Mills</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Street Food / Expo"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold">Rating Marker (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                  />
                </div>
              </div>

              {/* Destination extra details fields */}
              {cmsModelType === "destination" && (
                <div className="space-y-4 border-t border-brand-sand-200 pt-4">
                  <div className="space-y-1">
                    <label className="font-bold">Detailed Story</label>
                    <textarea
                      placeholder="Explain history, background..."
                      value={formData.story}
                      onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                      rows={2}
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold">Visiting Hours</label>
                      <input
                        type="text"
                        placeholder="10 AM - 6 PM"
                        value={formData.visitingHours}
                        onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="font-bold">Best Time</label>
                      <input
                        type="text"
                        placeholder="October - March"
                        value={formData.bestTimeToVisit}
                        onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel specific details */}
              {cmsModelType === "hotel" && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold">Price per Night (₹)</label>
                      <input
                        type="number"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="font-bold">Amenities (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Gym, Buffet, Pool"
                        value={formData.amenities}
                        onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Food specific fields */}
              {cmsModelType === "food" && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold">Must Try Surt Dish</label>
                      <input
                        type="text"
                        placeholder="Cheese Schezwan Locho"
                        value={formData.mustTryName}
                        onChange={(e) => setFormData({ ...formData, mustTryName: e.target.value })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="font-bold">Price Range</label>
                      <select
                        value={formData.priceLevel}
                        onChange={(e) => setFormData({ ...formData, priceLevel: e.target.value })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      >
                        <option value="₹">₹ (Budget)</option>
                        <option value="₹₹">₹₹ (Mid-range)</option>
                        <option value="₹₹₹">₹₹₹ (Premium)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tour specific fields */}
              {cmsModelType === "tour" && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold">Tour Price per Person (₹)</label>
                      <input
                        type="number"
                        value={formData.pricing}
                        onChange={(e) => setFormData({ ...formData, pricing: Number(e.target.value) })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="font-bold">Duration (e.g. 5 Hours)</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold">Itinerary Steps (one per line)</label>
                    <textarea
                      rows={3}
                      value={formData.itinerarySteps}
                      onChange={(e) => setFormData({ ...formData, itinerarySteps: e.target.value })}
                      placeholder="09:00 AM - pickup&#10;10:30 AM - Sightseeing"
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                    />
                  </div>
                </div>
              )}

              {/* Shopping specific fields */}
              {cmsModelType === "shopping" && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold">What to Buy (e.g. Brocades)</label>
                      <input
                        type="text"
                        value={formData.whatToBuy}
                        onChange={(e) => setFormData({ ...formData, whatToBuy: e.target.value })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="font-bold">Price Level Range</label>
                      <select
                        value={formData.priceRange}
                        onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as any })}
                        className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                      >
                        <option value="₹">₹ (Budget)</option>
                        <option value="₹₹">₹₹ (Mid-range)</option>
                        <option value="₹₹₹">₹₹₹ (Premium)</option>
                        <option value="₹₹₹₹">₹₹₹₹ (Luxury)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold">Insider Tips & Advice</label>
                    <textarea
                      rows={2}
                      value={formData.insiderTips}
                      onChange={(e) => setFormData({ ...formData, insiderTips: e.target.value })}
                      placeholder="Ask guides directly about wholesale mills rates..."
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5 resize-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Affiliated Stores (comma separated)</label>
                    <input
                      type="text"
                      value={formData.stores}
                      onChange={(e) => setFormData({ ...formData, stores: e.target.value })}
                      placeholder="Seematti Sarees, Millennium Market"
                      className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold font-mono">Location address</label>
                <input
                  type="text"
                  placeholder="Sarsana bypass, Surat"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white border border-brand-sand-200 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">Publish Mode</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "Published" })}
                    className={`flex-1 py-2 rounded text-center border font-bold ${
                      formData.status === "Published"
                        ? "bg-brand-emerald-900 border-brand-emerald-950 text-white"
                        : "bg-white border-brand-sand-200 text-brand-charcoal"
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "Draft" })}
                    className={`flex-1 py-2 rounded text-center border font-bold ${
                      formData.status === "Draft"
                        ? "bg-brand-emerald-900 border-brand-emerald-950 text-white"
                        : "bg-white border-brand-sand-200 text-brand-charcoal"
                    }`}
                  >
                    Draft Mode
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-emerald-950 text-white hover:bg-brand-emerald-900 transition-colors font-bold py-3 rounded-lg text-xs uppercase tracking-wider"
              >
                {isEditingId ? "Save Changes" : "Register Spot to Database"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
