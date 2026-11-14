import type { Metadata } from "next";
import { ResumeLanding } from "@/components/ResumeLanding";
import { fetchBrisbaneWeather } from "@/lib/weather";
import { getContent } from "@/lib/contentStore";
import { allMedia } from "@/lib/media";

// Read saved admin content on every request so edits show immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = getContent();
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    openGraph: { title: copy.metaTitle, description: copy.metaDescription, type: "website" },
  };
}

export default async function HomePage() {
  const weather = await fetchBrisbaneWeather();
  return <ResumeLanding content={getContent()} weather={weather} media={allMedia()} />;
}
