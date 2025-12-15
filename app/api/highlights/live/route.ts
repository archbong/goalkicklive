// app/api/highlights/live/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getHighlightsService } from '@/lib/services/highlights.service';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 1 minute for live matches

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Validate limit parameter
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          error: 'Invalid limit parameter',
          message: 'Limit must be between 1 and 50',
        },
        { status: 400 }
      );
    }

    const highlightsService = getHighlightsService();
    const liveMatches = await highlightsService.getLiveMatches();

    // Sort by date (most recent first) and apply limit
    const sortedMatches = liveMatches
      .sort((a, b) => b.matchDate.getTime() - a.matchDate.getTime())
      .slice(0, limit);

    // Set cache headers (shorter TTL for live matches)
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'CDN-Cache-Control': 'public, s-maxage=60',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=60',
    };

    return NextResponse.json({
      matches: sortedMatches,
      count: sortedMatches.length,
      totalLive: liveMatches.length,
      limit,
      timestamp: new Date().toISOString(),
    }, { headers });
  } catch (error) {
    console.error('Error fetching live matches:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch live matches',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
