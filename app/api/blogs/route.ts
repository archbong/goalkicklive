import { NextResponse } from "next/server";
import { blogs } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(blogs);
}
