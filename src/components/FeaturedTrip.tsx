"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Trip } from "@/lib/trips";

export function FeaturedTrip({ trip }: { trip: Trip }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: cover image translates slower than scroll
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} style={{ position: "relative", padding: "24px 0", overflow: "hidden" }}>
      <div
        style={{
          position: "relative",
          height: "min(72vh, 620px)",
          borderRadius: 16,
          overflow: "hidden",
          margin: "0 16px",
          background: "#1a1916",
        }}
      >
        <motion.img
          src={trip.cover}
          alt={trip.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "120%",
            objectFit: "cover",
            y: reduceMotion ? 0 : imgY,
          }}
        />

        {/* gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,14,12,0.0) 0%, rgba(15,14,12,0.25) 50%, rgba(15,14,12,0.85) 100%)",
          }}
        />

        {/* content over hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "clamp(24px, 4vw, 48px)",
            color: "#fafaf9",
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Featured · {trip.dates}
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                maxWidth: "20ch",
              }}
            >
              {trip.title}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                margin: "12px 0 0",
                maxWidth: "44rem",
                lineHeight: 1.6,
              }}
            >
              {trip.story.split("\n\n")[0]}
            </p>
            <div style={{ marginTop: 20, display: "flex", gap: 16, alignItems: "center" }}>
              <Link
                href={`/trips/${trip.slug}`}
                style={{
                  padding: "10px 18px",
                  background: "#fafaf9",
                  color: "#0f0e0c",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Open trip <span aria-hidden>↗</span>
              </Link>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                {trip.photos.length} photos · {trip.videos?.length ?? 0} videos
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
