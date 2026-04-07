import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
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
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-gray-200">
        {children}
      </body>
    </html>
  );
}
