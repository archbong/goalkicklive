import { blogs } from '@/lib/mockData';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

// The component must be async to await the params.
export default async function BlogDetailPage(props: BlogPageProps) {
  // Await the params object to get the actual values.
  const params = await props.params;
  const blog = blogs.find((b) => b.id === params.id);
  if (!blog) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">⚠ Blog Not Found</h1>
        <p className="text-gray-500 mt-2">It seems this blog doesn’t exist or has been removed.</p>
        <Link
          href="/blogs"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Link
        href={`/${params.locale}/blogs`} // Use the locale to go back
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-6"
      >
        <span className="text-xl">←</span> Back to Blogs
      </Link>

      {blog.image && (
        <div className="relative w-full h-96 mb-6 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transform transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By {blog.author} •{" "}
        {new Date(blog.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="prose prose-lg max-w-full text-gray-700 space-y-6">
        <p>{blog.content}</p>
      </div>
    </div>
  );
}