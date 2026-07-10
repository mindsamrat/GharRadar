"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, HardHat, X } from "lucide-react";
import {
  PROJECTS,
  BUILDERS,
  searchAll,
  type ReraProject,
  type ProjectStatus,
  type City,
} from "@/data/rera";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

const STATUSES: ProjectStatus[] = [
  "Completed",
  "Under Construction",
  "New Launch",
  "Lapsed",
];
const CITIES: (City | "All")[] = ["All", "Mumbai", "Pune"];
type Sort = "relevance" | "price-desc" | "price-asc" | "possession";

export function SearchExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = React.useState(params.get("q") ?? "");
  const [city, setCity] = React.useState<City | "All">(
    (params.get("city") as City) ?? "All"
  );
  const [status, setStatus] = React.useState<ProjectStatus | "All">(
    (params.get("status") as ProjectStatus) ?? "All"
  );
  const [sort, setSort] = React.useState<Sort>("relevance");

  // keep URL in sync (shallow) for shareable filters
  React.useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (city !== "All") sp.set("city", city);
    if (status !== "All") sp.set("status", status);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [q, city, status, pathname, router]);

  const builderMatches = React.useMemo(() => {
    if (!q.trim()) return [];
    return searchAll(q)
      .filter((r) => r.kind === "builder")
      .map((r) => r.item)
      .slice(0, 4) as typeof BUILDERS;
  }, [q]);

  const projects = React.useMemo(() => {
    let list: ReraProject[];
    if (q.trim()) {
      list = searchAll(q)
        .filter((r) => r.kind === "project")
        .map((r) => r.item as ReraProject);
    } else {
      list = [...PROJECTS];
    }
    if (city !== "All") list = list.filter((p) => p.city === city);
    if (status !== "All") list = list.filter((p) => p.status === status);

    switch (sort) {
      case "price-desc":
        list = [...list].sort((a, b) => b.priceMin - a.priceMin);
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.priceMin - b.priceMin);
        break;
      case "possession":
        list = [...list].sort(
          (a, b) =>
            +new Date(a.proposedCompletion) - +new Date(b.proposedCompletion)
        );
        break;
    }
    return list;
  }, [q, city, status, sort]);

  const activeFilters = (city !== "All" ? 1 : 0) + (status !== "All" ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Explore MahaRERA projects
        </h1>
        <p className="mt-2 text-[15px] text-[var(--fg-muted)]">
          Search {PROJECTS.length} registered projects across{" "}
          {BUILDERS.length} developers in Mumbai &amp; Pune.
        </p>
      </div>

      {/* Search + filters bar */}
      <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-white/[0.06] bg-[rgba(7,7,12,0.85)] px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:border-white/[0.08] sm:px-5">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <Search size={18} className="shrink-0 text-[var(--fg-dim)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Builder, project name, MahaRERA number or locality…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[var(--fg-dim)]"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="text-[var(--fg-dim)] hover:text-white"
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* City */}
          <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
                  city === c
                    ? "bg-white/[0.1] text-white"
                    : "text-[var(--fg-muted)] hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(status === s ? "All" : s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                  status === s
                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/12 text-[var(--accent)]"
                    : "border-white/10 text-[var(--fg-muted)] hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[var(--fg-dim)]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-white/10 bg-[var(--bg-elev)] px-3 py-2 text-[12px] text-white outline-none"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="possession">Possession: Soonest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Builder matches */}
      {builderMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
            Developers
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {builderMatches.map((b) => (
              <Link
                key={b.slug}
                href={`/builder/${b.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[var(--bg-card)]/60 p-4 transition-colors hover:border-[var(--violet)]/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--violet)]/12 text-[var(--violet)]">
                  <HardHat size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white group-hover:text-[var(--violet)]">
                    {b.name}
                  </span>
                  <span className="block text-[11px] text-[var(--fg-muted)]">
                    {b.cities.join(", ")} · ⭐ {b.rating}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
          {projects.length} project{projects.length === 1 ? "" : "s"}
          {activeFilters > 0 && " · filtered"}
        </h2>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/40 py-16 text-center">
          <p className="text-[var(--fg-muted)]">
            No projects match your filters.
          </p>
          <button
            onClick={() => {
              setQ("");
              setCity("All");
              setStatus("All");
            }}
            className="mt-3 text-sm font-semibold text-[var(--accent)]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.rera} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
