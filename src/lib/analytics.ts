/**
 * Production-Ready Analytics & Lead Tracking Hub
 * Integrates Google Analytics 4 (GA4) and Microsoft Clarity.
 */

// Global window extensions for GA4 and Clarity
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = "G-E7XQY8G9WZ"; // Default GA4 Id or configurable
const CLARITY_PROJECT_ID = "p3f8x5f3q1"; // Default Clarity Id or configurable

/**
 * Dynamically boots GA4 and Microsoft Clarity script layers
 */
export function initAnalytics() {
  if (typeof window === "undefined") return;

  // 1. Google Analytics 4 Bootstrapper
  try {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false, // Managed manually via route-based hooks
      cookie_flags: "max-age=7200;Secure;SameSite=None"
    });
    console.log(`[Analytics] GA4 successfully initialized with ID: ${GA_MEASUREMENT_ID}`);
  } catch (error) {
    console.error("[Analytics] GA4 script insertion failed:", error);
  }

  // 2. Microsoft Clarity Bootstrapper
  try {
    const clarityScript = document.createElement("script");
    clarityScript.type = "text/javascript";
    clarityScript.text = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
    `;
    document.head.appendChild(clarityScript);
    console.log(`[Analytics] Microsoft Clarity successfully initialized with ID: ${CLARITY_PROJECT_ID}`);
  } catch (error) {
    console.error("[Analytics] Clarity script insertion failed:", error);
  }
}

/**
 * Tracks individual page views
 */
export function trackPageVisit(path: string, title: string) {
  if (typeof window === "undefined") return;

  console.log(`%c[Analytics • Page View] ${title} (${path})`, "color: #dfcba5; font-weight: bold;");

  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title,
      page_location: window.location.href
    });
  }

  if (window.clarity) {
    window.clarity("set", "page_title", title);
  }
}

/**
 * Tracks WhatsApp click actions (The principal conversion endpoint)
 */
export function trackWhatsAppClick(itemName: string, category: string, context?: any) {
  if (typeof window === "undefined") return;

  console.log(`%c[Analytics • WhatsApp Conversion] Clicked: "${itemName}" in category "${category}"`, "color: #10b981; font-weight: bold;");

  if (window.gtag) {
    window.gtag("event", "whatsapp_click", {
      item_name: itemName,
      item_category: category,
      timestamp: new Date().toISOString(),
      ...context
    });
  }

  if (window.clarity) {
    window.clarity("event", "whatsapp_conversion", {
      item: itemName,
      category: category
    });
  }
}

/**
 * Tracks Search queries and count results to optimize guide matching
 */
export function trackSearch(query: string, resultsCount: number) {
  if (typeof window === "undefined" || !query) return;

  console.log(`%c[Analytics • Search Event] Query: "${query}" | Results: ${resultsCount}`, "color: #38bdf8;");

  if (window.gtag) {
    window.gtag("event", "search", {
      search_term: query,
      results_count: resultsCount
    });
  }
}

/**
 * Tracks user inquiry submissions (leads)
 */
export function trackInquirySubmitted(itemTitle: string, itemType: string, details: any) {
  if (typeof window === "undefined") return;

  console.log(`%c[Analytics • Inquiry Submitted] item: "${itemTitle}" | type: "${itemType}"`, "color: #e11d48; font-weight: bold;");

  if (window.gtag) {
    window.gtag("event", "inquiry_submission", {
      item_title: itemTitle,
      item_type: itemType,
      lead_name: details.name || "Anonymous",
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Tracks custom itinerary generation events
 */
export function trackItineraryGenerated(type: string, details: any) {
  if (typeof window === "undefined") return;

  console.log(`%c[Analytics • Itinerary Generated] type: "${type}"`, "color: #c5a059;");

  if (window.gtag) {
    window.gtag("event", "itinerary_generation", {
      itinerary_type: type,
      interests: details.interests || "General",
      duration_hours: details.hoursCount || "48"
    });
  }
}
