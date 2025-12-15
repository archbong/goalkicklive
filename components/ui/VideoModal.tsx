// components/ui/VideoModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { Button } from "./Button";
import VideoPlayer from "./VideoPlayer";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  videoUrl?: string;
  embedHtml?: string;
  thumbnailUrl?: string;
  description?: string;
  competition?: string;
  teams?: {
    home: string;
    away: string;
  };
  score?: {
    home: number;
    away: number;
  };
}

export default function VideoModal({
  isOpen,
  onClose,
  title = "Match Highlights",
  videoUrl,
  embedHtml,
  thumbnailUrl,
  description,
  competition,
  teams,
  score,
}: VideoModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Determine what to render in the video player
  const renderVideoContent = () => {
    if (embedHtml) {
      return <VideoPlayer embedHtml={embedHtml} />;
    }

    if (videoUrl) {
      // Check if it's a YouTube URL
      const isYouTube =
        videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
      const isVimeo = videoUrl.includes("vimeo.com");

      if (isYouTube) {
        // Extract YouTube video ID
        let videoId = "";
        if (videoUrl.includes("youtube.com/watch?v=")) {
          videoId = videoUrl.split("v=")[1]?.split("&")[0] || "";
        } else if (videoUrl.includes("youtu.be/")) {
          videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0] || "";
        }

        if (videoId) {
          const youtubeEmbed = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          return <VideoPlayer embedHtml={youtubeEmbed} />;
        }
      } else if (isVimeo) {
        // Extract Vimeo video ID
        const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
          const vimeoEmbed = `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
          return <VideoPlayer embedHtml={vimeoEmbed} />;
        }
      }

      // For direct video URLs, use HTML5 video player
      return (
        <div className="w-full aspect-video bg-black overflow-hidden rounded-lg">
          <video
            className="w-full h-full"
            controls
            autoPlay
            muted={isMuted}
            onLoadedData={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Fallback if no video content
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center rounded-lg">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Video Unavailable
          </h3>
          <p className="text-gray-400">
            This highlight video is currently not available.
          </p>
        </div>
      </div>
    );
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "max-w-6xl w-full max-h-[90vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800 bg-gray-900/95">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-white truncate">
              {title}
            </h2>
            {competition && (
              <p className="text-sm text-gray-400 truncate">{competition}</p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {/* Mute/Unmute button */}
            {videoUrl && !embedHtml && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            )}

            {/* Fullscreen toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={handleFullscreenToggle}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </Button>

            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Video Content */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300">Loading video...</p>
              </div>
            </div>
          )}

          <div
            className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          >
            {renderVideoContent()}
          </div>
        </div>

        {/* Video Info */}
        {(description || teams || score) && (
          <div className="p-4 md:p-6 border-t border-gray-800 bg-gray-900/95">
            {/* Teams and Score */}
            {teams && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-lg font-semibold text-white">
                        {teams.home}
                      </p>
                    </div>
                    {score && (
                      <div className="mx-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">
                            {score.home}
                          </span>
                          <span className="text-gray-400">-</span>
                          <span className="text-2xl font-bold text-white">
                            {score.away}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="text-center flex-1">
                      <p className="text-lg font-semibold text-white">
                        {teams.away}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Description
                </h4>
                <p className="text-gray-300">{description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
