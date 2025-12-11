"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Download, PlayCircle, Smartphone, Zap, Star } from "lucide-react";
import {
  getOptimizedCTAText,
  getOptimizedButtonColor,
  getSectionOptimization,
  PAGE_SECTIONS,
  trackABTestEvent,
} from "@/config/ab-testing";

interface OptimizedCTAProps {
  locale: string;
  section: keyof typeof PAGE_SECTIONS;
  defaultText?: string;
  defaultColor?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  fullWidth?: boolean;
  variant?: "default" | "outline" | "ghost" | "gradient";
  valueProp?: string;
  showSocialProof?: boolean;
  showUrgency?: boolean;
}

export default function OptimizedCTA({
  locale,
  section,
  defaultText = "DOWNLOAD APP",
  defaultColor = "green",
  className = "",
  size = "lg",
  showIcon = true,
  fullWidth = false,
  variant = "default",
  valueProp,
  showSocialProof = false,
  showUrgency = false,
}: OptimizedCTAProps) {
  const [userId, setUserId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [optimizedText, setOptimizedText] = useState<string>(defaultText);
  const [optimizedColor, setOptimizedColor] = useState<string>(defaultColor);
  const [sectionOptimizations, setSectionOptimizations] = useState<
    Record<string, string | boolean>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user and session IDs from tracking system
    const getTrackingIds = () => {
      if (typeof window !== "undefined") {
        const tracking = window.GoalkickTracking;
        if (tracking) {
          return {
            userId: tracking.getUserId() || "anonymous",
            sessionId: tracking.getSessionId() || "session-" + Date.now(),
          };
        }
      }
      return {
        userId: "anonymous-" + Math.random().toString(36).substr(2, 9),
        sessionId: "session-" + Date.now(),
      };
    };

    const { userId: uid, sessionId: sid } = getTrackingIds();
    setUserId(uid);
    setSessionId(sid);

    // Get optimized values
    const text = getOptimizedCTAText(uid, sid, "global", defaultText);
    const color = getOptimizedButtonColor(uid, sid, defaultColor);
    const optimizations = getSectionOptimization(
      PAGE_SECTIONS[section],
      uid,
      sid,
    );

    setOptimizedText(text);
    setOptimizedColor(color);
    setSectionOptimizations(optimizations);

    // Track impression
    trackABTestEvent({
      testId: "download-cta-2024-q1",
      variantId: "auto-detected",
      eventType: "impression",
      eventData: {
        section: PAGE_SECTIONS[section],
        ctaText: text,
        buttonColor: color,
        optimizations,
      },
      userId: uid,
      sessionId: sid,
    });

    setIsLoading(false);
  }, [section, defaultText, defaultColor]);

  const handleClick = () => {
    // Track click event
    trackABTestEvent({
      testId: "download-cta-2024-q1",
      variantId: "auto-detected",
      eventType: "click",
      eventData: {
        section: PAGE_SECTIONS[section],
        ctaText: optimizedText,
        buttonColor: optimizedColor,
        timestamp: Date.now(),
      },
      userId,
      sessionId,
    });

    // Also track with main tracking system
    if (typeof window !== "undefined" && window.GoalkickTracking) {
      window.GoalkickTracking.trackDownloadClick("all", PAGE_SECTIONS[section]);
    }
  };

  const getButtonColorClasses = (color: string, variantType: string) => {
    const baseClasses =
      "transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl";

    if (variantType === "gradient") {
      return `bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white ${baseClasses}`;
    }

    switch (color) {
      case "green":
        return variantType === "outline"
          ? `border-2 border-green-600 text-green-600 hover:bg-green-50 ${baseClasses}`
          : variantType === "ghost"
            ? `text-green-600 hover:bg-green-50 ${baseClasses}`
            : `bg-green-600 hover:bg-green-700 text-white ${baseClasses}`;

      case "blue":
        return variantType === "outline"
          ? `border-2 border-blue-600 text-blue-600 hover:bg-blue-50 ${baseClasses}`
          : variantType === "ghost"
            ? `text-blue-600 hover:bg-blue-50 ${baseClasses}`
            : `bg-blue-600 hover:bg-blue-700 text-white ${baseClasses}`;

      case "purple":
        return variantType === "outline"
          ? `border-2 border-purple-600 text-purple-600 hover:bg-purple-50 ${baseClasses}`
          : variantType === "ghost"
            ? `text-purple-600 hover:bg-purple-50 ${baseClasses}`
            : `bg-purple-600 hover:bg-purple-700 text-white ${baseClasses}`;

      case "red":
        return variantType === "outline"
          ? `border-2 border-red-600 text-red-600 hover:bg-red-50 ${baseClasses}`
          : variantType === "ghost"
            ? `text-red-600 hover:bg-red-50 ${baseClasses}`
            : `bg-red-600 hover:bg-red-700 text-white ${baseClasses}`;

      default:
        return `bg-green-600 hover:bg-green-700 text-white ${baseClasses}`;
    }
  };

  const getButtonSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-sm";
      case "md":
        return "h-10 px-4";
      case "lg":
        return "h-12 px-6 text-lg";
      case "xl":
        return "h-14 px-8 text-xl";
      default:
        return "h-12 px-6 text-lg";
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    const iconProps = {
      className: "mr-2",
      size: size === "sm" ? 16 : size === "lg" ? 20 : size === "xl" ? 24 : 18,
    };

    if (optimizedText.includes("WATCH") || optimizedText.includes("STREAM")) {
      return <PlayCircle {...iconProps} />;
    } else if (optimizedText.includes("GET")) {
      return <Smartphone {...iconProps} />;
    } else if (optimizedText.includes("FREE")) {
      return <Zap {...iconProps} />;
    } else {
      return <Download {...iconProps} />;
    }
  };

  const getSocialProof = () => {
    if (!showSocialProof && !sectionOptimizations.socialProof) return null;

    return (
      <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
        <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
        <span>4.8/5 • 5M+ downloads</span>
      </div>
    );
  };

  const getUrgencyBadge = () => {
    if (!showUrgency && !sectionOptimizations.urgency) return null;

    return (
      <div className="absolute -top-2 -right-2">
        <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          LIVE NOW
        </div>
      </div>
    );
  };

  const getValueProp = () => {
    const prop =
      valueProp ||
      sectionOptimizations.valueProp ||
      sectionOptimizations.ctaMessage;
    if (!prop) return null;

    return <div className="mt-1 text-sm text-gray-600 text-center">{prop}</div>;
  };

  if (isLoading) {
    return (
      <div className={`inline-block ${fullWidth ? "w-full" : ""}`}>
        <Button
          size={size === "md" ? "default" : size === "xl" ? "lg" : size}
          className={`${getButtonColorClasses(defaultColor, variant)} ${className} ${fullWidth ? "w-full" : ""} opacity-50`}
          disabled
        >
          <div className="flex items-center">
            {showIcon && <Download className="mr-2" size={20} />}
            <span className="animate-pulse">Loading...</span>
          </div>
        </Button>
      </div>
    );
  }

  const finalVariant =
    sectionOptimizations.buttonPosition === "sticky"
      ? "gradient"
      : typeof variant === "string"
        ? variant
        : "default";
  const finalColor =
    typeof sectionOptimizations.buttonColor === "string"
      ? sectionOptimizations.buttonColor
      : optimizedColor;

  return (
    <div className={`inline-block ${fullWidth ? "w-full" : ""}`}>
      <div className="relative">
        {getUrgencyBadge()}
        <Link
          href={`/${locale}/downloads`}
          className={`${getButtonColorClasses(finalColor as string, finalVariant as string)} ${getButtonSizeClasses(size)} ${className} ${fullWidth ? "w-full" : ""} inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]`}
          onClick={handleClick}
          data-track-download="true"
          data-track-platform="all"
          data-track-location={PAGE_SECTIONS[section]}
          data-ab-test="download-cta-2024-q1"
          data-ab-variant="optimized"
        >
          <div className="flex items-center justify-center">
            {getIcon()}
            <span className="font-bold">{optimizedText}</span>
          </div>
        </Link>
      </div>
      {getValueProp()}
      {getSocialProof()}
    </div>
  );
}

// Helper component for section-specific CTAs
export function HeroCTA({
  locale,
  className = "",
}: {
  locale: string;
  className?: string;
}) {
  return (
    <OptimizedCTA
      locale={locale}
      section="HERO"
      defaultText="WATCH FOOTBALL FREE"
      defaultColor="gradient"
      size="xl"
      className={`shadow-2xl ${className}`}
      showIcon={true}
      fullWidth={false}
      variant="gradient"
      valueProp="7-day free trial • No credit card"
      showSocialProof={true}
      showUrgency={true}
    />
  );
}

export function LiveMatchesCTA({
  locale,
  className = "",
}: {
  locale: string;
  className?: string;
}) {
  return (
    <OptimizedCTA
      locale={locale}
      section="LIVE_MATCHES"
      defaultText="WATCH LIVE"
      defaultColor="red"
      size="lg"
      className={className}
      showIcon={true}
      fullWidth={true}
      variant="default"
      valueProp="Matches streaming now"
      showUrgency={true}
    />
  );
}

export function HowItWorksCTA({
  locale,
  className = "",
}: {
  locale: string;
  className?: string;
}) {
  return (
    <OptimizedCTA
      locale={locale}
      section="HOW_IT_WORKS"
      defaultText="GET STARTED"
      defaultColor="blue"
      size="lg"
      className={className}
      showIcon={true}
      fullWidth={false}
      variant="default"
      valueProp="3 simple steps"
      showSocialProof={false}
    />
  );
}

export function FooterCTA({
  locale,
  className = "",
}: {
  locale: string;
  className?: string;
}) {
  return (
    <OptimizedCTA
      locale={locale}
      section="FOOTER"
      defaultText="DOWNLOAD NOW"
      defaultColor="green"
      size="md"
      className={className}
      showIcon={true}
      fullWidth={true}
      variant="outline"
      valueProp="Available on iOS & Android"
      showSocialProof={true}
    />
  );
}

// Sticky mobile CTA for bottom of screen
export function StickyMobileCTA({ locale }: { locale: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-green-600 to-blue-600 shadow-2xl border-t border-white/20 md:hidden">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <div className="font-bold">Watch Football Live</div>
            <div className="text-sm opacity-90">Download the app now</div>
          </div>
          <OptimizedCTA
            locale={locale}
            section="HERO"
            defaultText="GET APP"
            defaultColor="white"
            size="sm"
            className="shadow-lg"
            showIcon={false}
            fullWidth={false}
            variant="default"
          />
        </div>
      </div>
    </div>
  );
}
