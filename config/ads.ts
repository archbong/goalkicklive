// Ad Configuration for Goalkick Live
// This file contains all ad-related configuration for the website

// Environment variables for ads
export const AD_CONFIG = {
  // Google AdSense Configuration
  GOOGLE_ADSENSE: {
    CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || "ca-pub-xxxxxxxxxxxxxxx",
    ENABLED: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ENABLED === "true",
    TEST_MODE: false, // Will be set dynamically based on environment
  },

  // Global Ad Settings
  GLOBAL: {
    ENABLED: process.env.NEXT_PUBLIC_ADS_ENABLED !== "false",
    MAX_ADS_PER_PAGE: 6,
    MIN_CONTENT_HEIGHT: 500, // Minimum content height before showing ads (px)
    AD_REFRESH_INTERVAL: 30000, // 30 seconds
  },

  // Ad Blocker Detection
  AD_BLOCKER: {
    DETECTION_ENABLED: true,
    MESSAGE_ENABLED: true,
    MESSAGE_TEXT:
      "Please consider disabling your ad blocker to support our free service.",
  },

  // Privacy & Compliance
  COMPLIANCE: {
    GDPR_ENABLED: true,
    CCPA_ENABLED: true,
    COOKIE_CONSENT_REQUIRED: true,
  },
} as const;

// Ad placements for different page types
export const AD_PLACEMENTS = {
  HOME: {
    enabled: true,
    placements: [
      { id: "home-top", position: "top", format: "leaderboard", priority: 1 },
      {
        id: "home-hero-after",
        position: "between-content",
        format: "rectangle",
        priority: 2,
      },
      {
        id: "home-features-after",
        position: "between-content",
        format: "rectangle",
        priority: 3,
      },
      {
        id: "home-cta-after",
        position: "between-content",
        format: "rectangle",
        priority: 4,
      },
      {
        id: "home-bottom",
        position: "bottom",
        format: "leaderboard",
        priority: 5,
      },
    ],
  },

  DOWNLOADS: {
    enabled: true,
    placements: [
      {
        id: "downloads-top",
        position: "top",
        format: "leaderboard",
        priority: 1,
      },
      {
        id: "downloads-preview-after",
        position: "between-content",
        format: "rectangle",
        priority: 2,
      },
      {
        id: "downloads-features-after",
        position: "between-content",
        format: "rectangle",
        priority: 3,
      },
      {
        id: "downloads-requirements-after",
        position: "between-content",
        format: "rectangle",
        priority: 4,
      },
      {
        id: "downloads-bottom",
        position: "bottom",
        format: "leaderboard",
        priority: 5,
      },
    ],
  },

  ABOUT: {
    enabled: true,
    placements: [
      { id: "about-top", position: "top", format: "leaderboard", priority: 1 },
      {
        id: "about-offer-after",
        position: "between-content",
        format: "rectangle",
        priority: 2,
      },
      {
        id: "about-bottom",
        position: "bottom",
        format: "leaderboard",
        priority: 3,
      },
    ],
  },

  CONTACT: {
    enabled: true,
    placements: [
      {
        id: "contact-top",
        position: "top",
        format: "leaderboard",
        priority: 1,
      },
      {
        id: "contact-header-after",
        position: "between-content",
        format: "rectangle",
        priority: 2,
      },
      {
        id: "contact-info-after",
        position: "between-content",
        format: "rectangle",
        priority: 3,
      },
      {
        id: "contact-bottom",
        position: "bottom",
        format: "leaderboard",
        priority: 4,
      },
    ],
  },
} as const;

// Ad networks configuration
export const AD_NETWORKS = {
  GOOGLE_ADSENSE: {
    name: "Google AdSense",
    enabled: true,
    clientId: AD_CONFIG.GOOGLE_ADSENSE.CLIENT_ID,
    formats: [
      "leaderboard",
      "banner",
      "rectangle",
      "large-rectangle",
      "skyscraper",
      "fluid",
    ],
  },

  CUSTOM: {
    name: "Custom Ads",
    enabled: true,
    formats: [
      "leaderboard",
      "banner",
      "rectangle",
      "large-rectangle",
      "skyscraper",
      "fluid",
    ],
  },

  PLACEHOLDER: {
    name: "Placeholder",
    enabled: true,
    formats: [
      "leaderboard",
      "banner",
      "rectangle",
      "large-rectangle",
      "skyscraper",
      "fluid",
    ],
  },
} as const;

// Ad formats with dimensions
export const AD_FORMATS = {
  leaderboard: { width: 728, height: 90, name: "Leaderboard" },
  banner: { width: 468, height: 60, name: "Banner" },
  "half-banner": { width: 234, height: 60, name: "Half Banner" },
  rectangle: { width: 300, height: 250, name: "Medium Rectangle" },
  "medium-rectangle": { width: 300, height: 250, name: "Medium Rectangle" },
  "large-rectangle": { width: 336, height: 280, name: "Large Rectangle" },
  skyscraper: { width: 120, height: 600, name: "Skyscraper" },
  "wide-skyscraper": { width: 160, height: 600, name: "Wide Skyscraper" },
  "mobile-leaderboard": { width: 320, height: 50, name: "Mobile Leaderboard" },
  "mobile-banner": { width: 320, height: 100, name: "Mobile Banner" },
  fluid: { width: 0, height: 0, name: "Fluid (Responsive)" },
} as const;

// Helper functions
export function getAdPlacementsForPage(pageType: keyof typeof AD_PLACEMENTS) {
  const pageConfig = AD_PLACEMENTS[pageType];
  if (!pageConfig.enabled) {
    return [];
  }
  return pageConfig.placements;
}

export function isAdsEnabled() {
  return AD_CONFIG.GLOBAL.ENABLED;
}

export function getGoogleAdSenseConfig() {
  return {
    enabled: AD_CONFIG.GOOGLE_ADSENSE.ENABLED,
    clientId: AD_CONFIG.GOOGLE_ADSENSE.CLIENT_ID,
    testMode: AD_CONFIG.GOOGLE_ADSENSE.TEST_MODE,
  };
}

export function shouldShowAd(
  placementId: string,
  pageType: keyof typeof AD_PLACEMENTS,
): boolean {
  if (!isAdsEnabled()) return false;

  const pageConfig = AD_PLACEMENTS[pageType];
  if (!pageConfig.enabled) return false;

  return pageConfig.placements.some(
    (placement) => placement.id === placementId,
  );
}

// Ad targeting configuration
export const AD_TARGETING = {
  // Page-level targeting
  PAGE_TYPES: {
    HOME: "home",
    DOWNLOADS: "downloads",
    ABOUT: "about",
    CONTACT: "contact",
  },

  // User targeting (if available)
  USER: {
    LOCATION: "auto", // 'auto' or specific country code
    LANGUAGE: "auto", // 'auto' or specific language code
    INTERESTS: ["sports", "football", "streaming", "mobile-apps"],
  },

  // Content targeting
  CONTENT: {
    CATEGORY: "sports",
    SUBCATEGORY: "football",
    KEYWORDS: ["live streaming", "football matches", "mobile app", "sports"],
  },
} as const;

// Ad performance tracking
export const AD_METRICS = {
  TRACK_CLICKS: true,
  TRACK_IMPRESSIONS: true,
  TRACK_VIEWABILITY: true,
  SAMPLE_RATE: 0.1, // 10% of ad events
} as const;

// Ad styling configuration
export const AD_STYLES = {
  CONTAINER: {
    DEFAULT:
      "my-4 mx-auto overflow-hidden bg-gray-50 border border-gray-200 rounded-lg",
    MOBILE: "my-3 mx-2",
    DESKTOP: "my-6",
  },
  PLACEHOLDER: {
    BACKGROUND: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
    TEXT_COLOR: "#666666",
    BORDER: "1px dashed #cccccc",
  },
  LABEL: {
    TEXT: "Advertisement",
    STYLE: "text-xs text-gray-400 text-center mb-1",
    SHOW: true,
  },
} as const;

// Export types
export type AdFormat = keyof typeof AD_FORMATS;
export type PageType = keyof typeof AD_PLACEMENTS;
export type AdNetwork = keyof typeof AD_NETWORKS;
export type AdPlacement = {
  id: string;
  position: "top" | "bottom" | "between-content" | "sidebar";
  format: AdFormat;
  priority: number;
};
