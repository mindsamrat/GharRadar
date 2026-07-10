import Link from "next/link";
import { MapPin, Building2, Calendar, TrendingUp } from "lucide-react";
import { type ReraProject } from "@/data/rera";
import { StatusBadge } from "@/components/ui/badge";
import { formatINR, cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
}: {
  project: ReraProject;
  className?: string;
}) {
  const p = project;
  return (
    <Link
      href={`/project/${p.rera}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_20px_50px_-20px_rgba(255,106,43,0.35)]",
        className
      )}
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle,rgba(255,106,43,0.28),transparent 70%)" }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-white group-hover:text-[var(--accent)]">
            {p.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--fg-muted)]">
            <Building2 size={12} /> {p.builder}
          </p>
        </div>
        <StatusBadge status={p.status} />
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)]">
        <MapPin size={12} className="text-[var(--accent)]" /> {p.locality},{" "}
        {p.city}
        <span className="text-[var(--fg-dim)]">·</span>
        {p.propertyType}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Mini label="Ticket size" value={`${formatINR(p.priceMin)}+`} />
        <Mini label="₹/sq.ft" value={`₹${(p.pricePerSqft / 1000).toFixed(1)}K`} />
      </div>

      {/* booking progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--fg-dim)]">Inventory booked</span>
          <span className="font-semibold text-white">{p.bookedPct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ff6a2b,#ff2d6f)]"
            style={{ width: `${p.bookedPct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-[var(--fg-muted)]">
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {p.status === "Completed" && p.completedOn
            ? `Delivered ${new Date(p.completedOn).getFullYear()}`
            : `Poss. ${new Date(p.proposedCompletion).getFullYear()}`}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--accent)]/80">
          <TrendingUp size={11} />
          {p.rera}
        </span>
      </div>
    </Link>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-[var(--fg-dim)]">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold text-white">{value}</div>
    </div>
  );
}
