// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import MainLayout from "@/components/layout-components/MainLayout";
import Script from "next/script";
import "./globals.css";

export async function generateStaticParams(): Promise<
  Array<{ locale: Locale }>
> {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}`]));

  console.log(`Generating metadata for locale: ${locale}`);

  return {
    title: "Goalkick Live - Stream Live Football Matches",
    description:
      "Download our mobile app to stream live football matches from top leagues around the world. Never miss a moment of the action.",
    alternates: { languages },
    metadataBase: new URL("https://goalkicklive.com"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as Locale;

  if (!locales.includes(localeTyped)) {
    // Handle invalid locales - redirect to default locale
    // For now, we'll just use the first locale as fallback
    const fallbackLocale = locales[0];
    return (
      <html lang={fallbackLocale}>
        <body>
          <MainLayout locale={fallbackLocale}>{children}</MainLayout>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale}>
      <head>
        <Script
          src="/scripts/download-tracking.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <MainLayout locale={localeTyped}>{children}</MainLayout>
      </body>
    </html>
  );
}
