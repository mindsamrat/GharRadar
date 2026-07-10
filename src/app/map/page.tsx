import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { MapExplorer } from "@/components/map/MapExplorer";

export const metadata: Metadata = {
  title: "Micro-market Map Explorer — Mumbai",
  description:
    "Interactive Mumbai map with price heatmaps, investment scores, safety and air-quality overlays across 25 micro-markets.",
};

export default function MapPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-16">
        <MapExplorer />
      </main>
    </>
  );
}
