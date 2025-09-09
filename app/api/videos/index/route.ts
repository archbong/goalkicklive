// app/api/videos/index/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { indexScorebatVideo } from "@/lib/videoIndexer";

export async function POST(req: Request) {
  try {
    const video = await req.json();

    if (!video?.id || !video?.title) {
      return NextResponse.json(
        { error: "Missing required fields: id, title" },
        { status: 400 }
      );
    }

    await indexScorebatVideo(video);

    return NextResponse.json({ success: true, video });
  } catch (error: any) {
    console.error("Error indexing video:", error);
    return NextResponse.json(
      { error: "Failed to index video" },
      { status: 500 }
    );
  }
}
