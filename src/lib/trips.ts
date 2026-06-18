export interface TripVideo {
  provider: "youtube" | "vimeo";
  id: string;
  title?: string;
}

export interface Trip {
  slug: string;
  title: string;
  dates: string;          // "May 2026" — human readable
  startDate: string;      // ISO date for sorting
  location: string;
  cover: string;          // /trips/<slug>/cover.jpg
  photos: string[];       // filenames inside /trips/<slug>/
  videos?: TripVideo[];
  story: string;          // markdown
}

// ─── Add new trips by appending to this array ────────────────────────────────
//
// To add a new trip:
//   1. Create a folder at /public/trips/<slug>/ and drop in your photos
//   2. Set `cover` to the cover image filename
//   3. List remaining photos in `photos`
//   4. Write the story in markdown (multi-line strings supported)
//   5. (Optional) Add YouTube/Vimeo videos via `videos: [{ provider, id }]`
//   6. git push → Dokploy auto-redeploys → trip appears at /trips/<slug>
// ────────────────────────────────────────────────────────────────────────────

export const trips: Trip[] = [
  {
    slug: "cairns-may-2026",
    title: "Cairns & the Daintree",
    dates: "May 2026",
    startDate: "2026-05-12",
    location: "Far North Queensland, Australia",
    cover: "/trips/cairns-may-2026/cover.jpg",
    photos: [
      "/trips/cairns-may-2026/photo-01.jpg",
      "/trips/cairns-may-2026/photo-02.jpg",
      "/trips/cairns-may-2026/photo-03.jpg",
      "/trips/cairns-may-2026/photo-04.jpg",
    ],
    videos: [
      // Add real video IDs once you have them
      // { provider: "youtube", id: "dQw4w9WgXcQ", title: "Snorkelling at Agincourt Reef" },
    ],
    story: `Spent a week up in Far North Queensland.

The Daintree is genuinely something else — oldest continuously surviving rainforest on the planet, and you can walk through it in flip-flops. Drove the inland route up to Cape Tribulation and came back down via Mossman Gorge.

Snorkelled at Agincourt Reef on the third day. Saw two reef sharks, a turtle, and what felt like 10,000 fish I couldn't name.

Coffee in Port Douglas. Beer at Hartley's. Slept like the dead every night.`,
  },
];

export function getAllTrips(): Trip[] {
  return [...trips].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}
