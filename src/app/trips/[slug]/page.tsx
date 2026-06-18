/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getAllTrips, getTripBySlug } from "@/lib/trips";

export function generateStaticParams() {
  return getAllTrips().map((t) => ({ slug: t.slug }));
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 64px" }}>
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/trips"
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#a8a59c", textDecoration: "none" }}
        >
          ← trips
        </Link>
      </div>

      {/* Hero */}
      <img
        src={trip.cover}
        alt={trip.title}
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
          borderRadius: 12,
          background: "#5dcaa5",
          marginBottom: 24,
        }}
      />

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#7a7770", marginBottom: 6 }}>
          {trip.dates.toUpperCase()} · {trip.location.toUpperCase()}
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 500, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          {trip.title}
        </h1>
      </div>

      {/* Story */}
      <article
        style={{
          fontSize: 16,
          color: "#d8d6cf",
          lineHeight: 1.7,
          maxWidth: "44rem",
          marginBottom: 48,
        }}
        className="trip-story"
      >
        <style>{`
          .trip-story p { margin: 0 0 1em; }
          .trip-story p:last-child { margin-bottom: 0; }
          .trip-story a { color: #f5a623; text-decoration: underline; }
        `}</style>
        <ReactMarkdown>{trip.story}</ReactMarkdown>
      </article>

      {/* Videos */}
      {trip.videos && trip.videos.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#7a7770",
              marginBottom: 16,
            }}
          >
            Videos
          </h2>
          <div style={{ display: "grid", gap: 16 }}>
            {trip.videos.map((v) => (
              <VideoEmbed key={v.id} provider={v.provider} id={v.id} title={v.title} />
            ))}
          </div>
        </section>
      )}

      {/* Photos */}
      {trip.photos.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#7a7770",
              marginBottom: 16,
            }}
          >
            Photos ({trip.photos.length})
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 8,
            }}
          >
            {trip.photos.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#26241f",
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function VideoEmbed({ provider, id, title }: { provider: string; id: string; title?: string }) {
  const src =
    provider === "youtube"
      ? `https://www.youtube.com/embed/${id}`
      : provider === "vimeo"
      ? `https://player.vimeo.com/video/${id}`
      : "";
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden", background: "#0f0e0c" }}>
      <iframe
        src={src}
        title={title ?? "Video"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
