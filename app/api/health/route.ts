// app/api/health/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { withCORS, preflight } from "@/lib/cors";

export const runtime = "nodejs"; // Prisma requires Node runtime

export async function OPTIONS(req: NextRequest) {
  return preflight(req.headers.get("origin") ?? undefined);
}

export async function GET(req: NextRequest) {
  // DB ping
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  // Redis ping (optional)
  let redisOk = false;
  try {
    if (redis) {
      await redis.ping();
      redisOk = true;
    }
  } catch {
    redisOk = false;
  }

  const healthy = dbOk && (!redis || redisOk);

  // Create the base response
  const res = NextResponse.json(
    {
      status: healthy ? "ok" : "error",
      db: dbOk,
      redis: redis ? redisOk : "not-configured",
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 500 }
  );

  // Wrap with CORS
  return withCORS(res, req.headers.get("origin") ?? undefined);
}
