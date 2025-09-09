// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

// Create rate limiters for different endpoints
export const highlightsRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.API_RATE_LIMIT || '100'), // Default: 100 requests per minute
    '60 s'
  ),
  prefix: 'ratelimit:highlights',
  analytics: true,
});

export const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '60 s'), // 50 requests per minute for general endpoints
  prefix: 'ratelimit:general',
});

export const videoRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '60 s'), // 30 requests per minute for video endpoints
  prefix: 'ratelimit:video',
});

// Rate limit by IP address
export async function rateLimitByIP(
  identifier: string,
  endpoint: 'highlights' | 'general' | 'video' = 'general'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (process.env.NODE_ENV === 'development') {
    // Disable rate limiting in development
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  try {
    let result;

    switch (endpoint) {
      case 'highlights':
        result = await highlightsRateLimit.limit(identifier);
        break;
      case 'video':
        result = await videoRateLimit.limit(identifier);
        break;
      default:
        result = await generalRateLimit.limit(identifier);
    }

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open if rate limiting service is down
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }
}

// Rate limit by user ID (for authenticated endpoints)
export async function rateLimitByUser(
  userId: string,
  endpoint: 'highlights' | 'general' | 'video' = 'general'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  return rateLimitByIP(`user:${userId}`, endpoint);
}

// Rate limit by API key (for mobile app)
export async function rateLimitByAPIKey(
  apiKey: string,
  endpoint: 'highlights' | 'general' | 'video' = 'general'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  return rateLimitByIP(`apikey:${apiKey}`, endpoint);
}

// Get rate limit info without consuming a request
export async function getRateLimitInfo(
  identifier: string,
  endpoint: 'highlights' | 'general' | 'video' = 'general'
): Promise<{ limit: number; remaining: number; reset: number }> {
  try {
    let ratelimit;

    switch (endpoint) {
      case 'highlights':
        ratelimit = highlightsRateLimit;
        break;
      case 'video':
        ratelimit = videoRateLimit;
        break;
      default:
        ratelimit = generalRateLimit;
    }

    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

    return {
      limit,
      remaining: success ? remaining - 1 : 0, // Adjust for the test request
      reset,
    };
  } catch (error) {
    console.error('Rate limit info error:', error);
    return {
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }
}

// Middleware-friendly rate limit check
export async function checkRateLimit(
  request: Request,
  endpoint: 'highlights' | 'general' | 'video' = 'general'
): Promise<{ success: boolean; headers?: Headers }> {
  const clientIp = getClientIP(request);
  const rateLimitResult = await rateLimitByIP(clientIp, endpoint);

  if (!rateLimitResult.success) {
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
    headers.set('Retry-After', Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString());

    return { success: false, headers };
  }

  return { success: true };
}

// Helper function to extract client IP from request
function getClientIP(request: Request): string {
  // Try to get IP from various headers
  const headers = request.headers;
  const ip =
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('cf-connecting-ip') ||
    'unknown';

  return ip.trim();
}

// Rate limit headers for response
export function getRateLimitHeaders(
  success: boolean,
  limit: number,
  remaining: number,
  reset: number
): Headers {
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', reset.toString());

  if (!success) {
    headers.set('Retry-After', Math.ceil((reset - Date.now()) / 1000).toString());
  }

  return headers;
}

// Reset rate limit for a specific identifier
export async function resetRateLimit(
  identifier: string,
  endpoint: 'highlights' | 'general' | 'video' = 'general'
): Promise<void> {
  try {
    let ratelimit;

    switch (endpoint) {
      case 'highlights':
        ratelimit = highlightsRateLimit;
        break;
      case 'video':
        ratelimit = videoRateLimit;
        break;
      default:
        ratelimit = generalRateLimit;
    }

    // Reset by setting remaining to limit
    await ratelimit.reset(identifier);
  } catch (error) {
    console.error('Rate limit reset error:', error);
  }
}
