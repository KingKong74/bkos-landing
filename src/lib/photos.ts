export interface Photo {
  src: string;
  alt: string;
  width: number;   // for masonry aspect ratios
  height: number;
  caption?: string;
  date?: string;   // ISO
}

// ─── Add new photos by appending to this array ───────────────────────────────
//
// Curation note: this ribbon reads professional-with-personality — workspace,
// whiteboards, code on screens, events, and at most a couple of travel shots.
// Holiday albums live under /trips instead.
//
// PLACEHOLDERS: the files below don't exist yet. Drop real images with these
// names into /public/photos/ (ratios noted per entry) and adjust alt text.
//
// To add photos:
//   1. Drop image files in /public/photos/
//   2. Add an entry below with src + alt + width/height
//   3. Width/height just need RATIO, not actual pixels — the gallery uses them
//      for masonry layout. Use 4:3 → 800x600, 1:1 → 800x800, vertical 3:4 → 600x800.
//   4. git push → live
// ────────────────────────────────────────────────────────────────────────────

export const photos: Photo[] = [
  { src: "/photos/desk-setup.jpg", alt: "Desk setup — mini PC humming under the monitor", width: 800, height: 600, date: "2026-06-10" },
  { src: "/photos/whiteboard-schema.jpg", alt: "Whiteboard — sketching the moniqr ledger schema", width: 800, height: 600, date: "2026-05-28" },
  { src: "/photos/code-screen.jpg", alt: "BK-OS window manager mid-refactor", width: 800, height: 800, date: "2026-06-02" },
  { src: "/photos/ca-study.jpg", alt: "CA tax notes and a long black", width: 800, height: 800, date: "2026-04-20" },
  { src: "/photos/meetup.jpg", alt: "Brisbane developer meetup", width: 600, height: 800, date: "2026-03-14" },
  { src: "/photos/homelab.jpg", alt: "The homelab shelf — BOSGAME E2 and friends", width: 800, height: 600, date: "2026-06-05" },
  { src: "/photos/pour-over.jpg", alt: "Saturday V60", width: 800, height: 800, date: "2026-05-03" },
  { src: "/photos/daintree.jpg", alt: "Daintree canopy — the one holiday shot", width: 600, height: 800, date: "2026-05-14" },
];

export function getAllPhotos(): Photo[] {
  return [...photos].sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
}
