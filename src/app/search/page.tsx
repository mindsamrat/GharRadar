import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchExplorer } from "@/components/search/SearchExplorer";

export const metadata: Metadata = {
  title: "Explore MahaRERA Projects — Mumbai & Pune",
  description:
    "Search and filter registered MahaRERA projects by builder, status, city and price across Mumbai and Pune.",
};

export default function SearchPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-dvh">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-6 pt-32 text-[var(--fg-muted)]">
              Loading projects…
            </div>
          }
        >
          <SearchExplorer />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
