import Link from "next/link";

export default function About() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            About Goalkick Live
          </h1>
          <p className="text-gray-600 text-lg">
            We are a technology company dedicated to bringing live football
            match streaming to mobile devices worldwide. Our mission is to make
            football accessible to everyone, everywhere.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To provide football fans with a seamless, high-quality mobile
              streaming experience that allows them to watch live matches from
              top leagues around the world, no matter where they are.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become the leading mobile platform for live football streaming,
              connecting millions of fans with their favorite teams and creating
              a global community of football enthusiasts.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our mobile app delivers an exceptional football streaming experience
            with features designed for true fans.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Live Streaming",
                description:
                  "HD quality live matches from Premier League, La Liga, Serie A, Bundesliga, and more",
                icon: "📺",
              },
              {
                title: "Mobile First",
                description:
                  "Optimized specifically for mobile devices with intuitive controls and smooth playback",
                icon: "📱",
              },
              {
                title: "Real-time Updates",
                description:
                  "Live scores, match statistics, and instant notifications for goals and key events",
                icon: "⚡",
              },
              {
                title: "Global Coverage",
                description:
                  "Access matches from leagues worldwide, available in multiple languages",
                icon: "🌍",
              },
              {
                title: "Secure Platform",
                description:
                  "Reliable streaming with minimal buffering and 99.9% uptime guarantee",
                icon: "🔒",
              },
              {
                title: "Free Access",
                description:
                  "Download for free on iOS and Android with no hidden fees",
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
          <h2 className="text-3xl font-bold text-gray-900">Our Leadership</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our team combines expertise in sports technology, streaming
            infrastructure, and mobile development.
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
            Ready to Stream Live Football?
          </h2>
          <p className="text-gray-600 mb-6">
            Download our mobile app today and never miss a match again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/downloads"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Download the App
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
