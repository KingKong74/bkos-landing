// Server-only: uploaded files (resume PDF, headshot, hero image) stored on the
// content volume, with a fallback to the same file committed in public/.

import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.env.CONTENT_DIR || path.join(process.cwd(), "data"), "uploads");

export const SLOTS = {
  resume: { label: "Resume PDF", types: ["application/pdf"], fallback: "resume.pdf" },
  avatar: { label: "Headshot", types: ["image/jpeg", "image/png", "image/webp", "image/avif"], fallback: "avatar.jpg" },
  hero: { label: "Hero image", types: ["image/jpeg", "image/png", "image/webp", "image/avif"], fallback: "hero.jpg" },
} as const;
export type Slot = keyof typeof SLOTS;
export const MAX_BYTES = 15 * 1024 * 1024;

export function isSlot(s: string): s is Slot {
  return Object.prototype.hasOwnProperty.call(SLOTS, s);
}

interface Meta { type: string; name: string; size: number; at: number }

function metaPath(slot: Slot) { return path.join(DIR, `${slot}.json`); }
function filePath(slot: Slot) { return path.join(DIR, slot); }

function readMeta(slot: Slot): Meta | null {
  try { return JSON.parse(fs.readFileSync(metaPath(slot), "utf-8")); } catch { return null; }
}

/** Where a slot's file comes from right now. */
export function slotSource(slot: Slot): { kind: "upload"; meta: Meta } | { kind: "public"; file: string } | null {
  const meta = readMeta(slot);
  if (meta && fs.existsSync(filePath(slot))) return { kind: "upload", meta };
  const pub = path.join(process.cwd(), "public", SLOTS[slot].fallback);
  if (fs.existsSync(pub)) return { kind: "public", file: pub };
  return null;
}

/** Public URL for a slot (cache-busted), or null if nothing is available. */
export function mediaUrl(slot: Slot): string | null {
  const src = slotSource(slot);
  if (!src) return null;
  return src.kind === "upload" ? `/files/${slot}?v=${src.meta.at}` : `/${SLOTS[slot].fallback}`;
}

export function readSlot(slot: Slot): { body: Buffer; type: string; name: string } | null {
  const src = slotSource(slot);
  if (!src || src.kind !== "upload") return null;
  return { body: fs.readFileSync(filePath(slot)), type: src.meta.type, name: src.meta.name };
}

export function writeSlot(slot: Slot, body: Buffer, type: string, name: string) {
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(filePath(slot) + ".tmp", body);
  fs.renameSync(filePath(slot) + ".tmp", filePath(slot));
  const meta: Meta = { type, name, size: body.length, at: Date.now() };
  fs.writeFileSync(metaPath(slot), JSON.stringify(meta));
  return meta;
}

export function deleteSlot(slot: Slot) {
  fs.rmSync(filePath(slot), { force: true });
  fs.rmSync(metaPath(slot), { force: true });
}

export function allMedia() {
  return Object.fromEntries((Object.keys(SLOTS) as Slot[]).map((s) => [s, mediaUrl(s)])) as Record<Slot, string | null>;
}

export function mediaStatus() {
  return (Object.keys(SLOTS) as Slot[]).map((slot) => {
    const src = slotSource(slot);
    return {
      slot,
      label: SLOTS[slot].label,
      accept: SLOTS[slot].types.join(","),
      url: mediaUrl(slot),
      source: src?.kind ?? null,
      name: src?.kind === "upload" ? src.meta.name : src?.kind === "public" ? `public/${SLOTS[slot].fallback}` : null,
      size: src?.kind === "upload" ? src.meta.size : null,
    };
  });
}
