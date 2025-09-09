import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const cacheKey = "highlights:filters:options";

    // Try to get from cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("Cache hit for filter options");
        return NextResponse.json(JSON.parse(cached));
      }
    } catch (cacheError) {
      console.warn(
        "Redis cache unavailable, proceeding without cache:",
        cacheError,
      );
    }
    // Get available competitions
    const competitions = await prisma.competition.findMany({
      select: {
        name: true,
        slug: true,
        country: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Get available teams
    const teams = await prisma.team.findMany({
      select: {
        name: true,
        slug: true,
        country: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Get date range from matches
    const dateRange = await prisma.match.findMany({
      select: {
        matchDate: true,
      },
      orderBy: {
        matchDate: "asc",
      },
      take: 1,
    });

    const latestDate = await prisma.match.findMany({
      select: {
        matchDate: true,
      },
      orderBy: {
        matchDate: "desc",
      },
      take: 1,
    });

    const minDate = dateRange[0]?.matchDate || new Date();
    const maxDate = latestDate[0]?.matchDate || new Date();

    // Get provider counts (from videos)
    const providerCounts = await prisma.video.groupBy({
      by: ["provider"],
      _count: {
        id: true,
      },
    });

    const response = {
      competitions: competitions.map((c: any) => ({
        value: c.slug,
        label: c.name,
        country: c.country,
      })),
      teams: teams.map((t: any) => ({
        value: t.slug,
        label: t.name,
        country: t.country,
      })),
      dateRange: {
        min: minDate,
        max: maxDate,
      },
      providers: providerCounts.map((p: any) => ({
        id: p.provider || "unknown",
        name: p.provider || "Unknown",
        count: p._count.id,
      })),
    };

    // Cache the response for 1 hour
    try {
      await redis.setex(cacheKey, 3600, JSON.stringify(response));
      console.log("Cached filter options for 1 hour");
    } catch (cacheError) {
      console.warn("Failed to cache filter options:", cacheError);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 },
    );
  }
}
