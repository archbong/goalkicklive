// goalkicklive/app/api/providers/highlights/route.ts
import { NextResponse } from "next/server";
import { providerManager } from "@/lib/services/provider-manager";
import { highlightQuerySchema } from "@/lib/validators/highlight-validator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validatedParams = highlightQuerySchema.parse(queryParams);
    const {
      provider = "all",
      page = 1,
      pageSize = 20,
      ...filters
    } = validatedParams;

    console.log(`📥 Fetching highlights from provider: ${provider}`);

    const unifiedService = providerManager.getUnifiedService();
    if (!unifiedService) {
      return NextResponse.json(
        {
          error: "No video providers available",
          message: "Please check provider configuration",
        },
        { status: 503 },
      );
    }

    // Fetch highlights with pagination
    const highlights = await unifiedService.getHighlights({
      ...filters,
      provider: provider as "all" | "supersport" | "scorebat",
      page,
      pageSize,
    });

    // Get provider stats for metadata
    const providerStats = await unifiedService.getProviderStats();
    const availableProviders = await unifiedService.getAvailableProviders();

    const response = {
      highlights,
      metadata: {
        total: highlights.length,
        page,
        pageSize,
        provider,
        availableProviders,
        providerStats,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        timestamp: new Date().toISOString(),
      },
    };

    console.log(`✅ Fetched ${highlights.length} highlights from ${provider}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Failed to fetch provider highlights:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Invalid query parameters",
          details: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch highlights",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

// POST endpoint for testing provider-specific queries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, action, parameters = {} } = body;

    if (!provider || !action) {
      return NextResponse.json(
        { error: "Provider and action are required" },
        { status: 400 },
      );
    }

    const providerInstance = providerManager.getProvider(provider);
    if (!providerInstance) {
      return NextResponse.json(
        { error: `Provider '${provider}' not available` },
        { status: 404 },
      );
    }

    let result: unknown;

    switch (action) {
      case "getHighlights":
        result = await providerInstance.getHighlights(parameters);
        break;

      case "getLiveMatches":
        result = await providerInstance.getLiveMatches();
        break;

      case "getCompetitions":
        result = await providerInstance.getCompetitions();
        break;

      case "getTeams":
        result = await providerInstance.getTeams();
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      provider,
      action,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Provider API test failed:", error);

    return NextResponse.json(
      {
        error: "Provider test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
