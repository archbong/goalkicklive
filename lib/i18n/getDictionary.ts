// lib/i18n/getDictionary.ts (server-only util)
import 'server-only';
import type { Locale } from '@/i18n/config';

export async function getDictionary(locale: Locale) {
  return (await import(`@/locales/${locale}/common.json`)).default;
}
