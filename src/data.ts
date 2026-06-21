import { Destination, ShoppingGuide, Hotel, Tour, FoodSpot, LocalEvent, BlogPost, AuditLog, PartnerRequest, Inquiry, MonetizationSetting } from "./types";

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: "dest-1",
    title: "Surat Castle / Old Fort",
    description: "An authentic 16th-century fortification constructed by Safi Agha against Portuguese incursions, offering dramatic views of the Tapi River and historical exhibits.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.8,
    status: "Published",
    slug: "surat-castle",
    category: "Heritage",
    story: "Constructed in 1540 by Khudawand Khan, Surat Castle stands as a testament to Surat's status as India's premier medieval trading harbor. The castle underwent painstaking preservation and now offers curated galleries depicting ancient maritime routes and centuries of colonial struggles.",
    visitingHours: "10:00 AM - 06:00 PM (Closed on Mondays)",
    bestTimeToVisit: "October to March",
    nearbyAttractions: ["Dutch Garden", "Chauta Bazar", "Tapi River Front"],
    suggestedItinerary: "Dedicate 2 hours in the late afternoon. Begin with the defense bastion, explore the coin galleries, and finish on the terrace deck just as the golden hour hits the Tapi River.",
    location: "Near Hope Bridge, Chowk Bazar, Surat"
  },
  {
    id: "dest-2",
    title: "The Dutch & Armenian Cemeteries",
    description: "Serene garden sanctuaries containing massive mausoleums that look like grand architectural monuments from the height of Dutch trade.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.6,
    status: "Published",
    slug: "dutch-armenian-cemeteries",
    category: "Heritage",
    story: "In the 17th century, Surat was a bustling trade capital housing Dutch, English, and Armenian outposts. This cemetery contains spectacular mausoleums of Dutch merchants and barons, featuring grandiose pillars, dome ceilings, and historic carvings that rival miniature fortresses.",
    visitingHours: "08:00 AM - 05:00 PM",
    bestTimeToVisit: "November to February",
    nearbyAttractions: ["Katargam Gate", "Surat Castle"],
    suggestedItinerary: "Combine this with Surat Castle. Take a quiet guided stroll with a camera to admire European-Mughal hybrid monuments.",
    location: "Katargam Road, Surat"
  },
  {
    id: "dest-3",
    title: "Dumas Beach",
    description: "Famous for its dark, atmospheric sands, serene wind-carved pine forests, and delicious local tomato locho and sweet kulfi stalls.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.5,
    status: "Published",
    slug: "dumas-beach",
    category: "Nature",
    story: "Located 18 km outline of Surat along the Arabian Sea, Dumas Beach features iconic black sands rich with history and supernatural local folklore. Today it serves as the ultimate leisure destination for Surati families looking to escape to coastal breezes.",
    visitingHours: "06:00 AM - 08:00 PM",
    bestTimeToVisit: "Monsoon and Winter evenings",
    nearbyAttractions: ["Sardar Patel Museum", "Dumas Eco-Resort"],
    suggestedItinerary: "Drive down around 04:30 PM. Walk along the sand, try the hot locho and bhajiyas, and watch the tide cover the shoreline.",
    location: "Dumas, Surat District"
  },
  {
    id: "dest-4",
    title: "Gopi Talav & Urban Lake Park",
    description: "A premium urban park built around a historic 15th-century octagonal lake, featuring musical fountains, boating, and food pavilions.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"],
    rating: 4.7,
    status: "Published",
    slug: "gopi-talav",
    category: "Family Activities",
    story: "Gopi Talav was constructed in 1510 AD by Malik Gopi, an influential merchant governor of Surat. After extensive civic restoration in recent years, it has been transformed into a gorgeous green space with spectacular light and water shows at dusk.",
    visitingHours: "12:00 PM - 09:00 PM",
    bestTimeToVisit: "November to March (Evening slots)",
    nearbyAttractions: ["Chauta Bazar", "Dutch Cemetery"],
    suggestedItinerary: "Perfect for family leisure. Book a paddle boat, enjoy the musical water fountain at 07:15 PM, and enjoy local street food.",
    location: "Rustampura, Surat"
  }
];

export const INITIAL_SHOPPING: ShoppingGuide[] = [
  {
    id: "shop-1",
    title: "The Ultimate Saree & Bridal Trousseau Quest",
    description: "Expert guide to navigating Surat's world-famous textile hubs for premium bridal sarees, embroidered lehengas, and designer fabrics.",
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.9,
    status: "Published",
    slug: "bridal-saree-guide",
    category: "Bridal Shopping",
    priceRange: "₹₹₹",
    whatToBuy: "Tanchoi Silk, Georgette Lehengas with Zardozi Work, Banarasi brocades, and Gaji Silk sarees.",
    insiderTips: "Wholesale textile markets usually open around 10:30 AM and get very crowded by 2 PM. Avoid middlemen who promise massive discounts as they collect high commission fees from stores.",
    stores: [
      "Seematti Sarees & Bridal Emporium (Athwalines)",
      "Sabyasachi Partner Outlets (VIP Road)",
      "Anupam Creation (Ring Road)",
      "Shree Balaji Silk Mill Retail Outlet (Kinnary Cinema Road)"
    ],
    location: "Ring Road Textile District & Athwalines Retail Hub"
  },
  {
    id: "shop-2",
    title: "Surat Textile Market (STM)",
    description: "The gigantic beating heart of India's wholesale fashion and textile trade, spanning thousands of stores across multi-story complexes.",
    image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=1200&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=1200&auto=format&fit=crop"],
    rating: 4.8,
    status: "Published",
    slug: "surat-textile-market",
    category: "Textiles",
    priceRange: "₹",
    whatToBuy: "Bulk fabrics, synthetic silk sarees, salwar suit dress materials, laces, borders, and running dress fabric.",
    insiderTips: "Wear comfortable walking shoes. Bring cash as wholesale merchants prefer it. If buying in bulk, locate transporters directly behind the market buildings to ship directly to your home town.",
    stores: [
      "Radha Raman Textile Market Complex",
      "Millennium Market (Ring Road)",
      "Bombai House Wholesale Outlets",
      "World Trade Centre fabric floors"
    ],
    location: "Ring Road, Surat"
  },
  {
    id: "shop-3",
    title: "Katargam & Ghod Dod Diamond Boutiques",
    description: "Curated guide to exquisite handcheck solitaire diamonds and certified gold wedding jewelry in the Diamond Capital of the world.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop"],
    rating: 4.9,
    status: "Published",
    slug: "diamond-jewellery-guide",
    category: "Jewellery",
    priceRange: "₹₹₹",
    whatToBuy: "VVS-VS Certification grade Diamond Solitaire Necklaces, Custom Bridal Jadau Sets, Modern Diamond Band rings.",
    insiderTips: "Ask for IGI or GIA ratings certificates on every diamond purchased. Surat diamond crafters process 90% of the world's diamonds, ensuring you get the absolute best crafting rates.",
    stores: [
      "Kalamandir Jewellers (Ghod Dod Road)",
      "Charu Jewels (VIP Avenue)",
      "D. Khushalbhai Jewellers",
      "K.P. Sanghvi Retail Showroom"
    ],
    location: "Ghod Dod Road & Katargam Industrial Ring"
  }
];

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: "hotel-1",
    title: "Courtyard by Marriott Surat",
    description: "Luxurious oasis located on Surat's upscale Hazira Road, featuring stylish modern suites, a glorious infinity swimming pool, and pristine fine dining.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.9,
    status: "Published",
    slug: "courtyard-marriott-surat",
    category: "Luxury",
    pricePerNight: 8500,
    amenities: ["Infinity Pool", "High-speed WiFi", "Mouth-watering Cafe", "24/7 Room Service", "Premium Spa & Gym", "SITEX Airport Shuttle"],
    nearbyAttractions: ["Dumas Beach", "VR Surat Mall", "Tapi River Boardwalk"],
    contactInfo: "+91 261 414 5555 | reservations@marriottsurat.com",
    location: "Hazira Road, opposite Gavier Lake, Surat"
  },
  {
    id: "hotel-2",
    title: "The Gateway Hotel Athwalines",
    description: "Elegantly designed hotel overlooking the picturesque active waters of the Tapi River, perfect for luxury-conscious business or wedding travelers.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop"],
    rating: 4.8,
    status: "Published",
    slug: "gateway-hotel-athwalines",
    category: "Luxury",
    pricePerNight: 7200,
    amenities: ["Tapi View Balconies", "Outdoor Pool", "Traditional Gujarati Thali Restaurant", "Business Lounge"],
    nearbyAttractions: ["Dutch Cemeteries", "Science Centre Surat", "Surat Fort"],
    contactInfo: "+91 261 669 7000 | gateway.surat@tajhotels.com",
    location: "Ambika Niketan Temple Road, Athwalines, Surat"
  },
  {
    id: "hotel-3",
    title: "Lords Plaza Surat",
    description: "Highly rated, central hotel offering exceptionally clean accommodation and prompt hospitality right next to the Surat Railway Station.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop"],
    rating: 4.2,
    status: "Published",
    slug: "lords-plaza-surat",
    category: "Mid-range",
    pricePerNight: 3500,
    amenities: ["Free Airport Shuttle", "In-house Multi-cuisine Restaurant", "Speedy WiFi", "Mini-bar"],
    nearbyAttractions: ["Surat Castle", "Chauta Bazar", "STM Textile Market Grid"],
    contactInfo: "+91 261 241 8300 | info@lordsplazasurat.com",
    location: "Delhi Gate, Ring Road, Surat"
  }
];

export const INITIAL_TOURS: Tour[] = [
  {
    id: "tour-1",
    title: "Official Surat Heritage & History Walk",
    description: "Explore five centuries of global merchant history on foot, visiting Surat Fort, European tombs, and bustling heritage bazaar alleys.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4.9,
    status: "Published",
    slug: "surat-heritage-walk",
    pricing: 1500,
    duration: "4 Hours (Morning)",
    itinerary: [
      "07:30 AM - Meet-up and traditional tea briefing at Chowk Bazar.",
      "08:00 AM - Complete guided explorer walk inside Surat Castle.",
      "09:15 AM - Walk through narrow historical lanes of Chauta Bazar and ancient temple complex relics.",
      "10:30 AM - Explore majestic Dutch & Armenian mausoleums and tombs.",
      "11:30 AM - Wrap up with refreshing sweet cold Ghari and savory Locho tastings."
    ]
  },
  {
    id: "tour-2",
    title: "Curated Silk & Textile Industrial Tour",
    description: "A private behind-the-scenes journey into Surat's massive spinning mills, digital embroidery units, and historic handloom clusters.",
    image: "https://images.unsplash.com/photo-1524295981977-62f3a4794939?q=80&w=1200&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1524295981977-62f3a4794939?q=80&w=1200&auto=format&fit=crop"],
    rating: 4.8,
    status: "Published",
    slug: "textile-industrial-tour",
    pricing: 3000,
    duration: "6 Hours",
    itinerary: [
      "09:30 AM - Hotel pickup and introductory briefing about Surat fabric history.",
      "10:15 AM - Guided factory-floor visit inside an active power-loom and silk spinning mill.",
      "11:45 AM - Learn the ancient art of hand dyeing, tie-and-dye patterns, and modern digital block printing.",
      "01:15 PM - Traditional designer lunch with industry guides.",
      "02:30 PM - VIP direct-access entry to wholesale textile market showrooms with customized shopping help."
    ]
  }
];

export const INITIAL_FOOD: FoodSpot[] = [
  {
    id: "food-1",
    title: "Jani Locho Center",
    description: "The absolute gold standard for Surati Locho - a melt-in-mouth savory steamed chickpea snack garnished with butter, sev, and special spice blends.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    status: "Published",
    slug: "jani-locho-center",
    category: "Street Food",
    mustTry: "Butter Locho, Schezwan Locho, and Garlic Locho with sweet mint chutney.",
    priceLevel: "₹",
    location: "Chowk Bazar & VIP Road Outlets",
    timings: "07:00 AM - 01:30 PM, 04:30 PM - 09:30 PM"
  },
  {
    id: "food-2",
    title: "Kansar Gujarati Thali",
    description: "An authentic, bottomless royal Gujarati Thali dining experience with deep ghee-drenched rotis, diverse curries, and rich traditional sweets.",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    status: "Published",
    slug: "kansar-gujarati-thali",
    category: "Fine Dining",
    mustTry: "Surati Undhiyu, Dhokli, Shrikhand, and Jalebi with pure ghee.",
    priceLevel: "₹₹",
    location: "Ring Road, opposite Reshamwala Market, Surat",
    timings: "11:30 AM - 03:30 PM, 07:00 PM - 11:00 PM"
  },
  {
    id: "food-3",
    title: "Jamnadas Ghari Wala",
    description: "Pioneers of Ghari, a legendary traditional Surati dessert made with fresh cardamo-flavored mawa, heavy dry fruit, wrapped in pure ghee.",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    status: "Published",
    slug: "jamnadas-ghari-wala",
    category: "Local Favorites",
    mustTry: "Kesar Pistachio Ghari and sugar-free almond ghari.",
    priceLevel: "₹₹",
    location: "Chauta Bazar, Surat",
    timings: "09:00 AM - 10:00 PM"
  }
];

export const INITIAL_EVENTS: LocalEvent[] = [
  {
    id: "event-1",
    title: "SITEX: Surat International Textile Expo",
    description: "The global commercial showcase of cutting-edge machineries, luxury bridal loom concepts, silk advances, and embroidery craft trends.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    status: "Published",
    slug: "sitex-textile-expo",
    category: "Exhibitions",
    date: "January 14 - 17, 2027",
    venue: "SIECC, Sarsana, Surat"
  },
  {
    id: "event-2",
    title: "Royal Navratri Garba Utsav",
    description: "Experience 9 nights of synchronized multi-ring garba folk dances with thousands of dancers adorned in sparkling traditional mirror-work clothing.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    status: "Published",
    slug: "royal-navratri-garba",
    category: "Festivals",
    date: "October 10 - 18, 2026",
    venue: "Indoor Stadium Athwalines & Sarsana Dome Grounds, Surat"
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Insider Guide to Buying Wedding Sarees in Surat's Wholesale Markets",
    description: "A comprehensive local expert walk-through explaining saree fabrics, merchant navigation, price bars, and preventing common tourist shopping mistakes.",
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    status: "Published",
    slug: "wedding-saree-market-guide",
    category: "Shopping Guides",
    content: "Surat satisfies nearly 40% of India's wholesale fashion textile needs, making it a dream wedding destination. But walking in without a direct strategy is highly chaotic. First, understand the central textile hotspots. Ring road holds the primary wholesale malls containing upwards of 20,000 offices. If you want bridal couture lehengas or curated designer silk, prioritize Athwalines or VIP Road. Do not hire auto drivers who claim to know secret mill outlets; they operate heavily on retail commission premiums. Focus on registered landmark stores like Anupam or Kalamandir. Make physical swatches checks and always ask for material purity certification.",
    author: "Radhika Parekh (Fashion Director)",
    publishedAt: "2026-05-15"
  },
  {
    id: "blog-2",
    title: "Surati Street Food Chronicles: Beyond the Standard Locho",
    description: "Explore the deep culinary history of Surat's distinct snacks, from sizzling spicy Katargam Locho to refreshing coco drinks.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    status: "Published",
    slug: "surati-street-food-bible",
    category: "Food Trails",
    content: "Suratis are legendary food lovers, leading to the famous Gujarati proverb 'Kashi nu maran ane Surat nu jaman' (To die in Kashi, to feast in Surat). Locho remains the supreme morning breakfast, steamed chickpea mixture crafted from custom spices. But don't sleep on Ghari, or traditional Undhiyu - an exceptionally tasty complex winter vegetable stew of sweet potatoes, tiny green beans, and spiced fenugreek dumplings that takes days of local family prep work.",
    author: "Karan Desai (Culinary Historian)",
    publishedAt: "2026-06-12"
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    itemId: "tour-1",
    itemTitle: "Official Surat Heritage & History Walk",
    itemType: "tour",
    name: "Aarav Sharma",
    email: "aarav@gmail.com",
    phone: "+91 98765 43210",
    message: "Interested in booking a heritage walk for 4 family members visiting during SITEX next week. Do you have specialized English guides?",
    date: "2026-06-15",
    status: "New"
  },
  {
    id: "inq-2",
    itemId: "hotel-1",
    itemTitle: "Courtyard by Marriott Surat",
    itemType: "hotel",
    name: "Meera Patel",
    email: "meera.patel@yahoo.com",
    phone: "+91 81234 56789",
    message: "Seeking group booking rates for 15 rooms during my daughter's wedding trousseau shopping trip in mid-October.",
    date: "2026-06-14",
    status: "Contacted"
  }
];

export const INITIAL_PARTNERS: PartnerRequest[] = [
  {
    id: "part-1",
    businessName: "Radhe Shyam Traditional Sarees",
    businessType: "shop",
    contactEmail: "contact@radheshyamsilk.com",
    requestedUpdate: "Add our wholesale unit under STM category. We carry authentic Tanchoi and Patola fabrics starting ₹3000 onwards.",
    status: "Pending Approval",
    date: "2026-06-15"
  },
  {
    id: "part-2",
    businessName: "Laxmi Sweets & Ghari Boutique",
    businessType: "restaurant",
    contactEmail: "laxmisweets@surat.in",
    requestedUpdate: "Update shop address to: Laxmi Tower, Bhagal Chowk, Surat. Add sweet sugar-free variants in must-try section.",
    status: "Approved",
    date: "2026-06-13"
  }
];

export const INITIAL_AUDIT: AuditLog[] = [
  {
    id: "log-1",
    user: "itxghost111@gmail.com",
    role: "Super Admin",
    action: "Platform Initialized",
    targetType: "System Setup",
    targetName: "Surat Insider V1 Engine",
    timestamp: "2026-06-16T11:00:00"
  },
  {
    id: "log-2",
    user: "itxghost111@gmail.com",
    role: "Super Admin",
    action: "Approved Partner Listing",
    targetType: "Partner Request",
    targetName: "Laxmi Sweets & Ghari Boutique",
    timestamp: "2026-06-16T11:05:00"
  }
];

export const INITIAL_MONETIZATION: MonetizationSetting = {
  featuredListingFee: 2500,
  sponsoredAdCost: 150,
  premiumGuideAccessFee: 799,
  isFeaturedEnabled: true,
  isSponsoredEnabled: true,
  isPremiumEnabled: false
};
