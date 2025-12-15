"use client";

import { useState, useEffect, use } from "react";
import type { Locale } from "@/i18n/config";
import { TopBanner, BetweenContentAd, BottomBanner } from "@/components/ads";
import { HeroSection, CTASection } from "@/components/about";
import {
  ContactForm,
  ContactInfo,
  contactInfoPresets,
  MapSection,
  mapLocations,
  FAQSection,
  faqPresets,
} from "@/components/contact";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  MessageSquare,
  Users,
  Shield,
  HelpCircle,
  Star,
  Zap,
  Heart,
} from "lucide-react";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
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
  const unwrappedParams = use(params);
  const [, setCurrentLocale] = useState<Locale>("en");
  const [translations, setTranslations] = useState<Translations | null>(null);

  // Load locale and translations on client side
  useEffect(() => {
    const loadData = async () => {
      const localeParam = unwrappedParams.locale as Locale;
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
  }, [unwrappedParams]);

  // Handle form submission
  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    message: string;
  }) => {
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // You could add actual form submission logic here
    // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
  };

  // Show loading state while translations are being loaded
  if (!translations) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Banner Ad */}
      <TopBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-4"
      />

      {/* Hero Section */}
      <HeroSection
        title={translations.contactPage.title}
        description={translations.contactPage.description}
        background="gradient"
        size="lg"
        alignment="center"
      />

      {/* Ad between Hero and Contact Form */}
      <BetweenContentAd
        index={1}
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* Contact Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ContactForm
              title="Send Us a Message"
              description="We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."
              nameLabel={translations.contactPage.name}
              emailLabel={translations.contactPage.email}
              messageLabel={translations.contactPage.message}
              submitLabel={translations.contactPage.sendMessage}
              successMessage={translations.contactPage.messageSent}
              variant="card"
              size="lg"
              onSubmit={handleFormSubmit}
              showLabels={false}
              showSuccessToast={true}
              autoFocus={true}
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <ContactInfo
        title={translations.contactPage.otherWays}
        description="Choose the method that works best for you. We're here to help!"
        items={contactInfoPresets.detailed(unwrappedParams.locale)}
        columns={3}
        variant="card"
        size="md"
        background="light"
        alignment="center"
        showDivider={true}
        interactive={true}
      />

      {/* Ad between Contact Info and Map */}
      <BetweenContentAd
        index={2}
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* Interactive Map Section */}
      <MapSection
        title="Find Us"
        description="Visit our headquarters or connect with our global offices"
        location={mapLocations.sanFrancisco}
        variant="interactive"
        size="lg"
        showControls={true}
        showAddress={true}
        interactive={true}
        height="500px"
        background="white"
        showDivider={true}
        alignment="center"
        fadeIn={true}
      />

      {/* Global Offices */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Global Presence
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              With offices around the world, we're always close to our users and
              partners
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                location: mapLocations.sanFrancisco,
                title: "Headquarters",
                description: "Main office and engineering hub",
                icon: <Zap className="w-6 h-6" />,
                color: "green" as const,
              },
              {
                location: mapLocations.london,
                title: "Europe Office",
                description: "European operations and partnerships",
                icon: <Globe className="w-6 h-6" />,
                color: "blue" as const,
              },
              {
                location: mapLocations.dubai,
                title: "Middle East Office",
                description: "Regional content and support",
                icon: <Star className="w-6 h-6" />,
                color: "orange" as const,
              },
              {
                location: mapLocations.singapore,
                title: "Asia Office",
                description: "Asia-Pacific expansion team",
                icon: <Heart className="w-6 h-6" />,
                color: "purple" as const,
              },
            ].map((office, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    office.color === "green"
                      ? "bg-green-100 text-green-600"
                      : office.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : office.color === "orange"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {office.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {office.title}
                </h3>
                <p className="text-gray-600 mb-4">{office.description}</p>
                <p className="text-sm text-gray-500">
                  {office.location.address}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        description="Find quick answers to common questions about Goalkick Live"
        faqs={[
          ...faqPresets.general(unwrappedParams.locale),
          ...faqPresets.technical(unwrappedParams.locale),
          ...faqPresets.account(unwrappedParams.locale),
        ]}
        variant="accordion"
        size="md"
        background="white"
        showSearch={true}
        showCategories={true}
        showDivider={true}
        alignment="center"
        maxWidth="lg"
        defaultOpen={0}
        collapsible={true}
        showIcons={true}
      />

      {/* Social Media Contact */}
      <ContactInfo
        title={translations.contactPage.followUs}
        description="Connect with us on social media for updates, highlights, and community engagement"
        items={contactInfoPresets.social(unwrappedParams.locale)}
        columns={4}
        variant="card"
        size="sm"
        background="light"
        alignment="center"
        showDivider={false}
        interactive={true}
      />

      {/* Response Time Guarantee */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6">
              <Clock className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Response Promise
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              We're committed to providing timely and helpful responses to all
              inquiries
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  24h
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Email Response
                </h3>
                <p className="text-gray-600 text-sm">
                  We respond to all emails within 24 hours
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-green-600 mb-2">1h</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Urgent Support
                </h3>
                <p className="text-gray-600 text-sm">
                  Priority response for critical issues
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-green-600 mb-2">7d</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Feature Requests
                </h3>
                <p className="text-gray-600 text-sm">
                  We review all suggestions weekly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Still Have Questions?"
        description="Can't find what you're looking for? Our support team is ready to help."
        primaryButton={{
          text: "Contact Support",
          href: `mailto:support@goalkicklive.com`,
          variant: "default",
          size: "lg",
          icon: <MessageSquare className="w-5 h-5" />,
        }}
        secondaryButton={{
          text: "Visit Help Center",
          href: `/${unwrappedParams.locale}/help`,
          variant: "secondary",
          size: "lg",
          icon: <HelpCircle className="w-5 h-5" />,
        }}
        variant="gradient"
        size="lg"
        alignment="center"
        background="gradient"
        showDivider={true}
      >
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Available 24/7 for premium users • Multilingual support • Average
            response time: 2 hours
          </p>
        </div>
      </CTASection>

      {/* Bottom Banner Ad */}
      <BottomBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-8"
      />
    </div>
  );
}
