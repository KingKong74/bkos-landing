"use client";

// Admin content editor — everything here writes to localStorage via
// src/lib/siteContent.ts, so edits are per-browser for now.
// TODO(postgres): when content moves to BK-OS/Postgres, this component keeps
// the same shape — swap the useEditableContent hook for API-backed mutations.

import { useRef, useState } from "react";
import {
  useEditableContent,
  exportContent,
  importContent,
  newId,
  Project,
  Post,
  ReadingItem,
  Testimonial,
  SiteContent,
  SectionVisibility,
} from "@/lib/siteContent";

// ─── UI primitives ───────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f0e0c",
  border: "1px solid #3a3935",
  borderRadius: 8,
  padding: "8px 10px",
  color: "#f4f4f1",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
};

const smallButton: React.CSSProperties = {
  padding: "6px 10px",
  background: "transparent",
  color: "#a8a59c",
  border: "1px solid #3a3935",
  borderRadius: 6,
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "inherit",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#7a7770",
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "#1a1916",
        border: "1px solid #26241f",
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#f5a623",
          margin: "0 0 4px",
          fontWeight: 500,
        }}
      >
        {title}
      </h2>
      {hint && <p style={{ fontSize: 12, color: "#7a7770", margin: "0 0 14px", lineHeight: 1.5 }}>{hint}</p>}
      {children}
    </section>
  );
}

function ItemCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #26241f",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        background: "#141311",
      }}
    >
      {children}
    </div>
  );
}

function RowActions({
  onUp,
  onDown,
  onDelete,
}: {
  onUp?: () => void;
  onDown?: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      {onUp && (
        <button type="button" style={smallButton} onClick={onUp} aria-label="Move up">
          ↑
        </button>
      )}
      {onDown && (
        <button type="button" style={smallButton} onClick={onDown} aria-label="Move down">
          ↓
        </button>
      )}
      <button
        type="button"
        style={{ ...smallButton, color: "#e24b4a", borderColor: "rgba(226,75,74,0.4)", marginLeft: "auto" }}
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export function AdminEditor() {
  const [content, update, reset] = useEditableContent();
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<SiteContent>) => update({ ...content, ...patch });

  const setProject = (i: number, patch: Partial<Project>) =>
    set({ projects: content.projects.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const setPost = (i: number, patch: Partial<Post>) =>
    set({ posts: content.posts.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const setReading = (i: number, patch: Partial<ReadingItem>) =>
    set({ reading: content.reading.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  const setTestimonial = (i: number, patch: Partial<Testimonial>) =>
    set({ testimonials: content.testimonials.map((t, j) => (j === i ? { ...t, ...patch } : t)) });

  function handleExportCopy() {
    navigator.clipboard.writeText(exportContent()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleExportDownload() {
    const blob = new Blob([exportContent()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bkos-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(json: string) {
    try {
      const merged = importContent(json);
      update(merged);
      setImportStatus("Imported ✓");
      setImportText("");
    } catch (e) {
      setImportStatus(`Failed: ${e instanceof Error ? e.message : "invalid JSON"}`);
    }
    setTimeout(() => setImportStatus(null), 3000);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(handleImport);
    e.target.value = "";
  }

  const sectionLabels: { key: keyof SectionVisibility; label: string }[] = [
    { key: "projects", label: "Currently building" },
    { key: "stack", label: "The stack" },
    { key: "perspectives", label: "Perspectives" },
    { key: "photos", label: "Photo ribbon" },
    { key: "personal", label: "Personal" },
    { key: "vibe", label: "Vibe check" },
  ];

  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "#7a7770",
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        Edits save instantly to <strong>this browser&apos;s</strong> localStorage — other
        visitors see the defaults shipped in code. Export JSON to back up or move devices.
      </p>

      {/* Availability */}
      <Section title="Availability" hint="Shows in the hero and on /work.">
        <input
          style={inputStyle}
          value={content.availability}
          onChange={(e) => set({ availability: e.target.value })}
          placeholder="open to opportunities"
        />
      </Section>

      {/* Hero words */}
      <Section title="Rotating hero words" hint="Comma-separated; rotates in the hero pill.">
        <input
          style={inputStyle}
          value={content.heroWords.join(", ")}
          onChange={(e) =>
            set({ heroWords: e.target.value.split(",").map((w) => w.trim()).filter(Boolean) })
          }
        />
      </Section>

      {/* Section toggles */}
      <Section title="Sections" hint="Show or hide home-page sections.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
          {sectionLabels.map(({ key, label }) => (
            <label
              key={key}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#c4c1b8", cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={content.sections[key]}
                onChange={(e) => set({ sections: { ...content.sections, [key]: e.target.checked } })}
              />
              {label}
            </label>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Featured projects" hint="Order here is display order. Untick 'visible' to hide without deleting.">
        {content.projects.map((p, i) => (
          <ItemCard key={p.id}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Name">
                <input style={inputStyle} value={p.name} onChange={(e) => setProject(i, { name: e.target.value })} />
              </Field>
              <Field label="Status">
                <input style={inputStyle} value={p.status} onChange={(e) => setProject(i, { status: e.target.value })} />
              </Field>
            </div>
            <Field label="Tagline">
              <input style={inputStyle} value={p.tagline} onChange={(e) => setProject(i, { tagline: e.target.value })} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Tech (comma-separated)">
                <input
                  style={inputStyle}
                  value={p.tech.join(", ")}
                  onChange={(e) =>
                    setProject(i, { tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                  }
                />
              </Field>
              <Field label="Link">
                <input style={inputStyle} value={p.link ?? ""} onChange={(e) => setProject(i, { link: e.target.value || undefined })} />
              </Field>
            </div>
            <Field label="What building this taught me (hover reveal)">
              <textarea
                style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
                value={p.learned ?? ""}
                onChange={(e) => setProject(i, { learned: e.target.value || undefined })}
              />
            </Field>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#c4c1b8", cursor: "pointer" }}>
              <input type="checkbox" checked={p.visible} onChange={(e) => setProject(i, { visible: e.target.checked })} />
              Visible
            </label>
            <RowActions
              onUp={i > 0 ? () => set({ projects: move(content.projects, i, i - 1) }) : undefined}
              onDown={i < content.projects.length - 1 ? () => set({ projects: move(content.projects, i, i + 1) }) : undefined}
              onDelete={() => set({ projects: content.projects.filter((_, j) => j !== i) })}
            />
          </ItemCard>
        ))}
        <button
          type="button"
          style={smallButton}
          onClick={() =>
            set({
              projects: [
                ...content.projects,
                { id: newId("proj"), name: "New project", tagline: "", tech: [], status: "in development", visible: false },
              ],
            })
          }
        >
          + Add project
        </button>
      </Section>

      {/* Reading */}
      <Section title="Currently reading" hint="Shows in the Personal section.">
        {content.reading.map((r, i) => (
          <ItemCard key={r.id}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr", gap: 10 }}>
              <Field label="Title">
                <input style={inputStyle} value={r.title} onChange={(e) => setReading(i, { title: e.target.value })} />
              </Field>
              <Field label="Author">
                <input style={inputStyle} value={r.author} onChange={(e) => setReading(i, { author: e.target.value })} />
              </Field>
              <Field label="Note">
                <input style={inputStyle} value={r.note ?? ""} onChange={(e) => setReading(i, { note: e.target.value || undefined })} />
              </Field>
            </div>
            <RowActions onDelete={() => set({ reading: content.reading.filter((_, j) => j !== i) })} />
          </ItemCard>
        ))}
        <button
          type="button"
          style={smallButton}
          onClick={() => set({ reading: [...content.reading, { id: newId("read"), title: "", author: "" }] })}
        >
          + Add book
        </button>
      </Section>

      {/* Posts */}
      <Section title="Writing / posts" hint="Perspectives section. Tick 'coming soon' for placeholder cards.">
        {content.posts.map((p, i) => (
          <ItemCard key={p.id}>
            <Field label="Title">
              <input style={inputStyle} value={p.title} onChange={(e) => setPost(i, { title: e.target.value })} />
            </Field>
            <Field label="Excerpt">
              <textarea
                style={{ ...inputStyle, minHeight: 48, resize: "vertical" }}
                value={p.excerpt}
                onChange={(e) => setPost(i, { excerpt: e.target.value })}
              />
            </Field>
            <Field label="Body (optional, markdown-ish)">
              <textarea
                style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
                value={p.body ?? ""}
                onChange={(e) => setPost(i, { body: e.target.value || undefined })}
              />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
              <Field label="External link (optional)">
                <input style={inputStyle} value={p.link ?? ""} onChange={(e) => setPost(i, { link: e.target.value || undefined })} />
              </Field>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#c4c1b8", cursor: "pointer", paddingBottom: 10 }}>
                <input type="checkbox" checked={p.comingSoon ?? false} onChange={(e) => setPost(i, { comingSoon: e.target.checked })} />
                Coming soon
              </label>
            </div>
            <RowActions
              onUp={i > 0 ? () => set({ posts: move(content.posts, i, i - 1) }) : undefined}
              onDown={i < content.posts.length - 1 ? () => set({ posts: move(content.posts, i, i + 1) }) : undefined}
              onDelete={() => set({ posts: content.posts.filter((_, j) => j !== i) })}
            />
          </ItemCard>
        ))}
        <button
          type="button"
          style={smallButton}
          onClick={() => set({ posts: [...content.posts, { id: newId("post"), title: "", excerpt: "", comingSoon: true }] })}
        >
          + Add post
        </button>
      </Section>

      {/* Testimonials */}
      <Section title="Recommendations" hint="Shown on /work under 'What people say'.">
        {content.testimonials.map((t, i) => (
          <ItemCard key={t.id}>
            <Field label="Quote">
              <textarea
                style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
                value={t.quote}
                onChange={(e) => setTestimonial(i, { quote: e.target.value })}
              />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Name">
                <input style={inputStyle} value={t.name} onChange={(e) => setTestimonial(i, { name: e.target.value })} />
              </Field>
              <Field label="Role / relationship">
                <input style={inputStyle} value={t.role} onChange={(e) => setTestimonial(i, { role: e.target.value })} />
              </Field>
            </div>
            <RowActions onDelete={() => set({ testimonials: content.testimonials.filter((_, j) => j !== i) })} />
          </ItemCard>
        ))}
        <button
          type="button"
          style={smallButton}
          onClick={() => set({ testimonials: [...content.testimonials, { id: newId("rec"), quote: "", name: "", role: "" }] })}
        >
          + Add recommendation
        </button>
      </Section>

      {/* Backup */}
      <Section title="Backup" hint="Export the full content JSON, or paste/upload a backup to restore.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <button type="button" style={smallButton} onClick={handleExportCopy}>
            {copied ? "Copied ✓" : "Copy JSON"}
          </button>
          <button type="button" style={smallButton} onClick={handleExportDownload}>
            Download JSON
          </button>
          <button type="button" style={smallButton} onClick={() => fileInputRef.current?.click()}>
            Upload JSON…
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            style={{ display: "none" }}
          />
          <button
            type="button"
            style={{ ...smallButton, color: "#e24b4a", borderColor: "rgba(226,75,74,0.4)", marginLeft: "auto" }}
            onClick={() => {
              if (window.confirm("Reset all content to the defaults shipped in code?")) reset();
            }}
          >
            Reset to defaults
          </button>
        </div>
        <Field label="Paste JSON to import">
          <textarea
            style={{ ...inputStyle, minHeight: 72, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 11 }}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{"version":1, ...}'
          />
        </Field>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button type="button" style={smallButton} disabled={!importText.trim()} onClick={() => handleImport(importText)}>
            Import
          </button>
          {importStatus && (
            <span style={{ fontSize: 12, color: importStatus.startsWith("Failed") ? "#e24b4a" : "#5dcaa5" }}>
              {importStatus}
            </span>
          )}
        </div>
      </Section>
    </div>
  );
}
