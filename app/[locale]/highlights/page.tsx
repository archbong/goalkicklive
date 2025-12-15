// app/[locale]/highlights/page.tsx
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { TopBanner, BetweenContentAd, BottomBanner } from "@/components/ads";
import { HeroSection } from "@/components/about";
import { HighlightsSection } from "@/components/highlights/HighlightsSection";
import {
  Filter,
  Search,
  Grid,
  List,
  Calendar,
  Trophy,
  Users,
  PlayCircle,
  Bell,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HighlightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const dict = await getDictionary(localeTyped);

  return (
    <div className="min-h-screen">
      {/* Top Banner Ad */}
      <TopBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-4"
      />

      {/* Hero Section */}
      <HeroSection
        title="Football Match Highlights"
        description="Watch the best moments from football matches around the world. Browse thousands of highlights from top leagues including Premier League, La Liga, Serie A, Bundesliga, and more."
        background="gradient"
        size="lg"
        alignment="center"
      />

      {/* Ad between Hero and Highlights */}
      <BetweenContentAd
        index={1}
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* Main Highlights Section */}
      <HighlightsSection
        title="All Highlights"
        description="Browse and filter through our extensive collection of football match highlights"
        variant="featured"
        limit={12}
        columns={3}
        showViewAll={false}
        showFilters={true}
        showStats={true}
        background="light"
        className="py-12"
      />

      {/* Ad between sections */}
      <BetweenContentAd
        index={2}
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* Featured Competitions */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              <Trophy className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">TOP COMPETITIONS</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Competition
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select your favorite competition to see all available highlights
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Premier League",
                country: "England",
                matches: 380,
                color: "bg-red-100 text-red-800",
                icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
              },
              {
                name: "La Liga",
                country: "Spain",
                matches: 380,
                color: "bg-yellow-100 text-yellow-800",
                icon: "🇪🇸",
              },
              {
                name: "Serie A",
                country: "Italy",
                matches: 380,
                color: "bg-blue-100 text-blue-800",
                icon: "🇮🇹",
              },
              {
                name: "Bundesliga",
                country: "Germany",
                matches: 306,
                color: "bg-black text-white",
                icon: "🇩🇪",
              },
              {
                name: "Ligue 1",
                country: "France",
                matches: 380,
                color: "bg-blue-100 text-blue-800",
                icon: "🇫🇷",
              },
              {
                name: "Champions League",
                country: "Europe",
                matches: 125,
                color: "bg-purple-100 text-purple-800",
                icon: "🏆",
              },
              {
                name: "Europa League",
                country: "Europe",
                matches: 197,
                color: "bg-orange-100 text-orange-800",
                icon: "🥈",
              },
              {
                name: "World Cup",
                country: "International",
                matches: 64,
                color: "bg-green-100 text-green-800",
                icon: "🌍",
              },
            ].map((competition) => (
              <a
                key={competition.name}
                href={`/${locale}/highlights?competition=${encodeURIComponent(competition.name)}`}
                className={`${competition.color} rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-2xl mb-2">{competition.icon}</div>
                    <h3 className="font-bold text-lg">{competition.name}</h3>
                    <p className="text-sm opacity-80">{competition.country}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {competition.matches}
                    </div>
                    <div className="text-sm opacity-80">matches</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-current border-opacity-20">
                  <div className="flex items-center text-sm">
                    <span>View highlights</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Teams */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">POPULAR TEAMS</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Follow Your Favorite Teams
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Never miss a moment from your favorite football clubs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                name: "Manchester United",
                logo: "🔴",
                league: "Premier League",
              },
              { name: "Real Madrid", logo: "⚪", league: "La Liga" },
              { name: "Barcelona", logo: "🔵🔴", league: "La Liga" },
              { name: "Bayern Munich", logo: "🔴", league: "Bundesliga" },
              { name: "Juventus", logo: "⚫⚪", league: "Serie A" },
              { name: "Paris Saint-Germain", logo: "🔵", league: "Ligue 1" },
              { name: "Liverpool", logo: "🔴", league: "Premier League" },
              { name: "Manchester City", logo: "🔵", league: "Premier League" },
              { name: "Chelsea", logo: "🔵", league: "Premier League" },
              { name: "Arsenal", logo: "🔴", league: "Premier League" },
              { name: "AC Milan", logo: "🔴⚫", league: "Serie A" },
              { name: "Inter Milan", logo: "🔵⚫", league: "Serie A" },
            ].map((team) => (
              <a
                key={team.name}
                href={`/${locale}/highlights?team=${encodeURIComponent(team.name)}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="text-3xl mb-3">{team.logo}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {team.name}
                </h3>
                <p className="text-xs text-gray-500">{team.league}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-green-600 font-medium group-hover:text-green-700">
                    View matches →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get the most out of our highlights platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search & Filter
              </h3>
              <p className="text-gray-600">
                Find exactly what you're looking for with our advanced search
                and filtering options. Filter by competition, team, date, or
                provider.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Watch Highlights
              </h3>
              <p className="text-gray-600">
                Watch high-quality match highlights from multiple providers. All
                videos are available in HD with multiple camera angles and
                commentary options.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Notified
              </h3>
              <p className="text-gray-600">
                Never miss a match from your favorite teams. Set up
                notifications for new highlights and live match updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner Ad */}
      <BottomBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-8"
      />
    </div>
  );
}
