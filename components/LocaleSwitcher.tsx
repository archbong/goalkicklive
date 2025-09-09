// components/LocaleSwitcher.tsx
'use client';

import { locales } from '@/i18n/config';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LocaleSwitcher() {
  const params = useParams() as { locale?: string };
  const pathname = usePathname();
  const current = params.locale ?? 'en';

  // Strip current locale prefix
  const rest = pathname?.replace(/^\/[a-zA-Z-]+(?=\/|$)/, '') || '';

  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-100/60 px-2 py-1 backdrop-blur-sm shadow-sm">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest || ''}`}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-300 
            ${l === current 
              ? 'bg-white shadow-md text-black font-semibold scale-105' 
              : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
