import fs from "node:fs";
import path from "node:path";
import { ResumeLanding } from "@/components/ResumeLanding";
import { fetchBrisbaneWeather } from "@/lib/weather";
import "./landing.css";

function publicFile(name: string) {
  return fs.existsSync(path.join(process.cwd(), "public", name));
}

export default async function HomePage() {
  const weather = await fetchBrisbaneWeather();

  return (
    <ResumeLanding
      weather={weather}
      hasResumePdf={publicFile("resume.pdf")}
      hasHeroImage={publicFile("hero.jpg")}
      hasAvatar={publicFile("avatar.jpg")}
    />
  );
}
