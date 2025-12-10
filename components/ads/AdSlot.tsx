"use client";

import React, { useEffect, useRef } from "react";

export type AdFormat =
  | "leaderboard" // 728x90
  | "banner" // 468x60
  | "half-banner" // 234x60
  | "rectangle" // 300x250
  | "medium-rectangle" // 300x250
  | "large-rectangle" // 336x280
  | "skyscraper" // 120x600
  | "wide-skyscraper" // 160x600
  | "mobile-leaderboard" // 320x50
  | "mobile-banner" // 320x100
  | "fluid"; // Responsive

export type AdNetwork = "google-adsense" | "custom" | "placeholder";

interface AdSlotProps {
  /**
   * Unique identifier for the ad slot
   */
  slotId: string;

  /**
   * Ad format/size
   */
  format: AdFormat;

  /**
   * Ad network to use
   */
  network?: AdNetwork;

  /**
   * Custom ad content (used when network is 'custom')
   */
  customContent?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show a placeholder when no ads are loaded
   */
  showPlaceholder?: boolean;

  /**
   * Google AdSense client ID (ca-pub-XXXXX)
   */
  googleAdClient?: string;

  /**
   * Google AdSense slot ID (XXXXXX)
   */
  googleAdSlot?: string;

  /**
   * Whether the ad should be responsive
   */
  responsive?: boolean;

  /**
   * Custom styles for the ad container
   */
  style?: React.CSSProperties;
}

const adSizes: Record<
  AdFormat,
  { width: number; height: number; name: string }
> = {
  leaderboard: { width: 728, height: 90, name: "Leaderboard" },
  banner: { width: 468, height: 60, name: "Banner" },
  "half-banner": { width: 234, height: 60, name: "Half Banner" },
  rectangle: { width: 300, height: 250, name: "Medium Rectangle" },
  "medium-rectangle": { width: 300, height: 250, name: "Medium Rectangle" },
  "large-rectangle": { width: 336, height: 280, name: "Large Rectangle" },
  skyscraper: { width: 120, height: 600, name: "Skyscraper" },
  "wide-skyscraper": { width: 160, height: 600, name: "Wide Skyscraper" },
  "mobile-leaderboard": { width: 320, height: 50, name: "Mobile Leaderboard" },
  "mobile-banner": { width: 320, height: 100, name: "Mobile Banner" },
  fluid: { width: 0, height: 0, name: "Fluid (Responsive)" },
};

export default function AdSlot({
  slotId,
  format,
  network = "placeholder",
  customContent,
  className = "",
  showPlaceholder = true,
  googleAdClient,
  googleAdSlot,
  responsive = false,
  style = {},
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const size = adSizes[format];

  // Initialize Google AdSense
  useEffect(() => {
    if (network === "google-adsense" && googleAdClient && googleAdSlot) {
      const loadGoogleAds = () => {
        if (typeof window === "undefined") return;

        try {
          // @ts-expect-error - Google AdSense global
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error("Error loading Google AdSense:", error);
        }
      };

      // Load the AdSense script if not already loaded
      if (
        !document.querySelector('script[src*="pagead2.googlesyndication.com"]')
      ) {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        if (googleAdClient) {
          script.setAttribute("data-ad-client", googleAdClient);
        }
        document.head.appendChild(script);
        script.onload = loadGoogleAds;
      } else {
        loadGoogleAds();
      }
    }
  }, [network, googleAdClient, googleAdSlot]);

  const getAdStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      ...style,
      overflow: "hidden",
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    };

    if (responsive && format === "fluid") {
      return {
        ...baseStyles,
        width: "100%",
        height: "auto",
        minHeight: "250px",
        position: "relative",
      };
    }

    if (responsive) {
      return {
        ...baseStyles,
        width: "100%",
        maxWidth: `${size.width}px`,
        height: "auto",
        aspectRatio: `${size.width} / ${size.height}`,
      };
    }

    return {
      ...baseStyles,
      width: `${size.width}px`,
      height: `${size.height}px`,
    };
  };

  const renderAdContent = () => {
    switch (network) {
      case "google-adsense":
        if (!googleAdClient || !googleAdSlot) {
          return renderPlaceholder();
        }

        return (
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              width:
                responsive && format !== "fluid" ? "100%" : `${size.width}px`,
              height:
                responsive && format !== "fluid" ? "auto" : `${size.height}px`,
            }}
            data-ad-client={googleAdClient}
            data-ad-slot={googleAdSlot}
            data-ad-format={format === "fluid" ? "auto" : "rectangle"}
            data-full-width-responsive={responsive ? "true" : "false"}
            data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
          />
        );

      case "custom":
        return customContent || renderPlaceholder();

      case "placeholder":
      default:
        return renderPlaceholder();
    }
  };

  const renderPlaceholder = () => {
    if (!showPlaceholder) return null;

    return (
      <div className="flex flex-col items-center justify-center p-4 w-full h-full">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <div className="text-sm text-gray-500 text-center">
          <div className="font-medium">{size.name} Ad</div>
          <div className="text-xs mt-1">
            {size.width} × {size.height}
          </div>
          <div className="text-xs mt-2">Ad Slot: {slotId}</div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={adRef}
      className={`ad-slot ${className}`}
      style={getAdStyles()}
      data-slot-id={slotId}
      data-format={format}
      data-network={network}
    >
      {renderAdContent()}
    </div>
  );
}
