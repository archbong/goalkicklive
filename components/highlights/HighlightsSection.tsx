// components/highlights/HighlightsSection.tsx
import { getHighlightsService } from "@/lib/services/highlights.service";
import { HighlightsGrid } from "./HighlightsGrid";
import { Trophy, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { UnifiedHighlight } from "@/types/highlight";

interface HighlightsSectionProps {
  title?: string;
  description?: string;
  variant?: "featured" | "recent" | "live" | "competition";
  competition?: string;
  team?: string;
  limit?: number;
  columns?: 1 | 2 | 3 | 4;
  showViewAll?: boolean;
  viewAllHref?: string;
  className?: string;
  background?: "light" | "dark" | "gradient" | "transparent";
  showFilters?: boolean;
  showStats?: boolean;
}

export async function HighlightsSection({
  title = "Latest Match Highlights",
  description = "Watch the best moments from today's top football matches",
  variant = "featured",
  competition,
  team,
  limit = 6,
  columns = 3,
  showViewAll = true,
  viewAllHref = "/highlights",
  className = "",
  background = "light",
  showFilters = false,
  showStats = true,
}: HighlightsSectionProps) {
  // Initialize highlights service
  const highlightsService = getHighlightsService();

  let highlights: UnifiedHighlight[] = [];
  let stats = null;

  try {
    // Fetch highlights based on variant
    switch (variant) {
      case "featured":
        highlights = await highlightsService.getFeaturedHighlights(limit);
        break;
      case "recent":
        highlights = await highlightsService.getRecentHighlights(limit);
        break;
      case "live":
        highlights = await highlightsService.getLiveMatches();
        if (limit > 0) {
          highlights = highlights.slice(0, limit);
        }
        break;
      case "competition":
        if (competition) {
          highlights =
            await highlightsService.getHighlightsByCompetition(competition);
          if (limit > 0) {
            highlights = highlights.slice(0, limit);
          }
        }
        break;
      default:
        const response = await highlightsService.getHighlights({
          page: 1,
          pageSize: limit,
        });
        highlights = response.highlights;
        break;
    }

    // Get stats if requested
    if (showStats) {
      try {
        const [competitions, teams, allHighlights] = await Promise.all([
          highlightsService.getCompetitions(),
          highlightsService.getTeams(),
          highlightsService.getHighlights({ pageSize: 1 }),
        ]);

        stats = {
          totalCompetitions: competitions.length,
          totalTeams: teams.length,
          totalHighlights: allHighlights.totalCount,
        };
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }
  } catch (error) {
    console.error("Failed to fetch highlights:", error);
    // Return empty highlights array on error
    highlights = [];
  }

  // Background classes
  const backgroundClasses = {
    light: "bg-gray-50",
    dark: "bg-gray-900 text-white",
    gradient: "bg-gradient-to-br from-gray-50 to-white",
    transparent: "bg-transparent",
  };

  // Determine if we should show empty state
  const showEmptyState = highlights.length === 0;

  return (
    <section
      className={`py-12 md:py-16 ${backgroundClasses[background]} ${className}`}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                {variant === "live" ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">⚽ LIVE NOW</span>
                  </>
                ) : variant === "featured" ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">🔥 FEATURED</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">⚽ HIGHLIGHTS</span>
                  </>
                )}
              </div>

              {/* Title and Description */}
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                {description}
              </p>

              {/* Stats */}
              {showStats && stats && (
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.totalCompetitions}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Competitions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.totalTeams}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Teams
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.totalHighlights.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Highlights
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* View All Button */}
            {showViewAll && !showEmptyState && (
              <Link
                href={viewAllHref}
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                View All Highlights
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Highlights Grid */}
        {showEmptyState ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              No Highlights Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              {variant === "live"
                ? "There are no live matches at the moment. Check back later!"
                : "We're currently updating our highlights library. Please check back soon!"}
            </p>
            <Link
              href="/highlights"
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Browse All Highlights
            </Link>
          </div>
        ) : (
          <>
            <HighlightsGrid
              highlights={highlights}
              columns={columns}
              variant={variant === "featured" ? "featured" : "default"}
              size="md"
              showFilters={showFilters}
              showPagination={false}
            />

            {/* View All Footer */}
            {showViewAll && highlights.length >= limit && (
              <div className="mt-8 text-center">
                <Link
                  href={viewAllHref}
                  className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold"
                >
                  View all highlights
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// Competition-specific highlights section
export async function CompetitionHighlights({
  competition,
  limit = 6,
  ...props
}: Omit<HighlightsSectionProps, "variant" | "competition"> & {
  competition: string;
}) {
  return (
    <HighlightsSection
      {...props}
      variant="competition"
      competition={competition}
      limit={limit}
      title={`${competition} Highlights`}
      description={`Latest match highlights from ${competition}`}
    />
  );
}

// Team-specific highlights section
export async function TeamHighlights({
  team,
  limit = 6,
  ...props
}: Omit<HighlightsSectionProps, "variant" | "team"> & {
  team: string;
}) {
  return (
    <HighlightsSection
      {...props}
      title={`${team} Highlights`}
      description={`Latest match highlights featuring ${team}`}
      viewAllHref={`/highlights?team=${encodeURIComponent(team)}`}
    />
  );
}

// Live matches section
export async function LiveMatchesSection({
  limit = 6,
  ...props
}: Omit<HighlightsSectionProps, "variant">) {
  return (
    <HighlightsSection
      {...props}
      variant="live"
      limit={limit}
      title="Live Matches"
      description="Watch matches happening right now"
      background="dark"
      showViewAll={false}
    />
  );
}

// Featured highlights section
export async function FeaturedHighlightsSection({
  limit = 6,
  ...props
}: Omit<HighlightsSectionProps, "variant">) {
  return (
    <HighlightsSection
      {...props}
      variant="featured"
      limit={limit}
      title="Featured Highlights"
      description="Top matches selected by our editors"
    />
  );
}

// Recent highlights section
export async function RecentHighlightsSection({
  limit = 6,
  ...props
}: Omit<HighlightsSectionProps, "variant">) {
  return (
    <HighlightsSection
      {...props}
      title="Recent Highlights"
      description="Latest match highlights from around the world"
      limit={limit}
    />
  );
}
