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
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
        <Container className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {dict.hero.title}
              <span className="block text-green-500 mt-2">
                {dict.hero.subtitle}
              </span>
            </h1>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl">
              {dict.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                <Link href={`/${locale}/downloads`}>
                  {dict.hero.downloadButton}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-white text-white hover:bg-white/10"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                <Link href={`/${locale}/about`}>
                  {dict.hero.learnMoreButton}
                </Link>
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
              {dict.features.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dict.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <PlayCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {dict.features.liveStreaming.title}
              </h3>
              <p className="text-gray-600">
                {dict.features.liveStreaming.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {dict.features.mobileOptimized.title}
              </h3>
              <p className="text-gray-600">
                {dict.features.mobileOptimized.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {dict.features.globalCoverage.title}
              </h3>
              <p className="text-gray-600">
                {dict.features.globalCoverage.description}
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
    </>
  );
}
