// app/api/teams/[slug]/videos/route.ts
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

  const team = await prisma.team.findUnique({
    where: { slug: params.slug },
  });
  if (!team) {
    return withCORS(
      NextResponse.json({ error: "Team not found" }, { status: 404 }),
    );
  }

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
      where: {
        OR: [
          { match: { homeTeamId: team.id } },
          { match: { awayTeamId: team.id } },
        ],
      },
    }),
    prisma.video.count({
      where: {
        OR: [
          { match: { homeTeamId: team.id } },
          { match: { awayTeamId: team.id } },
        ],
      },
    }),
  ]);

  return withCORS(NextResponse.json({ page, limit, total, items }));
}
