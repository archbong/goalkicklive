// app/api/competitions/[slug]/videos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { getPaginationParams } from "@/lib/pagination";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return preflight(req.headers.get("origin") ?? undefined);
}

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  const { page, limit, skip } = getPaginationParams(req);

  const competition = await prisma.competition.findUnique({
    where: { slug: params.slug },
  });
  if (!competition) {
    return withCORS(
      NextResponse.json({ error: "Competition not found" }, { status: 404 }),
    );
  }

  const [items, total] = await Promise.all([
    prisma.video.findMany({
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: { match: { include: { homeTeam: true, awayTeam: true } } },
      where: { match: { competitionId: competition.id } },
    }),
    prisma.video.count({ where: { match: { competitionId: competition.id } } }),
  ]);

  return withCORS(NextResponse.json({ page, limit, total, items }));
}
