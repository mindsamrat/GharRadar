import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/data/rera";

export function FeaturedProjects() {
  // A spread across statuses & cities for the showcase
  const featured = [
    PROJECTS.find((p) => p.rera === "P51900012115"), // Three Sixty West (completed)
    PROJECTS.find((p) => p.rera === "P52100027629"), // Life Republic (UC)
    PROJECTS.find((p) => p.rera === "P51800046612"), // Godrej Reserve (launch)
    PROJECTS.find((p) => p.rera === "P51700041020"), // Runwal Gardens (lapsed)
    PROJECTS.find((p) => p.rera === "P52100044310"), // Gera World of Joy
    PROJECTS.find((p) => p.rera === "P51800029874"), // Piramal Revanta
  ].filter(Boolean) as typeof PROJECTS;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            Sample the data
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Featured registrations
          </h2>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fg-muted)] transition-colors hover:text-white"
        >
          Browse all {PROJECTS.length} projects <ArrowRight size={15} />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <Reveal key={p.rera} delay={i * 60}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
