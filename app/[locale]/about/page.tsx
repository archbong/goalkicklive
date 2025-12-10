import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

export default async function About({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {dict.aboutPage.title}
          </h1>
          <p className="text-gray-600 text-lg">{dict.aboutPage.description}</p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {dict.aboutPage.mission.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {dict.aboutPage.mission.description}
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {dict.aboutPage.vision.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {dict.aboutPage.vision.description}
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {dict.aboutPage.whatWeOffer.title}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            {dict.aboutPage.whatWeOffer.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: dict.features.liveStreaming.title,
                description: dict.features.liveStreaming.description,
                icon: "📺",
              },
              {
                title: dict.features.mobileOptimized.title,
                description: dict.features.mobileOptimized.description,
                icon: "📱",
              },
              {
                title: dict.features.realTimeUpdates.title,
                description: dict.features.realTimeUpdates.description,
                icon: "⚡",
              },
              {
                title: dict.features.globalCoverage.title,
                description: dict.features.globalCoverage.description,
                icon: "🌍",
              },
              {
                title: dict.features.secureReliable.title,
                description: dict.features.secureReliable.description,
                icon: "🔒",
              },
              {
                title: dict.features.freeDownload.title,
                description: dict.features.freeDownload.description,
                icon: "🎯",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {dict.aboutPage.ourLeadership.title}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            {dict.aboutPage.ourLeadership.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                name: "Samuel Archibong",
                role: "Founder & CEO",
                bio: "Former sports technology executive with 15+ years in digital media",
              },
              {
                name: "Habibi Johnson",
                role: "CTO",
                bio: "Expert in streaming infrastructure and mobile platform development",
              },
              {
                name: "Alex Morgan",
                role: "Head of Product",
                bio: "Product leader with experience in sports and entertainment apps",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow p-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-green-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {dict.aboutPage.readyToStream}
          </h2>
          <p className="text-gray-600 mb-6">{dict.downloadCta.description}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`/${locale}/downloads`}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {dict.aboutPage.downloadApp}
            </a>
            <a
              href={`/${locale}/contact`}
              className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              {dict.aboutPage.contactUs}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
