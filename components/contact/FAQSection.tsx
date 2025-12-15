import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, HelpCircle, Search, Filter } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category?: string;
  tags?: string[];
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  faqs: FAQItem[];
  variant?: "default" | "accordion" | "grid" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  background?: "light" | "white" | "gradient";
  showSearch?: boolean;
  showCategories?: boolean;
  showDivider?: boolean;
  alignment?: "left" | "center";
  maxWidth?: "sm" | "md" | "lg" | "full";
  defaultOpen?: number | null;
  collapsible?: boolean;
  showIcons?: boolean;
}

export function FAQSection({
  title,
  description,
  faqs,
  variant = "default",
  size = "md",
  className,
  titleClassName,
  descriptionClassName,
  background = "light",
  showSearch = true,
  showCategories = true,
  showDivider = false,
  alignment = "center",
  maxWidth = "lg",
  defaultOpen = null,
  collapsible = true,
  showIcons = true,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(
    new Set(faqs.map(faq => faq.category).filter(Boolean))
  ) as string[];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const variantClasses = {
    default: "space-y-4",
    accordion: "space-y-2",
    grid: "grid gap-4",
    minimal: "space-y-6",
  };

  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  };

  const titleSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const descriptionSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const faqSizeClasses = {
    sm: "p-3 text-sm",
    md: "p-4",
    lg: "p-6 text-lg",
  };

  const backgroundClasses = {
    light: "bg-gray-50",
    white: "bg-white",
    gradient: "bg-gradient-to-b from-gray-50 to-white",
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
  };

  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-4xl",
    full: "max-w-full",
  };

  const gridColumns = {
    default: "grid-cols-1",
    grid: "grid-cols-1 md:grid-cols-2",
  };

  const toggleFAQ = (index: number) => {
    if (!collapsible) return;
    setOpenIndex(openIndex === index ? null : index);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const renderFAQItem = (faq: FAQItem, index: number) => {
    const isOpen = openIndex === index;

    const faqContent = (
      <div
        key={index}
        className={cn(
          "rounded-lg transition-all duration-300",
          variant === "minimal" && "border-b border-gray-200 pb-6",
          variant !== "minimal" && "bg-white shadow-sm hover:shadow-md",
          isOpen && variant !== "minimal" && "shadow-md",
          faqSizeClasses[size]
        )}
      >
        <button
          onClick={() => toggleFAQ(index)}
          className={cn(
            "w-full flex items-center justify-between text-left",
            !collapsible && "cursor-default"
          )}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
        >
          <div className="flex items-start gap-3 flex-1">
            {showIcons && (
              <div className="flex-shrink-0 mt-1">
                <div className={cn(
                  "rounded-full p-2",
                  isOpen ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                )}>
                  <HelpCircle className="w-5 h-5" />
                </div>
              </div>
            )}

            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-gray-900",
                isOpen && "text-green-700"
              )}>
                {faq.question}
              </h3>

              {faq.category && showCategories && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-2">
                  {faq.category}
                </span>
              )}
            </div>
          </div>

          {collapsible && (
            <div className="flex-shrink-0 ml-4">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          )}
        </button>

        <div
          id={`faq-answer-${index}`}
          className={cn(
            "overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
          )}
          aria-hidden={!isOpen}
        >
          <div className={cn(
            "text-gray-600 leading-relaxed",
            "border-l-2 border-green-500 pl-4"
          )}>
            {typeof faq.answer === 'string' ? (
              <p>{faq.answer}</p>
            ) : (
              faq.answer
            )}
          </div>

          {faq.tags && faq.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {faq.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );

    return faqContent;
  };

  return (
    <section className={cn(
      "w-full",
      backgroundClasses[background],
      sizeClasses[size],
      className
    )}>
      <div className="container mx-auto px-4">
        <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
          {(title || description) && (
            <div className={cn("mb-12", alignmentClasses[alignment])}>
              {title && (
                <h2 className={cn(
                  "font-bold text-gray-900 mb-4",
                  titleSizeClasses[size],
                  titleClassName
                )}>
                  {title}
                </h2>
              )}

              {description && (
                <p className={cn(
                  "text-gray-600",
                  descriptionSizeClasses[size],
                  descriptionClassName
                )}>
                  {description}
                </p>
              )}

              {showDivider && (
                <div className={cn(
                  "h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6",
                  alignment === "center" ? "mx-auto" : ""
                )} />
              )}
            </div>
          )}

          {/* Search and Filter Controls */}
          {(showSearch || showCategories) && (
            <div className="mb-8 space-y-4">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              {showCategories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      !selectedCategory
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    All
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        selectedCategory === category
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {(searchQuery || selectedCategory) && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Showing {filteredFaqs.length} of {faqs.length} FAQs
                    {searchQuery && ` for "${searchQuery}"`}
                    {selectedCategory && ` in "${selectedCategory}"`}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FAQ Items */}
          <div className={cn(
            variantClasses[variant],
            variant === "grid" && gridColumns.grid
          )}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => renderFAQItem(faq, index))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {faqs.length}
                </div>
                <div className="text-gray-600">Total FAQs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {categories.length}
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredFaqs.length}
                </div>
                <div className="text-gray-600">Currently showing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pre-configured FAQ data for common use cases
export const faqPresets = {
  general: (locale: string) => [
    {
      question: "What is Goalkick Live?",
      answer: "Goalkick Live is a mobile app that allows you to stream live football matches from top leagues around the world. We provide high-quality streaming, real-time updates, and comprehensive match coverage.",
      category: "General",
      tags: ["app", "streaming", "football"],
    },
    {
      question: "Is Goalkick Live free to use?",
      answer: "Yes! Goalkick Live is completely free to download and use. We offer free access to live matches with optional premium features for enhanced experience.",
      category: "Pricing",
      tags: ["free", "pricing", "subscription"],
    },
    {
      question: "Which leagues are available on Goalkick Live?",
      answer: "We cover 50+ football leagues including Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and many more from around the world.",
      category: "Content",
      tags: ["leagues", "coverage", "matches"],
    },
    {
      question: "How can I download the app?",
      answer: "You can download Goalkick Live from the App Store (iOS) or Google Play Store (Android). Visit our downloads page for direct links and QR codes.",
      category: "Download",
      tags: ["download", "install", "app-store"],
    },
    {
      question: "What devices are supported?",
      answer: "Goalkick Live supports iOS 12+ and Android 8+ devices. We recommend using the latest version of your device's operating system for the best experience.",
      category: "Technical",
      tags: ["devices", "compatibility", "requirements"],
    },
  ],

  technical: (locale: string) => [
    {
      question: "Why is my stream buffering?",
      answer: "Buffering can occur due to slow internet connection, high traffic, or device performance issues. Try switching to a lower quality setting or connecting to a stronger Wi-Fi network.",
      category: "Technical Support",
      tags: ["buffering", "streaming", "internet"],
    },
    {
      question: "How do I update the app?",
      answer: "Updates are available through the App Store (iOS) or Google Play Store (Android). Enable automatic updates in your device settings to always have the latest version.",
      category: "Technical Support",
      tags: ["updates", "app", "maintenance"],
    },
    {
      question: "The app keeps crashing. What should I do?",
      answer: "Try these steps: 1) Restart the app, 2) Restart your device, 3) Update to the latest app version, 4) Clear app cache (Android), 5) Reinstall the app. If issues persist, contact our support team.",
      category: "Technical Support",
      tags: ["crashing", "bugs", "troubleshooting"],
    },
    {
      question: "How can I improve streaming quality?",
      answer: "Ensure you have a stable internet connection (minimum 5 Mbps for HD). Close other apps using bandwidth, connect to Wi-Fi instead of mobile data, and select appropriate quality settings in the app.",
      category: "Technical Support",
      tags: ["quality", "streaming", "internet"],
    },
    {
      question: "Is closed captioning available?",
      answer: "Yes, we support closed captioning in multiple languages. You can enable/disable captions in the video player settings during playback.",
      category: "Accessibility",
      tags: ["captions", "accessibility", "languages"],
    },
  ],

  account: (locale: string) => [
    {
      question: "How do I create an account?",
      answer: "You can create an account directly in the app using your email address or through social login options (Google, Facebook). Account creation is optional but recommended for personalized features.",
      category: "Account",
      tags: ["signup", "login", "account"],
    },
    {
      question: "I forgot my password. How can I reset it?",
      answer: "On the login screen, tap 'Forgot Password' and enter your email address. You'll receive a password reset link. If you don't see the email, check your spam folder.",
      category: "Account",
      tags: ["password", "security", "recovery"],
    },
    {
      question: "Can I use the same account on multiple devices?",
      answer: "Yes, you can use your Goalkick Live account on up to 3 devices simultaneously. For security reasons, we may ask for verification if we detect unusual activity.",
      category: "Account",
      tags: ["devices", "multi-device", "security"],
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Settings > Account > Delete Account. Please note that this action is permanent and cannot be undone.",
      category: "Account",
      tags: ["delete", "account", "privacy"],
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security seriously. We use industry-standard encryption and follow best practices to protect your personal information. Read our Privacy Policy for more details.",
      category: "Account",
      tags: ["security", "privacy", "data"],
    },
  ],
};
