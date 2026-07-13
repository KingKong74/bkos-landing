"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { useSiteContent, Post } from "@/lib/siteContent";

function PostCard({ post, index }: { post: Post; index: number }) {
  const reduceMotion = useReducedMotion();
  const clickable = !!post.link && !post.comingSoon;
  const Tag = clickable ? motion.a : motion.article;
  const linkProps = clickable
    ? { href: post.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...(linkProps as Record<string, string>)}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        clickable && !reduceMotion ? { y: -3, borderColor: "rgba(245,166,35,0.35)" } : undefined
      }
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 14,
        padding: 22,
        textDecoration: "none",
        color: "inherit",
        opacity: post.comingSoon ? 0.85 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 500,
            margin: 0,
            color: "#fafaf9",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {post.title}
        </h3>
        {post.comingSoon && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "3px 9px",
              borderRadius: 999,
              background: "#26241f",
              color: "#7a7770",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            coming soon
          </span>
        )}
      </div>
      <p style={{ fontSize: 13.5, color: "#a8a59c", lineHeight: 1.65, margin: 0, flex: 1 }}>
        {post.excerpt}
      </p>
      {clickable && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#f5a623",
            marginTop: 14,
          }}
        >
          read →
        </span>
      )}
    </Tag>
  );
}

export function Perspectives() {
  const { posts, sections } = useSiteContent();
  if (!sections.perspectives || posts.length === 0) return null;

  return (
    <section id="perspectives" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 32px" }}>
      <ScrollReveal style={{ marginBottom: 8 }}>
        <h2 className="section-label">Perspectives</h2>
      </ScrollReveal>
      <ScrollReveal style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: "#7a7770", margin: 0, maxWidth: "var(--reading-width)", lineHeight: 1.6 }}>
          Notes from the overlap of accounting and software. Written slowly, on purpose.
        </p>
      </ScrollReveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} />
        ))}
      </div>
    </section>
  );
}
