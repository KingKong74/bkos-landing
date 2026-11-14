"use client";

import { useTheme } from "@/lib/theme";

/** Themed frame for /admin: same tokens, header and light/dark toggle as the public site. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="rl" data-th={theme}>
      <header className="rl-head">
        <div className="rl-head-in" style={{ gridTemplateColumns: "1fr auto", gridTemplateAreas: '"brand right"' }}>
          <a href="/" className="rl-brand" style={{ textDecoration: "none" }}>
            <span className="rl-logo">BK</span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>bkos.dev</span>
            <span className="mono mute" style={{ fontSize: 13 }}>/ admin</span>
          </a>
          <div className="rl-right">
            <button type="button" className="rl-pill" onClick={toggleTheme}>{theme === "light" ? "Dark" : "Light"}</button>
            <form action="/api/admin/logout" method="POST" style={{ margin: 0 }}>
              <button type="submit" className="rl-pill strong">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
