"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export interface MediaItem {
  slot: string;
  label: string;
  accept: string;
  url: string | null;
  source: "upload" | "public" | null;
  name: string | null;
  size: number | null;
}

const HINT: Record<string, string> = {
  resume: "Powers the Resume PDF and Download resume buttons. PDF only.",
  avatar: "Headshot on the Resume tab. Square works best. Without one, your initials show.",
  hero: "Big image under the hero text. Wide (about 2:1). Without one, the drawn illustration shows.",
};

function kb(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}

export function AdminFiles({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(slot: string, init: RequestInit, url = "/api/admin/files") {
    setBusy(slot);
    setError(null);
    try {
      const res = await fetch(url, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  function upload(slot: string, file: File) {
    const form = new FormData();
    form.set("slot", slot);
    form.set("file", file);
    call(slot, { method: "POST", body: form });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((m) => (
        <div key={m.slot} className="card" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div className="rl-art" style={{ width: 72, height: 72, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {m.url && m.slot !== "resume" ? <img src={m.url} alt="" /> : <span className="mono mute" style={{ fontSize: 12 }}>{m.slot === "resume" ? "PDF" : "—"}</span>}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600 }}>{m.label}</div>
            <div className="mute" style={{ fontSize: 13 }}>{HINT[m.slot]}</div>
            <div className="mono" style={{ fontSize: 12, marginTop: 4, color: m.url ? "var(--pri)" : "var(--mute)" }}>
              {m.url ? (
                <>
                  {m.name}{m.size ? ` · ${kb(m.size)}` : ""}{" "}
                  <a href={m.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>view</a>
                </>
              ) : "Not set"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <label className="ad-btn" style={{ opacity: busy ? 0.5 : 1 }}>
              {busy === m.slot ? "Uploading…" : m.url ? "Replace" : "Upload"}
              <input type="file" accept={m.accept} hidden disabled={!!busy} onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(m.slot, f);
                e.target.value = "";
              }} />
            </label>
            {m.source === "upload" && (
              <button type="button" className="ad-btn danger" disabled={!!busy}
                onClick={() => { if (confirm(`Remove the uploaded ${m.label.toLowerCase()}?`)) call(m.slot, { method: "DELETE" }, `/api/admin/files?slot=${m.slot}`); }}>
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
      {error && <div className="mono" style={{ fontSize: 13, color: "var(--acc)" }}>{error}</div>}
      <div className="mute" style={{ fontSize: 13 }}>Uploads go live immediately. No Save needed. Max 15 MB.</div>
    </div>
  );
}
