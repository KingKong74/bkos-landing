import type { Metadata } from "next";
import "./globals.css";
import "./landing.css";

export const metadata: Metadata = {
  title: "Bailey King — accountant & systems analyst",
  description:
    "Accountant in Business Services Advisory and Systems Analyst at HMW Group, Brisbane. CA ANZ candidate. I redesign workflows and use AI to automate repetitive work.",
  metadataBase: new URL("https://bkos.dev"),
  openGraph: {
    title: "Bailey King — accountant & systems analyst",
    description:
      "Accountant in Business Services Advisory and Systems Analyst at HMW Group, Brisbane. CA ANZ candidate. I redesign workflows and use AI to automate repetitive work.",
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
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
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
        {children}
      </body>
    </html>
  );
}
