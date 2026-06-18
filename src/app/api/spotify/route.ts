import { NextResponse } from "next/server";
import { getCurrentOrRecent } from "@/lib/spotify";

// Cache for 30 seconds at the edge — keeps requests to Spotify reasonable
export const revalidate = 30;

export async function GET() {
  const track = await getCurrentOrRecent();
  if (!track) {
    return NextResponse.json({ track: null }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
  }
  return NextResponse.json(
    { track },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
  );
}
