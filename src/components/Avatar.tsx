"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export function Avatar({ size = 56 }: { size?: number }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        aria-label="Bailey King"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#f5a623",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #0f0e0c",
          boxShadow: "0 0 0 1px #3a3935",
          color: "#0f0e0c",
          fontSize: size * 0.34,
          fontWeight: 500,
          letterSpacing: "0.02em",
          fontFamily: "var(--font-sans)",
        }}
      >
        BK
      </div>
    );
  }

  return (
    <img
      src="/avatar.jpg"
      alt="Bailey King"
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #0f0e0c",
        boxShadow: "0 0 0 1px #3a3935",
        display: "block",
      }}
    />
  );
}
