"use client";

import { useState, useEffect, ReactNode } from "react";
import useRTL from "@/hooks/useRTL";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  fallback?: ReactNode;
}

export default function HighlightsGridErrorBoundary({
  children,
  onRetry,
  fallback,
}: Props) {
  const { isRTL, direction } = useRTL();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("HighlightsGrid Error:", event.error);
      setHasError(true);
      setError(event.error);
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("HighlightsGrid Promise Rejection:", event.reason);
      setHasError(true);
      setError(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
      );
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", unhandledRejectionHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener(
        "unhandledrejection",
        unhandledRejectionHandler,
      );
    };
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setError(undefined);
    onRetry?.();
  };

  if (hasError) {
    if (fallback) {
      return fallback;
    }

    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        dir={direction}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isRTL ? "فشل تحميل أبرز المباريات" : "Failed to load highlights"}
        </h3>

        <p className="text-gray-600 mb-6 max-w-md">
          {isRTL
            ? "واجهنا مشكلة أثناء تحميل أبرز المباريات. قد تكون هذه مشكلة مؤقتة."
            : "We encountered a problem while loading the match highlights. This might be a temporary issue."}
        </p>

        <button
          onClick={handleRetry}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {isRTL ? "حاول مرة أخرى" : "Try Again"}
        </button>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-6 text-left w-full max-w-md">
            <summary className="cursor-pointer text-sm text-gray-500 font-medium">
              Error Details (Development)
            </summary>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mt-2">
              {error.toString()}
            </pre>
          </details>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
