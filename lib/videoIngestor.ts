// lib/videoIngestor.ts
import { indexScorebatVideo } from "@/lib/videoIndexer";

const SCOREBAT_API = "https://www.scorebat.com/video-api/v3/feed/?token=" + process.env.SCOREBAT_API_KEY;

export async function ingestScorebatVideos() {
  const res = await fetch(SCOREBAT_API);
  if (!res.ok) {
    throw new Error(`Failed to fetch Scorebat API: ${res.status}`);
  }

  const data = await res.json();
  const videos = data.response || [];

  for (const video of videos) {
    await indexScorebatVideo(video);
  }

  return { count: videos.length };
}
