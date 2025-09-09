// lib/cors.ts
import { NextResponse } from "next/server";

const allowlist = (process.env.CORS_ALLOW_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowHeaders = process.env.CORS_ALLOW_HEADERS ?? "Content-Type,Authorization";
const allowMethods = process.env.CORS_ALLOW_METHODS ?? "GET,POST,OPTIONS";

export function withCORS(res: NextResponse, origin?: string) {
  const headers = new Headers(res.headers);

  const isAllowed = !origin || allowlist.includes(origin);

  headers.set("Vary", "Origin");
  if (isAllowed) {
    if (origin) headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", allowMethods);
    headers.set("Access-Control-Allow-Headers", allowHeaders);
    headers.set("Access-Control-Allow-Credentials", "true");
  }

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export function preflight(origin?: string) {
  const headers = new Headers();
  const isAllowed = origin && allowlist.includes(origin);

  if (isAllowed) {
    headers.set("Access-Control-Allow-Origin", origin!);
  } else {
    headers.set("Access-Control-Allow-Origin", "*");
  }

  headers.set("Access-Control-Allow-Methods", allowMethods);
  headers.set("Access-Control-Allow-Headers", allowHeaders);
  headers.set("Access-Control-Max-Age", "600");

  return new NextResponse(null, { status: 204, headers });
}
