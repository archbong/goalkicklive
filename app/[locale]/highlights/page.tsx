import AdvancedHighlightsFilter from "@/components/highlights/AdvancedHighlightsFilter";
import HighlightsGrid from "@/components/highlights/HighlightsGrid";
import HighlightsErrorBoundary from "@/components/highlights/HighlightsErrorBoundary";
import { FilterOptions } from "@/types/highlight";

interface HighlightsPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    competition?: string;
    competitions?: string;
    team?: string;
    teams?: string;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    provider?: string;
    page?: string;
  }>;
}

export default async function HighlightsPage(props: HighlightsPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  // Fetch filter options
  const filterOptionsResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/highlights/filters`,
    { next: { revalidate: 3600 } }, // Cache for 1 hour
  );

  let filterOptions: FilterOptions = {
    competitions: [],
    teams: [],
    dateRange: { min: new Date(), max: new Date() },
    providers: [],
  };

  if (filterOptionsResponse.ok) {
    filterOptions = await filterOptionsResponse.json();
  }

  // Fetch highlights with filters
  const highlightsUrl = new URL(`${process.env.NEXTAUTH_URL}/api/highlights`);
  if (searchParams.competition)
    highlightsUrl.searchParams.set("competition", searchParams.competition);
  if (searchParams.competitions)
    highlightsUrl.searchParams.set("competitions", searchParams.competitions);
  if (searchParams.team)
    highlightsUrl.searchParams.set("team", searchParams.team);
  if (searchParams.teams)
    highlightsUrl.searchParams.set("teams", searchParams.teams);
  if (searchParams.date)
    highlightsUrl.searchParams.set("date", searchParams.date);
  if (searchParams.dateFrom)
    highlightsUrl.searchParams.set("dateFrom", searchParams.dateFrom);
  if (searchParams.dateTo)
    highlightsUrl.searchParams.set("dateTo", searchParams.dateTo);
  if (searchParams.search)
    highlightsUrl.searchParams.set("search", searchParams.search);
  if (searchParams.provider)
    highlightsUrl.searchParams.set("provider", searchParams.provider);
  if (searchParams.page)
    highlightsUrl.searchParams.set("page", searchParams.page);

  const highlightsResponse = await fetch(highlightsUrl.toString(), {
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  let highlightsData = {
    highlights: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    hasMore: false,
  };

  if (highlightsResponse.ok) {
    highlightsData = await highlightsResponse.json();
  }

  return (
    <HighlightsErrorBoundary>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              ⚽ Latest Highlights
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              Relive the goals, drama, and top plays from leagues around the
              world.
            </p>
          </div>

          {/* Filter Section */}
          <AdvancedHighlightsFilter
            filterOptions={filterOptions}
            locale={params.locale}
          />

          {/* Highlights Grid */}
          <HighlightsGrid
            highlights={highlightsData.highlights}
            locale={params.locale}
          />

          {/* Pagination */}
          {highlightsData.totalCount > 0 && (
            <div className="mt-12 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing{" "}
                {(highlightsData.page - 1) * highlightsData.pageSize + 1}-
                {Math.min(
                  highlightsData.page * highlightsData.pageSize,
                  highlightsData.totalCount,
                )}{" "}
                of {highlightsData.totalCount.toLocaleString()} highlights
              </div>

              <div className="flex items-center space-x-2">
                {highlightsData.page > 1 && (
                  <a
                    href={`?${new URLSearchParams({
                      ...Object.fromEntries(
                        new URL(highlightsUrl.toString()).searchParams,
                      ),
                      page: (highlightsData.page - 1).toString(),
                    })}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}

                {highlightsData.hasMore && (
                  <a
                    href={`?${new URLSearchParams({
                      ...Object.fromEntries(
                        new URL(highlightsUrl.toString()).searchParams,
                      ),
                      page: (highlightsData.page + 1).toString(),
                    })}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </HighlightsErrorBoundary>
  );
}
