// lib/videoIndexer.ts
import { redis } from "@/lib/redis";

export interface ScorebatVideo {
  id: string;
  title: string;
  competition?: { name: string };
  side1?: { name: string };
  side2?: { name: string };
  embed: string; // iframe HTML from Scorebat
  date: string;  // ISO date string
}

export async function indexScorebatVideo(video: ScorebatVideo) {
  if (!redis) {
    throw new Error("Redis not configured");
  }

  const key = `video:${video.id}`;
  const teams =
    video.side1?.name && video.side2?.name
      ? `${video.side1.name} vs ${video.side2.name}`
      : "";

  const doc = {
    id: video.id,
    title: video.title ?? "",
    competition: video.competition?.name ?? "",
    teams,
    embed: video.embed ?? "",
    publishedAt: Date.parse(video.date) || Date.now(),
  };

  // Store as a single JSON document
  await redis.json.set(key, "$", doc);

  return key; // return the Redis key for reference
}
