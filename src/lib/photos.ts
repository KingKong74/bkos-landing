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
// To add photos:
//   1. Drop image files in /public/photos/
//   2. Add an entry below with src + alt + width/height
//   3. Width/height just need RATIO, not actual pixels — the gallery uses them
//      for masonry layout. Use 4:3 → 800x600, 1:1 → 800x800, vertical 3:4 → 600x800.
//   4. git push → live
// ────────────────────────────────────────────────────────────────────────────

export const photos: Photo[] = [
  // Placeholder examples — replace with real files
  { src: "/photos/sample-1.jpg", alt: "Brisbane river at dusk", width: 800, height: 600, date: "2026-04-12" },
  { src: "/photos/sample-2.jpg", alt: "Coffee, Northshore", width: 800, height: 800, date: "2026-04-15" },
  { src: "/photos/sample-3.jpg", alt: "Daintree canopy", width: 600, height: 800, date: "2026-05-14" },
  { src: "/photos/sample-4.jpg", alt: "Beach, Cape Trib", width: 800, height: 600, date: "2026-05-15" },
  { src: "/photos/sample-5.jpg", alt: "BOSGAME mini PC arrival", width: 800, height: 800, date: "2026-06-05" },
  { src: "/photos/sample-6.jpg", alt: "Desk setup, June", width: 800, height: 600, date: "2026-06-10" },
];

export function getAllPhotos(): Photo[] {
  return [...photos].sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
}
