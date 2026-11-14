"use client";

// ─── Site content store ──────────────────────────────────────────────────────
//
// Single source of truth for what the hidden admin panel edits: the
// availability line and the projects list.
//
// TODO(postgres): move this to Postgres via BK-OS — either fs_nodes (one JSON
// document at /sites/bkos-landing/content.json) or a dedicated site_content
// table keyed by `version`. Swap loadContent/saveContent for fetch calls to a
// /api/content route and delete the localStorage layer.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  tech: string[];
  status: string; // "in development" | "live" | "shipped" | "paused" | free text
  link?: string;
  learned?: string; // "what I learned building this" — shown on the Projects tab
  visible: boolean;
}

export interface SiteContent {
  version: 2;
  availability: string;
  projects: Project[];
}

export const DEFAULT_CONTENT: SiteContent = {
  version: 2,
  availability: "open to opportunities",
  projects: [
    {
      id: "bk-os",
      name: "BK-OS",
      tagline: "A self-hosted personal OS in the browser — auth, files, notes, apps.",
      tech: ["Next.js 16", "Postgres", "Docker Swarm"],
      status: "in development",
      link: "https://os.bkos.dev",
      learned:
        "Running my own auth and storage taught me more about sessions, cookies and failure modes than any tutorial. Also: backups are a feature, not a chore.",
      visible: true,
    },
    {
      id: "moniqr",
      name: "moniqr",
      tagline: "Accounting for Australian sole traders. Bank feeds, journals, BAS.",
      tech: ["React", "Supabase", "Basiq"],
      status: "in development",
      link: "https://moniqr.com",
      learned:
        "Bank feed data is messy in ways textbooks don't cover. Building double-entry from scratch made me a sharper accountant, not just a better dev.",
      visible: true,
    },
    {
      id: "stack",
      name: "Stack",
      tagline: "A self-hosted command centre for my side projects: resume cards, activity feeds, bug tracking and roadmaps.",
      tech: ["React", "Express", "Postgres", "Claude Code hooks"],
      status: "in development",
      link: "https://projects.bkos.dev",
      learned:
        "Context-switching is the real cost of side projects. Building a tool that remembers where I left off made every other project faster.",
      visible: true,
    },
  ],
};

// v2: content was slimmed to availability + projects; old v1 overrides are ignored.
const STORAGE_KEY = "bkos-site-content-v2";

/** Merge stored content over defaults so new fields added in code still appear. */
function mergeContent(stored: Partial<SiteContent>): SiteContent {
  return {
    version: 2,
    availability: stored.availability ?? DEFAULT_CONTENT.availability,
    projects: Array.isArray(stored.projects) ? stored.projects : DEFAULT_CONTENT.projects,
  };
}

export function loadContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    return mergeContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content: SiteContent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent("bkos-content-updated"));
  } catch {
    /* storage full or unavailable — edits stay in memory */
  }
}

export function resetContent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("bkos-content-updated"));
  } catch {
    /* ignore */
  }
}

export function exportContent(): string {
  return JSON.stringify(loadContent(), null, 2);
}

export function importContent(json: string): SiteContent {
  const parsed = JSON.parse(json) as Partial<SiteContent>;
  if (typeof parsed !== "object" || parsed === null) throw new Error("Not a JSON object");
  const merged = mergeContent(parsed);
  saveContent(merged);
  return merged;
}

/**
 * Read-only hook for public sections. Renders defaults on SSR / first paint,
 * then applies localStorage overrides after mount (avoids hydration mismatch).
 */
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    const refresh = () => setContent(loadContent());
    refresh();
    window.addEventListener("bkos-content-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("bkos-content-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return content;
}

/** Read-write hook for the admin editor. */
export function useEditableContent(): [SiteContent, (next: SiteContent) => void, () => void] {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    setContent(loadContent());
  }, []);

  const update = useCallback((next: SiteContent) => {
    setContent(next);
    saveContent(next);
  }, []);

  const reset = useCallback(() => {
    resetContent();
    setContent(DEFAULT_CONTENT);
  }, []);

  return [content, update, reset];
}

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
