"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UnifiedHighlight } from "@/types/highlight";
import HighlightsGridErrorBoundary from "./HighlightsGridErrorBoundary";
import useRTL from "@/hooks/useRTL";

interface HighlightsGridProps {
  highlights: UnifiedHighlight[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  locale: string;
}

function HighlightsGridContent({
  highlights,
  loading = false,
  error = null,
  onRetry,
  locale,
}: HighlightsGridProps) {
  const { isRTL, direction } = useRTL();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (id: string) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-300" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
              <div className="h-3 bg-gray-300 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isRTL ? "فشل تحميل أبرز المباريات" : "Failed to load highlights"}
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isRTL ? "حاول مرة أخرى" : "Try Again"}
          </button>
        )}
      </div>
    );
  }

  if (highlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No highlights found
        </h3>
        <p className="text-gray-600">
          {isRTL
            ? "جرب تعديل الفلاتر أو تحقق لاحقًا للحصول على محتوى جديد."
            : "Try adjusting your filters or check back later for new content."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {highlights.map((highlight) => (
        <Link
          key={highlight.id}
          href={`/highlights/${highlight.id}`}
          className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          dir={direction}
        >
          <div className="relative w-full h-48 overflow-hidden">
            {imageErrors.has(highlight.id) ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            ) : (
              <Image
                src={highlight.thumbnailUrl}
                alt={highlight.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onError={() => handleImageError(highlight.id)}
              />
            )}
            <div
              className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded`}
            >
              {Math.floor(highlight.duration / 60)}:
              {(highlight.duration % 60).toString().padStart(2, "0")}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
              {highlight.title}
            </h3>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium text-gray-900">
                {highlight.teams.home} vs {highlight.teams.away}
              </span>
              {highlight.score && (
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                  {highlight.score.home}-{highlight.score.away}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className={isRTL ? "text-left" : "text-right"}>
                {highlight.competition}
              </span>
              <span className={isRTL ? "text-right" : "text-left"}>
                {new Date(highlight.matchDate).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <svg
                    className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {highlight.views.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <svg
                    className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {highlight.likes.toLocaleString()}
                </span>
              </div>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs capitalize">
                {highlight.provider}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function HighlightsGrid(props: HighlightsGridProps) {
  return (
    <HighlightsGridErrorBoundary onRetry={props.onRetry}>
      <HighlightsGridContent {...props} />
    </HighlightsGridErrorBoundary>
  );
}
