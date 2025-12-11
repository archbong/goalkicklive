"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import Link from "next/link";

interface MobileDownloadBannerProps {
  locale: string;
}

export default function MobileDownloadBanner({
  locale,
}: MobileDownloadBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const isMobile = window.innerWidth < 768;

    // Check if banner was previously closed
    const wasClosed = localStorage.getItem("mobileDownloadBannerClosed");

    // Show banner if on mobile and not closed
    if (isMobile && !wasClosed) {
      // Delay appearance for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true);
    localStorage.setItem("mobileDownloadBannerClosed", "true");
  };

  const handleDownloadClick = () => {
    // Track download click
    console.log("Mobile download banner clicked");
    // In production, you would track this with analytics
    // analytics.track('mobile_download_banner_click');
  };

  if (!isVisible || isClosed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 shadow-2xl border-t border-white/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">
                  Watch Football on Mobile
                </div>
                <div className="text-xs opacity-90">
                  Download app for best streaming experience
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href={`/${locale}/downloads`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 bg-white text-green-700 hover:bg-gray-100 font-bold shadow-lg transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
                onClick={handleDownloadClick}
              >
                <Download className="h-4 w-4 mr-1" />
                GET APP
              </Link>

              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
