import { Hero } from "@/components/Hero";
import { CurrentlyBuilding } from "@/components/CurrentlyBuilding";
import { Personal } from "@/components/Personal";
import { Perspectives } from "@/components/Perspectives";
import { TheStack } from "@/components/TheStack";
import { PhotoRibbon } from "@/components/PhotoRibbon";
import { VibeCheck } from "@/components/VibeCheck";
import { getAllPhotos } from "@/lib/photos";
import { getBuildTime, formatTimeAgo } from "@/lib/build";
import { fetchBrisbaneWeather } from "@/lib/weather";

export default async function HomePage() {
  const photos = getAllPhotos();
  const buildTime = getBuildTime();
  const deployLabel = buildTime ? formatTimeAgo(buildTime) : "—";
  const weather = await fetchBrisbaneWeather();

  return (
    <main>
      <Hero weather={weather} />

      {/* Projects showcase */}
      <CurrentlyBuilding />

      {/* Infra credibility, kept quiet */}
      <TheStack />

      {/* Writing */}
      <Perspectives />

      {/* Photo ribbon */}
      <PhotoRibbon photos={photos} />

      {/* Personal + connect */}
      <Personal />

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
