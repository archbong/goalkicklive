import { getBlogs } from "@/lib/getBlogs";
import BlogsList from "@/components/ui/BlogsList";

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Latest Blogs
        </h1>
        <p className="text-gray-500 mt-2 sm:mt-0">
          Stay updated with our latest insights and stories.
        </p>
      </div>

      {/* Blogs List */}
      {blogs.length > 0 ? (
        <div className="space-y-6">
          <BlogsList data={blogs} />
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No blogs available at the moment. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}

