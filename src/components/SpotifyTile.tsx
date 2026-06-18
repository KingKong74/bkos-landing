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
  progress: number | null;
  duration: number;
}

const baseStyle: React.CSSProperties = {
  gridColumn: "span 3",
  background: "#1a1916",
  border: "1px solid #26241f",
  borderRadius: 14,
  padding: 14,
  display: "flex",
  gap: 14,
  alignItems: "center",
  minHeight: 92,
  textDecoration: "none",
  color: "inherit",
};

export function SpotifyTile({ index = 0 }: { index?: number }) {
  const [track, setTrack] = useState<Track | null>(null);
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    async function fetchTrack() {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          setTrack(data.track);
          setLoaded(true);
        }
      } catch {
        if (mounted) setLoaded(true);
      }
    }
    fetchTrack();
    const interval = setInterval(fetchTrack, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const empty = loaded && !track;
  const progressPct =
    track?.progress != null && track.duration > 0
      ? Math.min(100, (track.progress / track.duration) * 100)
      : 0;

  return (
    <motion.a
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, borderColor: "rgba(245,166,35,0.35)" }}
      href={track?.url ?? "https://open.spotify.com"}
      target="_blank"
      rel="noopener noreferrer"
      style={baseStyle}
    >
      {empty ? (
        <>
          <div
            style={{
              width: 60,
              height: 60,
              background: "#26241f",
              borderRadius: 10,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#56544f",
              fontSize: 24,
            }}
          >
            ♪
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#56544f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Spotify
            </div>
            <p style={{ fontSize: 13, color: "#7a7770", margin: 0 }}>
              Connect refresh token to show what I&apos;m listening to.
            </p>
          </div>
        </>
      ) : !track ? (
        <>
          <div style={{ width: 60, height: 60, background: "#26241f", borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ height: 10, width: 60, background: "#26241f", borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 12, width: "70%", background: "#26241f", borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 10, width: "50%", background: "#26241f", borderRadius: 4 }} />
          </div>
        </>
      ) : (
        <>
          {track.albumImage ? (
            <motion.img
              src={track.albumImage}
              alt={track.album}
              width={60}
              height={60}
              animate={track.isPlaying && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
              transition={
                track.isPlaying && !reduceMotion
                  ? { duration: 16, ease: "linear", repeat: Infinity }
                  : undefined
              }
              style={{
                width: 60,
                height: 60,
                borderRadius: track.isPlaying ? "50%" : 10,
                objectFit: "cover",
                flexShrink: 0,
                transition: "border-radius 0.4s ease",
              }}
            />
          ) : (
            <div style={{ width: 60, height: 60, background: "#993556", borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fbeaf0", fontSize: 24 }}>♪</span>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              {track.isPlaying ? (
                <>
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 6, height: 6, background: "#5dcaa5", borderRadius: "50%", display: "inline-block" }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#5dcaa5", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Now playing
                  </span>
                </>
              ) : (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#7a7770", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Last played
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#fafaf9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {track.title}
            </p>
            <p style={{ fontSize: 12, color: "#a8a59c", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {track.artist} · {track.album}
            </p>
            {track.isPlaying && (
              <div style={{ marginTop: 6, height: 2, background: "#26241f", borderRadius: 1, overflow: "hidden" }}>
                <div style={{ width: `${progressPct}%`, height: "100%", background: "#f5a623", transition: "width 1s linear" }} />
              </div>
            )}
          </div>
        </>
      )}
    </motion.a>
  );
}
