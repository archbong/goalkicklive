// i18n/config.ts
export const locales = ["en", "fr", "es", "ar", "he"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// RTL (Right-to-Left) languages
export const rtlLocales: Locale[] = ["ar", "he"];

// Check if a locale is RTL
export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

// Get text direction for a locale
export function getTextDirection(locale: Locale): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr";
}
