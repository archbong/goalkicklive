import Navbar from "./Navbar";
import Footer from "./Footer";
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

interface MainLayoutProps {
  children: React.ReactNode;
  locale: Locale;
}

export default async function MainLayout({
  children,
  locale,
}: MainLayoutProps) {
  // Get translations for the current locale
  const dict = await getDictionary(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar locale={locale} translations={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} translations={dict} />
    </div>
  );
}
