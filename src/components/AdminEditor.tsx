"use client";

// Admin content editor. Edits a draft locally; "Save" writes it to the server
// (/api/admin/content) and the public site shows it on the next page load.

import { useEffect, useRef, useState } from "react";
import { mergeContent, type SiteContent, type CAModule, type Copy, type Sections } from "@/lib/content";
import { ProjectImageUpload } from "./ProjectImageUpload";
import { AllContentEditor } from "./AllContentEditor";

const SECTION_LABELS: [keyof Sections, string][] = [
  ["whatIDo", "What I do"], ["howIWork", "How I work"], ["experience", "Experience"], ["projects", "Selected projects"],
  ["toolkit", "Toolkit"], ["cta", "Call to action"], ["nowPlaying", "Spotify now playing"], ["weather", "Weather"],
];

// ─── Small field helpers ─────────────────────────────────────────────────────

function Text({ label, value, onChange, multiline, wide, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; wide?: boolean; placeholder?: string;
}) {
  return (
    <label className="ad-field" style={wide || multiline ? { gridColumn: "1 / -1" } : undefined}>
      <span>{label}</span>
      {multiline ? (
        <textarea className="ad-input" rows={Math.min(8, Math.max(2, Math.ceil(value.length / 90)))} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="ad-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

/** string[] edited one item per line */
function Lines({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join("\n"));
  useEffect(() => { if (text.split("\n").map((l) => l.trim()).filter(Boolean).join("\n") !== value.join("\n")) setText(value.join("\n")); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <label className="ad-field" style={{ gridColumn: "1 / -1" }}>
      <span>{label} <em style={{ fontStyle: "normal", opacity: 0.7 }}>(one per line)</em></span>
      <textarea className="ad-input" rows={Math.max(2, value.length + 1)} value={text}
        onChange={(e) => { setText(e.target.value); onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean)); }} />
    </label>
  );
}

/** string[] edited as a comma-separated list */
function Csv({ label, value, onChange, wide }: { label: string; value: string[]; onChange: (v: string[]) => void; wide?: boolean }) {
  const [text, setText] = useState(value.join(", "));
  useEffect(() => { if (text.split(",").map((t) => t.trim()).filter(Boolean).join(",") !== value.join(",")) setText(value.join(", ")); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <label className="ad-field" style={wide ? { gridColumn: "1 / -1" } : undefined}>
      <span>{label} <em style={{ fontStyle: "normal", opacity: 0.7 }}>(comma separated)</em></span>
      <input className="ad-input" value={text}
        onChange={(e) => { setText(e.target.value); onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean)); }} />
    </label>
  );
}

function List<T>({ items, onChange, title, blank, children, addLabel }: {
  items: T[];
  onChange: (next: T[]) => void;
  title: (item: T) => string;
  blank: () => T;
  addLabel: string;
  children: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const move = (from: number, to: number) => {
    const next = items.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <details key={i} className="ad-item" open>
          <summary>
            <span style={{ fontWeight: 600, flex: 1, minWidth: 0 }}>{title(item) || "Untitled"}</span>
            <span style={{ display: "flex", gap: 6 }} onClick={(e) => e.preventDefault()}>
              <button type="button" className="ad-btn" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up">↑</button>
              <button type="button" className="ad-btn" disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down">↓</button>
              <button type="button" className="ad-btn danger" onClick={() => { if (confirm(`Delete “${title(item) || "this item"}”?`)) onChange(items.filter((_, j) => j !== i)); }}>Delete</button>
            </span>
          </summary>
          <div className="ad-grid" style={{ marginTop: 14 }}>
            {children(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))))}
          </div>
        </details>
      ))}
      <button type="button" className="ad-btn" style={{ alignSelf: "flex-start" }} onClick={() => onChange([...items, blank()])}>+ {addLabel}</button>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="eyebrow" style={{ fontSize: 12 }}>{title}</div>
      {hint && <div className="mute" style={{ fontSize: 13, marginTop: 4 }}>{hint}</div>}
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

// ─── Editor ──────────────────────────────────────────────────────────────────

const TABS = [
  ["all", "All writing"], ["home", "Home page"], ["resume", "Resume"], ["projects", "Projects"], ["contact", "Contact"],
  ["site", "Site-wide"], ["files", "Files"], ["backup", "Backup"],
] as const;
type Tab = (typeof TABS)[number][0];

export function AdminEditor({ initial, hasSaved, filesPanel }: { initial: SiteContent; hasSaved: boolean; filesPanel: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("all");
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [usingDefaults, setUsingDefaults] = useState(!hasSaved);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [recovery, setRecovery] = useState<SiteContent | null>(null);
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bkos-admin-draft");
      if (stored) {
        const previous = mergeContent(JSON.parse(stored));
        if (JSON.stringify(previous) !== JSON.stringify(initial)) setRecovery(previous);
      }
    } catch { /* Local recovery is optional. */ }
    setDraftReady(true);
  }, [initial]);

  const dirty = JSON.stringify(draft) !== saved;
  const set = (patch: Partial<SiteContent>) => setDraft((d) => ({ ...d, ...patch }));

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!draftReady || recovery) return;
    const timeout = setTimeout(() => {
      try {
        if (dirty) localStorage.setItem("bkos-admin-draft", JSON.stringify(draft));
        else localStorage.removeItem("bkos-admin-draft");
      } catch { /* The server save still works if local storage is unavailable. */ }
    }, 300);
    return () => clearTimeout(timeout);
  }, [draft, dirty, draftReady, recovery]);

  function flash(text: string, err = false) {
    setMsg({ text, err });
  }

  async function request(method: "PUT" | "DELETE", body?: SiteContent) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/content", {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setDraft(data);
      setSaved(JSON.stringify(data));
      setUsingDefaults(method === "DELETE");
      flash(method === "PUT" ? "Saved. Live on the site now." : "Reset to defaults.");
    } catch (e) {
      flash(`Failed: ${e instanceof Error ? e.message : "unknown error"}`, true);
    } finally {
      setBusy(false);
    }
  }

  function importJson(json: string) {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid content");
      setDraft(mergeContent(parsed));
      flash("Imported into the editor. Review, then Save.");
    } catch {
      flash("Import failed: invalid JSON", true);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bkos-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const cf = (key: keyof Copy, label: string, multiline?: boolean) => (
    <Text key={key} label={label} value={draft.copy[key]} multiline={multiline}
      onChange={(v) => set({ copy: { ...draft.copy, [key]: v } })} />
  );
  const grid = (children: React.ReactNode) => <div className="ad-grid">{children}</div>;
  const note = (text: string) => <div className="mute" style={{ fontSize: 13, marginTop: 12 }}>{text}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="ad-savebar ad-savebar-top">
        <div>
          <strong>{dirty ? "You have unpublished changes" : "Content is up to date"}</strong>
          <div className="mute" style={{ fontSize: 13 }}>Edit below, then Save & publish to update the public site.</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a className="ad-btn" href={`/#${["home", "resume", "projects", "contact"].includes(tab) ? tab : "home"}`} target="_blank" rel="noreferrer">View published site ↗</a>
          <button type="button" className="btn btn-acc" disabled={!dirty || busy} onClick={() => request("PUT", draft)}>{busy ? "Publishing…" : "Save & publish"}</button>
        </div>
      </div>
      {msg && <div role={msg.err ? "alert" : "status"} className="card" style={{ padding: 14, color: msg.err ? "var(--acc)" : "var(--ink)" }}>{msg.text}</div>}
      {recovery && <div className="card" style={{ padding: 16 }}>
        <p style={{ marginTop: 0 }}>Unsaved edits from your last visit are available.</p>
        <button type="button" className="ad-btn" onClick={() => { setDraft(recovery); setRecovery(null); }}>Restore edits</button>{" "}
        <button type="button" className="ad-btn" onClick={() => { setRecovery(null); try { localStorage.removeItem("bkos-admin-draft"); } catch {} }}>Dismiss</button>
      </div>}

      <nav className="ad-tabs" aria-label="Editor sections">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className="rl-tab" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      <fieldset disabled={busy} className="ad-editor-fields">
      {tab === "all" && <AllContentEditor content={draft} onChange={setDraft} />}

      {tab === "home" && (<>
        <Section title="Hero" hint="Top of the home page. Your name is under Site-wide.">
          {grid(<>
            <Text label="Availability (next to the dot)" value={draft.availability} onChange={(v) => set({ availability: v })} />
            {cf("city", "City (after availability, and on the weather card)")}
            <Text label="Intro (under your name)" value={draft.intro} onChange={(v) => set({ intro: v })} multiline />
            {cf("heroPrimary", "Primary button")}
            {cf("heroSecondary", "Secondary button")}
          </>)}
        </Section>

        <Section title="What I do" hint="Heading plus the cards. Each card’s label and short text also float over the hero image.">
          {grid(<>{cf("whatEyebrow", "Small label")}{cf("whatHeading", "Heading", true)}</>)}
          <div style={{ marginTop: 14 }}>
            <List items={draft.practices} onChange={(practices) => set({ practices })} addLabel="Add card" title={(p) => p.title}
              blank={() => ({ n: String(draft.practices.length + 1).padStart(2, "0"), tone: "pri" as const, label: "", title: "", short: "", body: "", tags: [] })}>
              {(p, s) => (
                <>
                  <Text label="Number" value={p.n} onChange={(v) => s({ n: v })} />
                  <Text label="Title" value={p.title} onChange={(v) => s({ title: v })} />
                  <label className="ad-field"><span>Colour</span><select className="ad-input" value={p.tone} onChange={(e) => s({ tone: e.target.value as "pri" | "acc" })}><option value="pri">Primary</option><option value="acc">Accent</option></select></label>
                  <Text label="Hero label" value={p.label} onChange={(v) => s({ label: v })} />
                  <Text label="Short text (over the hero image)" value={p.short} onChange={(v) => s({ short: v })} multiline />
                  <Text label="Card text" value={p.body} onChange={(v) => s({ body: v })} multiline />
                  <Csv label="Tags" value={p.tags} onChange={(v) => s({ tags: v })} wide />
                </>
              )}
            </List>
          </div>
        </Section>

        <Section title="How I work">
          {grid(cf("howEyebrow", "Small label"))}
          <div style={{ marginTop: 14 }}>
            <List items={draft.steps} onChange={(steps) => set({ steps })} addLabel="Add step" title={(st) => `${st.n} ${st.title}`}
              blank={() => ({ n: String(draft.steps.length + 1).padStart(2, "0"), title: "", body: "" })}>
              {(st, s) => (
                <>
                  <Text label="Number" value={st.n} onChange={(v) => s({ n: v })} />
                  <Text label="Title" value={st.title} onChange={(v) => s({ title: v })} />
                  <Text label="Text" value={st.body} onChange={(v) => s({ body: v })} multiline />
                </>
              )}
            </List>
          </div>
        </Section>

        <Section title="Experience preview">
          {grid(<>{cf("expEyebrow", "Small label")}{cf("expButton", "Button")}{cf("expHeading", "Heading", true)}</>)}
          {note("The roles themselves are edited in the Resume tab.")}
        </Section>

        <Section title="Selected projects">
          {grid(<>{cf("projEyebrow", "Small label")}{cf("projHeading", "Heading")}{cf("projButton", "Button")}</>)}
          {note("The projects themselves are edited in the Projects tab.")}
        </Section>

        <Section title="Toolkit">
          {grid(<>{cf("toolkitEyebrow", "Small label")}<Csv label="Tools" value={draft.toolkit} onChange={(v) => set({ toolkit: v })} wide /></>)}
        </Section>

        <Section title="Call to action" hint="The dark box at the bottom of the home page.">
          {grid(<>
            {cf("ctaHeading", "Heading")}
            {cf("ctaBody", "Text", true)}
            {cf("ctaEmailLabel", "Email button")}
            {cf("ctaEmail", "Email address")}
            {cf("downloadLabel", "Download resume button")}
          </>)}
        </Section>

        <Section title="Show / hide" hint="Turn parts of the home page on or off.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            {SECTION_LABELS.map(([key, label]) => (
              <label key={key} className="ad-check">
                <input type="checkbox" checked={draft.sections[key]} onChange={(e) => set({ sections: { ...draft.sections, [key]: e.target.checked } })} /> {label}
              </label>
            ))}
          </div>
        </Section>
      </>)}

      {tab === "resume" && (<>
        <Section title="Header card" hint="Your name and headshot are under Site-wide and Files.">
          {grid(<>
            <Text label="Headline (under your name)" value={draft.headline} onChange={(v) => set({ headline: v })} wide />
            <Csv label="Chips" value={draft.resumeChips} onChange={(v) => set({ resumeChips: v })} wide />
          </>)}
        </Section>

        <Section title="About">
          {grid(<>{cf("labelAbout", "Section label")}<Text label="About text" value={draft.about} onChange={(v) => set({ about: v })} multiline /></>)}
        </Section>

        <Section title="Experience" hint="Newest first. Also shown on the home page.">
          {grid(<>
            {cf("labelExperience", "Section label")}
            <Text label="Location (top right of the section)" value={draft.location} onChange={(v) => set({ location: v })} />
            {cf("roleToLabel", "Word between dates (“to”)")}
          </>)}
          <div style={{ marginTop: 14 }}>
            <List items={draft.roles} onChange={(roles) => set({ roles })} addLabel="Add role"
              title={(r) => `${r.org ? r.org + " · " : ""}${r.title}`}
              blank={() => ({ id: uid("role"), org: "", title: "", start: "", end: "present", period: "", type: "Full-time", summary: "", bullets: [], skills: [] })}>
              {(r, s) => (
                <>
                  <Text label="Organisation" value={r.org} onChange={(v) => s({ org: v })} />
                  <Text label="Title" value={r.title} onChange={(v) => s({ title: v })} />
                  <Text label="Start year (big number)" value={r.start} onChange={(v) => s({ start: v })} />
                  <Text label="End (year or “present”)" value={r.end} onChange={(v) => s({ end: v })} />
                  <Text label="Period (e.g. Oct 2026 – present)" value={r.period} onChange={(v) => s({ period: v })} />
                  <Text label="Type (e.g. Full-time · Brisbane City)" value={r.type} onChange={(v) => s({ type: v })} />
                  <Text label="Summary" value={r.summary} onChange={(v) => s({ summary: v })} multiline />
                  <Lines label="Bullet points (shown when expanded)" value={r.bullets} onChange={(v) => s({ bullets: v })} />
                  <Csv label="Skill tags" value={r.skills} onChange={(v) => s({ skills: v })} wide />
                </>
              )}
            </List>
          </div>
        </Section>

        <Section title="Education">
          {grid(<>
            {cf("labelEducation", "Section label")}
            <Text label="Qualification" value={draft.caProgram.title} onChange={(v) => set({ caProgram: { ...draft.caProgram, title: v } })} />
            <Text label="Institution" value={draft.caProgram.institution} onChange={(v) => set({ caProgram: { ...draft.caProgram, institution: v } })} />
            <Text label="Period" value={draft.caProgram.period} onChange={(v) => set({ caProgram: { ...draft.caProgram, period: v } })} />
          </>)}
          <div className="ad-field" style={{ margin: "16px 0 6px" }}><span>CA subjects: change the status as you go</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {draft.caModules.map((m, i) => {
              const setM = (patch: Partial<CAModule>) => set({ caModules: draft.caModules.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
              const mv = (to: number) => { const next = draft.caModules.slice(); const [it] = next.splice(i, 1); next.splice(to, 0, it); set({ caModules: next }); };
              return (
                <div key={i} className="ad-module">
                  <input className="ad-input" value={m.name} onChange={(e) => setM({ name: e.target.value })} placeholder="Subject name" />
                  <select className="ad-input" value={m.status} data-status={m.status} onChange={(e) => setM({ status: e.target.value as CAModule["status"] })}>
                    <option value="complete">complete</option>
                    <option value="in progress">in progress</option>
                    <option value="upcoming">upcoming</option>
                  </select>
                  <span style={{ display: "flex", gap: 6 }}>
                    <button type="button" className="ad-btn" disabled={i === 0} onClick={() => mv(i - 1)} aria-label="Move up">↑</button>
                    <button type="button" className="ad-btn" disabled={i === draft.caModules.length - 1} onClick={() => mv(i + 1)} aria-label="Move down">↓</button>
                    <button type="button" className="ad-btn danger" onClick={() => set({ caModules: draft.caModules.filter((_, j) => j !== i) })} aria-label="Remove subject">✕</button>
                  </span>
                </div>
              );
            })}
            <button type="button" className="ad-btn" style={{ alignSelf: "flex-start" }} onClick={() => set({ caModules: [...draft.caModules, { name: "", status: "upcoming" }] })}>+ Add subject</button>
          </div>
          <div className="ad-field" style={{ margin: "20px 0 6px" }}><span>Degrees</span></div>
          <List items={draft.degrees} onChange={(degrees) => set({ degrees })} addLabel="Add degree" title={(d) => d.title}
            blank={() => ({ title: "", institution: "", period: "" })}>
            {(d, s) => (
              <>
                <Text label="Degree" value={d.title} onChange={(v) => s({ title: v })} wide />
                <Text label="Institution" value={d.institution} onChange={(v) => s({ institution: v })} />
                <Text label="Period" value={d.period} onChange={(v) => s({ period: v })} />
              </>
            )}
          </List>
        </Section>

        <Section title="Skills">
          {grid(cf("labelSkills", "Section label"))}
          <div style={{ marginTop: 14 }}>
            <List items={draft.skillGroups} onChange={(skillGroups) => set({ skillGroups })} addLabel="Add group" title={(g) => g.domain}
              blank={() => ({ domain: "", skills: [] })}>
              {(g, s) => (
                <>
                  <Text label="Group name" value={g.domain} onChange={(v) => s({ domain: v })} />
                  <Csv label="Skills" value={g.skills} onChange={(v) => s({ skills: v })} wide />
                </>
              )}
            </List>
          </div>
        </Section>

        <Section title="Sidebar" hint="Contact card, Spotify and weather on the right. Contact links are in the Contact tab.">
          {grid(<>{cf("labelContact", "Contact label")}{cf("downloadLabel", "Download resume button")}{cf("weatherNowLabel", "Weather card: “right now”")}</>)}
        </Section>
      </>)}

      {tab === "projects" && (<>
        <Section title="Projects page">
          {grid(<>
            {cf("projectsTitle", "Title")}
            {cf("projectsSubtitle", "Subtitle", true)}
            {cf("visitLabel", "Link prefix (“Visit”)")}
            {cf("noLinkLabel", "Shown when a project has no link")}
          </>)}
        </Section>
        <Section title="Projects" hint="Shown on the Projects tab and in Selected projects on the home page.">
          <List items={draft.projects} onChange={(projects) => set({ projects })} addLabel="Add project"
            title={(p) => `${p.name}${p.visible ? "" : " (hidden)"}`}
            blank={() => ({ id: uid("proj"), name: "", tagline: "", tech: [], status: "in development", visible: true })}>
            {(p, s) => (
              <>
                <Text label="Name" value={p.name} onChange={(v) => s({ name: v })} />
                <Text label="Status" value={p.status} onChange={(v) => s({ status: v })} />
                <Text label="Tagline" value={p.tagline} onChange={(v) => s({ tagline: v })} wide />
                <Text label="Link" value={p.link ?? ""} placeholder="https://" onChange={(v) => s({ link: v || undefined })} />
                <Text label="Preview image URL (optional)" value={p.previewImage ?? ""} placeholder="/projects/screenshot.jpg or https://…" onChange={(v) => s({ previewImage: v || undefined })} wide />
                <ProjectImageUpload value={p.previewImage} onChange={(url) => s({ previewImage: url })} onBusyChange={setBusy} />
                <Csv label="Tech" value={p.tech} onChange={(v) => s({ tech: v })} />
                <Text label="What I learned" value={p.learned ?? ""} onChange={(v) => s({ learned: v || undefined })} multiline />
                <label className="ad-check"><input type="checkbox" checked={p.visible} onChange={(e) => s({ visible: e.target.checked })} /> Visible on the site</label>
              </>
            )}
          </List>
        </Section>
      </>)}

      {tab === "contact" && (<>
        <Section title="Contact page">
          {grid(<>{cf("contactTitle", "Title")}{cf("contactSubtitle", "Subtitle", true)}</>)}
        </Section>
        <Section title="Contact links" hint="Shown on the Contact tab and in the Resume sidebar.">
          <List items={draft.contacts} onChange={(contacts) => set({ contacts })} addLabel="Add link" title={(c) => c.label}
            blank={() => ({ label: "", text: "", href: "" })}>
            {(c, s) => (
              <>
                <Text label="Label" value={c.label} onChange={(v) => s({ label: v })} />
                <Text label="Display text" value={c.text} onChange={(v) => s({ text: v })} />
                <Text label="Link (https:// or mailto:)" value={c.href} onChange={(v) => s({ href: v })} wide />
              </>
            )}
          </List>
        </Section>
      </>)}

      {tab === "site" && (<>
        <Section title="Name & header">
          {grid(<>
            {cf("name", "Your name (hero + Resume tab)")}
            {cf("initials", "Initials (logo, and headshot fallback)")}
            {cf("brand", "Site name in header")}
            {cf("resumePdfLabel", "Header resume button")}
            {cf("tabHome", "Tab: Home")}
            {cf("tabResume", "Tab: Resume")}
            {cf("tabProjects", "Tab: Projects")}
            {cf("tabContact", "Tab: Contact")}
          </>)}
        </Section>
        <Section title="Live cards" hint="Spotify and weather labels (home page and Resume sidebar).">
          {grid(<>
            {cf("nowPlayingLabel", "Spotify: playing now")}
            {cf("lastPlayedLabel", "Spotify: not playing")}
            {cf("weatherFallback", "Weather: when unavailable")}
          </>)}
        </Section>
        <Section title="Footer & search engines">
          {grid(<>
            {cf("footer", "Footer text", true)}
            {cf("metaTitle", "Browser tab / Google title", true)}
            {cf("metaDescription", "Google / link-preview description", true)}
          </>)}
        </Section>
      </>)}

      {tab === "files" && filesPanel}

      {tab === "backup" && (
        <Section title="Backup" hint="Download covers all text and settings (not uploaded files).">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" className="ad-btn" onClick={download}>Download JSON</button>
            <button type="button" className="ad-btn" onClick={() => fileRef.current?.click()}>Import JSON</button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) f.text().then(importJson);
              e.target.value = "";
            }} />
            <button type="button" className="ad-btn danger" disabled={busy || usingDefaults}
              onClick={() => { if (confirm("Delete all saved edits and go back to the defaults from the code?")) request("DELETE"); }}>
              Reset to defaults
            </button>
          </div>
        </Section>
      )}

      </fieldset>
      <div className="ad-savebar">
        <span className="mono" style={{ fontSize: 13, color: msg?.err ? "var(--acc)" : dirty ? "var(--acc)" : "var(--mute)" }}>
          {msg?.text ?? (dirty ? "Unsaved changes" : "All changes saved")}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="ad-btn" disabled={!dirty || busy} onClick={() => setDraft(JSON.parse(saved))}>Discard</button>
          <button type="button" className="btn btn-acc" style={{ padding: "8px 20px", fontSize: 14 }} disabled={!dirty || busy} onClick={() => request("PUT", draft)}>
            {busy ? "Publishing…" : "Save & publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
