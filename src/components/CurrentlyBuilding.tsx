"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { useSiteContent, Project } from "@/lib/siteContent";

// Accent per card position — BK-OS keeps its Win98 teal
const ACCENTS = ["#4db6ac", "#5dcaa5", "#f5a623", "#85b7eb"];

function StatusPill({ status }: { status: string }) {
  const live = status === "live" || status === "shipped";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "3px 9px",
        borderRadius: 999,
        background: live ? "rgba(93,202,165,0.12)" : "rgba(245,166,35,0.1)",
        border: `1px solid ${live ? "rgba(93,202,165,0.35)" : "rgba(245,166,35,0.3)"}`,
        color: live ? "#5dcaa5" : "#f5a623",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function ProjectCard({ project, accent, index }: { project: Project; accent: string; index: number }) {
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = useReducedMotion();
  const Tag = project.link ? motion.a : motion.div;
  const linkProps = project.link
    ? { href: project.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...(linkProps as Record<string, string>)}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.45)", borderColor: "rgba(245,166,35,0.3)" }
      }
      onHoverStart={() => setRevealed(true)}
      onHoverEnd={() => setRevealed(false)}
      onFocus={() => setRevealed(true)}
      onBlur={() => setRevealed(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 16,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        minHeight: 280,
      }}
    >
      {/* Visual header — animated gradient stripe until real screenshots land */}
      <div
        aria-hidden
        style={{
          height: 96,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${accent}22, ${accent}08 60%, transparent)`,
          borderBottom: "1px solid #26241f",
        }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { x: ["-20%", "120%"] }}
          transition={{ duration: 7 + index * 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "35%",
            background: `linear-gradient(90deg, transparent, ${accent}18, transparent)`,
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 10,
            left: 18,
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 600,
            color: accent,
            opacity: 0.5,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {project.name.slice(0, 2)}
        </span>
      </div>

      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 500,
              margin: 0,
              color: "#fafaf9",
              letterSpacing: "-0.01em",
            }}
          >
            {project.name}
            {project.link && (
              <span aria-hidden style={{ color: "#56544f", fontSize: 13, marginLeft: 6 }}>
                ↗
              </span>
            )}
          </h3>
          <StatusPill status={project.status} />
        </div>
        <p style={{ fontSize: 13, color: "#a8a59c", lineHeight: 1.6, margin: "0 0 14px", flex: 1 }}>
          {project.tagline}
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                padding: "2px 8px",
                borderRadius: 5,
                background: "#26241f",
                color: "#a8a59c",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* "What I learned" — slides up on hover/focus */}
      {project.learned && (
        <motion.div
          initial={false}
          animate={{ y: revealed ? 0 : "100%", opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15,14,12,0.94)",
            backdropFilter: "blur(2px)",
            padding: "20px 20px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: accent,
              margin: "0 0 10px",
            }}
          >
            What building this taught me
          </p>
          <p style={{ fontSize: 13.5, color: "#d8d6cf", lineHeight: 1.65, margin: 0 }}>
            {project.learned}
          </p>
        </motion.div>
      )}
    </Tag>
  );
}

export function CurrentlyBuilding() {
  const { projects, sections } = useSiteContent();
  const visible = projects.filter((p) => p.visible);
  if (!sections.projects) return null;

  return (
    <section id="building" style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px 32px" }}>
      <ScrollReveal style={{ marginBottom: 8 }}>
        <h2 className="section-label">Currently building</h2>
      </ScrollReveal>
      <ScrollReveal style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: "#7a7770", margin: 0, maxWidth: "var(--reading-width)", lineHeight: 1.6 }}>
          Products I&apos;m shipping around a full-time job. Hover a card for the honest
          version.
        </p>
      </ScrollReveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {visible.map((p, i) => (
          <ProjectCard key={p.id} project={p} accent={ACCENTS[i % ACCENTS.length]} index={i} />
        ))}
      </div>
    </section>
  );
}
