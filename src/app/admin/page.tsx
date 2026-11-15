import type { Metadata } from "next";
import { AdminShell } from "@/components/AdminShell";
import { AdminEditor } from "@/components/AdminEditor";
import { AdminFiles } from "@/components/AdminFiles";
import { mediaStatus } from "@/lib/media";
import { getBuildTime, formatTimeAgo } from "@/lib/build";
import { fetchBrisbaneWeather } from "@/lib/weather";
import { getContent, hasSavedContent } from "@/lib/contentStore";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — bkos.dev", robots: { index: false } };

export default async function AdminPage() {
  const buildTime = getBuildTime();
  const weather = await fetchBrisbaneWeather();
  const spotify = !!process.env.SPOTIFY_REFRESH_TOKEN;
  const cfAnalytics = !!process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

  const status = [
    { label: "Last deploy", value: buildTime ? formatTimeAgo(buildTime) : "—", sub: buildTime ? new Date(buildTime).toLocaleString("en-AU", { timeZone: "Australia/Brisbane" }) : "no .build-time file" },
    { label: "Spotify", value: spotify ? "Connected" : "Not connected", sub: spotify ? "now playing via /api/spotify" : "set SPOTIFY_* env vars", ok: spotify },
    { label: "Weather", value: weather.temp == null ? "Unavailable" : `${weather.temp}°C`, sub: weather.temp == null ? "Open-Meteo fetch failed" : `Brisbane · ${weather.description}`, ok: weather.temp != null },
    { label: "Analytics", value: cfAnalytics ? "On" : "Off", sub: cfAnalytics ? "Cloudflare Web Analytics" : "set NEXT_PUBLIC_CF_ANALYTICS_TOKEN", ok: cfAnalytics },
  ];

  const links = [
    { href: "/", label: "Public site" },
    { href: "https://github.com/KingKong74/bkos-landing", label: "GitHub repo" },
    { href: "https://projects.bkos.dev", label: "Stack" },
    { href: "https://os.bkos.dev", label: "BK-OS" },
    ...(cfAnalytics ? [{ href: "https://dash.cloudflare.com/?to=/:account/web-analytics", label: "Cloudflare analytics" }] : []),
  ];

  return (
    <AdminShell>
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 72px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div>
          <div className="eyebrow">Admin</div>
          <h1 className="h2" style={{ marginTop: 6 }}>Manage your website</h1>
        </div>

        <section>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Content</div>
          <AdminEditor initial={getContent()} hasSaved={hasSavedContent()} filesPanel={<AdminFiles initial={mediaStatus()} />} />
        </section>

        <details className="card" style={{ padding: 20 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>Site status & technical details</summary>
          <section>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Status</div>
            <div className="rl-grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 12 }}>
              {status.map((c) => (
                <div key={c.label} className="card" style={{ padding: 18 }}>
                  <div className="mono mute" style={{ fontSize: 12 }}>{c.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6, color: c.ok === false ? "var(--acc)" : "var(--ink)" }}>{c.value}</div>
                  <div className="mono mute" style={{ fontSize: 12, marginTop: 4 }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </section>
        </details>

        <section>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Links</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {links.map((l) => (
              <a key={l.href} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="btn btn-surf" style={{ fontSize: 14, padding: "9px 18px" }}>
                {l.label} {l.href.startsWith("http") ? "↗" : ""}
              </a>
            ))}
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
