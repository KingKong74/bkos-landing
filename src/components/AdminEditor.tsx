"use client";

// Admin content editor. Edits a draft locally; "Save" writes it to the server
// (/api/admin/content) and the public site shows it on the next page load.

import { useEffect, useRef, useState } from "react";
import { DEFAULT_CONTENT, type SiteContent, type CAModule } from "@/lib/content";

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
        <details key={i} className="ad-item">
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

export function AdminEditor({ initial, hasSaved }: { initial: SiteContent; hasSaved: boolean }) {
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [usingDefaults, setUsingDefaults] = useState(!hasSaved);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(draft) !== saved;
  const set = (patch: Partial<SiteContent>) => setDraft((d) => ({ ...d, ...patch }));

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function flash(text: string, err = false) {
    setMsg({ text, err });
    setTimeout(() => setMsg(null), 4000);
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
      setDraft({ ...DEFAULT_CONTENT, ...parsed });
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p className="mute" style={{ margin: 0, fontSize: 14 }}>
        Edit anything below, then hit <strong>Save</strong>. Changes go live for everyone immediately.
        {usingDefaults && " Nothing saved yet, so the site is showing the defaults from the code."}
      </p>

      <Section title="Profile">
        <div className="ad-grid">
          <Text label="Availability (next to the dot)" value={draft.availability} onChange={(v) => set({ availability: v })} />
          <Text label="Employer" value={draft.employer} onChange={(v) => set({ employer: v })} />
          <Text label="Location" value={draft.location} onChange={(v) => set({ location: v })} />
          <Text label="Headline (Resume tab, under your name)" value={draft.headline} onChange={(v) => set({ headline: v })} wide />
          <Text label="Intro (home page, under your name)" value={draft.intro} onChange={(v) => set({ intro: v })} multiline />
          <Text label="About (Resume tab)" value={draft.about} onChange={(v) => set({ about: v })} multiline />
        </div>
      </Section>

      <Section title="Experience" hint="Newest first. Shown on the home page and the Resume tab.">
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
              <Lines label="Bullet points" value={r.bullets} onChange={(v) => s({ bullets: v })} />
              <Csv label="Skill tags" value={r.skills} onChange={(v) => s({ skills: v })} wide />
            </>
          )}
        </List>
      </Section>

      <Section title="CA Program">
        <div className="ad-grid" style={{ marginBottom: 14 }}>
          <Text label="Qualification" value={draft.caProgram.title} onChange={(v) => set({ caProgram: { ...draft.caProgram, title: v } })} />
          <Text label="Institution" value={draft.caProgram.institution} onChange={(v) => set({ caProgram: { ...draft.caProgram, institution: v } })} />
          <Text label="Period" value={draft.caProgram.period} onChange={(v) => set({ caProgram: { ...draft.caProgram, period: v } })} />
        </div>
        <div className="ad-field" style={{ marginBottom: 6 }}><span>Modules</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {draft.caModules.map((m, i) => {
            const setM = (patch: Partial<CAModule>) => set({ caModules: draft.caModules.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input className="ad-input" value={m.name} onChange={(e) => setM({ name: e.target.value })} placeholder="Module name" />
                <select className="ad-input" style={{ width: 150, flex: "none" }} value={m.status} onChange={(e) => setM({ status: e.target.value as CAModule["status"] })}>
                  <option value="complete">complete</option>
                  <option value="in progress">in progress</option>
                  <option value="upcoming">upcoming</option>
                </select>
                <button type="button" className="ad-btn danger" onClick={() => set({ caModules: draft.caModules.filter((_, j) => j !== i) })} aria-label="Remove module">✕</button>
              </div>
            );
          })}
          <button type="button" className="ad-btn" style={{ alignSelf: "flex-start" }} onClick={() => set({ caModules: [...draft.caModules, { name: "", status: "upcoming" }] })}>+ Add module</button>
        </div>
      </Section>

      <Section title="Degrees">
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

      <Section title="Skills" hint="Grouped skill chips on the Resume tab.">
        <List items={draft.skillGroups} onChange={(skillGroups) => set({ skillGroups })} addLabel="Add group" title={(g) => g.domain}
          blank={() => ({ domain: "", skills: [] })}>
          {(g, s) => (
            <>
              <Text label="Group name" value={g.domain} onChange={(v) => s({ domain: v })} />
              <Csv label="Skills" value={g.skills} onChange={(v) => s({ skills: v })} wide />
            </>
          )}
        </List>
        <div style={{ marginTop: 16 }} className="ad-grid">
          <Csv label="Toolkit strip (home page)" value={draft.toolkit} onChange={(v) => set({ toolkit: v })} wide />
        </div>
      </Section>

      <Section title="Projects">
        <List items={draft.projects} onChange={(projects) => set({ projects })} addLabel="Add project"
          title={(p) => `${p.name}${p.visible ? "" : " (hidden)"}`}
          blank={() => ({ id: uid("proj"), name: "", tagline: "", tech: [], status: "in development", visible: true })}>
          {(p, s) => (
            <>
              <Text label="Name" value={p.name} onChange={(v) => s({ name: v })} />
              <Text label="Status" value={p.status} onChange={(v) => s({ status: v })} />
              <Text label="Tagline" value={p.tagline} onChange={(v) => s({ tagline: v })} wide />
              <Text label="Link" value={p.link ?? ""} placeholder="https://" onChange={(v) => s({ link: v || undefined })} />
              <Csv label="Tech" value={p.tech} onChange={(v) => s({ tech: v })} />
              <Text label="What I learned (Projects tab)" value={p.learned ?? ""} onChange={(v) => s({ learned: v || undefined })} multiline />
              <label className="ad-check"><input type="checkbox" checked={p.visible} onChange={(e) => s({ visible: e.target.checked })} /> Visible on the site</label>
            </>
          )}
        </List>
      </Section>

      <Section title="What I do" hint="The two cards on the home page (and the floating labels on the hero image).">
        <List items={draft.practices} onChange={(practices) => set({ practices })} addLabel="Add card" title={(p) => p.title}
          blank={() => ({ n: String(draft.practices.length + 1).padStart(2, "0"), tone: "pri" as const, label: "", title: "", short: "", body: "", tags: [] })}>
          {(p, s) => (
            <>
              <Text label="Title" value={p.title} onChange={(v) => s({ title: v })} />
              <Text label="Hero label" value={p.label} onChange={(v) => s({ label: v })} />
              <Text label="Short (hero card)" value={p.short} onChange={(v) => s({ short: v })} multiline />
              <Text label="Body (home card)" value={p.body} onChange={(v) => s({ body: v })} multiline />
              <Csv label="Tags" value={p.tags} onChange={(v) => s({ tags: v })} wide />
            </>
          )}
        </List>
      </Section>

      <Section title="How I work" hint="The numbered steps on the home page.">
        <List items={draft.steps} onChange={(steps) => set({ steps })} addLabel="Add step" title={(st) => `${st.n} ${st.title}`}
          blank={() => ({ n: String(draft.steps.length + 1).padStart(2, "0"), title: "", body: "" })}>
          {(st, s) => (
            <>
              <Text label="Number" value={st.n} onChange={(v) => s({ n: v })} />
              <Text label="Title" value={st.title} onChange={(v) => s({ title: v })} />
              <Text label="Body" value={st.body} onChange={(v) => s({ body: v })} multiline />
            </>
          )}
        </List>
      </Section>

      <Section title="Contact links">
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

      <Section title="Backup">
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

      <div className="ad-savebar">
        <span className="mono" style={{ fontSize: 13, color: msg?.err ? "var(--acc)" : dirty ? "var(--acc)" : "var(--mute)" }}>
          {msg?.text ?? (dirty ? "Unsaved changes" : "All changes saved")}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="ad-btn" disabled={!dirty || busy} onClick={() => setDraft(JSON.parse(saved))}>Discard</button>
          <button type="button" className="btn btn-acc" style={{ padding: "8px 20px", fontSize: 14 }} disabled={!dirty || busy} onClick={() => request("PUT", draft)}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
