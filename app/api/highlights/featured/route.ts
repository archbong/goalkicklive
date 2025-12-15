// app/api/highlights/featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getHighlightsService } from '@/lib/services/highlights.service';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 6;

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
    const featuredHighlights = await highlightsService.getFeaturedHighlights(limit);

    // Set cache headers
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'CDN-Cache-Control': 'public, s-maxage=300',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
    };

    return NextResponse.json({
      highlights: featuredHighlights,
      count: featuredHighlights.length,
      limit,
      timestamp: new Date().toISOString(),
    }, { headers });
  } catch (error) {
    console.error('Error fetching featured highlights:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch featured highlights',
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
