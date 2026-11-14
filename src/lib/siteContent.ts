"use client";

// ─── Site content store ──────────────────────────────────────────────────────
//
// Single source of truth for everything editable via the hidden admin panel:
// featured projects, availability status, reading list, posts, hero words,
// testimonials, and section visibility.
//
// Storage: localStorage for now — edits are per-browser and won't survive a
// different device. Defaults below render on the server and for every visitor;
// localStorage overrides apply after hydration.
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
  learned?: string; // "what I learned building this" — shown on hover
  visible: boolean;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  body?: string;
  link?: string;
  comingSoon?: boolean;
}

export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  note?: string; // e.g. "for CA Risk & Tech" or "re-read"
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export interface SectionVisibility {
  projects: boolean;
  stack: boolean;
  perspectives: boolean;
  photos: boolean;
  personal: boolean;
  vibe: boolean;
}

export interface SiteContent {
  version: 1;
  availability: string;
  heroWords: string[];
  projects: Project[];
  reading: ReadingItem[];
  posts: Post[];
  testimonials: Testimonial[];
  sections: SectionVisibility;
}

export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  availability: "open to opportunities",
  heroWords: ["accountant", "developer", "builder", "investor", "tinkerer", "CA candidate"],
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
      learned:
        "Context-switching is the real cost of side projects. Building a tool that remembers where I left off made every other project faster.",
      visible: true,
    },
  ],
  reading: [
    { id: "r1", title: "Financial Shenanigans", author: "Howard Schilit", note: "forensic classics" },
    { id: "r2", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" },
    { id: "r3", title: "The Psychology of Money", author: "Morgan Housel", note: "re-read" },
  ],
  posts: [
    {
      id: "p1",
      title: "On learning to code as an accountant",
      excerpt:
        "Why the debit-credit mental model maps surprisingly well onto software, and what I'd tell an accountant starting from zero.",
      comingSoon: true,
    },
    {
      id: "p2",
      title: "Building your own tools",
      excerpt:
        "Self-hosting isn't about saving money on SaaS. It's about understanding what your tools actually do.",
      comingSoon: true,
    },
    {
      id: "p3",
      title: "Forensic accounting meets software",
      excerpt:
        "Tracing transactions through a general ledger and tracing bugs through a codebase are the same skill.",
      comingSoon: true,
    },
  ],
  testimonials: [],
  sections: {
    projects: true,
    stack: true,
    perspectives: true,
    photos: true,
    personal: true,
    vibe: true,
  },
};

const STORAGE_KEY = "bkos-site-content-v1";

/** Merge stored content over defaults so new fields added in code still appear. */
function mergeContent(stored: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_CONTENT,
    ...stored,
    version: 1,
    sections: { ...DEFAULT_CONTENT.sections, ...(stored.sections ?? {}) },
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
