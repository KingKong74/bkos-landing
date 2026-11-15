import { readProjectImage } from "@/lib/projectImages";

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const file = readProjectImage(name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.body), { headers: {
    "Content-Type": file.type, "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=31536000, immutable",
  } });
}
