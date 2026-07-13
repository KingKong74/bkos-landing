"use client";

import { ScrollReveal } from "./ScrollReveal";
import { useSiteContent } from "@/lib/siteContent";

const INTERESTS = [
  "nonfiction",
  "investing",
  "pour-over coffee — V60, light roasts", // REVIEW: confirm brew preference
  "photography — Canon R10 + GoPro",
  "travel — 37 countries and counting",
];

const CONNECT = [
  // REVIEW: confirm LinkedIn slug before publishing
  { href: "https://www.linkedin.com/in/bailey-king", label: "LinkedIn" },
  { href: "https://github.com/KingKong74", label: "GitHub" },
  { href: "mailto:bailey.king37@gmail.com", label: "Email" },
];

const card: React.CSSProperties = {
  background: "#1a1916",
  border: "1px solid #26241f",
  borderRadius: 14,
  padding: 20,
  height: "100%",
};

const cardLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#f5a623",
  margin: "0 0 14px",
  fontWeight: 500,
};

export function Personal() {
  const { reading, sections } = useSiteContent();
  if (!sections.personal) return null;

  return (
    <section id="connect" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 32px" }}>
      <ScrollReveal style={{ marginBottom: 8 }}>
        <h2 className="section-label">Off the clock</h2>
      </ScrollReveal>
      <ScrollReveal style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: "#7a7770", margin: 0, maxWidth: "var(--reading-width)", lineHeight: 1.6 }}>
          The parts that don&apos;t fit on a CV but explain the rest of it.
        </p>
      </ScrollReveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {/* Interests */}
        <ScrollReveal>
          <div style={card}>
            <h3 style={cardLabel}>Interests</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {INTERESTS.map((i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12.5,
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "#26241f",
                    color: "#c4c1b8",
                    lineHeight: 1.4,
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Reading */}
        <ScrollReveal delay={0.05}>
          <div style={card}>
            <h3 style={cardLabel}>Reading</h3>
            {reading.length === 0 ? (
              <p style={{ fontSize: 13, color: "#7a7770", margin: 0 }}>Between books.</p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
                {reading.map((r) => (
                  <li key={r.id} style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    <span style={{ color: "#f4f4f1" }}>{r.title}</span>
                    <span style={{ color: "#7a7770" }}> — {r.author}</span>
                    {r.note && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10.5,
                          color: "#56544f",
                          marginLeft: 6,
                        }}
                      >
                        ({r.note})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ScrollReveal>

        {/* Portfolio */}
        <ScrollReveal delay={0.1}>
          <div style={card}>
            <h3 style={cardLabel}>Portfolio</h3>
            <p style={{ fontSize: 13.5, color: "#c4c1b8", lineHeight: 1.65, margin: 0 }}>
              ASX-domiciled ETFs, US tech overweight, DCA-focused. Boring on purpose —
              the interesting risks go into the products I build instead.
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: "#56544f",
                margin: "12px 0 0",
              }}
            >
              style only, not advice · no positions shared
            </p>
          </div>
        </ScrollReveal>

        {/* Connect */}
        <ScrollReveal delay={0.15}>
          <div style={card}>
            <h3 style={cardLabel}>Connect</h3>
            <p style={{ fontSize: 13.5, color: "#a8a59c", lineHeight: 1.6, margin: "0 0 16px" }}>
              Recruiting, a forensic question, or comparing homelab notes — all welcome.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CONNECT.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #3a3935",
                    color: "#f4f4f1",
                    textDecoration: "none",
                    transition: "border-color 0.15s ease, background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(245,166,35,0.5)";
                    e.currentTarget.style.background = "rgba(245,166,35,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#3a3935";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
