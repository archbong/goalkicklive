import Image from "next/image";

export default function About() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 space-y-12">

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">About Football Highlight</h1>
          <p className="text-gray-600 text-lg">
            Bringing you the latest football highlights, news, and insights from leagues all around the world. Our mission is to keep fans connected to the beautiful game.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We aim to deliver fast, high-quality, and engaging football highlights so fans never miss a key moment. We strive to make football accessible to everyone with clear, concise, and visually appealing content.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become the go-to platform for football fans seeking instant highlights, news, and insights from leagues worldwide, building a strong community of football enthusiasts.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Meet the Team</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our team is passionate about football and technology. We combine expertise in content creation, software engineering, and fan engagement to bring you the best experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: "Samuel Archibong", role: "Founder & CTO", image: "/images/team1.jpg" },
              { name: "Habibi Johnson", role: "Content Editor", image: "/images/team2.jpg" },
              { name: "Alex Morgan", role: "Marketing Lead", image: "/images/team3.jpg" },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative w-full h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with the latest football highlights and news. Follow us on social media and never miss a moment.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Subscribe
            </a>
            <a href="#" className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
              Follow Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
