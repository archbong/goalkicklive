// app/api/videos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { getPaginationParams } from "@/lib/pagination";
import { cacheGet, cacheSet } from "@/lib/cache";

export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return preflight(req.headers.get("origin") ?? undefined);
}

export async function GET(req: NextRequest) {
  const { page, limit, skip } = getPaginationParams(req);

  const cacheKey = `videos:p${page}:l${limit}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return withCORS(NextResponse.json(cached));

  const [items, total] = await Promise.all([
    prisma.video.findMany({
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: {
        match: {
          include: { homeTeam: true, awayTeam: true, competition: true },
        },
      },
    }),
    prisma.video.count(),
  ]);

  const payload = {
    page,
    limit,
    total,
    items,
  };

  await cacheSet(cacheKey, payload, 30); // cache for 30s
  return withCORS(NextResponse.json(payload));
}
