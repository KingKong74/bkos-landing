"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Edit these to change what rotates
const ROLES = [
  "developer",
  "student",
  "builder",
  "traveller",
  "coffee snob",
  "tinkerer",
];

const INTERVAL_MS = 2400;

export function RotatingWord() {
  const [i, setI] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setI((x) => (x + 1) % ROLES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

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
          key={i}
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
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
