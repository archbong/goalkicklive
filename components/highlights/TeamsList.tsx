// components/highlights/TeamsList.tsx
import { Users, Shield } from "lucide-react";
import Link from "next/link";
import { getHighlightsService } from "@/lib/services/highlights.service";

interface TeamsListProps {
  limit?: number;
  showCount?: boolean;
  className?: string;
  initialTeams?: string[];
}

export async function TeamsList({
  limit = 15,
  showCount = true,
  className = "",
  initialTeams,
}: TeamsListProps) {
  // Initialize highlights service
  const highlightsService = getHighlightsService();

  let teams: string[] = initialTeams || [];

  // Only fetch from API if initial data is not provided
  if (!initialTeams) {
    try {
      // Fetch teams
      teams = await highlightsService.getTeams();

      // Apply limit
      if (limit > 0 && teams.length > limit) {
        teams = teams.slice(0, limit);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      // Fallback teams
      teams = [
        "Arsenal",
        "Chelsea",
        "Liverpool",
        "Manchester City",
        "Manchester United",
        "Tottenham",
        "Real Madrid",
        "Barcelona",
        "Atletico Madrid",
        "Bayern Munich",
        "Borussia Dortmund",
        "Juventus",
        "AC Milan",
        "Inter Milan",
        "Paris Saint-Germain",
        "Ajax",
        "Benfica",
        "Porto",
        "Celtic",
        "Rangers",
      ].slice(0, limit);
    }
  }

  // Apply limit to initial teams if provided
  if (limit > 0 && teams.length > limit) {
    teams = teams.slice(0, limit);
  }

  // Group teams by country/league for better organization
  const categorizedTeams = teams.reduce(
    (acc, team) => {
      const lowerTeam = team.toLowerCase();

      // Premier League teams
      if (
        lowerTeam.includes("arsenal") ||
        lowerTeam.includes("chelsea") ||
        lowerTeam.includes("liverpool") ||
        lowerTeam.includes("manchester") ||
        lowerTeam.includes("tottenham") ||
        lowerTeam.includes("everton") ||
        lowerTeam.includes("leicester") ||
        lowerTeam.includes("west ham") ||
        lowerTeam.includes("newcastle")
      ) {
        acc.england.push(team);
      }
      // La Liga teams
      else if (
        lowerTeam.includes("real madrid") ||
        lowerTeam.includes("barcelona") ||
        lowerTeam.includes("atletico") ||
        lowerTeam.includes("sevilla") ||
        lowerTeam.includes("valencia") ||
        lowerTeam.includes("villareal") ||
        lowerTeam.includes("real sociedad")
      ) {
        acc.spain.push(team);
      }
      // Serie A teams
      else if (
        lowerTeam.includes("juventus") ||
        lowerTeam.includes("milan") ||
        lowerTeam.includes("inter") ||
        lowerTeam.includes("napoli") ||
        lowerTeam.includes("roma") ||
        lowerTeam.includes("lazio") ||
        lowerTeam.includes("atalanta")
      ) {
        acc.italy.push(team);
      }
      // Bundesliga teams
      else if (
        lowerTeam.includes("bayern") ||
        lowerTeam.includes("dortmund") ||
        lowerTeam.includes("leverkusen") ||
        lowerTeam.includes("leipzig") ||
        lowerTeam.includes("frankfurt") ||
        lowerTeam.includes("wolfsburg") ||
        lowerTeam.includes("gladbach")
      ) {
        acc.germany.push(team);
      }
      // Ligue 1 teams
      else if (
        lowerTeam.includes("psg") ||
        lowerTeam.includes("paris") ||
        lowerTeam.includes("lyon") ||
        lowerTeam.includes("marseille") ||
        lowerTeam.includes("monaco") ||
        lowerTeam.includes("lille") ||
        lowerTeam.includes("nice")
      ) {
        acc.france.push(team);
      }
      // Other European teams
      else if (
        lowerTeam.includes("ajax") ||
        lowerTeam.includes("benfica") ||
        lowerTeam.includes("porto") ||
        lowerTeam.includes("celtic") ||
        lowerTeam.includes("rangers") ||
        lowerTeam.includes("shakhtar") ||
        lowerTeam.includes("dinamo")
      ) {
        acc.europe.push(team);
      } else {
        acc.other.push(team);
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
      other: [] as string[],
    },
  );

  // Flatten categorized teams while maintaining some order
  const displayTeams = [
    ...categorizedTeams.england,
    ...categorizedTeams.spain,
    ...categorizedTeams.italy,
    ...categorizedTeams.germany,
    ...categorizedTeams.france,
    ...categorizedTeams.europe,
    ...categorizedTeams.other,
  ].slice(0, limit);

  if (displayTeams.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No teams available at the moment.</p>
      </div>
    );
  }

  // Get team abbreviations for badges
  const getTeamAbbreviation = (teamName: string): string => {
    const words = teamName.split(" ");
    if (words.length === 1) {
      return teamName.substring(0, 2).toUpperCase();
    }

    // For multi-word names, take first letter of first two words
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    return teamName.substring(0, 2).toUpperCase();
  };

  // Get team badge color based on team
  const getTeamBadgeColor = (teamName: string): string => {
    const lowerTeam = teamName.toLowerCase();

    if (lowerTeam.includes("arsenal")) return "bg-red-600";
    if (lowerTeam.includes("chelsea")) return "bg-blue-600";
    if (lowerTeam.includes("liverpool")) return "bg-red-500";
    if (lowerTeam.includes("manchester city")) return "bg-sky-600";
    if (lowerTeam.includes("manchester united")) return "bg-red-700";
    if (lowerTeam.includes("tottenham")) return "bg-blue-800";
    if (lowerTeam.includes("real madrid"))
      return "bg-white text-gray-900 border border-gray-300";
    if (lowerTeam.includes("barcelona")) return "bg-blue-600";
    if (lowerTeam.includes("atletico")) return "bg-red-600";
    if (lowerTeam.includes("bayern")) return "bg-red-600";
    if (lowerTeam.includes("dortmund")) return "bg-yellow-500 text-gray-900";
    if (lowerTeam.includes("juventus")) return "bg-black text-white";
    if (lowerTeam.includes("milan")) return "bg-red-600";
    if (lowerTeam.includes("inter")) return "bg-blue-800";
    if (lowerTeam.includes("psg") || lowerTeam.includes("paris"))
      return "bg-blue-600";

    // Default colors based on country
    if (categorizedTeams.england.includes(teamName)) return "bg-red-600";
    if (categorizedTeams.spain.includes(teamName)) return "bg-red-600";
    if (categorizedTeams.italy.includes(teamName)) return "bg-green-600";
    if (categorizedTeams.germany.includes(teamName))
      return "bg-black text-white";
    if (categorizedTeams.france.includes(teamName)) return "bg-blue-600";

    return "bg-gray-600";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayTeams.map((team, index) => {
          const abbreviation = getTeamAbbreviation(team);
          const badgeColor = getTeamBadgeColor(team);

          return (
            <Link
              key={`${team}-${index}`}
              href={`/highlights?team=${encodeURIComponent(team)}`}
              className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-md ${badgeColor} text-white flex items-center justify-center font-bold text-xs`}
              >
                {abbreviation}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate group-hover:text-green-700">
                  {team}
                </h4>
                {showCount && (
                  <p className="text-xs text-gray-500 mt-1">
                    Latest matches and highlights
                  </p>
                )}
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-green-600 flex-shrink-0"
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
          );
        })}
      </div>

      {/* Team categories summary */}
      {Object.values(categorizedTeams).some((arr) => arr.length > 0) && (
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 justify-center">
            {categorizedTeams.england.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                England: {categorizedTeams.england.length}
              </span>
            )}
            {categorizedTeams.spain.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Spain: {categorizedTeams.spain.length}
              </span>
            )}
            {categorizedTeams.italy.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Italy: {categorizedTeams.italy.length}
              </span>
            )}
            {categorizedTeams.germany.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                Germany: {categorizedTeams.germany.length}
              </span>
            )}
            {categorizedTeams.france.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                France: {categorizedTeams.france.length}
              </span>
            )}
            {categorizedTeams.europe.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Europe: {categorizedTeams.europe.length}
              </span>
            )}
          </div>

          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Showing {displayTeams.length} of {teams.length} total teams
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
