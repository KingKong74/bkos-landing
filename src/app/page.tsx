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
import { Hero } from "@/components/Hero";
import { FeaturedTrip } from "@/components/FeaturedTrip";
import { PhotoRibbon } from "@/components/PhotoRibbon";
import { VibeCheck } from "@/components/VibeCheck";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAllTrips } from "@/lib/trips";
import { getAllPhotos } from "@/lib/photos";
import { getBuildTime, formatTimeAgo } from "@/lib/build";
import { fetchBrisbaneWeather } from "@/lib/weather";

export default async function HomePage() {
  const trips = getAllTrips();
  const lastTrip = trips[0];
  const photos = getAllPhotos();
  const buildTime = getBuildTime();
  const deployLabel = buildTime ? formatTimeAgo(buildTime) : "—";
  const weather = await fetchBrisbaneWeather();

  return (
    <main>
      <Hero weather={weather} />

      {/* Projects bento */}
      <section id="projects" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 16px 24px" }}>
        <ScrollReveal style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#7a7770",
              margin: 0,
            }}
          >
            What I&apos;m building
          </h2>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          <BaileyOSTile index={0} />
          <PhotosTile index={1} count={photos.length} thumbs={photos.slice(0, 4).map((p) => p.src)} />
          <NowTile index={2} />
          <SpotifyTile index={3} />
          {lastTrip ? (
            <TripTile
              index={4}
              slug={lastTrip.slug}
              title={lastTrip.title}
              dates={lastTrip.dates}
              photoCount={lastTrip.photos.length}
              videoCount={lastTrip.videos?.length ?? 0}
            />
          ) : (
            <ProjectTile index={4} title="No trips yet" description="Add one in src/lib/trips.ts" span={3} />
          )}
          <ProjectTile
            index={5}
            title="Moniqr"
            description="Accounting for Australian sole traders. Bank feeds, journals, BAS."
            badge="v0.4"
            span={2}
          />
          <TripsIndexTile index={6} count={trips.length} />
          <ProjectTile
            index={7}
            title="Flowdeck"
            description="Workflow tracker for builders. Kanban, FlowMap, Monaco-based code browser."
            badge="WIP"
            span={2}
          />
          <ContactBar index={8} />
        </div>
      </section>

      {/* Featured trip */}
      {lastTrip && <FeaturedTrip trip={lastTrip} />}

      {/* Photo ribbon */}
      <PhotoRibbon photos={photos} />

      {/* Vibe check */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <VibeCheck deployLabel={deployLabel} />
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "#56544f",
          margin: "0 16px 48px",
          textAlign: "center",
        }}
      >
        © 2026 — running on a mini PC under my desk · self-hosted with love
      </p>
    </main>
  );
}
