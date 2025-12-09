import { redis } from "@/lib/redis";

// Cache functions using ioredis
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    if (value === null) return null;

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds?: number,
): Promise<void> {
  if (!redis) return;

  try {
    const jsonValue = JSON.stringify(value);

    if (ttlSeconds) {
      // Use EX option for expiration in seconds
      await redis.set(key, jsonValue, "EX", ttlSeconds);
    } else {
      await redis.set(key, jsonValue);
    }
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
  }
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error);
  }
}

export async function cacheKeys(pattern: string): Promise<string[]> {
  if (!redis) return [];

  try {
    return await redis.keys(pattern);
  } catch (error) {
    console.error(`Cache keys error for pattern ${pattern}:`, error);
    return [];
  }
}

export async function cacheFlush(pattern?: string): Promise<void> {
  if (!redis) return;

  try {
    if (pattern) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } else {
      // Note: FLUSHALL is dangerous in production, use with caution
      await redis.flushall();
    }
  } catch (error) {
    console.error("Cache flush error:", error);
  }
}

// Check if cache is available
export function isCacheAvailable(): boolean {
  return !!redis;
}
