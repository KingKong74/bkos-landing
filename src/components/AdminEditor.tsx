"use client";

// Admin content editor. Writes to localStorage via src/lib/siteContent.ts, so
// edits apply to this browser only. Export the JSON and paste it into
// DEFAULT_CONTENT to publish for everyone.

import { useRef, useState } from "react";
import { useEditableContent, exportContent, importContent, newId, Project, SiteContent } from "@/lib/siteContent";

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className="ad-field" style={wide ? { gridColumn: "1 / -1" } : undefined}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function AdminEditor() {
  const [content, update, reset] = useEditableContent();
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<SiteContent>) => update({ ...content, ...patch });
  const setProject = (i: number, patch: Partial<Project>) =>
    set({ projects: content.projects.map((p, j) => (j === i ? { ...p, ...patch } : p)) });

  function flash(msg: string) {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2500);
  }

  function handleImport(json: string) {
    try {
      update(importContent(json));
      setImportText("");
      flash("Imported");
    } catch (e) {
      flash(`Import failed: ${e instanceof Error ? e.message : "invalid JSON"}`);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([exportContent()], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bkos-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p className="mute" style={{ margin: 0, fontSize: 14 }}>
        Edits save instantly to <strong>this browser</strong>. Visitors see the defaults in{" "}
        <code className="mono">src/lib/siteContent.ts</code>. Export the JSON to publish or move devices.
      </p>

      <div className="card" style={{ padding: 20 }}>
        <div className="eyebrow" style={{ fontSize: 12, marginBottom: 10 }}>Availability</div>
        <input
          className="ad-input"
          value={content.availability}
          onChange={(e) => set({ availability: e.target.value })}
          placeholder="open to opportunities"
        />
        <div className="mute" style={{ fontSize: 13, marginTop: 6 }}>Shown next to the dot in the hero and on the Resume tab.</div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="eyebrow" style={{ fontSize: 12, marginBottom: 12 }}>Projects</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {content.projects.map((p, i) => (
            <div key={p.id} className="ad-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontWeight: 600 }}>{p.name || "Untitled project"}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <label className="ad-check">
                    <input type="checkbox" checked={p.visible} onChange={(e) => setProject(i, { visible: e.target.checked })} /> Visible
                  </label>
                  <button type="button" className="ad-btn" disabled={i === 0} onClick={() => set({ projects: move(content.projects, i, i - 1) })} aria-label="Move up">↑</button>
                  <button type="button" className="ad-btn" disabled={i === content.projects.length - 1} onClick={() => set({ projects: move(content.projects, i, i + 1) })} aria-label="Move down">↓</button>
                  <button type="button" className="ad-btn danger" onClick={() => set({ projects: content.projects.filter((_, j) => j !== i) })}>Delete</button>
                </div>
              </div>
              <div className="ad-grid">
                <Field label="Name"><input className="ad-input" value={p.name} onChange={(e) => setProject(i, { name: e.target.value })} /></Field>
                <Field label="Status"><input className="ad-input" value={p.status} onChange={(e) => setProject(i, { status: e.target.value })} /></Field>
                <Field label="Tagline" wide><input className="ad-input" value={p.tagline} onChange={(e) => setProject(i, { tagline: e.target.value })} /></Field>
                <Field label="Link"><input className="ad-input" value={p.link ?? ""} placeholder="https://" onChange={(e) => setProject(i, { link: e.target.value || undefined })} /></Field>
                <Field label="Tech (comma separated)">
                  <input className="ad-input" value={p.tech.join(", ")} onChange={(e) => setProject(i, { tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
                </Field>
                <Field label="What I learned" wide>
                  <textarea className="ad-input" rows={2} value={p.learned ?? ""} onChange={(e) => setProject(i, { learned: e.target.value || undefined })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="ad-btn"
          style={{ marginTop: 12 }}
          onClick={() => set({ projects: [...content.projects, { id: newId("proj"), name: "", tagline: "", tech: [], status: "in development", visible: true }] })}
        >
          + Add project
        </button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="eyebrow" style={{ fontSize: 12, marginBottom: 12 }}>Backup</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" className="ad-btn" onClick={() => navigator.clipboard.writeText(exportContent()).then(() => flash("Copied JSON"))}>Copy JSON</button>
          <button type="button" className="ad-btn" onClick={download}>Download JSON</button>
          <button type="button" className="ad-btn" onClick={() => fileRef.current?.click()}>Import file</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) f.text().then(handleImport);
            e.target.value = "";
          }} />
          <button type="button" className="ad-btn danger" onClick={() => { if (confirm("Reset all edits in this browser to the defaults?")) { reset(); flash("Reset to defaults"); } }}>
            Reset to defaults
          </button>
        </div>
        <textarea className="ad-input mono" rows={3} style={{ marginTop: 12, fontSize: 12 }} placeholder="…or paste JSON here" value={importText} onChange={(e) => setImportText(e.target.value)} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <button type="button" className="ad-btn" disabled={!importText.trim()} onClick={() => handleImport(importText)}>Import pasted JSON</button>
          {status && <span className="mono" style={{ fontSize: 12, color: "var(--pri)" }}>{status}</span>}
        </div>
      </div>
    </div>
  );
}
