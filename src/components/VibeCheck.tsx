"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImage?: string;
  url: string;
}

export function VibeCheck({ deployLabel }: { deployLabel: string }) {
  const [track, setTrack] = useState<Track | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    async function fetchTrack() {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setTrack(data.track);
      } catch {
        /* ignore */
      }
    }
    fetchTrack();
    const id = setInterval(fetchTrack, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section style={{ padding: "48px 16px 24px" }}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "#1a1916",
          border: "1px solid #26241f",
          borderRadius: 14,
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* now playing snippet */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 240 }}>
          {track?.albumImage ? (
            <motion.img
              src={track.albumImage}
              alt={track.album}
              animate={track.isPlaying && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
              transition={track.isPlaying && !reduceMotion ? { duration: 12, ease: "linear", repeat: Infinity } : undefined}
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#26241f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#56544f",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              ♪
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: track?.isPlaying ? "#5dcaa5" : "#7a7770",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 2,
              }}
            >
              {track ? (track.isPlaying ? "Listening now" : "Last played") : "Mood music"}
            </div>
            <div style={{ fontSize: 13, color: "#fafaf9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {track ? `${track.title} — ${track.artist}` : "Whatever's on, probably."}
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 36, background: "#26241f" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "#7a7770",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Last deploy
          </span>
          <span style={{ fontSize: 13, color: "#fafaf9", fontFamily: "var(--font-mono)" }}>{deployLabel}</span>
        </div>
      </motion.div>
    </section>
  );
}
