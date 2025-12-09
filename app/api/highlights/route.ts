import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { highlightQuerySchema } from "@/lib/validators/highlight-validator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Generate cache key
    const cacheKey = `highlights:${JSON.stringify(queryParams)}`;

    // Try to get from cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("Cache hit for highlights:", cacheKey);
        return NextResponse.json(JSON.parse(cached));
      }
    } catch (cacheError) {
      console.warn(
        "Redis cache unavailable, proceeding without cache:",
        cacheError,
      );
    }

    // Validate query parameters
    const validatedParams = highlightQuerySchema.parse(queryParams);
    const {
      competition,
      competitions,
      team,
      teams,
      date,
      dateFrom,
      dateTo,
      search,
      provider,
      page = 1,
      pageSize = 20,
    } = validatedParams;

    // Build where clause for filtering
    const where: {
      competition?: { slug: string } | { slug: { in: string[] } };
      OR?: Array<
        | { homeTeam: { slug: string } }
        | { awayTeam: { slug: string } }
        | { homeTeam: { slug: { in: string[] } } }
        | { awayTeam: { slug: { in: string[] } } }
        | { title?: { contains: string; mode: "insensitive" } }
        | { homeTeam?: { name: { contains: string; mode: "insensitive" } } }
        | { awayTeam?: { name: { contains: string; mode: "insensitive" } } }
      >;
      matchDate?: { gte: Date; lt: Date } | { gte: Date; lte: Date };
      videos?: { some: { provider?: string } };
    } = {};

    if (competition) {
      where.competition = {
        slug: competition,
      };
    } else if (competitions && competitions.length > 0) {
      where.competition = {
        slug: { in: competitions },
      };
    }

    // Search functionality
    if (search) {
      where.OR = [
        ...(where.OR || []),
        { title: { contains: search, mode: "insensitive" } },
        { homeTeam: { name: { contains: search, mode: "insensitive" } } },
        { awayTeam: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Provider filtering
    if (provider && provider !== "all") {
      where.videos = {
        some: {
          provider: provider,
        },
      };
    }

    if (team) {
      where.OR = [
        ...(where.OR || []),
        { homeTeam: { slug: team } },
        { awayTeam: { slug: team } },
      ];
    } else if (teams && teams.length > 0) {
      where.OR = [
        ...(where.OR || []),
        { homeTeam: { slug: { in: teams } } },
        { awayTeam: { slug: { in: teams } } },
      ];
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);

      where.matchDate = {
        gte: targetDate,
        lt: nextDate,
      };
    } else if (dateFrom || dateTo) {
      const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
      const toDate = dateTo ? new Date(dateTo) : new Date();
      toDate.setDate(toDate.getDate() + 1); // Include the entire end date

      where.matchDate = {
        gte: fromDate,
        lt: toDate,
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.match.count({ where });

    // Get matches with pagination and filtering
    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
        videos: {
          where: { isActive: true },
          orderBy: { publishedAt: "desc" },
          take: 1, // Get only the latest video for each match
        },
      },
      orderBy: { matchDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Transform to highlight format
    const highlights = matches.map(
      (match: {
        id: number;
        title?: string | null;
        homeTeam: { name: string };
        awayTeam: { name: string };
        competition: { name: string };
        matchDate: Date;
        videos: Array<{
          thumbnailUrl?: string | null;
          sourceUrl?: string | null;
        }>;
      }) => ({
        id: match.id.toString(),
        title:
          match.title || `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        thumbnail:
          match.videos[0]?.thumbnailUrl || "/images/default-thumbnail.jpg",
        videoUrl: match.videos[0]?.sourceUrl || "",
        date: match.matchDate.toISOString(),
        competition: match.competition.name,
        teams: {
          home: match.homeTeam.name,
          away: match.awayTeam.name,
        },
        score: null, // Can be enhanced with actual score data
      }),
    );

    const response = {
      highlights,
      totalCount,
      page,
      pageSize,
      hasMore: page * pageSize < totalCount,
    };

    // Cache the response for 5 minutes
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(response));
      console.log("Cached highlights response for 5 minutes");
    } catch (cacheError) {
      console.warn("Failed to cache response:", cacheError);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return NextResponse.json(
      { error: "Failed to fetch highlights" },
      { status: 500 },
    );
  }
}
