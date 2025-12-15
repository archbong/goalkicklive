// Ad Components Index
export { default as AdSlot } from "./AdSlot";
export type { AdFormat, AdNetwork } from "./AdSlot";

export { default as AdManager } from "./AdManager";
export type { AdPlacement } from "./AdManager";
export {
  getAdPlacementsForPage,
  configureGoogleAdSense,
  detectAdBlocker,
} from "./AdManager";

export { default as AdBanner } from "./AdBanner";
export {
  TopBanner,
  BottomBanner,
  SidebarAd,
  InlineAd,
  StickyMobileAd,
  BetweenContentAd,
} from "./AdBanner";

// Ad configuration utilities
export const AD_CONFIG = {
  GOOGLE_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || "",
  ENABLED: process.env.NEXT_PUBLIC_ADS_ENABLED !== "false",
  TEST_MODE: false, // Set dynamically in client components
} as const;

// Default ad placements for different page types
export const DEFAULT_AD_PLACEMENTS = {
  HOME: "home",
  DOWNLOADS: "downloads",
  ABOUT: "about",
  CONTACT: "contact",
  BLOG: "blog",
} as const;

// Ad format constants
export const AD_FORMATS = {
  LEADERBOARD: "leaderboard" as const,
  BANNER: "banner" as const,
  RECTANGLE: "rectangle" as const,
  LARGE_RECTANGLE: "large-rectangle" as const,
  SKYSCRAPER: "skyscraper" as const,
  MOBILE_BANNER: "mobile-banner" as const,
  MOBILE_LEADERBOARD: "mobile-leaderboard" as const,
  FLUID: "fluid" as const,
} as const;

// Ad network constants
export const AD_NETWORKS = {
  GOOGLE_ADSENSE: "google-adsense" as const,
  CUSTOM: "custom" as const,
  PLACEHOLDER: "placeholder" as const,
} as const;
