"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/#perspectives", label: "Perspectives" },
  { href: "/#connect", label: "Connect" },
];

export function Nav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href;
  }

  return (
    <motion.nav
      aria-label="Primary"
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "14px 16px 0",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 8px",
          borderRadius: 999,
          background: scrolled ? "rgba(15,14,12,0.72)" : "rgba(15,14,12,0.4)",
          border: `1px solid ${scrolled ? "#26241f" : "rgba(38,36,31,0.5)"}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {LINKS.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.03em",
                padding: "6px 14px",
                borderRadius: 999,
                color: active ? "#f5a623" : "#a8a59c",
                background: active ? "rgba(245,166,35,0.1)" : "transparent",
                textDecoration: "none",
                transition: "color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = "#f4f4f1";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.color = "#a8a59c";
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
