import { NextResponse } from "next/server";
import { highlights } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(highlights);
}
