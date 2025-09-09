// components/HighlightsList.tsx
import Link from 'next/link';
import Image from "next/image";

export default function HighlightsList({
  data,
}: {
  data: typeof import("@/lib/mockData").highlights;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((highlight) => (
        <Link
          key={highlight.id}
          href={`/highlights/${highlight.id}`}
          className="group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white"
        >
          <div className="relative w-full h-48">
            <Image
              src={highlight.thumbnail}
              alt={highlight.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {highlight.title}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(highlight.date).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

