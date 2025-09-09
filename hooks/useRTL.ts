// goalkicklive/hooks/useRTL.ts
'use client';

import { useParams } from 'next/navigation';
import { Locale, isRTL, getTextDirection } from '@/i18n/config';

export interface UseRTLReturn {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  locale: Locale;
}

export function useRTL(): UseRTLReturn {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  return {
    isRTL: isRTL(locale),
    direction: getTextDirection(locale),
    locale,
  };
}

export default useRTL;
