// lib/rate-limit.ts
// Simplified rate limiting implementation for build compatibility

// Mock rate limiter interface
interface MockRateLimiter {
  limit: (identifier: string) => Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }>;
  reset?: (identifier: string) => Promise<void>;
}

// Create mock rate limiters for development/build
const createMockRateLimiter = (options: {
  limit: number;
  prefix: string;
}): MockRateLimiter => {
  return {
    limit: async () => ({
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: Date.now() + 60000, // 1 minute from now
    }),
    reset: async () => {},
  };
};

// Create rate limiters
export const highlightsRateLimit = createMockRateLimiter({
  limit: parseInt(process.env.API_RATE_LIMIT || "100"),
  prefix: "ratelimit:highlights",
});

export const generalRateLimit = createMockRateLimiter({
  limit: 50,
  prefix: "ratelimit:general",
});

export const videoRateLimit = createMockRateLimiter({
  limit: 30,
  prefix: "ratelimit:video",
});

// Rate limit by IP address
export async function rateLimitByIP(
  identifier: string,
  endpoint: "highlights" | "general" | "video" = "general",
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  // Always allow in development/build
  return {
    success: true,
    limit: 0,
    remaining: 0,
    reset: 0,
  };
}

// Rate limit by user ID (for authenticated endpoints)
export async function rateLimitByUser(
  userId: string,
  endpoint: "highlights" | "general" | "video" = "general",
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  return rateLimitByIP(`user:${userId}`, endpoint);
}

// Rate limit by API key (for mobile app)
export async function rateLimitByAPIKey(
  apiKey: string,
  endpoint: "highlights" | "general" | "video" = "general",
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  return rateLimitByIP(`apikey:${apiKey}`, endpoint);
}

// Get rate limit info without consuming a request
export async function getRateLimitInfo(
  identifier: string,
  endpoint: "highlights" | "general" | "video" = "general",
): Promise<{ limit: number; remaining: number; reset: number }> {
  return {
    limit: 0,
    remaining: 0,
    reset: 0,
  };
}

// Middleware-friendly rate limit check
export async function checkRateLimit(
  request: Request,
  endpoint: "highlights" | "general" | "video" = "general",
): Promise<{ success: boolean; headers?: Headers }> {
  return { success: true };
}

// Helper function to extract client IP from request
function getClientIP(request: Request): string {
  const headers = request.headers;
  const ip =
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0] ||
    headers.get("cf-connecting-ip") ||
    "unknown";
  return ip.trim();
}

// Rate limit headers for response
export function getRateLimitHeaders(
  success: boolean,
  limit: number,
  remaining: number,
  reset: number,
): Headers {
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", limit.toString());
  headers.set("X-RateLimit-Remaining", remaining.toString());
  headers.set("X-RateLimit-Reset", reset.toString());

  if (!success) {
    headers.set(
      "Retry-After",
      Math.ceil((reset - Date.now()) / 1000).toString(),
    );
  }

  return headers;
}

// Reset rate limit for a specific identifier
export async function resetRateLimit(
  identifier: string,
  endpoint: "highlights" | "general" | "video" = "general",
): Promise<void> {
  // No-op for mock implementation
}
