'use client';

import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, ShieldCheckIcon, MailIcon, FileTextIcon, EyeIcon } from "lucide-react";

interface Section {
  name: string;
  content: string | JSX.Element;
  ref: React.RefObject<HTMLDivElement | null>;
  icon: JSX.Element;
}

export default function PrivacyPolicyPage() {
  const introRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const useRefSection = useRef<HTMLDivElement>(null);
  const rightsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Introduction");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const sections = useMemo<Section[]>(() => [
    {
      name: "Introduction",
      ref: introRef,
      icon: <FileTextIcon className="w-5 h-5 inline-block mr-2 text-green-600" />,
      content: "Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app."
    },
    {
      name: "Information We Collect",
      ref: infoRef,
      icon: <EyeIcon className="w-5 h-5 inline-block mr-2 text-green-600" />,
      content: (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Personal information you provide (name, email, etc.)</li>
          <li>Usage data, including pages visited and actions performed</li>
          <li>Device information and browser type</li>
        </ul>
      )
    },
    {
      name: "How We Use Your Information",
      ref: useRefSection,
      icon: <FileTextIcon className="w-5 h-5 inline-block mr-2 text-green-600" />,
      content: (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>To provide and improve our services</li>
          <li>To personalize your experience</li>
          <li>To communicate updates and relevant information</li>
          <li>To ensure security and prevent fraudulent activity</li>
        </ul>
      )
    },
    {
      name: "Your Rights",
      ref: rightsRef,
      icon: <ShieldCheckIcon className="w-5 h-5 inline-block mr-2 text-green-600" />,
      content: "You have the right to access, correct, or delete your personal information. You can also opt out of certain data collection or marketing communications."
    },
    {
      name: "Contact Us",
      ref: contactRef,
      icon: <MailIcon className="w-5 h-5 inline-block mr-2 text-green-600" />,
      content: (
        <>
          If you have any questions about this Privacy Policy, feel free to reach out to us at{" "}
          <a href="mailto:support@example.com" className="text-green-600 hover:underline">
            support@example.com
          </a>.
        </>
      )
    },
  ], [introRef, infoRef, useRefSection, rightsRef, contactRef]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>, name: string) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(name);
    setMobileMenuOpen(false);
  }
};



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = sections.find((s) => s.ref.current === entry.target)?.name;
            if (sectionName) setActiveSection(sectionName);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((s) => s.ref.current && observer.observe(s.ref.current));
    return () => sections.forEach((s) => s.ref.current && observer.unobserve(s.ref.current));
  }, [sections]);

  const toggleSection = (name: string) => {
    setExpandedSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="container mx-auto py-12 max-w-6xl flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <nav className="md:flex flex-col w-64 sticky top-24 self-start space-y-3 hidden md:block">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Sections</h2>
        {sections.map((section) => (
          <button
            key={section.name}
            className={`text-left transition-colors ${activeSection === section.name ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"}`}
            onClick={() => scrollToRef(section.ref, section.name)}
          >
            {section.icon}
            {section.name}
          </button>
        ))}
      </nav>

      {/* Mobile Dropdown */}
      <div className="md:hidden mb-6">
        <button
          className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md text-gray-700 font-medium"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          Sections
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
        </button>
        {mobileMenuOpen && (
          <div className="mt-2 bg-gray-50 border rounded-md shadow-sm">
            {sections.map((section) => (
              <button
                key={section.name}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => scrollToRef(section.ref, section.name)}
              >
                {section.icon}
                {section.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>

        {sections.map((section) => (
          <div
            key={section.name}
            ref={section.ref}
            className="space-y-4 p-4 rounded-md bg-white shadow-md transform transition-all duration-500 hover:shadow-lg"
          >
            <button
              onClick={() => toggleSection(section.name)}
              className="w-full flex justify-between items-center font-semibold text-gray-800 text-xl md:text-2xl"
            >
              <span className="flex items-center">{section.icon}{section.name}</span>
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedSections[section.name] ? "rotate-180" : ""}`} />
            </button>
            {expandedSections[section.name] !== false && (
              <div className="mt-2 text-gray-700">{section.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        ↑ Top
      </button>
    </div>
  );
}
