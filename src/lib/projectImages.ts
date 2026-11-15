import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DIR = path.join(process.env.CONTENT_DIR || path.join(process.cwd(), "data"), "project-images");
const TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" };
export function saveProjectImage(body: Buffer, type: string) {
  const extension = TYPES[type];
  if (!extension) throw new Error("Use a PNG, JPEG, WebP or AVIF image.");
  const name = `${randomUUID()}.${extension}`;
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(path.join(DIR, name), body, { flag: "wx" });
  return `/project-images/${name}`;
}
export function readProjectImage(name: string) {
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp|avif)$/.test(name)) return null;
  const type = Object.entries(TYPES).find(([, extension]) => name.endsWith(`.${extension}`))?.[0];
  try { return { body: fs.readFileSync(path.join(DIR, name)), type: type! }; } catch { return null; }
}
