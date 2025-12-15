// components/highlights/StatsSection.tsx
import { Trophy, Users, Video, Radio } from "lucide-react";
import { getHighlightsService } from "@/lib/services/highlights.service";

interface StatsSectionProps {
  initialLiveMatchesCount?: number;
  initialCompetitionsCount?: number;
  initialTeamsCount?: number;
  initialHighlightsCount?: number;
}

export async function StatsSection({
  initialLiveMatchesCount,
  initialCompetitionsCount,
  initialTeamsCount,
  initialHighlightsCount,
}: StatsSectionProps) {
  // Initialize highlights service
  const highlightsService = getHighlightsService();

  let liveMatchesCount = initialLiveMatchesCount;
  let competitionsCount = initialCompetitionsCount;
  let teamsCount = initialTeamsCount;
  let highlightsCount = initialHighlightsCount;

  // If initial data is not provided, fetch from API
  if (
    liveMatchesCount === undefined ||
    competitionsCount === undefined ||
    teamsCount === undefined ||
    highlightsCount === undefined
  ) {
    try {
      // Fetch all stats in parallel
      const [liveMatches, competitions, teams, highlights] = await Promise.all([
        highlightsService.getLiveMatches(),
        highlightsService.getCompetitions(),
        highlightsService.getTeams(),
        highlightsService.getHighlights({ pageSize: 1 }),
      ]);

      // Set counts
      liveMatchesCount = liveMatches.length;
      competitionsCount = competitions.length;
      teamsCount = teams.length;
      highlightsCount = highlights.totalCount;
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Use fallback counts if API fails
      liveMatchesCount = liveMatchesCount ?? 12;
      competitionsCount = competitionsCount ?? 15;
      teamsCount = teamsCount ?? 50;
      highlightsCount = highlightsCount ?? 100;
    }
  }

  const stats = [
    {
      id: "live-matches",
      title: "Live Matches",
      count: liveMatchesCount,
      description: "Watch matches happening right now",
      icon: Radio,
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
    {
      id: "competitions",
      title: "Competitions",
      count: competitionsCount,
      description: "Top leagues and tournaments",
      icon: Trophy,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: "teams",
      title: "Teams",
      count: teamsCount,
      description: "Professional football clubs",
      icon: Users,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      id: "highlights",
      title: "Highlights",
      count: highlightsCount,
      description: "Match videos and replays",
      icon: Video,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Football Highlights Hub
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access the largest collection of football match highlights from
            around the world
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} ${stat.textColor} rounded-full mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.count.toLocaleString()}
                </h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {stat.title}
                </h4>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats description */}
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-gray-700">
            Our platform aggregates highlights from thousands of football
            matches across {competitionsCount} competitions, featuring{" "}
            {teamsCount} teams. With {highlightsCount.toLocaleString()}+ videos
            and counting, you'll never miss a moment of the action.
          </p>
        </div>
      </div>
    </section>
  );
}
