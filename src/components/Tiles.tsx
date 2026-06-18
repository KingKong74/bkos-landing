"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const tileBase: React.CSSProperties = {
  background: "#1a1916",
  border: "1px solid #26241f",
  borderRadius: 14,
  padding: 16,
  textDecoration: "none",
  color: "inherit",
  display: "block",
  position: "relative",
};

function TileReveal({ children, index = 0, gridColumn, gridRow, href, ...rest }: {
  children: ReactNode;
  index?: number;
  gridColumn?: string;
  gridRow?: string;
  href?: string;
  style?: React.CSSProperties;
}) {
  const Tag = href ? motion.a : motion.div;
  const linkProps = href
    ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined }
    : {};
  return (
    <Tag
      {...(linkProps as Record<string, string>)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, borderColor: "rgba(245,166,35,0.35)" }}
      style={{ ...tileBase, gridColumn, gridRow, ...rest.style }}
    >
      {children}
    </Tag>
  );
}

// ─── NowTile ─────────────────────────────────────────────────
const NOW_TEXT = "Polishing Flowdeck's FlowMap & writing CA ANZ tax notes. Coffee: third today.";

export function NowTile({ index = 0 }: { index?: number }) {
  return (
    <TileReveal index={index} gridColumn="span 2">
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 8, height: 8, background: "#f5a623", borderRadius: "50%", display: "inline-block" }}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#a8a59c", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Now
        </span>
      </div>
      <p style={{ fontSize: 13, margin: 0, lineHeight: 1.5, color: "#f4f4f1" }}>{NOW_TEXT}</p>
    </TileReveal>
  );
}

// ─── BaileyOSTile ─────────────────────────────────────────────
export function BaileyOSTile({ index = 0 }: { index?: number }) {
  return (
    <TileReveal
      index={index}
      href="https://os.bkos.dev"
      gridColumn="span 4"
      gridRow="span 2"
      style={{ background: "#008080", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", overflow: "hidden", padding: 20, minHeight: 220 }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, background: "#c0c0c0", border: "2px outset #c0c0c0" }} />
            <span style={{ fontFamily: "'MS Sans Serif', Tahoma, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.9)" }}>bailey.os</span>
          </div>
          <p style={{ fontSize: 26, fontWeight: 500, margin: "20px 0 8px", lineHeight: 1.15, color: "#fff" }}>
            My personal cloud, dressed like Windows 98.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.55, maxWidth: "32rem" }}>
            Self-hosted on a mini PC under my desk. Real auth, persistent notes, file explorer — and yes, those scrollbars work.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <span style={{ fontFamily: "'MS Sans Serif', Tahoma, sans-serif", fontSize: 12, padding: "4px 14px", background: "#c0c0c0", color: "#000", border: "2px outset #c0c0c0" }}>
            Open ▸
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
            os.bkos.dev
          </span>
        </div>
      </div>
    </TileReveal>
  );
}

// ─── ProjectTile ──────────────────────────────────────────────
interface ProjectTileProps {
  title: string;
  description: string;
  href?: string;
  badge?: string;
  span?: number;
  index?: number;
}

export function ProjectTile({ title, description, href, badge, span = 2, index = 0 }: ProjectTileProps) {
  return (
    <TileReveal index={index} href={href} gridColumn={`span ${span}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#fafaf9" }}>{title}</p>
        {badge && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "1px 7px", background: "#26241f", color: "#a8a59c", borderRadius: 4 }}>
            {badge}
          </span>
        )}
      </div>
      <p style={{ fontSize: 12, color: "#a8a59c", margin: 0, lineHeight: 1.5 }}>{description}</p>
    </TileReveal>
  );
}

// ─── PhotosTile ───────────────────────────────────────────────
interface PhotosTileProps {
  count: number;
  thumbs?: string[];
  index?: number;
}

export function PhotosTile({ count, thumbs = [], index = 0 }: PhotosTileProps) {
  const fallbacks = ["#f0997b", "#5dcaa5", "#fac775", "#85b7eb"];
  const cells = Array.from({ length: 4 }, (_, i) => thumbs[i] ?? null);
  return (
    <TileReveal index={index} href="/photos" gridColumn="span 2" style={{ padding: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, minHeight: 80, marginBottom: 8 }}>
        {cells.map((src, i) =>
          src ? (
            <img key={i} src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
          ) : (
            <div key={i} style={{ background: fallbacks[i], borderRadius: 4 }} />
          )
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: "#fafaf9" }}>Photos</p>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a7770" }}>{count}</span>
      </div>
    </TileReveal>
  );
}

// ─── TripTile ─────────────────────────────────────────────────
interface TripTileProps {
  slug: string;
  title: string;
  dates: string;
  photoCount: number;
  videoCount: number;
  index?: number;
}

export function TripTile({ slug, title, dates, photoCount, videoCount, index = 0 }: TripTileProps) {
  return (
    <TileReveal index={index} href={`/trips/${slug}`} gridColumn="span 3" style={{ padding: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 56, height: 56, background: "#5dcaa5", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#04342c" }}>
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
      </div>
    </TileReveal>
  );
}

// ─── TripsIndexTile ───────────────────────────────────────────
export function TripsIndexTile({ count, index = 0 }: { count: number; index?: number }) {
  return (
    <TileReveal index={index} href="/trips" gridColumn="span 2" style={{ background: "#412402", border: "1px solid rgba(250,199,117,0.15)", minHeight: 96 }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, color: "#fac775" }}>📍</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fac775" }}>
            Trips
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 30, fontWeight: 500, margin: 0, color: "#faeeda", lineHeight: 1 }}>{count}</p>
          <p style={{ fontSize: 11, color: "#fac775", margin: "4px 0 0" }}>places I&apos;ve stayed</p>
        </div>
      </div>
    </TileReveal>
  );
}

// ─── ContactBar ───────────────────────────────────────────────
export function ContactBar({ index = 0 }: { index?: number }) {
  const links = [
    { href: "mailto:bailey.king37@gmail.com", label: "Email", icon: "✉" },
    { href: "https://github.com/KingKong74", label: "GitHub", icon: "⌥" },
    { href: "/resume.pdf", label: "Resume", icon: "📄" },
  ];
  return (
    <TileReveal index={index} gridColumn="span 6">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#7a7770" }}>
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
    </TileReveal>
  );
}
