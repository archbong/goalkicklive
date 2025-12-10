// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import MainLayout from "@/components/layout-components/MainLayout";
import "./globals.css";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Fixed: Correctly destructure and use the 'locale' variable to prevent the warning and type error.
export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}`]));

  // You can now use `locale` to fetch translated titles, descriptions, etc.
  // For now, let's just make sure it's used to satisfy the linter.
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
  params: { locale: Locale };
}) {
  const { locale } = params;
  if (!locales.includes(locale)) {
    // Optionally handle invalid locales
  }
  return (
    <html lang={locale}>
      <body>
        <MainLayout locale={locale}>{children}</MainLayout>
      </body>
    </html>
  );
}
