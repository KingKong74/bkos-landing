import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import "./globals.css";
import "lenis/dist/lenis.css";

export const metadata: Metadata = {
  title: "Bailey King — accountant who codes",
  description:
    "Brisbane-based accountant moving into forensic work, CA ANZ candidate, and software developer. Building BK-OS and moniqr, self-hosted on my own infrastructure.",
  metadataBase: new URL("https://bkos.dev"),
  openGraph: {
    title: "Bailey King — accountant who codes",
    description:
      "Brisbane-based accountant moving into forensic work, CA ANZ candidate, and software developer. Building BK-OS and moniqr, self-hosted on my own infrastructure.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          ></script>
        )}
      </head>
      <body>
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
