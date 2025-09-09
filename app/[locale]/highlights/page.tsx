import { getHighlights } from "@/lib/getHighlights";
import HighlightsList from "@/components/ui/HighlightsList";

export default async function HighlightsPage() {
  const highlights = await getHighlights(); // server-side fetch

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            ⚽ Latest Highlights
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Relive the goals, drama, and top plays from leagues around the world.
          </p>
        </div>

        {/* Highlights List */}
        {highlights.length > 0 ? (
          <div className="">
            <HighlightsList data={highlights} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-4.553a1 1 0 00-1.414-1.414L13.172 8.586M9 14l-4.553 4.553a1 1 0 001.414 1.414L10.828 15.414M15 14l4.553 4.553a1 1 0 01-1.414 1.414L13.172 15.414M9 10L4.447 5.447a1 1 0 011.414-1.414L10.828 8.586"
              />
            </svg>
            <p className="text-lg">No highlights available right now.</p>
            <p className="text-sm text-gray-400">
              Check back soon for fresh updates!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


