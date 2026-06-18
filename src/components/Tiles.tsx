import Link from "next/link";

// ─── NowTile ───────────────────────────────────────────────────────────────
// To update this, edit the constant below and push.
const NOW_TEXT = "Polishing Flowdeck's FlowMap & writing CA ANZ tax notes. Coffee: third today.";

export function NowTile() {
  return (
    <div
      style={{
        gridColumn: "span 2",
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      className="tile"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, background: "#f5a623", borderRadius: "50%", display: "inline-block" }} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#a8a59c",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Now
        </span>
      </div>
      <p style={{ fontSize: 13, margin: 0, lineHeight: 1.45, color: "#f4f4f1" }}>{NOW_TEXT}</p>
    </div>
  );
}

// ─── BaileyOSTile (the big hero project tile, Win98-themed) ────────────────
export function BaileyOSTile() {
  return (
    <a
      href="https://os.bkos.dev"
      style={{
        gridColumn: "span 4",
        gridRow: "span 2",
        background: "#008080",
        borderRadius: 12,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 220,
        textDecoration: "none",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
      className="tile"
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: "#c0c0c0",
              border: "2px outset #c0c0c0",
            }}
          />
          <span
            style={{
              fontFamily: "'MS Sans Serif', Tahoma, sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            bailey.os
          </span>
        </div>
        <p style={{ fontSize: 24, fontWeight: 500, color: "#fff", margin: "18px 0 8px", lineHeight: 1.15 }}>
          My personal cloud, dressed like Windows 98.
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.5, maxWidth: "32rem" }}>
          Self-hosted on a mini PC under my desk. Real auth, persistent notes, file explorer — and yes, those scrollbars work.
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <span
          style={{
            fontFamily: "'MS Sans Serif', Tahoma, sans-serif",
            fontSize: 12,
            padding: "4px 14px",
            background: "#c0c0c0",
            color: "#000",
            border: "2px outset #c0c0c0",
          }}
        >
          Open ▸
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
          os.bkos.dev
        </span>
      </div>
    </a>
  );
}

// ─── Generic project tile (small) ──────────────────────────────────────────
interface ProjectTileProps {
  title: string;
  description: string;
  href?: string;
  badge?: string;
  span?: number;
}

export function ProjectTile({ title, description, href, badge, span = 2 }: ProjectTileProps) {
  const Tag = href ? "a" : "div";
  const props = href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" } : {};
  return (
    <Tag
      {...(props as Record<string, string>)}
      style={{
        gridColumn: `span ${span}`,
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 12,
        padding: 14,
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
      className="tile"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#fafaf9" }}>{title}</p>
        {badge && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              padding: "1px 6px",
              background: "#26241f",
              color: "#a8a59c",
              borderRadius: 3,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <p style={{ fontSize: 12, color: "#a8a59c", margin: 0, lineHeight: 1.45 }}>{description}</p>
    </Tag>
  );
}

// ─── Photos preview tile (links to /photos) ────────────────────────────────
interface PhotosTileProps {
  count: number;
  thumbs?: string[]; // up to 4 image URLs to peek
}

export function PhotosTile({ count, thumbs = [] }: PhotosTileProps) {
  // Fallback color blocks if no thumbs available yet
  const fallbacks = ["#f0997b", "#5dcaa5", "#fac775", "#85b7eb"];
  const cells = Array.from({ length: 4 }, (_, i) => thumbs[i] ?? null);

  return (
    <Link
      href="/photos"
      style={{
        gridColumn: "span 2",
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        textDecoration: "none",
        color: "inherit",
      }}
      className="tile"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, flex: 1, minHeight: 84 }}>
        {cells.map((src, i) =>
          src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
            />
          ) : (
            <div key={i} style={{ background: fallbacks[i], borderRadius: 4 }} />
          )
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "#fafaf9" }}>Photos</p>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a7770" }}>{count}</span>
      </div>
    </Link>
  );
}

// ─── Trip preview tile (links to a specific trip) ──────────────────────────
interface TripTileProps {
  slug: string;
  title: string;
  dates: string;
  photoCount: number;
  videoCount: number;
}

export function TripTile({ slug, title, dates, photoCount, videoCount }: TripTileProps) {
  return (
    <Link
      href={`/trips/${slug}`}
      style={{
        gridColumn: "span 3",
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        gap: 12,
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
      }}
      className="tile"
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: "#5dcaa5",
          borderRadius: 8,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "#04342c",
        }}
      >
        ⛰
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a7770", marginBottom: 2 }}>
          LAST TRIP · {dates.toUpperCase()}
        </div>
        <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#fafaf9" }}>{title}</p>
        <p style={{ fontSize: 12, color: "#a8a59c", margin: "2px 0 0" }}>
          {photoCount} photo{photoCount === 1 ? "" : "s"}
          {videoCount > 0 && ` · ${videoCount} video${videoCount === 1 ? "" : "s"}`}
        </p>
      </div>
    </Link>
  );
}

// ─── Trips index tile (count of all trips) ─────────────────────────────────
export function TripsIndexTile({ count }: { count: number }) {
  return (
    <Link
      href="/trips"
      style={{
        gridColumn: "span 2",
        background: "#412402",
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 96,
        textDecoration: "none",
        color: "inherit",
      }}
      className="tile"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 14, color: "#fac775" }}>📍</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#fac775",
          }}
        >
          Trips
        </span>
      </div>
      <div>
        <p style={{ fontSize: 28, fontWeight: 500, margin: 0, color: "#faeeda", lineHeight: 1 }}>{count}</p>
        <p style={{ fontSize: 11, color: "#fac775", margin: "4px 0 0" }}>places I&apos;ve stayed</p>
      </div>
    </Link>
  );
}

// ─── Contact bar ───────────────────────────────────────────────────────────
export function ContactBar() {
  const links = [
    { href: "mailto:bailey.king37@gmail.com", label: "Email", icon: "✉" },
    { href: "https://github.com/KingKong74", label: "GitHub", icon: "⌥" },
    { href: "/resume.pdf", label: "Resume", icon: "📄" },
  ];
  return (
    <div
      style={{
        gridColumn: "span 6",
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 12,
        padding: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
      className="tile"
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#7a7770",
        }}
      >
        Say hi
      </span>
      <div style={{ display: "flex", gap: 18 }}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            style={{ color: "#f4f4f1", textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span aria-hidden style={{ fontSize: 16 }}>{l.icon}</span>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
