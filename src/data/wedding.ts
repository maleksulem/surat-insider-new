import { CuratedExperience } from "../types";

export interface BridalHighlight {
  title: string;
  desc: string;
  place: string;
}

export const BRIDAL_HIGHLIGHTS: BridalHighlight[] = [
  {
    title: "Salabatpura Handlooms",
    desc: "Generational weavers producing authentic heavy weaves, specialized in intricate pattern design and custom bridal weights.",
    place: "Salabatpura Textile Hub"
  },
  {
    title: "Gold-Tethered Gaji Silk",
    desc: "Pure mulberry silk with dense, mirror-like satin faces, tailored exclusively with traditional royal crimson brocade weaves.",
    place: "Navsari Loom Estates"
  },
  {
    title: "Genuine 24K Silver Zari Wire",
    desc: "Precious gold-plated silver wiring drawn to sub-human hair thinness, handwoven into classical motifs that never tarnish.",
    place: "Gopipura Guild Workshops"
  }
];

export const BRIDAL_BOUTIQUES_DATA: CuratedExperience[] = [
  {
    id: "boutique-1",
    slug: "imperial-gaji-silk",
    title: "Imperial Gaji Silk Weavers Guild",
    category: "Bridal Shopping",
    shortDescription: "A centuries-old artisan guild specializing in rich crimson satin-silk and genuine gold-plated silver zari handloom sarees.",
    fullDescription: "Representing generations of weaving excellence, the Imperial Gaji Silk Weavers Guild is highly rated for preserving ancient handloom patterns. Their master craftsmen weave pure mulberry silk into thick satin faces, decorated with traditional royal crimson brocade borders.",
    location: "Salabatpura Textile Hub, Surat",
    timings: "10:30 AM - 08:30 PM (Closed on Sundays)",
    bestTimeToVisit: "November to February",
    estimatedDuration: "2 Hours",
    priceRange: "₹₹₹₹ (Sarees from ₹15,000 to ₹1,50,000)",
    highlights: [
      "100% authentic handloom heavy-satin Gaji silk fabrics",
      "Direct weaver-to-buyer transactions bypassing design houses",
      "Custom dye cards and traditional hand-made zari motif selections",
      "Certified Silk-Mark quality cards with every luxury drape"
    ],
    tips: [
      "Inspect the fabric reverse side; real hand-loom silk displays minor weaver knots that prove authenticity.",
      "Bring your designer reference charts if you are ordering a custom-patterned wedding saree.",
      "Always request a demonstration of the tarnish-free pure silver zari burn test."
    ],
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop"
    ],
    inquiryType: "Royal Loom Sourcing",
    whatsappMessage: "Hi Surat Insider! I am looking to consult the Imperial Gaji Silk Weavers Guild for my custom bridal saree.",
    rating: 4.9,
    status: "Published"
  },
  {
    id: "boutique-2",
    slug: "gopipura-zardosi",
    title: "Gopipura Zardosi Mastercraft",
    category: "Designer Wear",
    shortDescription: "A highly specialized atelier crafting exquisite, custom royal wedding lehengas using precious metallic gold and silver threads.",
    fullDescription: "Gopipura Zardosi Mastercraft houses master embroiderers whose families have dressed royal courts for centuries. Every lehenga is an heirloom artwork, meticulously hand-stitched with authentic gold-plated silver wires, pearls, and precious beads over heavy silk velvets.",
    location: "Artisan Workshops, Gopipura, Surat",
    timings: "11:00 AM - 07:00 PM (Prior appointments mandatory)",
    bestTimeToVisit: "By advance booking",
    estimatedDuration: "3 Hours",
    priceRange: "₹₹₹₹ (Lehengas from ₹85,000 onwards)",
    highlights: [
      "Extremely rare Dabka and Zardosi embroidery using pure silver wires",
      "Fully personalized wedding dress consultation with master embroiderers",
      "Heirloom-grade heavy velvets and luxury pure georgettes",
      "Complete design catalogs spanning Mughal and heritage motifs"
    ],
    tips: [
      "Custom zardosi hand-embroidery is extremely slow; place orders at least 4-6 months before the wedding date.",
      "Ask the master craftsman to explain the difference between machine-stitched and authentic wire handwork.",
      "Request a complimentary matching embroidered bag or groom's stole with your order."
    ],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop"
    ],
    inquiryType: "Custom Embroidery Sourcing",
    whatsappMessage: "Hi! I am seeking to schedule a bridal embroidery consultation at Gopipura Zardosi Mastercraft.",
    rating: 4.8,
    status: "Published"
  },
  {
    id: "boutique-3",
    slug: "kalamandir-jewels",
    title: "Kalamandir Bridal Jewellery House",
    category: "Jewellery",
    shortDescription: "A certified premier heritage jewelry house specializing in certified solitaires, antique Jadau, and royal gold sets.",
    fullDescription: "Kalamandir is synonymous with trust and elegance in South Gujarat. For decades, they have crafted exquisite bridal jewelry collections, showcasing Surat's world-famous precision diamond cuts, pure 22K hallmarked gold temple sets, and traditional Rajasthani Kundan-Polki work.",
    location: "Ghod Dod Road, Opp. Lal Bungalow, Surat",
    timings: "11:00 AM - 09:00 PM",
    bestTimeToVisit: "Afternoon hours to avoid the evening rush",
    estimatedDuration: "2 Hours",
    priceRange: "₹₹₹₹ (Gold & Diamond Jewellery rates apply)",
    highlights: [
      "Surat's finest certified solitaires and custom diamond settings",
      "Exquisite Rajasthani Jadau and Polki (uncut diamond) sets",
      "Secure private viewing suites for elite bridal parties",
      "100% BIS Hallmarked Gold and certified conflict-free diamonds"
    ],
    tips: [
      "Book their VIP suite for a relaxed, private family jewelry matching session.",
      "Bring the bride's wedding lehenga or saree fabric to match the gold hues under specialized lighting.",
      "Ask for their buy-back and exchange policy certificates on all diamond purchases."
    ],
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop"
    ],
    inquiryType: "Jewellery Consultation",
    whatsappMessage: "Hello! We would like to request an exclusive viewing slot for bridal jewelry at Kalamandir Jewellery House.",
    rating: 4.9,
    status: "Published"
  },
  {
    id: "venue-1",
    slug: "avadh-utopia",
    title: "Avadh Utopia Surat",
    category: "Wedding Venues",
    shortDescription: "A massive, ultra-luxurious 5-star club resort featuring grand imperial lawns, majestic banquet halls, and royal suites.",
    fullDescription: "Avadh Utopia is a state-of-the-art luxury lifestyle club and resort, celebrated as Surat's premier wedding destination. Designed with majestic pillars, gorgeous water cascades, and massive grand ballrooms, it easily hosts thousands of wedding guests in high luxury.",
    location: "Dumas Road, near Airport, Surat",
    timings: "24 Hours (For stay) • Banquet slots: Flexible",
    bestTimeToVisit: "November to March (Winter weddings)",
    estimatedDuration: "Flexible (Multi-day celebrations)",
    priceRange: "₹₹₹₹ (Premium venue rental rates)",
    highlights: [
      "Majestic royal banqueting halls with exquisite sound and light arrays",
      "Vast outdoor lawns holding over 2,000 guests in supreme luxury",
      "Premium guest rooms and elite villas for bridal parties",
      "Superb customized catering services presenting world cuisines"
    ],
    tips: [
      "Book at least 8 to 12 months in advance for auspicious marriage dates.",
      "Coordinate with their in-house decoration team to utilize their grand fountain backdrop.",
      "The location is extremely close to the airport, highly convenient for out-of-town guests."
    ],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop"
    ],
    inquiryType: "Royal Venue Booking",
    whatsappMessage: "Hi Surat Insider! I am looking for pricing and availability at Avadh Utopia Surat for a multi-day wedding celebration.",
    rating: 4.8,
    status: "Published"
  },
  {
    id: "venue-2",
    slug: "amaara-lawns",
    title: "Amaara Royal Lawn Estates",
    category: "Wedding Venues",
    shortDescription: "A gorgeous, rustic outdoor luxury wedding estate surrounded by green mango groves and grand water installations.",
    fullDescription: "Amaara Royal Lawn Estates is a premium open-air wedding garden, popular for dream weddings under the starry skies. It features beautifully manicured lawns, natural floral arches, wooden rustic gazebos, and an elegant palace-style entryway that provides a spectacular backdrop for photography.",
    location: "Dabhari Road, near Dumas Beach, Surat",
    timings: "04:00 PM - 01:00 AM (For wedding events)",
    bestTimeToVisit: "Winter months (November to February)",
    estimatedDuration: "6 Hours",
    priceRange: "₹₹₹ - ₹₹₹₹ (Mid-range to premium venue rental)",
    highlights: [
      "Stunning green open-air layout surrounded by mango orchards",
      "Palace-style royal facade entrance gate for grand bridal entries",
      "Dedicated multi-tier designer lighting setups installed on the trees",
      "Scenic rustic brick pathways and comfortable spacious bridal cabins"
    ],
    tips: [
      "Excellent coastal breeze in the evenings; plan open-sky dinner buffets.",
      "Arrange guest shuttle transport from Ghod Dod Road as the location is 20 minutes outside the city core.",
      "Request their firework allowance policy for the bridal entrance moment."
    ],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
    ],
    inquiryType: "Royal Venue Booking",
    whatsappMessage: "Hi Surat Insider! I am interested in booking Amaara Royal Lawn Estates for an upcoming evening wedding ceremony.",
    rating: 4.7,
    status: "Published"
  }
];
