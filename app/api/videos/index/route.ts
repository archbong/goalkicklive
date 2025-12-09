// app/api/videos/index/route.ts
import { NextResponse } from "next/server";
import { indexScorebatVideo } from "@/lib/videoIndexer";

export async function POST(req: Request) {
  try {
    const video = await req.json();

    if (!video?.id || !video?.title) {
      return NextResponse.json(
        { error: "Missing required fields: id, title" },
        { status: 400 },
      );
    }

    await indexScorebatVideo(video);

    return NextResponse.json({ success: true, video });
  } catch (error: unknown) {
    console.error("Error indexing video:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to index video";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
