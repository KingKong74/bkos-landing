import Link from "next/link";
import { AdminEditor } from "@/components/AdminEditor";
import { getAllTrips } from "@/lib/trips";
import { getAllPhotos } from "@/lib/photos";
import { getBuildTime, formatTimeAgo } from "@/lib/build";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const trips = getAllTrips();
  const photos = getAllPhotos();
  const buildTime = getBuildTime();
  const spotifyConnected = !!process.env.SPOTIFY_REFRESH_TOKEN;
  const cfAnalytics = !!process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

  const cards = [
    {
      label: "Trips",
      value: trips.length.toString(),
      sub: trips[0]?.title ?? "none yet",
    },
    {
      label: "Photos",
      value: photos.length.toString(),
      sub: photos[0]?.date ?? "—",
    },
    {
      label: "Spotify",
      value: spotifyConnected ? "Connected" : "Not connected",
      sub: spotifyConnected ? "polling /api/spotify" : "set SPOTIFY_* env vars",
      ok: spotifyConnected,
    },
    {
      label: "Last deploy",
      value: buildTime ? formatTimeAgo(buildTime) : "—",
      sub: buildTime ? new Date(buildTime).toLocaleString() : "no .build-time file",
    },
  ];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px 64px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <Link
            href="/"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#a8a59c", textDecoration: "none" }}
          >
            ← bkos.dev
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 500, margin: "10px 0 4px", letterSpacing: "-0.02em" }}>
            Admin
          </h1>
          <p style={{ fontSize: 13, color: "#a8a59c", margin: 0 }}>
            Site status + content editor.
          </p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              background: "transparent",
              color: "#a8a59c",
              border: "1px solid #3a3935",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Sign out
          </button>
        </form>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              padding: 16,
              background: "#1a1916",
              border: "1px solid #26241f",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#7a7770",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                margin: 0,
                color: c.ok === false ? "#e24b4a" : "#fafaf9",
                lineHeight: 1.1,
              }}
            >
              {c.value}
            </div>
            <div style={{ fontSize: 11, color: "#7a7770", marginTop: 6, fontFamily: "var(--font-mono)" }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#7a7770",
            marginBottom: 12,
          }}
        >
          Site content
        </h2>
        <AdminEditor />
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#7a7770",
            marginBottom: 12,
          }}
        >
          Web analytics
        </h2>
        <div
          style={{
            padding: 16,
            background: "#1a1916",
            border: "1px solid #26241f",
            borderRadius: 12,
            color: "#a8a59c",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {cfAnalytics ? (
            <>
              <p style={{ margin: 0 }}>Cloudflare Web Analytics beacon is loaded. View full stats at:</p>
              <p style={{ margin: "8px 0 0" }}>
                <a
                  href="https://dash.cloudflare.com/?to=/:account/web-analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#f5a623", textDecoration: "underline" }}
                >
                  dash.cloudflare.com → Web Analytics
                </a>
              </p>
            </>
          ) : (
            <>
              <p style={{ margin: 0 }}>To see traffic stats, enable Cloudflare Web Analytics:</p>
              <ol style={{ margin: "10px 0 0", paddingLeft: 20 }}>
                <li>dash.cloudflare.com → Web Analytics → Add site → bkos.dev</li>
                <li>Copy the token</li>
                <li>Set <code style={{ fontFamily: "var(--font-mono)", color: "#f5a623" }}>NEXT_PUBLIC_CF_ANALYTICS_TOKEN</code> in Dokploy env vars</li>
                <li>Redeploy</li>
              </ol>
            </>
          )}
        </div>
      </section>

      <section>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#7a7770",
            marginBottom: 12,
          }}
        >
          Quick links
        </h2>
        <div style={{ display: "grid", gap: 8 }}>
          <AdminLink href="https://github.com/KingKong74/bkos-landing" label="GitHub repo" />
          <AdminLink href="https://os.bkos.dev" label="bailey.os" />
          <AdminLink href="/" label="Public site" />
        </div>
      </section>
    </main>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{
        padding: "12px 16px",
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 8,
        textDecoration: "none",
        color: "#f4f4f1",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{label}</span>
      <span style={{ color: "#56544f" }}>↗</span>
    </a>
  );
}
