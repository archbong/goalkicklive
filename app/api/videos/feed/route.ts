// app/api/videos/feed/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  if (!redis) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 500 },
    );
  }

  const keys = await redis.keys("video:*");
  const videos = [];

  for (const key of keys) {
    const videoData = await redis.get(key);
    if (videoData) {
      try {
        const video = JSON.parse(videoData);
        videos.push(video);
      } catch (error) {
        console.error(`Failed to parse video data from key ${key}:`, error);
      }
    }
  }

  // Sort by publishedAt descending
  videos.sort((a, b) => b.publishedAt - a.publishedAt);

  return NextResponse.json({ feed: videos });
}
