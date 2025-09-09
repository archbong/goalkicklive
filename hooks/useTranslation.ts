import { usePathname } from 'next/navigation';
import enJson from '@/locales/en/common.json';
import frJson from '@/locales/fr/common.json';
import esJson from '@/locales/es/common.json';

type LocaleKey = 'en' | 'fr' | 'es';
type LocaleStrings = Record<string, string>;
const en: LocaleStrings = enJson as LocaleStrings;
const fr: LocaleStrings = frJson as LocaleStrings;
const es: LocaleStrings = esJson as LocaleStrings;
const locales: Record<LocaleKey, LocaleStrings> = { en, fr, es };

export function useTranslation() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] as LocaleKey) || 'en';
  const t = (key: string) => locales[locale]?.[key] || key;
  return { t };
}
