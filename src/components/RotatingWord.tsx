"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteContent } from "@/lib/siteContent";

// Words come from the content store — editable in the admin panel
const INTERVAL_MS = 2400;

export function RotatingWord() {
  const { heroWords } = useSiteContent();
  const [i, setI] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || heroWords.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % heroWords.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion, heroWords.length]);

  const word = heroWords[i % heroWords.length] ?? "accountant";

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "baseline",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-block",
            padding: "2px 12px",
            background: "rgba(245,166,35,0.13)",
            color: "#f5a623",
            borderRadius: 6,
            border: "1px solid rgba(245,166,35,0.35)",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
