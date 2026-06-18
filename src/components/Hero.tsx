"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Avatar } from "./Avatar";
import { AdminGate } from "./AdminGate";
import { DotField } from "./DotField";
import { RotatingWord } from "./RotatingWord";

// Random Aussie-flavoured greeting — picks a different one on each visit
const GREETINGS = ["Hi", "Hey", "G'day", "Howdy", "Hello", "Heya"];

function pickGreeting(): string {
  // Render a stable greeting per session (mounted client-side)
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

export function Hero({ weather }: { weather: { temp: number | null; emoji: string } }) {
  const reduceMotion = useReducedMotion();
  // Computed once on mount; not animated. Slightly inconsistent SSR↔CSR is fine.
  const greeting = typeof window === "undefined" ? "Hi" : pickGreeting();
  const headingText = `${greeting}, I'm Bailey.`;

  // Stagger letters; treat each character as a span
  const letters = headingText.split("");

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "0 24px",
      }}
    >
      <DotField />

      {/* warm amber radial glow */}
      <motion.div
        aria-hidden
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: 540,
          height: 540,
          background:
            "radial-gradient(circle, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.06) 40%, transparent 70%)",
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      />
      <motion.div
        aria-hidden
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.5 }}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: 460,
          height: 460,
          background:
            "radial-gradient(circle, rgba(83, 74, 183, 0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Avatar in top-right with admin gate */}
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
        <AdminGate>
          <Avatar size={48} />
        </AdminGate>
      </div>

      {/* Main content */}
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%", zIndex: 2 }}>
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#7a7770",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                background: "#5dcaa5",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            bkos.dev
          </span>
          <span>·</span>
          <span>Brisbane, AU</span>
          {weather.temp !== null && (
            <>
              <span>·</span>
              <span>
                {weather.temp}°C {weather.emoji}
              </span>
            </>
          )}
        </motion.div>

        {/* Letter-by-letter heading */}
        <h1
          style={{
            fontSize: "clamp(44px, 8vw, 84px)",
            fontWeight: 500,
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "#fafaf9",
          }}
        >
          {letters.map((char, idx) => (
            <motion.span
              key={`${char}-${idx}`}
              initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: idx * 0.035,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                display: "inline-block",
                color: idx >= headingText.length - 7 ? "#f5a623" : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        {/* Rotating role */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: letters.length * 0.035 + 0.1, duration: 0.6 }}
          style={{
            marginTop: 20,
            fontSize: "clamp(18px, 2.5vw, 22px)",
            color: "#d8d6cf",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span>A Brisbane</span>
          <RotatingWord />
          <span
            style={{
              color: "#7a7770",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
            }}
          >
            / also: student, builder, traveller
          </span>
        </motion.div>

        {/* Subhead */}
        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: letters.length * 0.035 + 0.25, duration: 0.6 }}
          style={{
            fontSize: 15,
            color: "#a8a59c",
            maxWidth: "34rem",
            marginTop: 28,
            lineHeight: 1.6,
          }}
        >
          My corner of the internet. Self-hosted on a mini PC under my desk. Scroll for projects, photos, and what I&apos;m listening to right this second.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: letters.length * 0.035 + 0.4, duration: 0.6 }}
          style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}
        >
          <a
            href="https://os.bkos.dev"
            style={{
              padding: "11px 20px",
              background: "#f5a623",
              color: "#0f0e0c",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245,166,35,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Open bailey.os <span aria-hidden>↗</span>
          </a>
          <Link
            href="#projects"
            style={{
              padding: "11px 20px",
              background: "transparent",
              color: "#f4f4f1",
              border: "1px solid #3a3935",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.15s ease, border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(245,166,35,0.08)";
              e.currentTarget.style.borderColor = "rgba(245,166,35,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#3a3935";
            }}
          >
            See projects
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "#56544f",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          pointerEvents: "none",
        }}
      >
        <span>scroll</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: 16 }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
