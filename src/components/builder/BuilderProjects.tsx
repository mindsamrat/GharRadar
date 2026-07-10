"use client";

import * as React from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { type ReraProject, type ProjectStatus } from "@/data/rera";
import { cn } from "@/lib/utils";

const TABS: (ProjectStatus | "All")[] = [
  "All",
  "Completed",
  "Under Construction",
  "New Launch",
  "Lapsed",
];

export function BuilderProjects({ projects }: { projects: ReraProject[] }) {
  const [tab, setTab] = React.useState<ProjectStatus | "All">("All");

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    for (const p of projects) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [projects]);

  const shown =
    tab === "All" ? projects : projects.filter((p) => p.status === tab);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const n = counts[t] ?? 0;
          if (t !== "All" && n === 0) return null;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
                tab === t
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/12 text-[var(--accent)]"
                  : "border-white/10 text-[var(--fg-muted)] hover:text-white"
              )}
            >
              {t} <span className="opacity-60">({n})</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.rera} project={p} />
        ))}
      </div>
    </div>
  );
}
