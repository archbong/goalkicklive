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
} from "lucide-react";

export default async function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
        <Container className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Stream Live Football Matches
              <span className="block text-green-500 mt-2">On Your Mobile</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl">
              Experience live match streaming, real-time scores, and exclusive
              content with our dedicated mobile app. Never miss a moment of the
              action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                <Link href="/downloads">Download Now</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-white text-white hover:bg-white/10"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <Image
                  src="/hero/app-mockup.png"
                  alt="Goalkick Live Mobile App"
                  width={400}
                  height={800}
                  className="object-contain w-full h-auto"
                  priority
                />
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
              Why Choose Goalkick Live?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our mobile app delivers the ultimate football streaming experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <PlayCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Live Match Streaming
              </h3>
              <p className="text-gray-600">
                Watch live football matches from top leagues around the world in
                HD quality.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Mobile Optimized
              </h3>
              <p className="text-gray-600">
                Designed specifically for mobile devices with intuitive controls
                and smooth playback.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Global Coverage
              </h3>
              <p className="text-gray-600">
                Access matches from Premier League, La Liga, Serie A,
                Bundesliga, and more.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Get live scores, match statistics, and instant notifications for
                goals and events.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enjoy secure streaming with minimal buffering and 99.9% uptime
                guarantee.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Download className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Free Download
              </h3>
              <p className="text-gray-600">
                Download the app for free with no hidden fees. Available on iOS
                and Android.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* App Download CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Stream Live Football?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Download Goalkick Live now and never miss a match again
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
              <Link href="/downloads">Download on the App Store</Link>
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
              <Link href="/downloads">Get it on Google Play</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-white/80">
            Available for iOS 12+ and Android 8+
          </p>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of football fans who love our app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">John D.</h4>
                  <p className="text-sm text-gray-500">Football Fan</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;The best football streaming app I&apos;ve used. Crystal
                clear quality and never buffers during crucial moments!&quot;
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
                  <h4 className="font-bold text-gray-900">Maria S.</h4>
                  <p className="text-sm text-gray-500">Season Ticket Holder</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;When I can&apos;t make it to the stadium, this app is my
                go-to. The real-time stats are incredibly detailed.&quot;
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
                  <h4 className="font-bold text-gray-900">Ahmed R.</h4>
                  <p className="text-sm text-gray-500">Sports Journalist</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;Essential for my work. The global coverage means I can
                follow any league from anywhere in the world.&quot;
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
    </>
  );
}
