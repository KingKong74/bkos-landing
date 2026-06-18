"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import type { Photo } from "@/lib/photos";

export function PhotoRibbon({ photos }: { photos: Photo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Make horizontal scroll respond to vertical wheel (common pattern for ribbons)
  function handleWheel(e: React.WheelEvent) {
    if (!scrollRef.current) return;
    // Only horizontal-shift on vertical wheel if there's actually horizontal room
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }

  if (photos.length === 0) return null;

  return (
    <section style={{ padding: "48px 0 24px", overflow: "hidden" }}>
      <div style={{ padding: "0 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            margin: 0,
            color: "#a8a59c",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Recent photos
        </h2>
        <Link
          href="/photos"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "#f5a623",
            textDecoration: "none",
          }}
        >
          all {photos.length} →
        </Link>
      </div>

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          padding: "0 16px 16px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
        }}
      >
        {photos.slice(0, 12).map((p, i) => (
          <motion.div
            key={p.src}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            style={{
              flex: "0 0 auto",
              width: 220,
              height: 260,
              borderRadius: 10,
              overflow: "hidden",
              scrollSnapAlign: "start",
              background: "#1a1916",
              border: "1px solid #26241f",
              position: "relative",
            }}
          >
            <Link href="/photos" style={{ display: "block", height: "100%" }}>
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "32px 12px 10px",
                  background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))",
                  color: "#fafaf9",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>
                  {p.alt}
                </span>
                {p.date && <span style={{ color: "rgba(255,255,255,0.6)" }}>{p.date.slice(0, 7)}</span>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
