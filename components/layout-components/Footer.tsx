import Link from "next/link";
import { Container } from "@/components/layout-components/Container";
import { Facebook, Twitter, Instagram } from "react-feather";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 text-sm border-t border-gray-800">
      <Container className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-white font-semibold tracking-wide">
            ⚽ Goalkick Live
          </p>
          <p className="text-xs text-gray-500">
            &copy; {year} Goalkick Live. All rights reserved.
          </p>
        </div>

        {/* Center - Social Links */}
        <div className="flex gap-4 text-gray-500">
          <Link
            href="https://facebook.com"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Facebook size={18} />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Twitter size={18} />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Instagram size={18} />
          </Link>
        </div>

        {/* Right */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href={`/${locale}/privacy-policy`}
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href={`/${locale}/terms-and-conditions`}
            className="hover:text-white transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href={`/${locale}/settings`}
            className="hover:text-white transition-colors"
          >
            Settings
          </Link>
        </div>
      </Container>
    </footer>
  );
}
