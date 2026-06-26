import { DESTINATIONS_DATA } from './destinations';
import { FOOD_DATA } from './food';
import { SHOPPING_DATA } from './shopping';
import { BRIDAL_BOUTIQUES_DATA } from './wedding';
import { TOURS_DATA, EVENTS_DATA } from './weekend';
import { HOTELS_DATA } from './hotels';
import { BaseItem } from '../types';

export type DiscoveryCategory = 
  | 'Place' 
  | 'Restaurant' 
  | 'Hotel' 
  | 'Shopping' 
  | 'Experience' 
  | 'Event';

export interface DiscoveryItem extends BaseItem {
  type: DiscoveryCategory;
  location?: string;
  tags: string[];
  coords?: { x: number, y: number }; // Relative coordinates for the supportive map (0-100)
}

// Helper to convert existing data to DiscoveryItem format
const mapToDiscovery = (data: any[], type: DiscoveryCategory): DiscoveryItem[] => {
  return data.map((item, idx) => ({
    ...item,
    type,
    tags: [type, ...(item.category ? [item.category] : [])],
    // Generate deterministic pseudo-coordinates if not present
    coords: {
      x: 20 + (Math.sin(idx * 1.5) * 30 + 30),
      y: 20 + (Math.cos(idx * 2.1) * 30 + 30)
    }
  }));
};

export const UNIFIED_DISCOVERY_DATA: DiscoveryItem[] = [
  ...mapToDiscovery(DESTINATIONS_DATA, 'Place'),
  ...mapToDiscovery(FOOD_DATA, 'Restaurant'),
  ...mapToDiscovery(HOTELS_DATA, 'Hotel'),
  ...mapToDiscovery(SHOPPING_DATA, 'Shopping'),
  ...mapToDiscovery(BRIDAL_BOUTIQUES_DATA, 'Shopping'),
  ...mapToDiscovery(TOURS_DATA, 'Experience'),
  ...mapToDiscovery(EVENTS_DATA, 'Event'),
];

export interface DiscoveryCollection {
  id: string;
  title: string;
  description: string;
  image: string;
  itemIds: string[];
}

export const DISCOVERY_COLLECTIONS: DiscoveryCollection[] = [
  {
    id: 'editors-choice',
    title: "Editor's Choice",
    description: "The absolute essentials for any Surti pilgrimage.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=800&auto=format&fit=crop",
    itemIds: ['dest-1', 'food-1', 'shop-1']
  },
  {
    id: 'hidden-corners',
    title: "Hidden Corners",
    description: "Quiet spots and ancient alleys known only to locals.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=800&auto=format&fit=crop",
    itemIds: ['dest-3', 'food-3', 'tour-2']
  },
  {
    id: 'luxury-exp',
    title: "Luxury Experiences",
    description: "High-end shopping, fine dining, and gold-standard stays.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
    itemIds: ['hotel-1', 'shop-bridal-1', 'food-fine-1']
  }
];

export const SMART_SUGGESTIONS = [
  {
    title: "Perfect First Visit",
    query: "castle gopi locho",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Luxury Wedding Route",
    query: "bridal diamond gold",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Street Food Evening",
    query: "locho khaman sev",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=400&auto=format&fit=crop"
  },
  {
    title: "Sunset & Sea",
    query: "dumas beach coastal",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop"
  }
];
