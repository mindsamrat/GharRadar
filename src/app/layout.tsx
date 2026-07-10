import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const SITE_URL = "https://gharradar.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GharRadar — MahaRERA Intelligence for Mumbai & Pune",
    template: "%s · GharRadar",
  },
  description:
    "Search any builder or MahaRERA number and instantly see completed, ongoing and lapsed projects — registration status, delivery track record, complaints and pricing. Real estate intelligence for Mumbai & Pune homebuyers.",
  keywords: [
    "MahaRERA",
    "RERA Maharashtra",
    "Mumbai real estate",
    "Pune real estate",
    "builder track record",
    "property intelligence",
    "RERA number search",
  ],
  authors: [{ name: "GharRadar" }],
  openGraph: {
    title: "GharRadar — MahaRERA Intelligence for Mumbai & Pune",
    description:
      "Type a builder name or MahaRERA number and get the full project picture — before you buy.",
    url: SITE_URL,
    siteName: "GharRadar",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "GharRadar — MahaRERA Intelligence",
    description:
      "Search any builder or MahaRERA number and see their full project track record.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07070c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
