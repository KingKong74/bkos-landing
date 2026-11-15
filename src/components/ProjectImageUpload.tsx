"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export function ProjectImageUpload({ value, onChange, onBusyChange }: { value?: string; onChange: (url: string | undefined) => void; onBusyChange: (busy: boolean) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file: File) {
    setBusy(true); onBusyChange(true); setError("");
    try {
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/admin/project-images", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); onBusyChange(false); }
  }
  return <div style={{ gridColumn: "1 / -1" }}>
    {value && <img src={value} alt="Selected project screenshot" style={{ display: "block", width: "100%", maxWidth: 360, maxHeight: 220, objectFit: "contain", marginBottom: 12 }} />}
    <label className="ad-btn">{busy ? "Uploading…" : "Upload project screenshot"}<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file); event.target.value = ""; }} /></label>{" "}
    {value && <button type="button" className="ad-btn" disabled={busy} onClick={() => onChange(undefined)}>Clear screenshot</button>}
    <p className="mute" style={{ fontSize: 13 }}>Upload an image or enter a URL above. Save & publish to apply it to the project.</p>
    {error && <p role="alert">{error}</p>}
  </div>;
}
