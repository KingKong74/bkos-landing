"use client";

import { useEffect, useRef, useState } from "react";
import { AdminLoginModal } from "./AdminLoginModal";

const CLICKS_REQUIRED = 5;
const RESET_MS = 2000;

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function bump() {
    const next = count + 1;
    setCount(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (next >= CLICKS_REQUIRED) {
      setCount(0);
      setOpen(true);
      return;
    }
    timerRef.current = setTimeout(() => setCount(0), RESET_MS);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <>
      <button
        type="button"
        onClick={bump}
        aria-label="Profile"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
        style={{ background: "transparent", border: "none", padding: 0, cursor: "default" }}
      >
        {children}
      </button>
      {open && <AdminLoginModal onClose={() => setOpen(false)} />}
    </>
  );
}
