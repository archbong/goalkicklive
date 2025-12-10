"use client";

import React from "react";
import AdSlot, { AdFormat, AdNetwork } from "./AdSlot";

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export interface AdPlacement {
  id: string;
  name: string;
  description: string;
  format: AdFormat;
  network: AdNetwork;
  position:
    | "header"
    | "sidebar"
    | "footer"
    | "content"
    | "between-content"
    | "popup";
  enabled: boolean;
  priority: number;
  googleAdClient?: string;
  googleAdSlot?: string;
  customContent?: React.ReactNode;
  responsive?: boolean;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

interface AdManagerProps {
  /**
   * Array of ad placements to render
   */
  placements: AdPlacement[];

  /**
   * Current viewport size for responsive ads
   */
  viewport?: "mobile" | "tablet" | "desktop";

  /**
   * Whether ads are enabled globally
   */
  adsEnabled?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Callback when an ad is clicked
   */
  onAdClick?: (placementId: string) => void;

  /**
   * Callback when an ad fails to load
   */
  onAdError?: (placementId: string, error: Error) => void;
}

const defaultPlacements: AdPlacement[] = [
  {
    id: "header-ad",
    name: "Header Banner",
    description: "Top of page banner ad",
    format: "leaderboard",
    network: "placeholder",
    position: "header",
    enabled: true,
    priority: 1,
    showOnMobile: true,
    showOnDesktop: true,
    responsive: true,
  },
  {
    id: "sidebar-top",
    name: "Sidebar Top",
    description: "Top of sidebar ad",
    format: "rectangle",
    network: "placeholder",
    position: "sidebar",
    enabled: true,
    priority: 2,
    showOnMobile: false,
    showOnDesktop: true,
    responsive: true,
  },
  {
    id: "content-top",
    name: "Content Top",
    description: "Top of main content ad",
    format: "large-rectangle",
    network: "placeholder",
    position: "content",
    enabled: true,
    priority: 3,
    showOnMobile: true,
    showOnDesktop: true,
    responsive: true,
  },
  {
    id: "between-content-1",
    name: "Between Content 1",
    description: "Ad between content sections",
    format: "rectangle",
    network: "placeholder",
    position: "between-content",
    enabled: true,
    priority: 4,
    showOnMobile: true,
    showOnDesktop: true,
    responsive: true,
  },
  {
    id: "between-content-2",
    name: "Between Content 2",
    description: "Second ad between content sections",
    format: "rectangle",
    network: "placeholder",
    position: "between-content",
    enabled: true,
    priority: 5,
    showOnMobile: true,
    showOnDesktop: true,
    responsive: true,
  },
  {
    id: "sidebar-bottom",
    name: "Sidebar Bottom",
    description: "Bottom of sidebar ad",
    format: "skyscraper",
    network: "placeholder",
    position: "sidebar",
    enabled: true,
    priority: 6,
    showOnMobile: false,
    showOnDesktop: true,
    responsive: true,
  },
  {
    id: "footer-ad",
    name: "Footer Banner",
    description: "Bottom of page banner ad",
    format: "leaderboard",
    network: "placeholder",
    position: "footer",
    enabled: true,
    priority: 7,
    showOnMobile: true,
    showOnDesktop: true,
    responsive: true,
  },
  {
    id: "mobile-sticky",
    name: "Mobile Sticky",
    description: "Sticky ad at bottom on mobile",
    format: "mobile-banner",
    network: "placeholder",
    position: "footer",
    enabled: true,
    priority: 8,
    showOnMobile: true,
    showOnDesktop: false,
    responsive: true,
  },
];

export default function AdManager({
  placements = defaultPlacements,
  viewport = "desktop",
  adsEnabled = true,
  className = "",
  onAdClick,
}: AdManagerProps) {
  // Filter placements based on viewport and enabled status
  const filteredPlacements = placements
    .filter((placement) => placement.enabled && adsEnabled)
    .filter((placement) => {
      if (viewport === "mobile") {
        return placement.showOnMobile !== false;
      } else if (viewport === "tablet") {
        return placement.showOnDesktop !== false;
      }
      return placement.showOnDesktop !== false;
    })
    .sort((a, b) => a.priority - b.priority);

  // Group placements by position for easier rendering
  const placementsByPosition = filteredPlacements.reduce(
    (acc, placement) => {
      if (!acc[placement.position]) {
        acc[placement.position] = [];
      }
      acc[placement.position].push(placement);
      return acc;
    },
    {} as Record<string, AdPlacement[]>,
  );

  const handleAdClick = (placementId: string) => {
    if (onAdClick) {
      onAdClick(placementId);
    }

    // Track ad clicks for analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "ad_click", {
        event_category: "ads",
        event_label: placementId,
        value: 1,
      });
    }
  };

  // Handle ad errors (commented out for now)
  // const handleAdError = (placementId: string, error: Error) => {
  //   console.error(`Ad error for placement ${placementId}:`, error);
  // };

  const renderPlacement = (placement: AdPlacement) => {
    const containerClasses = `ad-placement ad-placement-${placement.position} ad-placement-${placement.id}`;

    return (
      <div
        key={placement.id}
        className={containerClasses}
        data-ad-placement={placement.id}
        data-ad-position={placement.position}
        onClick={() => handleAdClick(placement.id)}
      >
        <AdSlot
          slotId={placement.id}
          format={placement.format}
          network={placement.network}
          customContent={placement.customContent}
          googleAdClient={placement.googleAdClient}
          googleAdSlot={placement.googleAdSlot}
          responsive={placement.responsive}
          showPlaceholder={true}
          className="w-full"
        />
      </div>
    );
  };

  const renderPositionGroup = (position: string, placements: AdPlacement[]) => {
    if (position === "sidebar") {
      return (
        <div key={position} className="ad-position-sidebar space-y-4">
          {placements.map(renderPlacement)}
        </div>
      );
    }

    if (position === "between-content") {
      return placements.map(renderPlacement);
    }

    return (
      <div key={position} className={`ad-position-${position} w-full`}>
        {placements.map(renderPlacement)}
      </div>
    );
  };

  if (!adsEnabled || filteredPlacements.length === 0) {
    return null;
  }

  return (
    <div className={`ad-manager ${className}`}>
      {Object.entries(placementsByPosition).map(([position, placements]) =>
        renderPositionGroup(position, placements),
      )}
    </div>
  );
}

// Helper function to get ad placements for specific page types
export function getAdPlacementsForPage(
  pageType: "home" | "downloads" | "about" | "contact" | "blog",
): AdPlacement[] {
  const basePlacements = [...defaultPlacements];

  switch (pageType) {
    case "home":
      return basePlacements.map((placement) => ({
        ...placement,
        // Home page can have more aggressive ad placements
        enabled: placement.position !== "popup",
      }));

    case "downloads":
      return basePlacements.map((placement) => ({
        ...placement,
        // Downloads page might have fewer ads
        enabled: ["header", "content-top", "footer"].includes(
          placement.position,
        ),
      }));

    case "about":
    case "contact":
      return basePlacements.map((placement) => ({
        ...placement,
        // Informational pages have minimal ads
        enabled: placement.position === "footer",
      }));

    default:
      return basePlacements;
  }
}

// Helper function to configure Google AdSense
export function configureGoogleAdSense(
  clientId: string,
  placements: AdPlacement[],
) {
  return placements.map((placement) => ({
    ...placement,
    network: "google-adsense" as AdNetwork,
    googleAdClient: clientId,
    googleAdSlot: placement.id.replace("-", ""),
  }));
}

// Helper to check if user has ad blocker
export function detectAdBlocker(): Promise<boolean> {
  return new Promise((resolve) => {
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    testAd.style.position = "absolute";
    testAd.style.left = "-999px";
    testAd.style.top = "-999px";
    testAd.style.width = "1px";
    testAd.style.height = "1px";
    testAd.style.visibility = "hidden";

    document.body.appendChild(testAd);

    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      resolve(isBlocked);
    }, 100);
  });
}
