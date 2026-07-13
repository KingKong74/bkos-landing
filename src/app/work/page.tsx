import type { Metadata } from "next";
import { WorkPage } from "@/components/WorkPage";

export const metadata: Metadata = {
  title: "Work — Bailey King",
  description:
    "Experience, CA ANZ progress, notable engagements and skills. Forensic-track accountant and software developer in Brisbane.",
};

export default function Work() {
  return <WorkPage />;
}
