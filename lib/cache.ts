import { Redis } from "@upstash/redis";

// Only initialize if env var exists
let client: Redis | undefined;

if (process.env.REDIS_URL) {
  // Upstash Redis uses just the URL (and optionally token)
  client = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN ?? "", // if required
  });
}

// Export a singleton
export const redis = client;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  const value = await redis.get(key);
  return typeof value === "string" ? (JSON.parse(value) as T) : null;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  if (!redis) return;
  const jsonValue = JSON.stringify(value);
  if (ttlSeconds) {
    await redis.set(key, jsonValue, { ex: ttlSeconds });
  } else {
    await redis.set(key, jsonValue);
  }
}