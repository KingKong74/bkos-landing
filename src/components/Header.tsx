import { Avatar } from "./Avatar";
import { AdminGate } from "./AdminGate";
import { fetchBrisbaneWeather } from "@/lib/weather";

export async function Header() {
  const weather = await fetchBrisbaneWeather();
  return (
    <header style={{ padding: "0 16px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#7a7770",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, background: "#5dcaa5", borderRadius: "50%", display: "inline-block" }}></span>
            bkos.dev
          </span>
          <span>·</span>
          <span>Brisbane, AU</span>
          {weather.temp !== null && (
            <>
              <span>·</span>
              <span>{weather.temp}°C {weather.emoji}</span>
            </>
          )}
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 38px)",
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fafaf9",
          }}
        >
          Hi, I&apos;m Bailey.
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#a8a59c",
            margin: "8px 0 0",
            maxWidth: "34rem",
            lineHeight: 1.55,
          }}
        >
          Brisbane developer, CA ANZ student, perpetual builder. This is where I keep my stuff.
        </p>
      </div>
      <AdminGate>
        <Avatar size={56} />
      </AdminGate>
    </header>
  );
}
