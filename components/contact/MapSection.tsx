import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, Maximize2, Minimize2 } from "lucide-react";

interface MapSectionProps {
  title?: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    name?: string;
  };
  variant?: "default" | "minimal" | "interactive" | "card";
  size?: "sm" | "md" | "lg";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showControls?: boolean;
  showAddress?: boolean;
  interactive?: boolean;
  zoom?: number;
  height?: string;
  background?: "light" | "white" | "gradient";
  showDivider?: boolean;
  alignment?: "left" | "center";
  fadeIn?: boolean;
  fullscreen?: boolean;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export function MapSection({
  title,
  description,
  location = {
    lat: 37.7749,
    lng: -122.4194,
    address: "San Francisco, CA",
    name: "Goalkick Live Headquarters",
  },
  variant = "default",
  size = "md",
  className,
  titleClassName,
  descriptionClassName,
  showControls = true,
  showAddress = true,
  interactive = true,
  zoom = 14,
  height = "400px",
  background = "light",
  showDivider = false,
  alignment = "center",
  fadeIn = true,
  fullscreen = false,
  onFullscreenToggle,
}: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!fadeIn);
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const [isLoading, setIsLoading] = useState(true);

  const variantClasses = {
    default: "rounded-xl shadow-md",
    minimal: "rounded-lg",
    interactive: "rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300",
    card: "rounded-xl shadow-lg bg-white",
  };

  const sizeClasses = {
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };

  const titleSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const descriptionSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
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

  // Fade-in effect when component enters viewport
  useEffect(() => {
    if (!fadeIn) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (mapRef.current) observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, [fadeIn]);

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    onFullscreenToggle?.(newFullscreenState);
  };

  // Generate Google Maps embed URL
  const getMapUrl = () => {
    const { lat, lng, address } = location;
    const encodedAddress = encodeURIComponent(address);
    const params = new URLSearchParams({
      q: `${lat},${lng}`,
      z: zoom.toString(),
      output: "embed",
      hl: "en",
    });

    if (interactive) {
      params.set("t", "m");
    }

    return `https://maps.google.com/maps?${params.toString()}`;
  };

  // Handle map load
  const handleMapLoad = () => {
    setIsLoading(false);
  };

  return (
    <section
      className={cn(
        "w-full py-12",
        backgroundClasses[background],
        className
      )}
    >
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div
            className={cn(
              "mb-8 max-w-3xl",
              alignmentClasses[alignment]
            )}
          >
            {title && (
              <h2
                className={cn(
                  "font-bold text-gray-900 mb-4",
                  titleSizeClasses[size],
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "text-gray-600",
                  descriptionSizeClasses[size],
                  descriptionClassName
                )}
              >
                {description}
              </p>
            )}
            {showDivider && (
              <div
                className={cn(
                  "h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6",
                  alignment === "center" ? "mx-auto" : ""
                )}
              />
            )}
          </div>
        )}

        <div
          ref={mapRef}
          className={cn(
            "relative overflow-hidden",
            variantClasses[variant],
            sizeClasses[size],
            fadeIn && "transition-opacity duration-1000",
            fadeIn && (isVisible ? "opacity-100" : "opacity-0"),
            isFullscreen && "fixed inset-0 z-50 !rounded-none !p-0"
          )}
          style={{
            height: isFullscreen ? "100vh" : height,
          }}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          {/* Map iframe */}
          <iframe
            src={getMapUrl()}
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleMapLoad}
            title={`Map showing ${location.address}`}
          />

          {/* Map controls */}
          {showControls && (
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              {interactive && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105"
                  aria-label="Get directions"
                  title="Get directions"
                >
                  <Navigation className="w-5 h-5 text-gray-700" />
                </a>
              )}

              <button
                onClick={handleFullscreenToggle}
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 text-gray-700" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          )}

          {/* Address overlay */}
          {showAddress && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs z-20">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-2">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    {location.name || "Our Location"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {location.address}
                  </p>
                  {interactive && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fullscreen overlay close button */}
          {isFullscreen && (
            <button
              onClick={handleFullscreenToggle}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 z-20"
              aria-label="Exit fullscreen"
            >
              <Minimize2 className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>

        {/* Additional location info */}
        {variant === "card" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Office Hours</h4>
              <p className="text-gray-600 text-sm">
                Mon-Fri: 9:00 AM - 6:00 PM EST
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Parking</h4>
              <p className="text-gray-600 text-sm">
                Street parking available
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Accessibility</h4>
              <p className="text-gray-600 text-sm">
                Wheelchair accessible entrance
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Pre-configured map locations
export const mapLocations = {
  sanFrancisco: {
    lat: 37.7749,
    lng: -122.4194,
    address: "San Francisco, CA 94103, USA",
    name: "Goalkick Live Headquarters",
  },
  london: {
    lat: 51.5074,
    lng: -0.1278,
    address: "London, UK",
    name: "Goalkick Live Europe Office",
  },
  dubai: {
    lat: 25.2048,
    lng: 55.2708,
    address: "Dubai, UAE",
    name: "Goalkick Live Middle East Office",
  },
  singapore: {
    lat: 1.3521,
    lng: 103.8198,
    address: "Singapore",
    name: "Goalkick Live Asia Office",
  },
  newYork: {
    lat: 40.7128,
    lng: -74.0060,
    address: "New York, NY 10001, USA",
    name: "Goalkick Live East Coast Office",
  },
};
