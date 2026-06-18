/* eslint-disable @next/next/no-img-element */
import fs from "node:fs";
import path from "node:path";

function hasAvatar(): boolean {
  try {
    const p = path.join(process.cwd(), "public", "avatar.jpg");
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

export function Avatar({ size = 56 }: { size?: number }) {
  const exists = hasAvatar();

  if (exists) {
    return (
      <img
        src="/avatar.jpg"
        alt="Bailey King"
        width={size}
        height={size}
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
