// components/highlights/CompetitionsList.tsx
import { Trophy } from "lucide-react";
import Link from "next/link";
import { getHighlightsService } from "@/lib/services/highlights.service";

interface CompetitionsListProps {
  limit?: number;
  showCount?: boolean;
  className?: string;
  initialCompetitions?: string[];
}

export async function CompetitionsList({
  limit = 12,
  showCount = true,
  className = "",
  initialCompetitions,
}: CompetitionsListProps) {
  // Initialize highlights service
  const highlightsService = getHighlightsService();

  let competitions: string[] = initialCompetitions || [];

  // Only fetch from API if initial data is not provided
  if (!initialCompetitions) {
    try {
      // Fetch competitions
      competitions = await highlightsService.getCompetitions();

      // Apply limit
      if (limit > 0 && competitions.length > limit) {
        competitions = competitions.slice(0, limit);
      }
    } catch (error) {
      console.error("Failed to fetch competitions:", error);
      // Fallback competitions
      competitions = [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
        "Champions League",
        "Europa League",
        "FA Cup",
        "Copa del Rey",
        "Coppa Italia",
        "MLS",
        "Eredivisie",
      ].slice(0, limit);
    }
  }

  // Apply limit to initial competitions if provided
  if (limit > 0 && competitions.length > limit) {
    competitions = competitions.slice(0, limit);
  }

  // Group competitions by region/category for better organization
  const categorizedCompetitions = competitions.reduce(
    (acc, competition) => {
      const lowerComp = competition.toLowerCase();

      if (lowerComp.includes("premier") || lowerComp.includes("english")) {
        acc.england.push(competition);
      } else if (
        lowerComp.includes("la liga") ||
        lowerComp.includes("spanish")
      ) {
        acc.spain.push(competition);
      } else if (lowerComp.includes("serie") || lowerComp.includes("italian")) {
        acc.italy.push(competition);
      } else if (
        lowerComp.includes("bundesliga") ||
        lowerComp.includes("german")
      ) {
        acc.germany.push(competition);
      } else if (lowerComp.includes("ligue") || lowerComp.includes("french")) {
        acc.france.push(competition);
      } else if (
        lowerComp.includes("champions") ||
        lowerComp.includes("europa") ||
        lowerComp.includes("uefa")
      ) {
        acc.europe.push(competition);
      } else if (lowerComp.includes("cup") || lowerComp.includes("trophy")) {
        acc.cups.push(competition);
      } else {
        acc.other.push(competition);
      }

      return acc;
    },
    {
      england: [] as string[],
      spain: [] as string[],
      italy: [] as string[],
      germany: [] as string[],
      france: [] as string[],
      europe: [] as string[],
      cups: [] as string[],
      other: [] as string[],
    },
  );

  // Flatten categorized competitions while maintaining some order
  const displayCompetitions = [
    ...categorizedCompetitions.england,
    ...categorizedCompetitions.spain,
    ...categorizedCompetitions.italy,
    ...categorizedCompetitions.germany,
    ...categorizedCompetitions.france,
    ...categorizedCompetitions.europe,
    ...categorizedCompetitions.cups,
    ...categorizedCompetitions.other,
  ].slice(0, limit);

  if (displayCompetitions.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          No competitions available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayCompetitions.map((competition, index) => (
          <Link
            key={`${competition}-${index}`}
            href={`/highlights?competition=${encodeURIComponent(competition)}`}
            className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-700">
                {competition}
              </h4>
              {showCount && (
                <p className="text-xs text-gray-500 mt-1">
                  Latest highlights available
                </p>
              )}
            </div>
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        ))}
      </div>

      {/* Competition categories summary */}
      {Object.values(categorizedCompetitions).some((arr) => arr.length > 0) && (
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 justify-center">
            {categorizedCompetitions.england.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                England: {categorizedCompetitions.england.length}
              </span>
            )}
            {categorizedCompetitions.spain.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Spain: {categorizedCompetitions.spain.length}
              </span>
            )}
            {categorizedCompetitions.italy.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Italy: {categorizedCompetitions.italy.length}
              </span>
            )}
            {categorizedCompetitions.germany.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                Germany: {categorizedCompetitions.germany.length}
              </span>
            )}
            {categorizedCompetitions.france.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                France: {categorizedCompetitions.france.length}
              </span>
            )}
            {categorizedCompetitions.europe.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Europe: {categorizedCompetitions.europe.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
