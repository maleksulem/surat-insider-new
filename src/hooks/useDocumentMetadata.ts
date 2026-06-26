import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface MetadataProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export function useDocumentMetadata({
  title,
  description,
  keywords = "Surat, Surat Insider, Surat Tourism, Surat Shopping, Surat Food, Surat Saree, Surat Diamonds",
  ogType = "website",
  ogImage = "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop",
  schema
}: MetadataProps) {
  const location = useLocation();
  const currentUrl = `https://suratinsider.com${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = `${title} • Surat Insider`;

    // 2. Helper to set/create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 3. Helper to set/create link tags (like canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Set standard meta tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);

    // Set Open Graph tags
    setMetaTag("property", "og:title", `${title} • Surat Insider`);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:site_name", "Surat Insider");

    // Set Twitter cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", `${title} • Surat Insider`);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // Set Canonical URL
    setLinkTag("canonical", currentUrl);

    // 4. Update JSON-LD Structured Data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"].dynamic-seo-schema');
    existingScripts.forEach((s) => s.remove());

    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.className = "dynamic-seo-schema";
      
      const finalSchema = Array.isArray(schema) ? schema : [schema];
      
      const breadcrumbItems = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://suratinsider.com/"
        }
      ];
      if (location.pathname !== "/") {
        const pathSegment = location.pathname.replace("/", "");
        const pathLabel = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
        breadcrumbItems.push({
          "@type": "ListItem",
          "position": 2,
          "name": pathLabel,
          "item": currentUrl
        });
      }
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
      };

      script.text = JSON.stringify([...finalSchema, breadcrumbSchema]);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogType, ogImage, schema, location.pathname, currentUrl]);
}
