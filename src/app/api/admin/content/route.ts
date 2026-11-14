import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { getContent, saveContent, resetContent } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

async function authed(req: NextRequest) {
  return verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
}

const unauthorized = () => NextResponse.json({ error: "Not signed in" }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!(await authed(req))) return unauthorized();
  return NextResponse.json(getContent());
}

export async function PUT(req: NextRequest) {
  if (!(await authed(req))) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const saved = saveContent(body);
    revalidatePath("/");
    return NextResponse.json(saved);
  } catch (e) {
    console.error("content save failed", e);
    return NextResponse.json({ error: "Could not write content file" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await authed(req))) return unauthorized();
  const content = resetContent();
  revalidatePath("/");
  return NextResponse.json(content);
}
