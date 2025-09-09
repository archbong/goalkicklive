'use client';

import { useRef, useState, useEffect } from 'react';

interface Section {
  id: string;
  title: string;
  content: string;
}

const sections: Section[] = [
  { id: 'acceptance', title: 'Acceptance of Terms', content: 'By using our website, you agree to these terms and conditions. If you do not agree, please refrain from using our services.' },
  { id: 'services', title: 'Use of Services', content: 'You may use the services only for lawful purposes and in accordance with the terms outlined here.' },
  { id: 'responsibilities', title: 'User Responsibilities', content: 'Users are responsible for maintaining the confidentiality of their account and for all activities under their account.' },
  { id: 'liability', title: 'Limitation of Liability', content: 'We are not liable for any damages arising from the use of our website, including direct, indirect, incidental, or consequential damages.' },
  { id: 'modifications', title: 'Modifications', content: 'We may revise these terms at any time. Continued use of our services constitutes acceptance of the updated terms.' },
  { id: 'contact', title: 'Contact', content: 'For questions about these terms, please contact us at support@example.com.' },
];

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver to update active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' } // trigger when section is roughly in center
    );

    // Copy current refs to a local variable for stable cleanup
    const refs = sectionRefs.current.slice();
    refs.forEach((ref) => ref && observer.observe(ref));

    return () => {
      refs.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, []);

  const scrollToSection = (index: number) => {
    const ref = sectionRefs.current[index];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-5xl flex flex-col lg:flex-row gap-8">
      {/* Side Navigation */}
      <nav className="hidden lg:block w-60 sticky top-20 self-start">
        <ul className="space-y-2">
          {sections.map((section, index) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(index)}
                className={`text-left w-full px-3 py-2 rounded transition-colors ${
                  activeSection === section.id
                    ? 'bg-green-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 space-y-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms and Conditions</h1>
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => { sectionRefs.current[index] = el; return undefined; }}
            className="scroll-mt-20 border-b border-gray-200 pb-8 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">{section.title}</h2>
            <p className="text-gray-700">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
