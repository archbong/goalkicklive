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
            sessionId: tracking.getSessionId() || "session",
          };
        }
      }
      return {
        userId: "anonymous",
        sessionId: "session",
      };
    };

    const { userId: uid, sessionId: sid } = getTrackingIds();

    // Only generate unique IDs on client side if needed
    let finalUserId = uid;
    let finalSessionId = sid;

    if (uid === "anonymous" || sid === "session") {
      finalUserId = "anonymous-" + Math.random().toString(36).substr(2, 9);
      finalSessionId = "session-" + Date.now();
    }

    setUserId(finalUserId);
    setSessionId(finalSessionId);

    // Get optimized values
    const text = getOptimizedCTAText(
      finalUserId,
      finalSessionId,
      "global",
      defaultText,
    );
    const color = getOptimizedButtonColor(
      finalUserId,
      finalSessionId,
      defaultColor,
    );
    const optimizations = getSectionOptimization(
      PAGE_SECTIONS[section],
      finalUserId,
      finalSessionId,
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
      userId: finalUserId,
      sessionId: finalSessionId,
    });

    setIsLoading(false);
  }, [section, defaultText, defaultColor]);

  const handleClick = () => {
    trackABTestEvent({
      testId: "download-cta-2024-q1",
      variantId: "auto-detected",
      eventType: "click",
      eventData: {
        section: PAGE_SECTIONS[section],
        ctaText: optimizedText,
        buttonColor: optimizedColor,
        optimizations: sectionOptimizations,
      },
      userId,
      sessionId,
    });
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center ${className}`}>
        <Button
          size={
            size === "sm"
              ? "sm"
              : size === "lg"
                ? "lg"
                : size === "xl"
                  ? "lg"
                  : "default"
          }
          variant={
            variant === "gradient" || variant === "outline"
              ? "default"
              : variant
          }
          className={`${fullWidth ? "w-full" : ""} opacity-50`}
          disabled
        >
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Link
        href={`/${locale}/downloads`}
        onClick={handleClick}
        className={`${fullWidth ? "w-full" : ""}`}
      >
        <Button
          size={
            size === "sm"
              ? "sm"
              : size === "lg"
                ? "lg"
                : size === "xl"
                  ? "lg"
                  : "default"
          }
          variant={
            variant === "gradient" || variant === "outline"
              ? "default"
              : variant
          }
          className={`${fullWidth ? "w-full" : ""}`}
          style={{
            backgroundColor:
              optimizedColor === "green"
                ? "#10B981"
                : optimizedColor === "blue"
                  ? "#3B82F6"
                  : optimizedColor === "orange"
                    ? "#F59E0B"
                    : "#10B981",
          }}
        >
          {showIcon && <Download className="w-5 h-5 mr-2" />}
          {optimizedText}
        </Button>
      </Link>

      {showSocialProof && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>Trusted by 50,000+ football fans</span>
        </div>
      )}

      {showUrgency && (
        <div className="text-sm text-red-600 font-medium">
          <Zap className="w-4 h-4 inline mr-1" />
          Limited time offer
        </div>
      )}

      {valueProp && (
        <div className="text-sm text-gray-600 text-center max-w-md">
          {valueProp}
        </div>
      )}
    </div>
  );
}
