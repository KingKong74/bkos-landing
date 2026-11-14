import { NextResponse } from "next/server";
import { isSlot, readSlot } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  if (!isSlot(slot)) return new NextResponse("Not found", { status: 404 });
  const file = readSlot(slot);
  if (!file) return new NextResponse("Not found", { status: 404 });
  const disposition = slot === "resume" ? `inline; filename="Bailey-King-Resume.pdf"` : "inline";
  return new NextResponse(new Uint8Array(file.body), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": disposition,
      "X-Content-Type-Options": "nosniff",
      // URLs carry ?v=<upload time>, so they can be cached hard
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
