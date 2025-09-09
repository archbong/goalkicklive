import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string;
}

export default function BlogsList({ data }: { data: Blog[] }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10 text-lg">
        No blogs available at the moment. Check back soon!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((blog) => (
        <div
          key={blog.id}
          className={cn(
            "bg-white border rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col group"
          )}
        >
          {blog.image && (
            <div className="relative w-full h-48 sm:h-56 md:h-60 overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
              {blog.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              By {blog.author} •{" "}
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-3 text-gray-700 flex-1 line-clamp-3">{blog.excerpt}</p>

            <Link
              href={`/blogs/${blog.id}`}
              className="mt-4 inline-block text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Read More →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
