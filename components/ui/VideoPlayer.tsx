import DOMPurify from "dompurify";
import { useEffect, useRef, useState, useMemo } from "react";

interface VideoPlayerProps {
  embedHtml: string;
  onError?: () => void;
}

export default function VideoPlayer({ embedHtml, onError }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [showAutoplayHint, setShowAutoplayHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const errorCheckTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Process embed HTML to fix common issues
  const processedHtml = useMemo(() => {
    let html = embedHtml;

    // Try to extract iframe src for processing
    const iframeMatch = html.match(/<iframe[^>]*src="([^"]+)"[^>]*>/i);
    if (iframeMatch) {
      const fullIframeTag = iframeMatch[0];
      let src = iframeMatch[1];
      let modified = false;

      // Check if src is a base64 string without a protocol (common Scorebat issue)
      if (src.match(/^[A-Za-z0-9+/]+=*(\?|$)/)) {
        console.log(
          "VideoPlayer: Detected base64 iframe src, attempting to fix...",
        );

        // Check if it's missing the Scorebat domain
        if (
          !src.startsWith("http://") &&
          !src.startsWith("https://") &&
          !src.startsWith("data:")
        ) {
          // Try to construct a proper Scorebat URL
          // Scorebat iframes typically use their embed endpoint
          const fixedSrc = `https://www.scorebat.com/embed/${src}`;
          console.log(
            `VideoPlayer: Fixed iframe src from ${src.substring(0, 50)}... to ${fixedSrc.substring(0, 50)}...`,
          );

          // Replace the src in the iframe tag
          html = html.replace(/src="[^"]+"/i, `src="${fixedSrc}"`);
          modified = true;
        }
      }

      // Ensure iframe has proper attributes
      if (!html.includes(" width=") && !html.includes(' width="')) {
        html = html.replace(/<iframe/i, '<iframe width="100%"');
        modified = true;
      }
      if (!html.includes(" height=") && !html.includes(' height="')) {
        html = html.replace(/<iframe/i, '<iframe height="100%"');
        modified = true;
      }
      if (
        !html.includes(" allowfullscreen") &&
        !html.includes(' allowfullscreen="')
      ) {
        html = html.replace(/<iframe/i, "<iframe allowfullscreen");
        modified = true;
      }
      if (!html.includes(" frameborder=") && !html.includes(' frameborder="')) {
        html = html.replace(/<iframe/i, '<iframe frameborder="0"');
        modified = true;
      }
      // Add autoplay permission for modern browsers
      if (!html.includes(' allow="') && !html.includes(" allow=")) {
        html = html.replace(
          /<iframe/i,
          '<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"',
        );
        modified = true;
      }

      if (modified) {
        console.log(
          "VideoPlayer: Modified embed HTML to fix iframe attributes",
        );
      }
    }

    return html;
  }, [embedHtml]);

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(processedHtml, {
    ADD_TAGS: ["iframe", "div"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "style",
      "width",
      "height",
    ],
    ALLOWED_URI_REGEXP: /.*/,
  });

  // Monitor iframe loading
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const iframe = container.querySelector("iframe");

    if (!iframe) {
      console.error("VideoPlayer: No iframe found in embed HTML");
      setHasError(true);
      return;
    }

    // Clear previous timeouts
    errorCheckTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
    errorCheckTimeouts.current = [];

    // Log iframe src for debugging
    console.log("VideoPlayer: iframe src:", iframe.src);
    console.log("VideoPlayer: iframe dimensions:", {
      width: iframe.width,
      height: iframe.height,
      styleWidth: iframe.style.width,
      styleHeight: iframe.style.height,
    });

    // Set debug info for display
    setDebugInfo(`iframe src: ${iframe.src.substring(0, 100)}...`);

    // Check if iframe has autoplay permission
    if (iframe.allow) {
      console.log("VideoPlayer: iframe allow attribute:", iframe.allow);
    } else {
      console.log("VideoPlayer: iframe missing allow attribute");
    }

    const handleLoad = () => {
      console.log("VideoPlayer: iframe loaded successfully");
      setHasError(false);

      // Check if iframe is actually visible
      setTimeout(() => {
        if (iframe) {
          const rect = iframe.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          const visibilityInfo = {
            width: rect.width,
            height: rect.height,
            isVisible,
            top: rect.top,
            left: rect.left,
            inViewport:
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <=
                (window.innerWidth || document.documentElement.clientWidth),
          };
          console.log("VideoPlayer: iframe visibility check:", visibilityInfo);

          // Update debug info
          setDebugInfo(
            (prev) =>
              prev + ` | Visible: ${isVisible} (${rect.width}x${rect.height})`,
          );

          // If iframe has dimensions but content might not be visible, try to trigger play
          if (isVisible && iframe.src.includes("autoplay=1")) {
            console.log("VideoPlayer: iframe is visible with autoplay enabled");

            // Show autoplay hint after a delay if video might be blocked
            const autoplayHintTimeout = setTimeout(() => {
              // Check if iframe still appears empty (no video playing)
              // We can't directly check video state due to cross-origin restrictions
              // So we show hint based on common autoplay blocking scenarios
              setShowAutoplayHint(true);
            }, 3000);

            errorCheckTimeouts.current.push(
              autoplayHintTimeout as NodeJS.Timeout,
            );
          }

          // If iframe has zero dimensions, log CSS info
          if (!isVisible) {
            console.log("VideoPlayer: iframe CSS styles:", {
              display: iframe.style.display,
              visibility: iframe.style.visibility,
              position: iframe.style.position,
              zIndex: iframe.style.zIndex,
              opacity: iframe.style.opacity,
            });

            // Check parent container
            const container = containerRef.current;
            if (container) {
              const containerRect = container.getBoundingClientRect();
              console.log("VideoPlayer: container dimensions:", {
                width: containerRect.width,
                height: containerRect.height,
                display: container.style.display,
              });
            }
          }
        }
      }, 500);
    };

    const handleError = () => {
      console.warn("VideoPlayer: iframe error event fired");
      console.warn("VideoPlayer: iframe src:", iframe.src);

      // Check if iframe is actually in error state
      // Some browsers fire error events for minor issues
      const errorCheckTimeout = setTimeout(() => {
        try {
          // Check if iframe has loaded at least partially
          if (iframe.contentWindow) {
            console.log(
              "VideoPlayer: iframe has window despite error event - ignoring error",
            );
            return;
          }
        } catch (e) {
          // Cross-origin error - can't check
          console.log(
            "VideoPlayer: cross-origin iframe, error may be false positive",
          );
        }

        // Only show error if iframe is still problematic after a delay
        console.error("VideoPlayer: iframe confirmed failed to load");
        setHasError(true);
        if (onError) onError();
      }, 2000); // Wait 2 seconds to confirm error

      // Store timeout ID for cleanup
      errorCheckTimeouts.current.push(errorCheckTimeout as NodeJS.Timeout);
    };

    // Add event listeners
    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);

    // Set a timeout to detect if iframe never loads
    const timeoutId = setTimeout(() => {
      // Check if iframe has loaded
      try {
        // For cross-origin iframes, accessing contentWindow may throw an error
        if (iframe.contentWindow) {
          // Iframe has a window object, it's likely loaded
          console.log("VideoPlayer: iframe has window object, assuming loaded");
        } else {
          console.warn(
            "VideoPlayer: iframe loading timeout - no content window",
          );
          // Don't immediately show error - check if iframe is visible first
          if (iframe.offsetWidth > 0 && iframe.offsetHeight > 0) {
            console.log(
              "VideoPlayer: iframe has dimensions, not showing error",
            );
          } else {
            setHasError(true);
            if (onError) onError();
          }
        }
      } catch (e) {
        // Cross-origin error - can't access contentWindow
        // This is normal for YouTube/Vimeo/Scorebat embeds
        console.log(
          "VideoPlayer: timeout check - cross-origin iframe (normal)",
        );
        // Check if iframe is at least visible
        if (iframe.offsetWidth > 0 && iframe.offsetHeight > 0) {
          console.log(
            "VideoPlayer: cross-origin iframe is visible, not showing error",
          );
        } else {
          console.warn(
            "VideoPlayer: cross-origin iframe not visible after timeout",
          );
          setHasError(true);
          if (onError) onError();
        }
      }
    }, 15000); // 15 second timeout (more generous)

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
      clearTimeout(timeoutId);
      // Clear all error check timeouts
      errorCheckTimeouts.current.forEach((timeoutId) =>
        clearTimeout(timeoutId),
      );
      errorCheckTimeouts.current = [];
      setShowAutoplayHint(false);
    };
  }, [sanitizedHtml, onError]);

  if (hasError) {
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
            Video Playback Issue
          </h3>
          <p className="text-gray-400 mb-4">
            The video could not be loaded. Try these troubleshooting steps:
          </p>
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
            <p className="text-blue-300 text-sm mb-2">
              <strong>First try:</strong> Hard refresh the page (Ctrl+F5 or
              Cmd+Shift+R) to clear cache
            </p>
          </div>
          <ul className="text-gray-500 text-sm text-left max-w-md mx-auto mb-6">
            <li className="mb-2">
              • <strong>Click the video area</strong> - Some browsers require
              user interaction
            </li>
            <li className="mb-2">
              • <strong>Check browser console</strong> (F12) for specific errors
            </li>
            <li className="mb-2">
              • <strong>Try a different browser</strong> (Chrome, Firefox,
              Safari)
            </li>
            <li className="mb-2">
              • <strong>Disable browser extensions</strong> that might interfere
            </li>
            <li className="mb-2">
              • <strong>Check network connectivity</strong> - The video might be
              temporarily unavailable
            </li>
            <li>
              • <strong>Scorebat/YouTube service issue</strong> - Try again
              later
            </li>
            <li className="mb-2">
              • <strong>Clear browser cache</strong> - Old cached code might be
              causing issues
            </li>
          </ul>
          {debugInfo && (
            <div className="mb-4 p-3 bg-gray-800 rounded text-xs text-gray-300 font-mono">
              Debug: {debugInfo}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setHasError(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                // Try to open the video in a new tab
                const iframe = containerRef.current?.querySelector("iframe");
                if (iframe?.src) {
                  window.open(iframe.src, "_blank");
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

  return (
    <div className="w-full aspect-video">
      <div
        ref={containerRef}
        className="w-full h-full bg-black overflow-hidden rounded-lg relative"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        style={{
          border: "2px solid #00ff00", // Green border when working
          boxSizing: "border-box",
        }}
      />
      {debugInfo && (
        <div className="mt-2 p-2 bg-blue-100 text-blue-800 text-xs rounded font-mono">
          Status: {debugInfo}
        </div>
      )}
      {showAutoplayHint && !hasError && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Video may be blocked from autoplaying
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Most browsers block videos from autoplaying. Try:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Clicking directly on the video area</li>
                  <li>Looking for a play button in the video player</li>
                  <li>Refreshing the page and clicking immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">
        Debug: Green border means video container is loaded. If you see this but
        no video, the issue is likely with the video provider (Scorebat/YouTube)
        or autoplay being blocked. Try hard refresh (Ctrl+F5) to clear cache.
      </div>
    </div>
  );
}
