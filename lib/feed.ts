import { redis } from "./redis";

// lib/feed.ts
export async function addToFeed(userId: string, postId: string) {
  await redis?.lpush(`feed:${userId}`, postId);
  await redis?.ltrim(`feed:${userId}`, 0, 99); // keep 100 items max
}

export async function getFeed(userId: string) {
  const postIds = await redis?.lrange(`feed:${userId}`, 0, 49); // 50 latest
  return postIds;
}
export async function clearFeed(userId: string) {
  await redis?.del(`feed:${userId}`);
}