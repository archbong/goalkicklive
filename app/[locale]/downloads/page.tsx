import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

const downloadItems = [
  {
    title: "Football Highlights App",
    description: "Download our mobile app to get instant highlights on your phone.",
    link: "#",
    image: "/images/download-app.jpg",
  },
  {
    title: "Weekly Highlights PDF",
    description: "Get a PDF summary of the top goals and moments every week.",
    link: "#",
    image: "/images/download-pdf.jpg",
  },
  {
    title: "Media Kit",
    description: "Download logos, assets, and branding materials for Football Highlight.",
    link: "#",
    image: "/images/download-media.jpg",
  },
];

export default function Downloads() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Downloads</h1>
          <p className="text-gray-600 text-lg">
            Access all resources, apps, and media kits available for Football Highlight.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {downloadItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden flex flex-col transition-shadow"
            >
              {/* Image Preview */}
              {item.image && (
                <div className="relative w-full h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-700 flex-1">{item.description}</p>
                <Button variant="default" className="mt-6 w-full">
                  <a href={item.link}>Download</a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to get notifications when new resources are available.
          </p>
          <Button variant="default" className="px-8 py-3">
            Subscribe Now
          </Button>
        </div>
      </div>
    </section>
  );
}
