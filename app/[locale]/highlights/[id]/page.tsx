// app/highlights/[id]/page.tsx
import { highlights } from '@/lib/mockData';
import Link from 'next/link';

interface HighlightPageProps {
  params: Promise<{
    locale: string;
    id: string 
  }>;
}

export default async function HighlightDetailPage(props: HighlightPageProps) {
  const params = await props.params;
  const highlight = highlights.find((h) => h.id === params.id);

  if (!highlight) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">⚠ Highlight Not Found</h1>
        <p className="text-gray-500 mt-2">It looks like this highlight doesn’t exist.</p>
        <Link
          href="/highlights"
          className="mt-6 inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          ← Back to Highlights
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Link
        href="/highlights"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-6"
      >
        <span className="text-xl">←</span> Back to Highlights
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{highlight.title}</h1>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(highlight.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
        <video
          src={highlight.videoUrl}
          controls
          className="w-full"
        />
      </div>
    </div>
  );
}

