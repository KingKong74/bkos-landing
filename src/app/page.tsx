import fs from "node:fs";
import path from "node:path";
import { ResumeLanding } from "@/components/ResumeLanding";
import { fetchBrisbaneWeather } from "@/lib/weather";
import { getContent } from "@/lib/contentStore";

// Read saved admin content on every request so edits show immediately.
export const dynamic = "force-dynamic";

function publicFile(name: string) {
  return fs.existsSync(path.join(process.cwd(), "public", name));
}

export default async function HomePage() {
  const weather = await fetchBrisbaneWeather();

  return (
    <ResumeLanding
      content={getContent()}
      weather={weather}
      hasResumePdf={publicFile("resume.pdf")}
      hasHeroImage={publicFile("hero.jpg")}
      hasAvatar={publicFile("avatar.jpg")}
    />
  );
}
