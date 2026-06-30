import React, { createContext, useContext, useState, useMemo } from "react";
import { WebsiteImageConfig } from "../types";

interface WebsiteImagesContextType {
  websiteImages: WebsiteImageConfig[];
  imageMap: Record<string, string>;
  defaultMap: Record<string, string>;
  refreshImages: () => void;
}

const WebsiteImagesContext = createContext<WebsiteImagesContextType | undefined>(undefined);

export function WebsiteImagesProvider({ 
  children, 
  websiteImages = [], 
  refreshImages = () => {} 
}: { 
  children: React.ReactNode; 
  websiteImages?: WebsiteImageConfig[]; 
  refreshImages?: () => void; 
}) {
  
  // Memoize fast lookups
  const imageMap = useMemo(() => {
    const map: Record<string, string> = {};
    websiteImages.forEach((img) => {
      map[img.id] = img.url;
    });
    return map;
  }, [websiteImages]);

  const defaultMap = useMemo(() => {
    const map: Record<string, string> = {};
    websiteImages.forEach((img) => {
      map[img.id] = img.defaultUrl;
    });
    return map;
  }, [websiteImages]);

  return (
    <WebsiteImagesContext.Provider value={{ websiteImages, imageMap, defaultMap, refreshImages }}>
      {children}
    </WebsiteImagesContext.Provider>
  );
}

export function useWebsiteImages() {
  const context = useContext(WebsiteImagesContext);
  if (!context) {
    // Return a safe fallback if context is not fully loaded/provided
    return {
      websiteImages: [],
      imageMap: {} as Record<string, string>,
      defaultMap: {} as Record<string, string>,
      refreshImages: () => {}
    };
  }
  return context;
}

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageId?: string; // UIMS mapped ID
  src?: string; // Standard source fallback
  alt?: string;
  className?: string;
  fallbackType?: "destination" | "shopping" | "hotel" | "tour" | "food" | "event" | "blog" | "generic";
}

export function SafeImage({ 
  imageId, 
  src, 
  alt, 
  className, 
  fallbackType = "generic", 
  ...props 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const { imageMap, defaultMap } = useWebsiteImages();

  // Map of fallback types to our gorgeous local SVGs
  const fallbackMap: Record<string, string> = {
    destination: "/images/surat_castle.svg",
    shopping: "/images/textile_guide.svg",
    hotel: "/images/hotel.svg",
    tour: "/images/tour.svg",
    food: "/images/food.svg",
    event: "/images/event.svg",
    blog: "/images/blog.svg",
    generic: "/images/generic.svg",
  };

  const getResolvedSrc = () => {
    if (imageId) {
      // Resolve through UIMS registry
      const mappedUrl = imageMap[imageId];
      if (mappedUrl && mappedUrl.trim() !== "") {
        return mappedUrl;
      }
      // Revert to system default URL
      const defaultUrl = defaultMap[imageId];
      if (defaultUrl && defaultUrl.trim() !== "") {
        return defaultUrl;
      }
    }
    return src;
  };

  const getFallback = () => {
    const lowerAlt = (alt || "").toLowerCase();
    
    // Exact matching for specific spots
    if (lowerAlt.includes("castle") || lowerAlt.includes("fort")) return "/images/surat_castle.svg";
    if (lowerAlt.includes("cemetery") || lowerAlt.includes("cemeteries") || lowerAlt.includes("garden") || lowerAlt.includes("dutch")) return "/images/cemeteries.svg";
    if (lowerAlt.includes("beach") || lowerAlt.includes("dumas") || lowerAlt.includes("suvali")) return "/images/dumas_beach.svg";
    if (lowerAlt.includes("talav") || lowerAlt.includes("lake") || lowerAlt.includes("gopi")) return "/images/gopi_talav.svg";
    if (lowerAlt.includes("saree") || lowerAlt.includes("bridal") || lowerAlt.includes("trousseau") || lowerAlt.includes("suit")) return "/images/textile_guide.svg";
    if (lowerAlt.includes("market") || lowerAlt.includes("textile") || lowerAlt.includes("stm") || lowerAlt.includes("mall") || lowerAlt.includes("venenzino")) return "/images/textile_market.svg";
    if (lowerAlt.includes("diamond") || lowerAlt.includes("boutique") || lowerAlt.includes("jewellery") || lowerAlt.includes("solitaire")) return "/images/diamonds.svg";
    if (lowerAlt.includes("hotel") || lowerAlt.includes("marriott") || lowerAlt.includes("lords") || lowerAlt.includes("gateway") || lowerAlt.includes("stay") || lowerAlt.includes("room")) return "/images/hotel.svg";
    if (lowerAlt.includes("locho") || lowerAlt.includes("ghari") || lowerAlt.includes("undhiyu") || lowerAlt.includes("food") || lowerAlt.includes("dine") || lowerAlt.includes("restaurant") || lowerAlt.includes("thali")) return "/images/food.svg";
    if (lowerAlt.includes("expo") || lowerAlt.includes("sitex") || lowerAlt.includes("garba") || lowerAlt.includes("festival") || lowerAlt.includes("event")) return "/images/event.svg";
    
    // Fallback to type matching
    return fallbackMap[fallbackType] || "/images/generic.svg";
  };

  const activeSrc = getResolvedSrc();

  return (
    <img
      src={hasError || !activeSrc ? getFallback() : activeSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => {
        if (!hasError) setHasError(true);
      }}
      {...props}
    />
  );
}
