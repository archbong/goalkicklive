// lib/i18n/getDictionary.ts
import type { Locale } from "@/i18n/config";

export async function getDictionary(locale: Locale) {
  try {
    const dictionary = await import(`@/locales/${locale}/common.json`);
    return dictionary.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback to English if the requested locale fails
    const englishDictionary = await import(`@/locales/en/common.json`);
    return englishDictionary.default;
  }
}
