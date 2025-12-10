"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import LocaleSwitcher from "../LocaleSwitcher";
import { Transition } from "@headlessui/react";

interface NavbarProps {
  locale: string;
  translations: {
    nav: {
      home: string;
      downloads: string;
      about: string;
      contact: string;
    };
  };
}

export default function Navbar({ locale, translations }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: translations.nav.home, href: `/${locale}` },
    { name: translations.nav.downloads, href: `/${locale}/downloads` },
    { name: translations.nav.about, href: `/${locale}/about` },
    { name: translations.nav.contact, href: `/${locale}/contact` },
  ];

  const renderNavLinks = (closeMenu?: () => void) =>
    navLinks.map((link) => (
      <li key={link.name}>
        <Link
          href={link.href}
          className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-gray-300 transition-colors"
          onClick={closeMenu}
        >
          {link.name}
        </Link>
      </li>
    ));

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <span className="w-6 h-6">⚽</span>
            <span>Goalkick Live</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-6">
            {renderNavLinks()}
            <li>
              <LocaleSwitcher />
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className="p-2 rounded hover:bg-gray-800 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav with smooth slide down */}
      <Transition
        show={isOpen}
        enter="transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        enterFrom="max-h-0 opacity-0 -translate-y-4"
        enterTo="max-h-screen opacity-100 translate-y-0"
        leave="transition-all duration-400 ease-in-out"
        leaveFrom="max-h-screen opacity-100 translate-y-0"
        leaveTo="max-h-0 opacity-0 -translate-y-4"
      >
        <div className="md:hidden bg-black px-4 pb-4 overflow-hidden">
          <ul className="space-y-2">
            {renderNavLinks(() => setIsOpen(false))}
          </ul>
          <div className="mt-3 flex gap-2">
            <LocaleSwitcher />
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Transition>
    </nav>
  );
}
