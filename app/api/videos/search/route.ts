import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (!redis) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 500 },
    );
  }

  // Get all video keys
  const keys = await redis.keys("video:*");
  if (keys.length === 0) {
    return NextResponse.json({ videos: [] });
  }

  const results = [];
  for (const key of keys) {
    const videoData = await redis.get(key);
    if (!videoData) continue;

    let video;
    try {
      video = JSON.parse(videoData);
    } catch (error) {
      console.error(`Failed to parse video data from key ${key}:`, error);
      continue;
    }
    if (!video) continue;

    // Simple substring match for title, competition, or teams
    if (
      (video.title && video.title.toLowerCase().includes(q)) ||
      (video.competition && video.competition.toLowerCase().includes(q)) ||
      (video.teams && video.teams.toLowerCase().includes(q))
    ) {
      results.push(video);
    }
  }
  return NextResponse.json({ results });
}
