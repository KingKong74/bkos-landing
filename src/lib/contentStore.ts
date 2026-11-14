// Server-only: reads/writes the admin-edited content as JSON on disk.
// In production CONTENT_DIR defaults to /app/data, a Docker volume mounted by
// Dokploy so edits survive redeploys.

import fs from "node:fs";
import path from "node:path";
import { mergeContent, type SiteContent } from "./content";

const DIR = process.env.CONTENT_DIR || path.join(process.cwd(), "data");
const FILE = path.join(DIR, "content.json");

export function getContent(): SiteContent {
  try {
    return mergeContent(JSON.parse(fs.readFileSync(FILE, "utf-8")));
  } catch {
    return mergeContent(null);
  }
}

export function saveContent(input: unknown): SiteContent {
  const content = mergeContent(input);
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(content, null, 2));
  fs.renameSync(tmp, FILE);
  return content;
}

export function resetContent(): SiteContent {
  fs.rmSync(FILE, { force: true });
  return mergeContent(null);
}

export function hasSavedContent(): boolean {
  return fs.existsSync(FILE);
}
