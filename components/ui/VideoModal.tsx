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
  const [videoError, setVideoError] = useState(false);

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
    if (videoError) {
      return (
        <div className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center rounded-lg">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Video Playback Failed
            </h3>
            <p className="text-gray-400 mb-4">
              The video could not be loaded. This is often caused by:
            </p>
            <ul className="text-gray-500 text-sm text-left max-w-md mx-auto mb-6">
              <li className="mb-2">
                • Ad blocker interfering with the video player
              </li>
              <li className="mb-2">
                • Browser restrictions on embedded content
              </li>
              <li className="mb-2">• Network or connectivity issues</li>
              <li>• Temporary service interruption from the video provider</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setVideoError(false);
                  setIsLoading(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  // Try to extract URL from embed HTML
                  if (embedHtml) {
                    const iframeMatch = embedHtml.match(/src="([^"]+)"/);
                    if (iframeMatch && iframeMatch[1]) {
                      window.open(iframeMatch[1], "_blank");
                    }
                  } else if (videoUrl) {
                    window.open(videoUrl, "_blank");
                  }
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (embedHtml) {
      return (
        <VideoPlayer
          embedHtml={embedHtml}
          onError={() => {
            setVideoError(true);
            setIsLoading(false);
          }}
        />
      );
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
            onLoadedData={() => {
              setIsLoading(false);
              setVideoError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setVideoError(true);
            }}
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
          <p className="text-gray-400 mb-4">
            This highlight video is currently not available.
          </p>
          <div className="text-sm text-gray-500">
            <p>No embed HTML or video URL provided.</p>
          </div>
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
          {isLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300">Loading video...</p>
                <p className="text-gray-500 text-sm mt-2">
                  If this takes too long, try disabling your ad blocker
                </p>
              </div>
            </div>
          )}

          <div
            className={`${isLoading && !videoError ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
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
