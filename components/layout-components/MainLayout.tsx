import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function MainLayout(
  { children, locale }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
