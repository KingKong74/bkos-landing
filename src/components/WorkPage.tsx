"use client";

import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { useSiteContent } from "@/lib/siteContent";
import {
  roles,
  caModules,
  qualifications,
  engagements,
  skillGroups,
} from "@/lib/career";

// ─── Shared bits ─────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="section-label" style={{ marginBottom: 24 }}>
      {children}
    </h2>
  );
}

function Chip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "amber" }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 999,
        background: tone === "amber" ? "rgba(245,166,35,0.1)" : "#1a1916",
        border: `1px solid ${tone === "amber" ? "rgba(245,166,35,0.3)" : "#26241f"}`,
        color: tone === "amber" ? "#f5a623" : "#a8a59c",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ProficiencyDots({ level }: { level: number }) {
  return (
    <span
      aria-label={`${level} of 5`}
      style={{ display: "inline-flex", gap: 3, alignItems: "center", flexShrink: 0 }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: i < level ? "#f5a623" : "#26241f",
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function WorkPage() {
  const { testimonials, availability } = useSiteContent();
  const passed = caModules.filter((m) => m.status === "passed").length;
  const inProgress = caModules.filter((m) => m.status === "in progress").length;
  const progressPct = ((passed + inProgress * 0.5) / caModules.length) * 100;

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 96px" }}>
      {/* Intro */}
      <ScrollReveal as="header" style={{ marginBottom: 72 }}>
        <p className="section-label" style={{ marginBottom: 16 }}>
          Work
        </p>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 44px)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            margin: 0,
            color: "#fafaf9",
          }}
        >
          The accountant who codes.
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#a8a59c",
            lineHeight: 1.65,
            maxWidth: "var(--reading-width)",
            margin: "20px 0 0",
          }}
        >
          I work at a mid-tier accounting firm in Brisbane, moving into forensic accounting
          on the commercial side, while working through the CA ANZ program. Nights and
          weekends I build software — my own products, on my own infrastructure. Each side
          makes the other sharper.
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "#7a7770",
            margin: "18px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            aria-hidden
            style={{ width: 6, height: 6, background: "#5dcaa5", borderRadius: "50%", display: "inline-block" }}
          />
          {availability}
        </p>
      </ScrollReveal>

      {/* Experience */}
      <section style={{ marginBottom: 72 }}>
        <ScrollReveal>
          <SectionHeading>Experience</SectionHeading>
        </ScrollReveal>
        <div style={{ display: "grid", gap: 16 }}>
          {roles.map((role, i) => (
            <ScrollReveal key={role.title} delay={i * 0.06}>
              <article
                style={{
                  background: "#1a1916",
                  border: "1px solid #26241f",
                  borderRadius: 14,
                  padding: "24px 24px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <h3 style={{ fontSize: 17, fontWeight: 500, margin: 0, color: "#fafaf9" }}>
                    {role.title}
                  </h3>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#7a7770" }}>
                    {role.dates}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#7a7770", margin: "0 0 14px" }}>{role.firm}</p>
                <p
                  style={{
                    fontSize: 14,
                    color: "#a8a59c",
                    lineHeight: 1.65,
                    margin: "0 0 14px",
                    maxWidth: "var(--reading-width)",
                  }}
                >
                  {role.summary}
                </p>
                <ul style={{ margin: "0 0 18px", paddingLeft: 18, display: "grid", gap: 7 }}>
                  {role.bullets.map((b) => (
                    <li key={b} style={{ fontSize: 13.5, color: "#c4c1b8", lineHeight: 1.6 }}>
                      {b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {role.skills.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Qualifications */}
      <section style={{ marginBottom: 72 }}>
        <ScrollReveal>
          <SectionHeading>Qualifications</SectionHeading>
        </ScrollReveal>

        <ScrollReveal>
          <div
            style={{
              background: "#1a1916",
              border: "1px solid #26241f",
              borderRadius: 14,
              padding: 24,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0, color: "#fafaf9" }}>
                CA Program — Chartered Accountants ANZ
              </h3>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#f5a623" }}>
                in progress
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#a8a59c", margin: "0 0 18px", lineHeight: 1.6 }}>
              {passed} of {caModules.length} modules passed
              {inProgress > 0 && `, ${inProgress} in progress`}.
            </p>

            {/* Progress bar */}
            <div
              role="progressbar"
              aria-valuenow={Math.round(progressPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="CA Program progress"
              style={{
                height: 6,
                borderRadius: 999,
                background: "#26241f",
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #f5a623, #fac775)",
                }}
              />
            </div>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
              {caModules.map((m) => (
                <li
                  key={m.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13.5,
                  }}
                >
                  <span style={{ color: m.status === "upcoming" ? "#7a7770" : "#c4c1b8" }}>
                    {m.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      color:
                        m.status === "passed"
                          ? "#5dcaa5"
                          : m.status === "in progress"
                            ? "#f5a623"
                            : "#56544f",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.status === "passed" ? "✓ passed" : m.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {qualifications.map((q) => (
          <ScrollReveal key={q.title}>
            <div
              style={{
                background: "#1a1916",
                border: "1px solid #26241f",
                borderRadius: 14,
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, color: "#fafaf9" }}>
                  {q.title}
                </h3>
                {q.year && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#7a7770" }}>
                    {q.year}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "#7a7770", margin: "4px 0 0" }}>
                {q.institution} — {q.detail}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* Engagements */}
      <section style={{ marginBottom: 72 }}>
        <ScrollReveal>
          <SectionHeading>Notable engagements</SectionHeading>
        </ScrollReveal>
        <ScrollReveal>
          <p
            style={{
              fontSize: 13,
              color: "#7a7770",
              margin: "0 0 20px",
              lineHeight: 1.6,
              maxWidth: "var(--reading-width)",
            }}
          >
            Anonymised by design — forensic work is confidential work. Happy to talk
            specifics in the right setting.
          </p>
        </ScrollReveal>
        <div style={{ display: "grid", gap: 10 }}>
          {engagements.map((e, i) => (
            <ScrollReveal key={e.description} delay={i * 0.05}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 16,
                  flexWrap: "wrap",
                  padding: "14px 18px",
                  background: "#1a1916",
                  border: "1px solid #26241f",
                  borderRadius: 10,
                }}
              >
                <span style={{ fontSize: 14, color: "#c4c1b8", lineHeight: 1.5 }}>
                  {e.description}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#7a7770",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.meta}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Skills matrix */}
      <section style={{ marginBottom: 72 }}>
        <ScrollReveal>
          <SectionHeading>Selected skills</SectionHeading>
        </ScrollReveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {skillGroups.map((group, i) => (
            <ScrollReveal key={group.domain} delay={i * 0.05}>
              <div
                style={{
                  background: "#1a1916",
                  border: "1px solid #26241f",
                  borderRadius: 14,
                  padding: 20,
                  height: "100%",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#f5a623",
                    margin: "0 0 14px",
                    fontWeight: 500,
                  }}
                >
                  {group.domain}
                </h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
                  {group.skills.map((s) => (
                    <li
                      key={s.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 13.5,
                        color: "#c4c1b8",
                      }}
                    >
                      <span>{s.name}</span>
                      <ProficiencyDots level={s.level} />
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "#56544f",
              margin: "16px 0 0",
            }}
          >
            self-assessed, deliberately conservative — 5 means I&apos;m comfortable being the
            last line of defence
          </p>
        </ScrollReveal>
      </section>

      {/* Testimonials */}
      <section style={{ marginBottom: 72 }}>
        <ScrollReveal>
          <SectionHeading>What people say</SectionHeading>
        </ScrollReveal>
        {testimonials.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {testimonials.map((t) => (
              <ScrollReveal key={t.id}>
                <figure
                  style={{
                    background: "#1a1916",
                    border: "1px solid #26241f",
                    borderRadius: 14,
                    padding: 24,
                    margin: 0,
                  }}
                >
                  <blockquote
                    style={{
                      fontSize: 15,
                      color: "#c4c1b8",
                      lineHeight: 1.65,
                      margin: "0 0 12px",
                      fontStyle: "italic",
                    }}
                  >
                    “{t.quote}”
                  </blockquote>
                  <figcaption style={{ fontSize: 13, color: "#7a7770" }}>
                    <span style={{ color: "#a8a59c" }}>{t.name}</span> — {t.role}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <div
              style={{
                border: "1px dashed #26241f",
                borderRadius: 14,
                padding: 24,
                fontSize: 13,
                color: "#7a7770",
                lineHeight: 1.6,
              }}
            >
              Recommendations land here as they come in. References available on request —{" "}
              <a
                href="mailto:bailey.king37@gmail.com"
                style={{ color: "#f5a623", textDecoration: "none" }}
              >
                just ask
              </a>
              .
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* Footer nav */}
      <ScrollReveal>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            paddingTop: 24,
            borderTop: "1px solid #26241f",
          }}
        >
          <Link
            href="/"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#a8a59c" }}
          >
            ← back home
          </Link>
          <a
            href="mailto:bailey.king37@gmail.com"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#f5a623" }}
          >
            get in touch →
          </a>
        </div>
      </ScrollReveal>
    </main>
  );
}
