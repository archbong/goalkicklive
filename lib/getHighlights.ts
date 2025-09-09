// lib/getHighlights.ts
"use cache";

import { HighlightFilters, UnifiedHighlight } from "@/types/highlight";

export async function getHighlights(
  filters?: HighlightFilters,
): Promise<UnifiedHighlight[]> {
  try {
    const url = new URL(`${process.env.NEXTAUTH_URL}/api/highlights`);

    if (filters?.competition)
      url.searchParams.set("competition", filters.competition);
    if (filters?.team) url.searchParams.set("team", filters.team);
    if (filters?.date) url.searchParams.set("date", filters.date);
    if (filters?.page) url.searchParams.set("page", filters.page.toString());
    if (filters?.pageSize)
      url.searchParams.set("pageSize", filters.pageSize.toString());
    if (filters?.provider) url.searchParams.set("provider", filters.provider);

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch highlights: ${response.status}`);
    }

    const data = await response.json();
    return data.highlights || [];
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return [];
  }
}
