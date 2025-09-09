import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { fetchRecent, SBVideo } from "@/lib/scorebat";
import { ensureTeam, findCompetitionByName } from "@/lib/mappers";
import { sha256 } from "@/lib/checksum";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";

function requireAdmin(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function OPTIONS(req: NextRequest) {
  return preflight(req.headers.get("origin") ?? undefined);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ?? undefined;
  const baseResponse = new NextResponse(null, { status: 200 });
  const cors = withCORS(baseResponse, origin);
  const unauthorized = requireAdmin(req);
  if (unauthorized) return new NextResponse(unauthorized.body, { status: 401, headers: cors.headers });

  const videos: SBVideo[] = await fetchRecent();

  let created = 0, updated = 0, skipped = 0;

  for (const v of videos) {
    const title = v.title;
    const home = v.side1?.name;
    const away = v.side2?.name;
    const competitionName = v.competition;

    if (!home || !away || !competitionName) {
      skipped++;
      continue;
    }

    const homeTeam = await ensureTeam(home);
    const awayTeam = await ensureTeam(away);
    const competition = await findCompetitionByName(competitionName);

    if (!competition) {
      skipped++;
      continue;
    }

    const extId = v.id ?? v.matchviewUrl ?? "";
    const checksum = await sha256(JSON.stringify(v));

    const match = await prisma.match.upsert({
      where: { extId },
      update: { title, status: "FINISHED" },
      create: {
        extId,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        competitionId: competition.id,
        matchDate: new Date(v.date),
        title,
        status: "FINISHED",
      },
    });

    for (const vid of v.videos) {
      // Use a checksum as the unique identifier since 'id' is not present
      const videoIdBytes = await sha256(JSON.stringify(vid));
      const videoIdHex = Buffer.from(videoIdBytes).toString("hex");
      const videoId = parseInt(videoIdHex, 16);
      await prisma.video.upsert({
        where: { id: videoId },
        update: { embedHtml: vid.embed, title: vid.title },
        create: {
          id: videoId,
          matchId: match.id,
          title: vid.title ?? "",
          embedHtml: vid.embed,
          sourceUrl: v.matchviewUrl ?? "",
          thumbnailUrl: v.thumbnail ?? "",
          provider: "ScoreBat",
          publishedAt: new Date(v.date),
          checksum: Buffer.from(checksum),
        },
      });
    }

    created++;
  }

  return new NextResponse(JSON.stringify({ created, skipped }), { headers: cors.headers });
}
