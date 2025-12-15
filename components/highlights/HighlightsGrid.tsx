// components/highlights/HighlightsGrid.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  PlayCircle,
  Calendar,
  Users,
  Trophy,
  Eye,
  Heart,
  ExternalLink,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { UnifiedHighlight } from "@/types/highlight";
import { Button } from "@/components/ui/Button";
import VideoModal from "@/components/ui/VideoModal";

interface HighlightsGridProps {
  highlights: UnifiedHighlight[];
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
  variant?: "default" | "compact" | "featured" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  onHighlightClick?: (highlight: UnifiedHighlight) => void;
  loading?: boolean;
  loadingSkeletonCount?: number;
}

export function HighlightsGrid({
  highlights,
  title,
  description,
  columns = 3,
  variant = "default",
  size = "md",
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  showFilters = false,
  showSearch = false,
  showPagination = false,
  itemsPerPage = 12,
  onHighlightClick,
  loading = false,
  loadingSkeletonCount = 6,
}: HighlightsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredHighlights, setFilteredHighlights] =
    useState<UnifiedHighlight[]>(highlights);
  const [selectedCompetition, setSelectedCompetition] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedHighlight, setSelectedHighlight] =
    useState<UnifiedHighlight | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Extract unique competitions and teams for filters
  const competitions = Array.from(
    new Set(highlights.map((h) => h.competition)),
  ).filter(Boolean);
  const teams = Array.from(
    new Set([
      ...highlights.map((h) => h.teams.home),
      ...highlights.map((h) => h.teams.away),
    ]),
  ).filter(Boolean);

  // Apply filters when they change
  useEffect(() => {
    let filtered = [...highlights];

    if (selectedCompetition && selectedCompetition !== "all") {
      filtered = filtered.filter((h) =>
        h.competition.toLowerCase().includes(selectedCompetition.toLowerCase()),
      );
    }

    if (selectedTeam && selectedTeam !== "all") {
      filtered = filtered.filter(
        (h) =>
          h.teams.home.toLowerCase().includes(selectedTeam.toLowerCase()) ||
          h.teams.away.toLowerCase().includes(selectedTeam.toLowerCase()),
      );
    }

    setFilteredHighlights(filtered);
    setCurrentPage(1);
  }, [selectedCompetition, selectedTeam, highlights]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredHighlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHighlights = filteredHighlights.slice(startIndex, endIndex);

  // Grid column classes
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  // Size classes
  const sizeClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  // Card size classes
  const cardSizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  // Title size classes
  const titleSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  // Description size classes
  const descriptionSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Format date
  const formatDate = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Format time
  const formatTime = (date: Date) => {
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  };

  const handleCardClick = (highlight: UnifiedHighlight) => {
    if (onHighlightClick) {
      onHighlightClick(highlight);
    } else {
      setSelectedHighlight(highlight);
      setIsVideoModalOpen(true);
    }
  };

  const renderHighlightCard = (highlight: UnifiedHighlight, index: number) => {
    const isFeatured = variant === "featured";
    const isCompact = variant === "compact";
    const isMinimal = variant === "minimal";

    return (
      <div
        key={highlight.id}
        className={cn(
          "group relative overflow-hidden rounded-xl transition-all duration-300",
          "bg-white shadow-md hover:shadow-xl",
          "border border-gray-200 hover:border-green-300",
          "cursor-pointer transform hover:-translate-y-1",
          cardSizeClasses[size],
          isFeatured && "bg-gradient-to-br from-white to-gray-50",
          isCompact && "p-3",
          isMinimal && "bg-transparent border-0 shadow-none hover:shadow-none",
        )}
        onClick={() => handleCardClick(highlight)}
      >
        {/* Thumbnail */}
        {!isMinimal && (
          <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="aspect-video flex items-center justify-center">
              {highlight.thumbnailUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${highlight.thumbnailUrl})` }}
                />
              ) : (
                <div className="text-center p-8">
                  <PlayCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-500 text-sm">
                    Match Highlights
                  </span>
                </div>
              )}
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                <PlayCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Duration badge */}
            {highlight.duration && !isCompact && (
              <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                {Math.floor(highlight.duration / 60)}:
                {(highlight.duration % 60).toString().padStart(2, "0")}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(isMinimal ? "space-y-2" : "space-y-3")}>
          {/* Competition */}
          {!isMinimal && highlight.competition && (
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 truncate">
                {highlight.competition}
              </span>
            </div>
          )}

          {/* Teams and Score */}
          <div className={cn("space-y-2", isMinimal && "space-y-1")}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-semibold text-gray-900 truncate",
                    isMinimal ? "text-sm" : "text-base",
                  )}
                >
                  {highlight.teams.home} vs {highlight.teams.away}
                </h3>
              </div>
              {highlight.score && (
                <div
                  className={cn("font-bold", isMinimal ? "text-sm" : "text-lg")}
                >
                  <span className="text-gray-900">{highlight.score.home}</span>
                  <span className="text-gray-400 mx-1">-</span>
                  <span className="text-gray-900">{highlight.score.away}</span>
                </div>
              )}
            </div>

            {/* Date and Time */}
            {!isCompact && !isMinimal && (
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(highlight.matchDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{formatTime(highlight.matchDate)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {!isCompact && !isMinimal && highlight.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {highlight.description}
            </p>
          )}

          {/* Engagement Stats */}
          {!isMinimal && (highlight.views > 0 || highlight.likes > 0) && (
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              {highlight.views > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{highlight.views.toLocaleString()}</span>
                </div>
              )}
              {highlight.likes > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Heart className="w-4 h-4" />
                  <span>{highlight.likes.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Provider Badge */}
          {!isMinimal && (
            <div className="pt-2">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  "bg-green-100 text-green-800",
                )}
              >
                Scorebat
                <ExternalLink className="w-3 h-3 ml-1" />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () => {
    return Array.from({ length: loadingSkeletonCount }).map((_, index) => (
      <div
        key={index}
        className={cn(
          "rounded-xl bg-gray-100 animate-pulse",
          cardSizeClasses[size],
        )}
      >
        <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ));
  };

  const renderEmptyState = () => (
    <div className="col-span-full text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
        <Trophy className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        No Highlights Found
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        {selectedCompetition || selectedTeam
          ? "No highlights match your current filters. Try adjusting your search criteria."
          : "No highlights available at the moment. Please check back later!"}
      </p>
      {(selectedCompetition || selectedTeam) && (
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedCompetition("");
            setSelectedTeam("");
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  const filterHighlights = (competition: string, team: string) => {
    setSelectedCompetition(competition);
    setSelectedTeam(team);
  };

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h2
                className={cn(
                  "font-bold text-gray-900 mb-2",
                  titleSizeClasses[size],
                  titleClassName,
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
                  descriptionClassName,
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Filters and Search */}
        {(showFilters || showSearch) && (
          <div className="space-y-4">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search highlights..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = highlights.filter(
                      (h) =>
                        h.title.toLowerCase().includes(searchTerm) ||
                        h.description.toLowerCase().includes(searchTerm) ||
                        h.teams.home.toLowerCase().includes(searchTerm) ||
                        h.teams.away.toLowerCase().includes(searchTerm) ||
                        h.competition.toLowerCase().includes(searchTerm),
                    );
                    setFilteredHighlights(filtered);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}

            {showFilters && (
              <div className="flex flex-wrap gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={selectedCompetition}
                  onChange={(e) =>
                    filterHighlights(e.target.value, selectedTeam)
                  }
                >
                  <option value="">All Competitions</option>
                  {competitions.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={selectedTeam}
                  onChange={(e) =>
                    filterHighlights(selectedCompetition, e.target.value)
                  }
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => filterHighlights("", "")}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Highlights Grid */}
        <div className={cn("grid", gridColumns[columns], sizeClasses[size])}>
          {loading
            ? renderLoadingSkeleton()
            : paginatedHighlights.length > 0
              ? paginatedHighlights.map((highlight, index) =>
                  renderHighlightCard(highlight, index),
                )
              : renderEmptyState()}
        </div>

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredHighlights.length)} of{" "}
              {filteredHighlights.length} highlights
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={
                        currentPage === pageNum ? "default" : "secondary"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="min-w-[40px]"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setSelectedHighlight(null);
        }}
        title={selectedHighlight?.title}
        videoUrl={selectedHighlight?.videoUrl}
        embedHtml={selectedHighlight?.embedUrl}
        thumbnailUrl={selectedHighlight?.thumbnailUrl}
        description={selectedHighlight?.description}
        competition={selectedHighlight?.competition}
        teams={selectedHighlight?.teams}
        score={selectedHighlight?.score}
      />
    </>
  );
}
