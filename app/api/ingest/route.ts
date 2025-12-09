// app/api/ingest/route.ts
import { NextResponse } from "next/server";
import { ingestScorebatVideos } from "@/lib/videoIngestor";

export async function POST() {
  try {
    const result = await ingestScorebatVideos();
    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
