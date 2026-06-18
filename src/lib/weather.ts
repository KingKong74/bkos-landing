const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-27.47&longitude=153.03&current=temperature_2m,weather_code&timezone=Australia/Brisbane";

export interface Weather {
  temp: number | null;
  emoji: string;
  description: string;
}

const codeMap: Record<number, { emoji: string; desc: string }> = {
  0:  { emoji: "☀",  desc: "clear" },
  1:  { emoji: "🌤", desc: "mostly clear" },
  2:  { emoji: "⛅",  desc: "partly cloudy" },
  3:  { emoji: "☁",  desc: "overcast" },
  45: { emoji: "🌫", desc: "fog" },
  48: { emoji: "🌫", desc: "fog" },
  51: { emoji: "🌦", desc: "drizzle" },
  61: { emoji: "🌧", desc: "rain" },
  63: { emoji: "🌧", desc: "rain" },
  65: { emoji: "🌧", desc: "heavy rain" },
  80: { emoji: "🌦", desc: "showers" },
  95: { emoji: "⛈",  desc: "thunderstorm" },
};

export async function fetchBrisbaneWeather(): Promise<Weather> {
  try {
    const res = await fetch(WEATHER_URL, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("weather fetch failed");
    const data = await res.json();
    const temp = Math.round(data?.current?.temperature_2m ?? 0);
    const code = Number(data?.current?.weather_code ?? 0);
    const entry = codeMap[code] ?? { emoji: "•", desc: "" };
    return { temp, emoji: entry.emoji, description: entry.desc };
  } catch {
    return { temp: null, emoji: "", description: "" };
  }
}
