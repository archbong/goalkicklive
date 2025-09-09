// app/api/videos/feed/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  if (!redis) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
  }

  const keys = await redis.keys("video:*");
  const videos = [];

  for (const key of keys) {
    const video = await redis.json.get(key);
    if (video) videos.push(video);
  }

  // Sort by publishedAt descending
  videos.sort((a, b) => b.publishedAt - a.publishedAt);

  return NextResponse.json({ feed: videos });
}
