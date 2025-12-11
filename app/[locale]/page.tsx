import { Container } from "@/components/layout-components/Container";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Smartphone,
  PlayCircle,
  Shield,
  Globe,
  Download,
  Star,
  ExternalLink,
  Bell,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { TopBanner, BetweenContentAd, BottomBanner } from "@/components/ads";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const dict = await getDictionary(localeTyped);

  return (
    <>
      {/* Top Banner Ad - Now Closable! */}
      <TopBanner
        show={true}
        closable={true}
        closeButtonDelay={3}
        showCloseLabel={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-4"
      />

      {/* Hero Section - Live Match Streaming Focus */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 md:py-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('/patterns/football-pattern.svg')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">
                  ⚽ {dict.hero.title}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                {dict.hero.title}
                <span className="block text-green-500 mt-2">
                  {dict.hero.subtitle}
                </span>
              </h1>

              <p className="text-xl mb-8 text-gray-300 max-w-2xl">
                {dict.hero.description}
              </p>

              {/* Live Match Ticker */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">
                      {dict.common.watch} LIVE
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">67&apos;</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold">MU</span>
                    </div>
                    <span className="font-medium">Man United</span>
                  </div>
                  <div className="text-2xl font-bold mx-4">2 - 1</div>
                  <div className="flex items-center">
                    <span className="font-medium">Man City</span>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center ml-3">
                      <span className="text-xs font-bold">MC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 group"
                      data-track-download="true"
                      data-track-platform="all"
                      data-track-location="hero"
                    >
                      <PlayCircle className="mr-2 h-6 w-6 group-hover:animate-pulse" />
                      <Link href={`/${locale}/downloads`}>
                        <span className="font-bold text-lg">
                          WATCH LIVE MATCHES
                        </span>
                      </Link>
                    </Button>
                    <div className="mt-2 text-center text-sm text-green-300">
                      7-day free trial • No credit card required
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  <Link href={`/${locale}/downloads#features`}>
                    SEE ALL FEATURES
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center text-sm text-gray-400">
                <div className="flex items-center mr-6">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs">📱</span>
                  </div>
                  <span>5M+ Downloads</span>
                </div>
                <div className="flex items-center mr-6">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs">⭐</span>
                  </div>
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs">⚡</span>
                  </div>
                  <span>Live in 150+ Countries</span>
                </div>
              </div>
            </div>

            {/* App Preview with Live Match Simulation */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 transform hover:scale-[1.02] transition-all duration-500">
                {/* Simulated Live Match on Phone */}
                <div className="bg-black p-1">
                  <div className="bg-gray-900 rounded-t-2xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-xs text-white">LIVE</span>
                      </div>
                      <span className="text-xs text-gray-400">67&apos;</span>
                    </div>

                    {/* Match Score */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg font-bold text-white">
                            MU
                          </span>
                        </div>
                        <span className="text-sm text-white font-medium">
                          Man United
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-1">
                          2 - 1
                        </div>
                        <div className="text-xs text-gray-400">
                          Premier League
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg font-bold text-white">
                            MC
                          </span>
                        </div>
                        <span className="text-sm text-white font-medium">
                          Man City
                        </span>
                      </div>
                    </div>

                    {/* Live Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-400">Possession</div>
                        <div className="text-sm text-white font-medium">
                          52% - 48%
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-400">Shots</div>
                        <div className="text-sm text-white font-medium">
                          8 - 6
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-400">Corners</div>
                        <div className="text-sm text-white font-medium">
                          4 - 3
                        </div>
                      </div>
                    </div>

                    {/* Recent Events */}
                    <div className="space-y-2">
                      <div className="flex items-center text-xs">
                        <span className="text-gray-400 mr-2">58&apos;</span>
                        <span className="text-green-400">⚽ GOAL!</span>
                        <span className="text-white ml-2">
                          Fernandes (Man United)
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="text-gray-400 mr-2">45+2&apos;</span>
                        <span className="text-green-400">⚽ GOAL!</span>
                        <span className="text-white ml-2">
                          Haaland (Man City)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Phone frame */}
                  <div className="relative">
                    <Image
                      src="/hero/app-mockup.png"
                      alt="Goalkick Live Mobile App - Live Match Streaming"
                      width={400}
                      height={800}
                      className="object-contain w-full h-auto"
                      priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-green-600/90 backdrop-blur-sm rounded-full p-4 animate-pulse">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Zero Buffer
                    </div>
                    <div className="text-xs text-gray-400">HD Streaming</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Live Stats
                    </div>
                    <div className="text-xs text-gray-400">Real-time Data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Live Matches Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <div className="inline-flex items-center bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">⚽ LIVE NOW</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Matches Streaming Live
              </h2>
              <p className="text-gray-300">
                Watch these matches right now on our mobile app
              </p>
            </div>
            <Link
              href={`/${locale}/downloads`}
              className="inline-flex items-center justify-center rounded-md text-lg font-medium h-12 px-6 bg-red-600 text-white hover:bg-red-700 mt-4 md:mt-0 shadow-lg hover:shadow-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 active:scale-[0.98]"
              data-track-download="true"
              data-track-platform="all"
              data-track-location="live_matches_header"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              WATCH LIVE NOW
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Match 1 - Live */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 group">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">
                      {dict.common.watch} LIVE
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">67&apos;</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">MU</span>
                    </div>
                    <span className="font-medium">Man United</span>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1">2 - 1</div>
                    <div className="text-xs text-gray-400">Premier League</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">MC</span>
                    </div>
                    <span className="font-medium">Man City</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 mr-2">58&apos;</span>
                    <span className="text-green-400">⚽ GOAL!</span>
                    <span className="text-white ml-2">Fernandes</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 mr-2">45+2&apos;</span>
                    <span className="text-green-400">⚽ GOAL!</span>
                    <span className="text-white ml-2">Haaland</span>
                  </div>
                </div>
                <Link
                  href={`/${locale}/downloads`}
                  className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium h-10 px-4 bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 active:scale-[0.98]"
                  data-track-download="true"
                  data-track-platform="all"
                  data-track-location="live_match_card"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  WATCH LIVE
                </Link>
              </div>
            </div>

            {/* Match 2 - Starting Soon */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">STARTING SOON</span>
                </div>
                <span className="text-sm text-gray-400">19:45</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">RM</span>
                  </div>
                  <span className="font-medium">Real Madrid</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">VS</div>
                  <div className="text-xs text-gray-400">Champions League</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">BAY</span>
                  </div>
                  <span className="font-medium">Bayern Munich</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Kick-off in</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    1:15:00
                  </div>
                </div>
                <div className="text-sm text-gray-300 text-center">
                  Quarter Final - 2nd Leg
                </div>
              </div>
              <Link
                href={`/${locale}/downloads`}
                className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium h-10 px-4 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 active:scale-[0.98]"
                data-track-download="true"
                data-track-platform="all"
                data-track-location="upcoming_match_card"
              >
                <Bell className="mr-2 h-4 w-4" />
                SET REMINDER
              </Link>
            </div>

            {/* Match 3 - Recent Result */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">FULL TIME</span>
                </div>
                <span className="text-sm text-gray-400">FINAL</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">LIV</span>
                  </div>
                  <span className="font-medium">Liverpool</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">3 - 1</div>
                  <div className="text-xs text-gray-400">Premier League</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">ARS</span>
                  </div>
                  <span className="font-medium">Arsenal</span>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Possession</span>
                  <span className="font-medium">58% - 42%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Shots</span>
                  <span className="font-medium">14 - 8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Corners</span>
                  <span className="font-medium">6 - 3</span>
                </div>
              </div>
              <Link
                href={`/${locale}/downloads`}
                className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium h-10 px-4 bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 active:scale-[0.98]"
                data-track-download="true"
                data-track-platform="all"
                data-track-location="completed_match_card"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                WATCH HIGHLIGHTS
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/${locale}/downloads`}
              className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
            >
              <span>See all upcoming matches on the app</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* Ad between Live Matches and Features */}
      <BetweenContentAd
        index={1}
        show={true}
        closable={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium">
                📱 3 SIMPLE STEPS TO WATCH
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Watch Football in Minutes
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get started in 3 easy steps. No complicated setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                1
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 pt-12 hover:border-green-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <Download className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Download App
                </h3>
                <p className="text-gray-300 text-center">
                  Get the app from App Store or Google Play. It&apos;s free to
                  download.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                2
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 pt-12 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <PlayCircle className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Pick a Match
                </h3>
                <p className="text-gray-300 text-center">
                  Browse live and upcoming matches. Choose your favorite team or
                  league.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                3
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 pt-12 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <Smartphone className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Start Streaming
                </h3>
                <p className="text-gray-300 text-center">
                  Tap play and enjoy HD football on your phone. No cable or TV
                  required.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/downloads`}
              className="inline-flex items-center justify-center rounded-md text-lg font-medium h-12 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 active:scale-[0.98]"
              data-track-download="true"
              data-track-platform="all"
              data-track-location="how_it_works"
            >
              <Download className="mr-2 h-5 w-5" />
              DOWNLOAD & WATCH FREE
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about streaming football on Goalkick
              Live
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Is the app really free to download?
                </h3>
                <p className="text-gray-600">
                  Yes! The Goalkick Live app is completely free to download. You
                  get access to live scores, match stats, and highlights for
                  free. For live streaming of matches, we offer flexible
                  subscription plans starting at just $9.99/month.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Can I watch matches offline?
                </h3>
                <p className="text-gray-600">
                  Absolutely! With our premium subscription, you can download
                  full matches and highlights to watch offline. Perfect for
                  commuting or when you&apos;re in areas with poor internet
                  connection.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Which leagues do you cover?
                </h3>
                <p className="text-gray-600">
                  We cover all major leagues: Premier League, Champions League,
                  La Liga, Bundesliga, Serie A, Ligue 1, plus 50+ other leagues
                  worldwide including MLS, Brasileirão, Eredivisie, and more.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Do I need a TV subscription or cable?
                </h3>
                <p className="text-gray-600">
                  No cable or TV subscription required! Everything streams
                  directly to your phone. All you need is the app and an
                  internet connection.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Can I watch on multiple devices?
                </h3>
                <p className="text-gray-600">
                  Yes! With a premium subscription, you can stream on up to 3
                  devices simultaneously. Watch on your phone, tablet, and
                  computer at the same time.
                </p>
              </div>

              <div className="text-center mt-10">
                <Link
                  href={`/${locale}/downloads`}
                  className="inline-flex items-center justify-center rounded-md text-lg font-medium h-12 px-6 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 active:scale-[0.98]"
                  data-track-download="true"
                  data-track-platform="all"
                  data-track-location="faq"
                >
                  <Download className="mr-2 h-5 w-5" />
                  DOWNLOAD NOW
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-100">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {dict.features.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dict.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <PlayCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                HD Live Streaming
              </h3>
              <p className="text-gray-600">
                Watch matches in crystal clear HD with zero buffering.
                Experience every goal, save, and tackle like you&apos;re in the
                stadium.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Watch Anywhere
              </h3>
              <p className="text-gray-600">
                Stream on your phone during commute, at work, or while
                traveling. Perfect for football fans on the move.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                50+ Leagues Worldwide
              </h3>
              <p className="text-gray-600">
                Premier League, Champions League, La Liga, Bundesliga, Serie A,
                and more. All in one app.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {dict.features.realTimeUpdates.title}
              </h3>
              <p className="text-gray-600">
                {dict.features.realTimeUpdates.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {dict.features.secureReliable.title}
              </h3>
              <p className="text-gray-600">
                {dict.features.secureReliable.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Download className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {dict.features.freeDownload.title}
              </h3>
              <p className="text-gray-600">
                {dict.features.freeDownload.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Ad between Features and Download CTA */}
      <BetweenContentAd
        index={2}
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* App Download CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {dict.downloadCta.title}
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            {dict.downloadCta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100 px-10"
            >
              <Image
                src="/app-store.svg"
                alt="App Store"
                width={24}
                height={24}
                className="mr-3"
              />
              <Link href={`/${locale}/downloads`}>
                {dict.downloadCta.appStore}
              </Link>
            </Button>

            <Button
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100 px-10"
            >
              <Image
                src="/play-store.svg"
                alt="Google Play"
                width={24}
                height={24}
                className="mr-3"
              />
              <Link href={`/${locale}/downloads`}>
                {dict.downloadCta.playStore}
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-white/80">
            {dict.downloadCta.availability}
          </p>
        </Container>
      </section>

      {/* Ad between FAQ and Testimonials */}
      <BetweenContentAd
        index={3}
        show={true}
        closable={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-8"
      />

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {dict.testimonials.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dict.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {dict.testimonials.testimonial1.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {dict.testimonials.testimonial1.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;{dict.testimonials.testimonial1.quote}&quot;
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">MS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {dict.testimonials.testimonial2.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {dict.testimonials.testimonial2.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;{dict.testimonials.testimonial2.quote}&quot;
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">AR</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {dict.testimonials.testimonial3.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {dict.testimonials.testimonial3.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;{dict.testimonials.testimonial3.quote}&quot;
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom Banner Ad */}
      <BottomBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-8"
      />

      {/* Closable Ad Feature Demo Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              New Feature: Closable Ads
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              We&apos;ve improved our ad experience! Now users can close ads
              they find annoying.
            </p>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Try it out</h3>
                  <p className="text-gray-600 mb-4">
                    The top banner on this page is now closable. Look for the X
                    button in the top right corner!
                  </p>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Click the X button to close annoying ads
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Close button appears after 3 seconds
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Works on all ad positions
                    </li>
                  </ul>
                  <Link
                    href={`/${locale}/examples/ads`}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    View more examples
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">
                      Example Code:
                    </div>
                    <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
                      {`<TopBanner
  closable={true}
  closeButtonDelay={3}
  showCloseLabel={true}
  onClose={() => {
    // Track when users close ads
    analytics.track(&apos;ad_closed&apos;);
  }}
/>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              We&apos;re committed to improving user experience while supporting
              our free service.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
