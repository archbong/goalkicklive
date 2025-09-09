import { z } from "zod";

const ScoreBatVideo = z.object({
  id: z.string().optional(),
  title: z.string(),
  competition: z.string().nullable().optional(),
  matchviewUrl: z.string().url().optional(),
  thumbnail: z.string().url().nullable().optional(),
  date: z.string(), // ISO
  side1: z.object({ name: z.string() }).optional(),
  side2: z.object({ name: z.string() }).optional(),
  videos: z.array(z.object({ embed: z.string(), title: z.string().optional() })).default([]),
});

const ScoreBatResponse = z.object({ response: z.array(ScoreBatVideo) });

const BASE = process.env.SCOREBAT_API_BASE ?? "https://www.scorebat.com/video-api/v3";

async function httpGet(path: string) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { "User-Agent": process.env.SCOREBAT_USER_AGENT ?? "Goalkicklive-HighlightsBot/1.0" },
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`ScoreBat HTTP ${res.status}`);
  return res.json();
}

export async function fetchRecent() {
  const raw = await httpGet("/");
  return ScoreBatResponse.parse(raw).response;
}

export type SBVideo = z.infer<typeof ScoreBatVideo>;
