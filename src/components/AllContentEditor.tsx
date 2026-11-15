"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content";

type Field = { path: (string | number)[]; label: string; value: string | boolean };
const words = (key: string) => key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
const titles: Record<string, string> = {
  copy: "Headings, navigation, buttons & footer", sections: "Section visibility",
  intro: "Home introduction", about: "About me", practices: "What I do cards",
  steps: "How I work", roles: "Experience", caProgram: "CA qualification",
  caModules: "CA subjects", skillGroups: "Skill groups", resumeChips: "Resume badges",
};

function fields(value: unknown, path: Field["path"] = [], label = ""): Field[] {
  if (typeof value === "string" || typeof value === "boolean") return [{ path, label, value }];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => {
    if (key === "id") return [];
    const index = Array.isArray(value) ? Number(key) : key;
    const name = typeof index === "number"
      ? `${index + 1}${child && typeof child === "object" ? ` · ${child.name || child.title || child.org || child.domain || child.label || "Item"}` : ""}`
      : words(key);
    return fields(child, [...path, index], label ? `${label} / ${name}` : name);
  });
}

export function AllContentEditor({ content, onChange }: { content: SiteContent; onChange: (content: SiteContent) => void }) {
  const [query, setQuery] = useState("");
  function update(path: Field["path"], value: Field["value"]) {
    const next = structuredClone(content);
    let target: any = next;
    for (const key of path.slice(0, -1)) target = target[key];
    target[path[path.length - 1]] = value;
    onChange(next);
  }
  const search = query.trim().toLowerCase();
  const groups = Object.entries(content).map(([key, value]) => ({
    title: titles[key] || words(key),
    items: fields(value, [key]).filter((field) => !search || `${titles[key] || words(key)} ${field.label} ${field.value}`.toLowerCase().includes(search)),
  })).filter((group) => group.items.length);
  return (
    <>
      <label className="ad-field">
        <span>Find any text or setting</span>
        <input className="ad-input" type="search" placeholder="Search wording, headings, projects, roles…" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p className="mute" style={{ margin: 0 }}>Every text field and visibility setting is here. Use the page tabs to add, remove or reorder items.</p>
      {!groups.length && <p role="status">No matching content. Try searching for a word shown on the site.</p>}
      {groups.map((group) => (
        <section className="card" style={{ padding: 20 }} key={group.title}>
          <h2 style={{ fontSize: 18, margin: "0 0 16px" }}>{group.title}</h2>
          <div className="ad-grid">
            {group.items.map((field) => typeof field.value === "boolean" ? (
              <label className="ad-check" key={field.path.join(".")}>
                <input type="checkbox" checked={field.value} onChange={(event) => update(field.path, event.target.checked)} />
                {field.label}
              </label>
            ) : (
              <label className="ad-field" style={{ gridColumn: "1 / -1" }} key={field.path.join(".")}>
                <span>{field.label || group.title}</span>
                <textarea className="ad-input" rows={field.value.length > 120 ? 4 : 2} value={field.value} onChange={(event) => update(field.path, event.target.value)} />
              </label>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
