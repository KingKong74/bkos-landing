import { Header } from "@/components/Header";
import {
  BaileyOSTile,
  NowTile,
  PhotosTile,
  ProjectTile,
  TripTile,
  TripsIndexTile,
  ContactBar,
} from "@/components/Tiles";
import { SpotifyTile } from "@/components/SpotifyTile";
import { getAllTrips } from "@/lib/trips";
import { getAllPhotos } from "@/lib/photos";
import { getBuildTime, formatTimeAgo } from "@/lib/build";

export default function HomePage() {
  const trips = getAllTrips();
  const lastTrip = trips[0];
  const photos = getAllPhotos();
  const buildTime = getBuildTime();
  const deployLabel = buildTime ? formatTimeAgo(buildTime) : "—";

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 0 48px" }}>
      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 12,
          padding: "0 16px",
        }}
      >
        <BaileyOSTile />
        <PhotosTile count={photos.length} thumbs={photos.slice(0, 4).map((p) => p.src)} />
        <NowTile />
        <SpotifyTile />
        {lastTrip ? (
          <TripTile
            slug={lastTrip.slug}
            title={lastTrip.title}
            dates={lastTrip.dates}
            photoCount={lastTrip.photos.length}
            videoCount={lastTrip.videos?.length ?? 0}
          />
        ) : (
          <ProjectTile title="No trips yet" description="Add one in src/lib/trips.ts" span={3} />
        )}

        <ProjectTile
          title="Moniqr"
          description="Accounting for Australian sole traders. Bank feeds, journals, BAS."
          badge="v0.4"
          span={2}
        />
        <TripsIndexTile count={trips.length} />
        <ProjectTile
          title="Flowdeck"
          description="Workflow tracker for builders. Kanban, FlowMap, Monaco-based code browser."
          badge="WIP"
          span={2}
        />
        <ContactBar />
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "#56544f",
          margin: "32px 16px 0",
          textAlign: "center",
        }}
      >
        © 2026 — running on a mini PC under my desk · last deploy: {deployLabel}
      </p>
    </main>
  );
}
