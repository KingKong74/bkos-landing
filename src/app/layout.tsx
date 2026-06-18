import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";
import "lenis/dist/lenis.css";

export const metadata: Metadata = {
  title: "Bailey King — bkos.dev",
  description: "Brisbane developer, CA ANZ student, perpetual builder.",
  metadataBase: new URL("https://bkos.dev"),
  openGraph: {
    title: "Bailey King — bkos.dev",
    description: "Brisbane developer, CA ANZ student, perpetual builder.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
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
        {children}
      </body>
    </html>
  );
}
