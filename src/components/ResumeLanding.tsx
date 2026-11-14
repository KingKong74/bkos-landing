"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSiteContent } from "@/lib/siteContent";
import { useTheme } from "@/lib/theme";
import {
  ABOUT, EMPLOYER, HEADLINE, INTRO, LOCATION,
  caModules, caProgram, contacts, degrees, practices, roles, skillGroups, steps, toolkit,
} from "@/lib/career";
import type { Weather } from "@/lib/weather";
import { AdminLoginModal } from "./AdminLoginModal";
import { ThemeToggle } from "./ThemeToggle";

type Page = "home" | "resume" | "projects" | "contact";

const TABS: [Page, string][] = [["home", "Home"], ["resume", "Resume"], ["projects", "Projects"], ["contact", "Contact"]];
const ADMIN_CLICKS = 5;
const ADMIN_WINDOW_MS = 2000;

interface Track { title: string; artist: string; albumImage?: string; url: string; isPlaying: boolean }

interface Props {
  weather: Weather;
  hasResumePdf: boolean;
  hasHeroImage: boolean;
  hasAvatar: boolean;
}

function pageFromHash(): Page {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace("#", "");
  return (TABS.some(([id]) => id === h) ? h : "home") as Page;
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function host(url?: string) {
  if (!url) return "";
  try { return new URL(url).host.replace(/^www\./, ""); } catch { return url; }
}

export function ResumeLanding({ weather, hasResumePdf, hasHeroImage, hasAvatar }: Props) {
  const content = useSiteContent();
  const projects = content.projects.filter((p) => p.visible);
  const availability = cap(content.availability || "open to opportunities");

  const [page, setPage] = useState<Page>("home");
  const [theme, toggleTheme] = useTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [track, setTrack] = useState<Track | null>(null);
  const [admin, setAdmin] = useState(false);
  const clicks = useRef<number[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Hash routing + saved theme
  useEffect(() => {
    setPage(pageFromHash());
    const onHash = () => { setPage(pageFromHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  // Spotify now playing
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/spotify")
        .then((r) => r.json())
        .then((d) => { if (alive) setTrack(d?.track ?? null); })
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.15 },
    );
    root.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page, projects.length]);

  const go = useCallback((p: Page) => {
    const target = p === "home" ? window.location.pathname : `#${p}`;
    if (pageFromHash() !== p) history.pushState(null, "", target);
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  // Hidden admin trigger: 5 clicks within 2s in the top-right corner of the window.
  // Listens on window so it works over the header and buttons alike.
  useEffect(() => {
    const ZONE = 64;
    const onDown = (e: PointerEvent) => {
      const right = document.documentElement.clientWidth;
      if (e.clientX >= right - ZONE && e.clientY <= ZONE) onCorner();
    };
    window.addEventListener("pointerdown", onDown, true);
    return () => window.removeEventListener("pointerdown", onDown, true);
  }, []);

  function onCorner() {
    const now = Date.now();
    clicks.current = clicks.current.filter((t) => now - t < ADMIN_WINDOW_MS).concat(now);
    if (clicks.current.length >= ADMIN_CLICKS) {
      clicks.current = [];
      setAdmin(true);
    }
  }

  const tempText = weather.temp == null ? "—°C" : `${weather.temp}°C`;
  const condText = weather.description ? cap(weather.description) : "Live from Open-Meteo";

  const resumeBtn = (label: string, cls: string) =>
    hasResumePdf ? (
      <a href="/resume.pdf" download="Bailey-King-Resume.pdf" className={cls}>{label}</a>
    ) : null;

  const nowPlaying = track && (
    <a href={track.url} target="_blank" rel="noreferrer" className="rl-live-pill card-link" style={{ textDecoration: "none" }}>
      <div className="rl-art" style={{ width: 36, height: 36, borderRadius: "50%" }}>
        {track.albumImage && <img src={track.albumImage} alt="" />}
      </div>
      <div>
        <div className="mono" style={{ fontSize: 11, color: "var(--acc)" }}>{track.isPlaying ? "now playing" : "last played"}</div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{track.title} · <span className="mute">{track.artist}</span></div>
      </div>
    </a>
  );

  return (
    <div className="rl" data-th={theme} ref={rootRef}>

      <header className="rl-head">
        <div className="rl-head-in">
          <button type="button" className="rl-brand" onClick={() => go("home")}>
            <span className="rl-logo">BK</span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>bkos.dev</span>
          </button>
          <nav className="rl-tabs" aria-label="Primary">
            {TABS.map(([id, label]) => (
              <button key={id} type="button" className="rl-tab" aria-current={page === id ? "page" : undefined} onClick={() => go(id)}>
                {label}
              </button>
            ))}
          </nav>
          <div className="rl-right">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            {resumeBtn("Resume PDF", "rl-pill strong btn")}
          </div>
        </div>
      </header>

      {page === "home" && (
        <>
          <section className="rl-hero">
            <div className="rl-hero-in">
              <div className="mono mute" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <span className="dot" />{availability} · Brisbane City {tempText}
              </div>
              <h1>Bailey King</h1>
              <p className="rl-hero-sub">{INTRO}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 30, flexWrap: "wrap", justifyContent: "center" }}>
                <button type="button" className="btn btn-acc btn-lg" onClick={() => go("resume")}>View resume</button>
                <button type="button" className="btn btn-surf btn-lg" onClick={() => go("projects")}>See projects</button>
              </div>

              <div className="rl-visual">
                <div className="rl-visual-frame">
                  {hasHeroImage ? <img src="/hero.jpg" alt="" /> : <HeroArt />}
                </div>
                <div className="rl-visual-floats">
                  {practices.map((p, i) => (
                    <div key={p.title} className={`rl-float ${i === 0 ? "l" : "r"}`}>
                      <div className="mono" style={{ fontSize: 12, color: `var(--${p.tone})` }}>{p.label}</div>
                      <div style={{ fontWeight: 600, fontSize: 16, marginTop: 2 }}>{p.title}</div>
                      <div className="mute" style={{ fontSize: 13.5, marginTop: 4 }}>{p.short}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rl-live">
                {nowPlaying}
                <div className="rl-live-pill" style={{ padding: "10px 18px" }}>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{tempText}</div>
                  <div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--pri)" }}>brisbane</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{condText}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="rl-main">
            <section data-reveal>
              <div className="eyebrow">What I do</div>
              <h2 className="h2" style={{ maxWidth: 720 }}>Two disciplines, one practice: the accounting and the systems that run it.</h2>
              <div className="rl-grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", marginTop: 36 }}>
                {practices.map((p) => (
                  <div key={p.title} data-reveal className="card" style={{ borderRadius: 24, padding: 32 }}>
                    <div className={`eyebrow ${p.tone === "acc" ? "acc" : ""}`}>{p.n}</div>
                    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 12 }}>{p.title}</div>
                    <p className="mute" style={{ margin: "10px 0 0", textWrap: "pretty" }}>{p.body}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                      {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section data-reveal>
              <div className="eyebrow">How I work</div>
              <div className="rl-steps">
                {steps.map((s) => (
                  <div key={s.n} data-reveal style={{ padding: "28px 28px 8px 0" }}>
                    <div className="rl-step-n">{s.n}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, marginTop: 16 }}>{s.title}</div>
                    <p className="mute" style={{ margin: "8px 0 0", textWrap: "pretty" }}>{s.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section data-reveal className="rl-exp">
              <div>
                <div className="eyebrow">Experience</div>
                <h2 className="h2">The accounting, and the systems behind it.</h2>
                <button type="button" className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => go("resume")}>Full resume →</button>
              </div>
              <div>
                {roles.map((r) => (
                  <div key={r.id} data-reveal className="rl-exp-row">
                    <div className="mono mute" style={{ fontSize: 13, paddingTop: 3 }}>{r.period}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600 }}>{r.title}</div>
                      <div className="mono" style={{ fontSize: 13, color: "var(--pri)", marginTop: 2 }}>{r.org}</div>
                      <p className="mute" style={{ margin: "6px 0 0", fontSize: 14.5, textWrap: "pretty" }}>{r.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section data-reveal>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div className="eyebrow">Selected projects</div>
                  <h2 className="h2">Built and self-hosted.</h2>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => go("projects")}>All projects →</button>
              </div>
              <div className="rl-grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", marginTop: 32 }}>
                {projects.map((p) => (
                  <a key={p.id} data-reveal href={p.link} target={p.link ? "_blank" : undefined} rel="noreferrer" className="rl-proj card-link" style={p.link ? undefined : { cursor: "default" }}>
                    <div className="rl-shot" style={{ aspectRatio: "4 / 3" }}>{host(p.link) || "self-hosted"}</div>
                    <div style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 18 }}>{p.name}</span>
                        <span className="mono" style={{ fontSize: 12, color: "var(--acc)" }}>{p.status}</span>
                      </div>
                      <div className="mute" style={{ fontSize: 14, marginTop: 4 }}>{p.tagline}</div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section data-reveal>
              <div className="eyebrow">Toolkit</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                {toolkit.map((k) => (
                  <span key={k} style={{ fontSize: 15, padding: "8px 16px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surf)" }}>{k}</span>
                ))}
              </div>
            </section>

            <section data-reveal className="rl-cta">
              <h2 style={{ margin: 0, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.02em" }}>Let&apos;s work together.</h2>
              <p style={{ margin: "12px auto 0", maxWidth: 520, fontSize: 17, opacity: 0.8 }}>
                Recruiting, a systems or automation question, or comparing homelab notes — all welcome.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
                <a href="mailto:bailey.king37@gmail.com" className="btn btn-acc btn-lg">Email me</a>
                {hasResumePdf ? (
                  <a href="/resume.pdf" download="Bailey-King-Resume.pdf" className="btn btn-lg" style={{ border: "1px solid var(--bg)", color: "var(--bg)" }}>Download resume</a>
                ) : (
                  <button type="button" className="btn btn-lg" style={{ background: "transparent", border: "1px solid var(--bg)", color: "var(--bg)" }} onClick={() => go("resume")}>View resume</button>
                )}
              </div>
            </section>
          </div>
        </>
      )}

      {page === "resume" && (
        <div className="rl-resume">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card rl-id">
              <div className="rl-avatar">
                {hasAvatar ? <img src="/avatar.jpg" alt="Bailey King" /> : "BK"}
              </div>
              <div>
                <div className="mono mute" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                  <span className="dot" />{availability}
                </div>
                <h1 style={{ margin: "6px 0 0", fontSize: 34, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Bailey King</h1>
                <p className="mute" style={{ margin: "6px 0 0", fontSize: 16, textWrap: "pretty" }}>{HEADLINE}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  <span className="chip">{EMPLOYER}</span>
                  <span className="chip">{LOCATION}</span>
                  <span className="chip">CA Program, in progress</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "24px 28px" }}>
              <div className="eyebrow" style={{ fontSize: 12, marginBottom: 8 }}>About</div>
              <p style={{ margin: 0, fontSize: 16, textWrap: "pretty" }}>{ABOUT}</p>
            </div>

            <div className="card" style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div className="eyebrow" style={{ fontSize: 12 }}>Experience</div>
                <div className="mute" style={{ fontSize: 14 }}>Brisbane, QLD</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {roles.map((r) => {
                  const o = open[r.id] ?? false;
                  return (
                    <div key={r.id} className="rl-role">
                      <div className="rl-role-date" style={{ paddingTop: 18 }}>
                        <div style={{ fontWeight: 600, fontSize: 22, lineHeight: 1 }}>{r.start}</div>
                        <div className="mono mute" style={{ fontSize: 12, marginTop: 4 }}>to {r.end}</div>
                      </div>
                      <div className="rl-role-box">
                        <button type="button" className="rl-toggle" aria-expanded={o} onClick={() => setOpen((s) => ({ ...s, [r.id]: !o }))}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{r.title}</div>
                            <div className="mute" style={{ fontSize: 13.5 }}>{r.org} · {r.type}</div>
                            <div className="mono mute" style={{ fontSize: 12, marginTop: 2 }}>{r.period}</div>
                          </div>
                          <span className="rl-sign">{o ? "−" : "+"}</span>
                        </button>
                        <p style={{ margin: "10px 0 0", fontSize: 14.5, textWrap: "pretty" }}>{r.summary}</p>
                        {o && (
                          <>
                            <ul style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 14.5, display: "flex", flexDirection: "column", gap: 6 }}>
                              {r.bullets.map((b) => <li key={b}>{b}</li>)}
                            </ul>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                              {r.skills.map((s) => (
                                <span key={s} className="mono" style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, border: "1px solid var(--line)" }}>{s}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card" style={{ padding: "24px 28px" }}>
              <div className="eyebrow" style={{ fontSize: 12, marginBottom: 14 }}>Education</div>
              <div className="rl-edu">
                <div>
                  <div style={{ fontWeight: 600 }}>{caProgram.title}</div>
                  <div className="mute" style={{ fontSize: 14 }}>{caProgram.institution}</div>
                  <div className="mono mute" style={{ fontSize: 12, marginTop: 2 }}>{caProgram.period}</div>
                  <div style={{ display: "flex", flexDirection: "column", marginTop: 10 }}>
                    {caModules.map((m) => (
                      <div key={m.name} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0", borderTop: "1px solid var(--line)", fontSize: 14 }}>
                        <span>{m.name}</span>
                        <span className="mono" style={{
                          fontSize: 12, whiteSpace: "nowrap",
                          color: m.status === "passed" ? "var(--pri)" : m.status === "in progress" ? "var(--acc)" : "var(--mute)",
                        }}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {degrees.map((d) => (
                    <div key={d.title}>
                      <div style={{ fontWeight: 600 }}>{d.title}</div>
                      <div className="mute" style={{ fontSize: 14 }}>{d.institution}</div>
                      <div className="mono mute" style={{ fontSize: 12, marginTop: 2 }}>{d.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "24px 28px" }}>
              <div className="eyebrow" style={{ fontSize: 12, marginBottom: 14 }}>Skills</div>
              <div className="rl-grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))" }}>
                {skillGroups.map((g) => (
                  <div key={g.domain}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{g.domain}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {g.skills.map((s) => <span key={s} className="chip" style={{ fontSize: 13.5 }}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rl-side">
            <div className="card" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ fontSize: 12, marginBottom: 12 }}>Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {contacts.map((c) => (
                  <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ display: "block" }}>
                    <div className="mute" style={{ fontSize: 13 }}>{c.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, wordBreak: "break-all" }}>{c.text}</div>
                  </a>
                ))}
              </div>
              {hasResumePdf && (
                <a href="/resume.pdf" download="Bailey-King-Resume.pdf" className="btn btn-acc" style={{ display: "block", marginTop: 16, textAlign: "center", padding: 10, fontSize: 14 }}>Download resume</a>
              )}
            </div>
            {track && (
              <a href={track.url} target="_blank" rel="noreferrer" className="card card-link" style={{ padding: 20, display: "flex", gap: 12, alignItems: "center" }}>
                <div className="rl-art" style={{ width: 52, height: 52, borderRadius: 12 }}>
                  {track.albumImage && <img src={track.albumImage} alt="" />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--acc)" }}>{track.isPlaying ? "now playing" : "last played"}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{track.title}</div>
                  <div className="mute" style={{ fontSize: 13 }}>{track.artist}</div>
                </div>
              </a>
            )}
            <div className="card" style={{ padding: 20 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--pri)" }}>brisbane right now</div>
              <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.2, marginTop: 4 }}>{tempText}</div>
              <div className="mute" style={{ fontSize: 14 }}>{condText}</div>
            </div>
          </aside>
        </div>
      )}

      {page === "projects" && (
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>Projects</h2>
          <p className="mute" style={{ margin: "8px 0 0", fontSize: 16 }}>Software built and run on my own infrastructure.</p>
          <div className="rl-grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", marginTop: 32 }}>
            {projects.map((p) => (
              <div key={p.id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div className="rl-shot" style={{ aspectRatio: "16 / 10" }}>{host(p.link) || "self-hosted"}</div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 18 }}>{p.name}</span>
                    <span className="mono" style={{ fontSize: 12, padding: "2px 10px", borderRadius: 999, background: "var(--soft)" }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 14.5, textWrap: "pretty" }}>{p.tagline}</div>
                  {p.learned && <div className="mute" style={{ fontSize: 13.5, textWrap: "pretty" }}>{p.learned}</div>}
                  <div className="mono mute" style={{ fontSize: 12 }}>{p.tech.join(" · ")}</div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" style={{ marginTop: "auto", paddingTop: 8, fontWeight: 600, fontSize: 14, color: "var(--pri)" }}>
                      Visit {host(p.link)} ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "contact" && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>Get in touch</h2>
          <p className="mute" style={{ margin: "10px 0 0", fontSize: 17 }}>
            Recruiting, a systems or automation question, or comparing homelab notes — all welcome.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32, textAlign: "left" }}>
            {contacts.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card card-link"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 22px", borderRadius: 16 }}>
                <div style={{ minWidth: 0 }}>
                  <div className="mute" style={{ fontSize: 13 }}>{c.label}</div>
                  <div style={{ fontWeight: 500, wordBreak: "break-all" }}>{c.text}</div>
                </div>
                <span style={{ color: "var(--pri)", fontSize: 18 }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <p className="mono mute" style={{ margin: 0, padding: 24, textAlign: "center", fontSize: 12 }}>
        © 2026 — running on a mini PC under my desk · self-hosted with love
      </p>

      {admin && <AdminLoginModal onClose={() => setAdmin(false)} />}
    </div>
  );
}

/** Stand-in hero visual until /public/hero.jpg exists: ledger lines above, workflow nodes below, meeting in the middle. */
function HeroArt() {
  const rows = [0, 1, 2, 3, 4];
  const nodes = [120, 300, 500, 700, 880];
  return (
    <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--soft)" />
          <stop offset="1" stopColor="var(--sky)" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="var(--line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1000" height="500" fill="url(#hg)" />
      <rect width="1000" height="500" fill="url(#grid)" opacity=".7" />
      {/* Ledger (top) */}
      {rows.map((i) => (
        <g key={i} opacity={1 - i * 0.14}>
          <rect x={250} y={40 + i * 30} width={300 - i * 20} height={8} rx={4} fill="var(--pri)" opacity=".35" />
          <rect x={600} y={40 + i * 30} width={110} height={8} rx={4} fill="var(--pri)" opacity=".55" />
          <rect x={730} y={40 + i * 30} width={40 + ((i * 37) % 50)} height={8} rx={4} fill="var(--mute)" opacity=".3" />
        </g>
      ))}
      {/* Workflow (bottom) */}
      <path d={`M${nodes[0]} 400 ${nodes.slice(1).map((x) => `L${x} 400`).join(" ")}`} stroke="var(--acc)" strokeWidth="2" strokeDasharray="6 8" fill="none" opacity=".6" />
      {nodes.map((x, i) => (
        <g key={x}>
          <rect x={x - 44} y={376} width={88} height={48} rx={12} fill="var(--surf)" stroke="var(--line)" />
          <circle cx={x - 22} cy={400} r={6} fill={i === 2 ? "var(--acc)" : "var(--pri)"} opacity={i === 2 ? 1 : 0.6} />
          <rect x={x - 8} y={396} width={36} height={8} rx={4} fill="var(--mute)" opacity=".35" />
        </g>
      ))}
      {/* Meeting point */}
      <path d="M500 200 C500 260 500 300 500 376" stroke="var(--pri)" strokeWidth="2" fill="none" opacity=".5" />
      <circle cx={500} cy={262} r={22} fill="var(--acc)" opacity=".15" />
      <circle cx={500} cy={262} r={9} fill="var(--acc)" />
    </svg>
  );
}
