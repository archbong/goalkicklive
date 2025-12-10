"use client";

import React, { useState } from "react";
import AdSlot, { AdFormat, AdNetwork } from "./AdSlot";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

interface AdBannerProps {
  /**
   * Position of the banner
   */
  position?: "top" | "bottom" | "sidebar" | "inline" | "sticky-bottom";

  /**
   * Ad format to use
   */
  format?: AdFormat;

  /**
   * Ad network to use
   */
  network?: AdNetwork;

  /**
   * Custom ad content
   */
  customContent?: React.ReactNode;

  /**
   * Google AdSense client ID
   */
  googleAdClient?: string;

  /**
   * Google AdSense slot ID
   */
  googleAdSlot?: string;

  /**
   * Whether the ad should be responsive
   */
  responsive?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show the ad
   */
  show?: boolean;

  /**
   * Whether to show on mobile
   */
  showOnMobile?: boolean;

  /**
   * Whether to show on desktop
   */
  showOnDesktop?: boolean;

  /**
   * Maximum width for the ad container
   */
  maxWidth?: string;

  /**
   * Margin around the ad
   */
  margin?: string;

  /**
   * Padding inside the ad container
   */
  padding?: string;

  /**
   * Whether the banner can be closed by the user
   */
  closable?: boolean;

  /**
   * Callback when the banner is closed
   */
  onClose?: () => void;

  /**
   * Time in seconds before the close button appears (0 = immediately)
   */
  closeButtonDelay?: number;

  /**
   * Whether to show a "Close ad" label
   */
  showCloseLabel?: boolean;
}

export default function AdBanner({
  position = "inline",
  format = "rectangle",
  network = "placeholder",
  customContent,
  googleAdClient,
  googleAdSlot,
  responsive = true,
  className = "",
  show = true,
  showOnMobile = true,
  showOnDesktop = true,
  maxWidth,
  margin = "my-6",
  padding = "p-0",
  closable = false,
  onClose,
  closeButtonDelay = 0,
  showCloseLabel = false,
}: AdBannerProps) {
  const [isClosed, setIsClosed] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(
    closeButtonDelay === 0,
  );

  // Handle close button delay
  React.useEffect(() => {
    if (closable && closeButtonDelay > 0) {
      const timer = setTimeout(() => {
        setShowCloseButton(true);
      }, closeButtonDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [closable, closeButtonDelay]);

  // Don't render if show is false or banner is closed
  if (!show || isClosed) {
    return null;
  }

  // Determine if we should show based on viewport (simplified check)
  const isClient = typeof window !== "undefined";
  const isMobile = isClient && window.innerWidth < 768;

  if ((isMobile && !showOnMobile) || (!isMobile && !showOnDesktop)) {
    return null;
  }

  // Handle close action
  const handleClose = () => {
    setIsClosed(true);
    if (onClose) {
      onClose();
    }
  };

  // Generate slot ID based on position and format
  const slotId = `ad-banner-${position}-${format}-${Date.now()}`;

  // Get appropriate format based on position and screen size
  const getAdFormat = (): AdFormat => {
    if (isMobile) {
      switch (position) {
        case "top":
        case "bottom":
          return "mobile-banner";
        case "sticky-bottom":
          return "mobile-leaderboard";
        default:
          return "rectangle";
      }
    }

    switch (position) {
      case "top":
      case "bottom":
        return responsive ? "fluid" : "leaderboard";
      case "sidebar":
        return "skyscraper";
      case "sticky-bottom":
        return "banner";
      default:
        return format;
    }
  };

  // Get container classes based on position
  const getContainerClasses = (): string => {
    const baseClasses = `ad-banner ad-banner-${position} ${margin} ${padding} ${className} relative`;

    switch (position) {
      case "top":
        return `${baseClasses} w-full`;
      case "bottom":
        return `${baseClasses} w-full`;
      case "sidebar":
        return `${baseClasses} w-full`;
      case "inline":
        return `${baseClasses} w-full flex justify-center`;
      case "sticky-bottom":
        return `${baseClasses} fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t`;
      default:
        return baseClasses;
    }
  };

  // Get container styles
  const getContainerStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (maxWidth) {
      styles.maxWidth = maxWidth;
      styles.marginLeft = "auto";
      styles.marginRight = "auto";
    }

    if (position === "sticky-bottom") {
      styles.backgroundColor = "white";
    }

    return styles;
  };

  const adFormat = getAdFormat();
  const containerClasses = getContainerClasses();
  const containerStyles = getContainerStyles();

  return (
    <div className={containerClasses} style={containerStyles}>
      <AdSlot
        slotId={slotId}
        format={adFormat}
        network={network}
        customContent={customContent}
        googleAdClient={googleAdClient}
        googleAdSlot={googleAdSlot}
        responsive={responsive}
        showPlaceholder={true}
        className="w-full"
      />

      {closable && showCloseButton && (
        <div
          className={`absolute ${position === "sticky-bottom" ? "top-2 right-2" : "top-1 right-1"}`}
        >
          <div className="flex items-center gap-1">
            {showCloseLabel && (
              <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-l">
                Close ad
              </span>
            )}
            <IconButton
              onClick={handleClose}
              className="bg-white/90 hover:bg-white shadow-sm border border-gray-200"
              size="sm"
              aria-label="Close ad"
              title="Close ad"
            >
              <X className="w-4 h-4 text-gray-600" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured banner components for common use cases
export function TopBanner(props: Omit<AdBannerProps, "position">) {
  return <AdBanner position="top" format="leaderboard" {...props} />;
}

export function BottomBanner(props: Omit<AdBannerProps, "position">) {
  return <AdBanner position="bottom" format="leaderboard" {...props} />;
}

export function SidebarAd(props: Omit<AdBannerProps, "position">) {
  return <AdBanner position="sidebar" format="skyscraper" {...props} />;
}

export function InlineAd(props: Omit<AdBannerProps, "position">) {
  return <AdBanner position="inline" format="rectangle" {...props} />;
}

export function StickyMobileAd(props: Omit<AdBannerProps, "position">) {
  return (
    <AdBanner
      position="sticky-bottom"
      format="mobile-banner"
      showOnMobile={true}
      showOnDesktop={false}
      {...props}
    />
  );
}

// Helper component for between content sections
export function BetweenContentAd({
  index = 1,
  ...props
}: Omit<AdBannerProps, "position"> & { index?: number }) {
  return (
    <div className="my-8">
      <div className="text-xs text-gray-400 text-center mb-2">
        Advertisement {index}
      </div>
      <AdBanner position="inline" format="rectangle" {...props} />
    </div>
  );
}
