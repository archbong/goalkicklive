import { NextRequest, NextResponse } from "next/server";
import { withCORS, preflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return preflight(req.headers.get("origin") ?? undefined);
}

export async function GET(req: NextRequest) {
  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    return NextResponse.json({ error: "Redis not configured" });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "*";

  const url = `${process.env.REDIS_URL}/ft.search/idx:videos`;
  const body = [q, "SORTBY", "publishedAt", "DESC", "LIMIT", "0", "20"];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return withCORS(NextResponse.json(data));
}
