"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import { TopBanner, BetweenContentAd, BottomBanner } from "@/components/ads";

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

interface Translations {
  contactPage: {
    title: string;
    description: string;
    name: string;
    email: string;
    message: string;
    sendMessage: string;
    messageSent: string;
    otherWays: string;
    followUs: string;
  };
  common: {
    loading: string;
  };
}

export default function Contact({ params }: ContactPageProps) {
  const [, setCurrentLocale] = useState<Locale>("en");
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load locale and translations on client side
  useEffect(() => {
    const loadData = async () => {
      const { locale: localeParam } = await params;
      setCurrentLocale(localeParam);

      // Dynamically import the translation file for the locale
      try {
        const dict = await import(`@/locales/${localeParam}/common.json`);
        setTranslations({
          contactPage: dict.default.contactPage,
          common: dict.default.common,
        });
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to English if translation fails
        const dict = await import(`@/locales/en/common.json`);
        setTranslations({
          contactPage: dict.default.contactPage,
          common: dict.default.common,
        });
      }
    };
    loadData();
  }, [params]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  // Fade-in map when it enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (mapRef.current) observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  const inputClass = `
    w-full border border-gray-300 rounded-md p-3
    focus:outline-none focus:ring-2 focus:ring-green-600
    transition-all duration-300
    hover:border-green-500
  `;

  // Show loading state while translations are being loaded
  if (!translations) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      {/* Top Banner Ad */}
      <TopBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-4"
      />

      <div className="container mx-auto px-4 max-w-3xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {translations.contactPage.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {translations.contactPage.description}
          </p>
        </div>

        {/* Ad between Header and Contact Form */}
        <BetweenContentAd
          index={1}
          show={true}
          network="placeholder"
          responsive={true}
          maxWidth="800px"
        />

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-8 space-y-6 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={translations.contactPage.name}
              required
              className={inputClass}
            />
            <input
              type="email"
              placeholder={translations.contactPage.email}
              required
              className={inputClass}
            />
          </div>
          <textarea
            placeholder={translations.contactPage.message}
            required
            rows={5}
            className={inputClass}
          />
          <Button
            variant="default"
            className="w-full py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {translations.contactPage.sendMessage}
          </Button>

          {/* Animated Success Toast */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 transform transition-all duration-500 ${
              submitted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10 pointer-events-none"
            } bg-green-100 text-green-800 rounded-md px-6 py-3 shadow-md text-center`}
          >
            {translations.contactPage.messageSent}
          </div>
        </form>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {translations.contactPage.otherWays}
          </h2>
          <p className="text-gray-600">
            Email:{" "}
            <a
              href="mailto:contact@goalkicklive.com"
              className="text-green-600 hover:underline"
            >
              contact@goalkicklive.com
            </a>
          </p>
          <p className="text-gray-600">
            Phone:{" "}
            <a
              href="tel:+1234567890"
              className="text-green-600 hover:underline"
            >
              +1 (555) 123-4567
            </a>
          </p>
          <p className="text-gray-600">
            {translations.contactPage.followUs}{" "}
            <span className="ml-2 space-x-4">
              <a
                href="https://twitter.com/goalkicklive"
                className="text-green-600 hover:underline"
              >
                Twitter
              </a>
              <a
                href="https://facebook.com/goalkicklive"
                className="text-green-600 hover:underline"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/goalkicklive"
                className="text-green-600 hover:underline"
              >
                Instagram
              </a>
            </span>
          </p>
        </div>

        {/* Google Maps with Fade-in */}
        <div
          ref={mapRef}
          className={`rounded-xl overflow-hidden shadow-md transition-opacity duration-1000 ${
            mapVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0197030597566!2d-122.41941508468153!3d37.77492977975959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085814c3c7c4c3d%3A0x92cfd24e7d5a5f3e!2sSan+Francisco!5e0!3m2!1sen!2sus!4v1629738749480!5m2!1sen!2sus"
            width="100%"
            height="400"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Ad between Contact Info and Map */}
        <BetweenContentAd
          index={2}
          show={true}
          network="placeholder"
          responsive={true}
          maxWidth="800px"
        />
      </div>

      {/* Bottom Banner Ad */}
      <BottomBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-8"
      />
    </section>
  );
}
