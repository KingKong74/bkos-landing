"use client";

import { ScrollReveal } from "./ScrollReveal";
import { useSiteContent } from "@/lib/siteContent";

const STACK: { name: string; role: string }[] = [
  { name: "BOSGAME E2 mini PC", role: "hardware" },
  { name: "Debian", role: "os" },
  { name: "Docker Swarm", role: "orchestration" },
  { name: "Dokploy", role: "deploys" },
  { name: "Cloudflare Tunnel", role: "ingress" },
  { name: "Tailscale", role: "network" },
  { name: "Postgres", role: "data" },
  { name: "Next.js 16", role: "framework" },
  { name: "TypeScript", role: "language" },
  { name: "Tailwind", role: "styles" },
];

export function TheStack() {
  const { sections } = useSiteContent();
  if (!sections.stack) return null;

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 32px" }}>
      <ScrollReveal>
        <div
          style={{
            border: "1px solid #26241f",
            borderRadius: 14,
            padding: "20px 22px",
            background:
              "linear-gradient(135deg, rgba(245,166,35,0.04), transparent 45%), #141311",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <h2 className="section-label" style={{ color: "#a8a59c" }}>
              The stack behind this site
            </h2>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#56544f" }}>
              git push → live, no cloud bill
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STACK.map((s) => (
              <span
                key={s.name}
                title={s.role}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "#1a1916",
                  border: "1px solid #26241f",
                  color: "#c4c1b8",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#f5a623",
                    opacity: 0.6,
                    display: "inline-block",
                  }}
                />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
