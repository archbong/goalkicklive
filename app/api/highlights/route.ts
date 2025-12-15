// app/api/highlights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getHighlightsService } from "@/lib/services/highlights.service";
import { highlightQuerySchema } from "@/lib/validators/highlight-validator";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse and validate query parameters
    const queryParams = {
      competition: searchParams.get("competition") || undefined,
      team: searchParams.get("team") || undefined,
      date: searchParams.get("date") || undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : undefined,
      pageSize: searchParams.get("pageSize")
        ? parseInt(searchParams.get("pageSize")!)
        : undefined,
      provider: searchParams.get("provider") || undefined,
      search: searchParams.get("search") || undefined,
    };

    // Validate query parameters
    const validationResult = highlightQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const validatedParams = validationResult.data;
    const highlightsService = getHighlightsService();

    // Get highlights based on query parameters
    let highlights;

    if (validatedParams.competition) {
      highlights = await highlightsService.getHighlightsByCompetition(
        validatedParams.competition,
      );
    } else if (validatedParams.team) {
      highlights = await highlightsService.getHighlightsByTeam(
        validatedParams.team,
      );
    } else {
      // Get all highlights with pagination
      const response = await highlightsService.getHighlights({
        competition: validatedParams.competition,
        team: validatedParams.team,
        date: validatedParams.date,
        page: validatedParams.page,
        pageSize: validatedParams.pageSize,
        provider: validatedParams.provider,
      });

      // Apply search filter if provided
      if (validatedParams.search) {
        const searchTerm = validatedParams.search.toLowerCase();
        response.highlights = response.highlights.filter(
          (highlight) =>
            highlight.title.toLowerCase().includes(searchTerm) ||
            highlight.description.toLowerCase().includes(searchTerm) ||
            highlight.competition.toLowerCase().includes(searchTerm) ||
            highlight.teams.home.toLowerCase().includes(searchTerm) ||
            highlight.teams.away.toLowerCase().includes(searchTerm),
        );
        response.totalCount = response.highlights.length;
        response.hasMore = false; // Disable pagination when searching
      }

      highlights = response;
    }

    // Set cache headers
    const headers = {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      "CDN-Cache-Control": "public, s-maxage=300",
      "Vercel-CDN-Cache-Control": "public, s-maxage=300",
    };

    return NextResponse.json(highlights, { headers });
  } catch (error) {
    console.error("Error fetching highlights:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch highlights",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
