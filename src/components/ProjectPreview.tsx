"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
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
  // Serve captured images locally; protected sites need an admin-supplied screenshot.
  const savedPreview = url?.hostname === "moniqr.com" && url.pathname === "/"
    ? "/projects/moniqr.png" : undefined;
  const protectedSite = url && ["os.bkos.dev", "projects.bkos.dev"].includes(url.hostname);
  const source = project.previewImage || savedPreview || (!protectedSite && url
    ? `https://image.thum.io/get/noanimate/width/800/crop/750/${url.href}`
    : undefined);

  useEffect(() => {
    if (!source || loaded || failed) return;
    const timeout = window.setTimeout(() => setFailed(true), 20000);
    return () => window.clearTimeout(timeout);
  }, [source, loaded, failed]);

  return (
    <div className="rl-shot" style={{ aspectRatio }}>
      {source && !failed && (
        <img src={source} alt={`Webpage preview of ${project.name}`} loading="eager"
          decoding="async" referrerPolicy="no-referrer" data-loaded={loaded}
          onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      )}
      <span className="rl-shot-label">
        {url?.host.replace(/^www\./, "") || noLinkLabel}
        {failed || (protectedSite && !source) ? " · Preview unavailable" : source && !loaded ? " · Loading preview…" : ""}
      </span>
    </div>
  );
}
