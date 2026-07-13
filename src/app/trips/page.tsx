/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getAllTrips } from "@/lib/trips";

export default function TripsPage() {
  const trips = getAllTrips();
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px 64px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/"
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#a8a59c", textDecoration: "none" }}
        >
          ← bkos.dev
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: "12px 0 4px", letterSpacing: "-0.02em" }}>
          Trips
        </h1>
        <p style={{ fontSize: 14, color: "#a8a59c", margin: 0 }}>
          {trips.length} place{trips.length === 1 ? "" : "s"} I&apos;ve stayed.
        </p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {trips.map((trip) => (
          <Link
            key={trip.slug}
            href={`/trips/${trip.slug}`}
            style={{
              display: "flex",
              gap: 16,
              padding: 16,
              background: "#1a1916",
              border: "1px solid #26241f",
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
            }}
            className="tile"
          >
            <img
              src={trip.cover}
              alt={trip.title}
              width={120}
              height={120}
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                background: "#5dcaa5",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#7a7770",
                  marginBottom: 4,
                }}
              >
                {trip.dates.toUpperCase()} · {trip.location.toUpperCase()}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "#fafaf9" }}>{trip.title}</h2>
              <p
                style={{
                  fontSize: 13,
                  color: "#a8a59c",
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {trip.story.split("\n\n")[0]}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#56544f", margin: "10px 0 0" }}>
                {trip.photos.length} photo{trip.photos.length === 1 ? "" : "s"}
                {trip.videos && trip.videos.length > 0 && ` · ${trip.videos.length} video${trip.videos.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
