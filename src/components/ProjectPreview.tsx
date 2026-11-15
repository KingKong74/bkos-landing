"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { Project } from "@/lib/content";

export function ProjectPreview({ project, noLinkLabel, aspectRatio = "16 / 10" }: {
  project: Project;
  noLinkLabel: string;
  aspectRatio?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  let url: URL | undefined;
  try {
    const parsed = new URL(project.link ?? "");
    if (["https:", "http:"].includes(parsed.protocol)) url = parsed;
  } catch { /* Projects without a public URL keep their placeholder. */ }
  const source = project.previewImage || (url
    ? `https://image.thum.io/get/noanimate/width/800/crop/750/${url.href}`
    : undefined);

  return (
    <div className="rl-shot" style={{ aspectRatio }}>
      {source && !failed && (
        <img src={source} alt={`Webpage preview of ${project.name}`} loading="lazy"
          decoding="async" referrerPolicy="no-referrer" data-loaded={loaded}
          onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      )}
      <span className="rl-shot-label">
        {url?.host.replace(/^www\./, "") || noLinkLabel}
        {failed ? " · Preview unavailable" : source && !loaded ? " · Loading preview…" : ""}
      </span>
    </div>
  );
}
