import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GharRadar — Real Estate Intelligence for Mumbai",
  description:
    "Know your neighborhood before you move. Property prices, safety, air quality, commute times and infrastructure data for Mumbai micro-markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-gray-200">
        {children}
      </body>
    </html>
  );
}
