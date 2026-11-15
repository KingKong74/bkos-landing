import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { saveProjectImage } from "@/lib/projectImages";
import { MAX_BYTES } from "@/lib/media";

export async function POST(req: NextRequest) {
  if (!(await verifyToken(req.cookies.get(SESSION_COOKIE)?.value))) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 15 MB." }, { status: 400 });
  if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) return NextResponse.json({ error: "Use a PNG, JPEG, WebP or AVIF image." }, { status: 400 });
  try {
    const url = saveProjectImage(Buffer.from(await file.arrayBuffer()), file.type);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Could not save image." }, { status: 500 });
  }
}
