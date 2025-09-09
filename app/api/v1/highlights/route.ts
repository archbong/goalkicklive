// app/api/v1/highlights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UnifiedVideoService } from '@/lib/services/unified-video-service';
import { APIServiceFactory } from '@/lib/services/api-service-factory';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { safeValidateHighlightQuery } from '@/lib/validators/highlight-validator';
import { HighlightsResponse } from '@/types/highlight';

export async function GET(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(request, 'highlights');
    if (!rateLimitCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        {
          status: 429,
          headers: rateLimitCheck.headers
        }
      );
    }

    // Validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const validationResult = safeValidateHighlightQuery(searchParams);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error },
        { status: 400 }
      );
    }

    const filters = validationResult.data!;

    // Get highlights from unified service
    const providers = APIServiceFactory.createVideoService();
    const videoService = new UnifiedVideoService(providers);
    const highlights = await videoService.getHighlights(filters);

    // Count highlights by provider
    const providerCounts = {
      supersport: highlights.filter(h => h.provider === 'supersport').length,
      scorebat: highlights.filter(h => h.provider === 'scorebat').length,
    };

    // Prepare response
    const response: HighlightsResponse = {
      highlights,
      totalCount: highlights.length,
      page: filters.page,
      pageSize: filters.pageSize,
      hasMore: false, // Will be implemented with proper pagination
      providers: providerCounts,
    };

    // Add rate limit headers to response
    const headers = getRateLimitHeaders(true, 100, 99, Date.now() + 60000);

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Highlights API error:', error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes('Validation')) {
      return NextResponse.json(
        { error: 'Invalid request parameters', message: error.message },
        { status: 400 }
      );
    }

    // Handle rate limiting errors
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: error.message },
        { status: 429 }
      );
    }

    // Handle provider errors
    if (error instanceof Error && error.message.includes('Provider')) {
      return NextResponse.json(
        {
          error: 'Service temporarily unavailable',
          message: 'One or more highlight providers are currently unavailable'
        },
        { status: 503 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching highlights'
      },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS preflight requests
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

// Configuration for Next.js
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
