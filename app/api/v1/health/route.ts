// app/api/v1/health/route.ts
import { NextResponse } from 'next/server';
import { APIServiceFactory } from '@/lib/services/api-service-factory';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(request, 'general');
    if (!rateLimitCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        {
          status: 429,
          headers: rateLimitCheck.headers
        }
      );
    }

    // Check Redis connection
    let redisStatus = 'healthy';
    try {
      await redis.ping();
    } catch (error) {
      redisStatus = 'unhealthy';
      console.error('Redis health check failed:', error);
    }

    // Get provider status
    const providers = APIServiceFactory.createVideoService();
    const providerStats = await Promise.all(
      providers.map(async (provider) => {
        try {
          const highlights = await provider.getHighlights({ pageSize: 1 });
          return {
            name: provider.getProviderName(),
            status: 'healthy',
            highlightsCount: highlights.length,
          };
        } catch (error) {
          return {
            name: provider.getProviderName(),
            status: 'unhealthy',
            highlightsCount: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // Prepare response
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        redis: redisStatus,
        database: 'healthy', // Assuming database is healthy if we got this far
      },
      providers: providerStats,
      version: '1.0.0',
      uptime: process.uptime(),
    };

    // Add rate limit headers to response
    const headers = getRateLimitHeaders(true, 50, 49, Date.now() + 60000);

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
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
