"use client";

import { useEffect, useRef, useState } from "react";

// Rendered inside the .rl theme wrapper, so it picks up the landing tokens.
export function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Invalid password");
      setPassword("");
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  const disabled = loading || !password;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(8,15,27,.55)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16,
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label="Admin sign in"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          width: 340, maxWidth: "100%", background: "var(--surf)", color: "var(--ink)",
          border: "1px solid var(--line)", borderRadius: 16, padding: 24,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 18 }}>Admin</div>
        <div style={{ fontSize: 14, color: "var(--mute)", marginTop: 4 }}>Enter the admin password.</div>
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          style={{
            width: "100%", marginTop: 16, padding: "10px 12px", border: "1px solid var(--line)",
            borderRadius: 8, background: "var(--bg)", color: "var(--ink)", font: "15px var(--sans)", outline: "none",
          }}
        />
        {error && <div style={{ color: "var(--acc)", fontSize: 13, marginTop: 8 }}>{error}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 14px", border: "1px solid var(--line)", borderRadius: 999, background: "transparent",
              color: "var(--ink)", font: "500 14px var(--sans)", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={disabled}
            style={{
              padding: "8px 16px", border: 0, borderRadius: 999, background: "var(--pri)", color: "var(--onpri)",
              font: "600 14px var(--sans)", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
