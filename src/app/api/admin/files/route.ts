import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { SLOTS, MAX_BYTES, isSlot, writeSlot, deleteSlot, mediaStatus } from "@/lib/media";

export const dynamic = "force-dynamic";

async function authed(req: NextRequest) {
  return verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export async function POST(req: NextRequest) {
  if (!(await authed(req))) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const slot = String(form?.get("slot") ?? "");
  const file = form?.get("file");
  if (!isSlot(slot)) return NextResponse.json({ error: "Unknown file slot" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!(SLOTS[slot].types as readonly string[]).includes(file.type)) {
    return NextResponse.json({ error: `${SLOTS[slot].label} must be ${SLOTS[slot].types.join(" / ")}` }, { status: 400 });
  }
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is over 15 MB" }, { status: 400 });
  writeSlot(slot, Buffer.from(await file.arrayBuffer()), file.type, file.name);
  revalidatePath("/");
  return NextResponse.json(mediaStatus());
}

export async function DELETE(req: NextRequest) {
  if (!(await authed(req))) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const slot = req.nextUrl.searchParams.get("slot") ?? "";
  if (!isSlot(slot)) return NextResponse.json({ error: "Unknown file slot" }, { status: 400 });
  deleteSlot(slot);
  revalidatePath("/");
  return NextResponse.json(mediaStatus());
}
