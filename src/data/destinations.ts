import { Destination } from "../types";

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: "dest-1",
    slug: "surat-castle",
    title: "The Imperial Surat Castle",
    description: "A 16th-century fortification standing as a quiet monument to Surat's maritime dominance.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    status: "Published",
    category: "Heritage",
    story: "Built in 1540 by Safi Agha, this castle was designed to protect the port from Portuguese raids. It features robust bastions and hidden weapon caches.",
    visitingHours: "10:00 AM - 06:00 PM",
    bestTimeToVisit: "November to February",
    nearbyAttractions: ["Chowk Bazar", "Hope Bridge"],
    suggestedItinerary: "Morning castle walk followed by authentic locho breakfast at Chowk.",
    location: "Chowk Bazar, Surat"
  },
  {
    id: "dest-2",
    slug: "dumas-beach",
    title: "Dumas Coastal Sanctuary",
    description: "Famed for its black volcanic sands and legendary nocturnal mist.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    status: "Published",
    category: "Nature",
    story: "The black sands of Dumas are a geological rarity in India. The beach is a hub for evening leisure and coastal street food.",
    visitingHours: "Open 24 Hours (Best at sunset)",
    bestTimeToVisit: "Evening (05:00 PM - 07:30 PM)",
    nearbyAttractions: ["Sarsana Dome", "VR Mall"],
    suggestedItinerary: "Afternoon shopping at VR Mall followed by a sunset drive to Dumas.",
    location: "Dumas Road, Surat"
  },
  {
    id: "dest-3",
    slug: "gopi-talav",
    title: "Gopi Talav Urban Lake",
    description: "An ancient octagonal lake restored into a vibrant urban park and cultural hub.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    status: "Published",
    category: "Heritage",
    story: "Built by Malik Gopi, the governor of Surat in 1510, this lake once supplied the city's water and hosted global merchant navies.",
    visitingHours: "01:00 PM - 10:00 PM",
    bestTimeToVisit: "Night (07:00 PM onwards for fountain shows)",
    nearbyAttractions: ["Zampa Bazar", "Heritage Walk"],
    suggestedItinerary: "Evening walk around the lake followed by the musical laser show.",
    location: "Navpura, Surat"
  }
];
