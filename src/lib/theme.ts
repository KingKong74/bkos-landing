"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const THEME_KEY = "bkos-theme";
const PAGE_BG: Record<Theme, string> = { light: "#FFFFFF", dark: "#15181D" };

/** Light/dark theme shared by the landing page and admin, remembered per browser. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch { /* storage unavailable */ }
  }, []);

  // Keep the page chrome (overscroll, scrollbars, form controls) in step
  useEffect(() => {
    document.documentElement.style.background = PAGE_BG[theme];
    document.body.style.background = PAGE_BG[theme];
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      try { window.localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return [theme, toggle];
}
