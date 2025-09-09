import { Container } from "@/components/layout-components/Container";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getHighlights } from "@/lib/getHighlights";
import { getBlogs } from "@/lib/getBlogs";

export default async function HomePage() {
  const highlights = await getHighlights();
  const blogs = await getBlogs();

  const latestHighlights = highlights.slice(0, 6);
  const latestBlogs = blogs.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <Container className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Watch the Latest{" "}
              <span className="text-green-500">Football Highlights</span>
            </h1>
            <p className="text-lg mb-6 text-gray-300 max-w-lg">
              Get instant access to match highlights, goals, and top moments from
              leagues around the world.
            </p>
            <Button size="lg" className="shadow-lg hover:scale-105 transition-transform">
              <Link href="/highlights">View Highlights</Link>
            </Button>
          </div>

          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-500 ease-out">
              <Image
                src="/hero/hero-football.jpeg"
                alt="Football match highlight"
                width={500}
                height={300}
                className="object-cover w-full h-auto"
                priority
              />
            </div>
          </div>

        </Container>
      </section>

      {/* Latest Highlights */}
      <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100">
        <Container>
          {/* Section Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              ⚡ Latest Highlights
            </h2>
            <Link
              href="/highlights"
              className="text-green-600 hover:text-green-700 font-semibold transition-all duration-200 hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {latestHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden group transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <Image
                    src={highlight.thumbnail}
                    alt={highlight.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    {highlight.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {new Date(highlight.date).toLocaleDateString()}
                  </p>

                  {/* Watch Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
                  >
                    <Link href={`/highlights/${highlight.id}`}>▶ Watch</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>


      {/* Latest Blogs */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Blogs</h2>
            <Link
              href="/blogs"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {latestBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition-shadow flex flex-col"
              >
                {/* Blog Image */}
                <div className="relative w-full h-48">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Blog Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto flex justify-between items-center border-t pt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(blog.date).toLocaleDateString()}
                    </span>
                    <Button variant="secondary" size="sm">
                      <Link href={`/blogs/${blog.id}`}>Read More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
