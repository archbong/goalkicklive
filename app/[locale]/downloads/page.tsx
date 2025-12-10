import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Apple, QrCode, Smartphone } from "lucide-react";

export default function Downloads() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Download Goalkick Live
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Get our mobile app to stream live football matches from top leagues
            around the world. Available for free on iOS and Android.
          </p>
        </div>

        {/* Main Download Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* App Preview */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero/app-mockup.png"
                alt="Goalkick Live Mobile App"
                width={400}
                height={800}
                className="object-contain w-full h-auto"
              />
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Available on All Devices
              </h2>
              <p className="text-gray-600">
                Download the app on your preferred platform and start streaming
                live football matches today.
              </p>
            </div>

            {/* App Store Buttons */}
            <div className="space-y-6">
              <Button
                size="lg"
                className="w-full bg-black text-white hover:bg-gray-900 px-8 py-4"
              >
                <Apple className="mr-3 h-6 w-6" />
                <div className="text-left">
                  <div className="text-sm">Download on the</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </Button>

              <Button
                size="lg"
                className="w-full bg-black text-white hover:bg-gray-900 px-8 py-4"
              >
                <Smartphone className="mr-3 h-6 w-6" />
                <div className="text-left">
                  <div className="text-sm">Get it on</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </Button>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <QrCode className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Scan to Download
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Scan this QR code with your mobile device to download the app
                directly.
              </p>
              <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
                <div className="w-48 h-48 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <QrCode className="h-32 w-32 mx-auto" />
                    <p className="mt-2 text-sm font-medium">Goalkick Live</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            App Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📺",
                title: "Live Streaming",
                description: "HD quality live matches from top leagues",
              },
              {
                icon: "📱",
                title: "Mobile Optimized",
                description: "Designed specifically for mobile devices",
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                description: "Live scores and instant notifications",
              },
              {
                icon: "🌍",
                title: "Global Coverage",
                description: "Matches from leagues worldwide",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              System Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Apple className="h-8 w-8 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">iOS</h3>
                </div>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li>• iOS 12.0 or later</li>
                  <li>• iPhone, iPad, or iPod touch</li>
                  <li>• 100MB available storage</li>
                  <li>• Internet connection required</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Smartphone className="h-8 w-8 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Android
                  </h3>
                </div>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li>• Android 8.0 or later</li>
                  <li>• 100MB available storage</li>
                  <li>• Internet connection required</li>
                  <li>• Google Play Services</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            If you encounter any issues downloading or installing the app,
            please contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" className="px-8">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="secondary" className="px-8">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
