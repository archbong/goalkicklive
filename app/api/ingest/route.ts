// app/api/ingest/route.ts
import { NextResponse } from "next/server";
import { ingestScorebatVideos } from "@/lib/videoIngestor";

export async function POST() {
  try {
    const result = await ingestScorebatVideos();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
