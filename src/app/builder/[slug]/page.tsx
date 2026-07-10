import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  CalendarDays,
} from "lucide-react";
import {
  BUILDERS,
  builderBySlug,
  projectsByBuilder,
  builderStats,
  type ProjectStatus,
} from "@/data/rera";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusDonut } from "@/components/charts/StatusDonut";
import { BuilderProjects } from "@/components/builder/BuilderProjects";

export function generateStaticParams() {
  return BUILDERS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = builderBySlug(slug);
  if (!b) return { title: "Developer not found" };
  return {
    title: `${b.name} — Track record & MahaRERA projects`,
    description: `${b.name}: ${b.onTimeDeliveryPct}% on-time delivery, ${b.deliveredSqftMn}M sq.ft delivered. Explore all MahaRERA-registered projects across ${b.cities.join(" & ")}.`,
  };
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = builderBySlug(slug);
  if (!b) notFound();

  const projects = projectsByBuilder(slug);
  const stats = builderStats(slug);

  const donutData: { status: ProjectStatus; count: number }[] = [
    { status: "Completed", count: stats.completed },
    { status: "Under Construction", count: stats.ongoing },
    { status: "New Launch", count: stats.launches },
    { status: "Lapsed", count: stats.lapsed },
  ];

  return (
    <>
      <SiteNav />
      <main className="min-h-dvh">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-white/[0.06] pt-24 pb-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid radial-fade opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[820px] max-w-[110vw] -translate-x-1/2 blur-[90px] opacity-40 glow-accent" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Back to search
            </Link>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[13px] text-[var(--fg-muted)]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1">
                    <CalendarDays size={12} /> Est. {b.founded}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1">
                    <MapPin size={12} /> {b.headquarters}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--amber)]/25 bg-[var(--amber)]/10 px-2.5 py-1 font-semibold text-[var(--amber)]">
                    <Star size={12} className="fill-current" /> {b.rating}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-bold text-white sm:text-[40px]">
                  {b.name}
                </h1>
                <p className="mt-2 max-w-2xl text-[15px] text-[var(--fg-muted)]">
                  {b.tagline} · Active in {b.cities.join(" & ")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.1] bg-[var(--bg-card)]/60 p-5">
                <StatusDonut data={donutData} />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi
              icon={<CheckCircle2 size={16} />}
              color="var(--green)"
              value={`${b.onTimeDeliveryPct}%`}
              label="On-time delivery"
            />
            <Kpi
              icon={<Clock size={16} />}
              color="var(--amber)"
              value={`${b.avgDelayMonths} mo`}
              label="Avg. delay"
            />
            <Kpi
              icon={<Building2 size={16} />}
              color="var(--accent)"
              value={`${b.deliveredSqftMn}M`}
              label="Sq.ft delivered"
            />
            <Kpi
              icon={<AlertTriangle size={16} />}
              color={b.reraComplaints > 30 ? "var(--red,#ff5252)" : "var(--fg)"}
              value={String(b.reraComplaints)}
              label="RERA complaints"
            />
          </div>

          {/* About */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <section className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/50 p-6">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                About the developer
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--fg)]">
                {b.description}
              </p>
            </section>
            <section className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/50 p-6">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                Portfolio snapshot
              </h2>
              <dl className="mt-3 divide-y divide-white/[0.06] text-[13.5px]">
                <Row k="Total projects tracked" v={String(stats.total)} />
                <Row k="Completed & delivered" v={String(stats.completed)} />
                <Row k="Under construction" v={String(stats.ongoing)} />
                <Row k="New launches" v={String(stats.launches)} />
                <Row
                  k="Lapsed registrations"
                  v={String(stats.lapsed)}
                  danger={stats.lapsed > 0}
                />
                <Row k="Avg. inventory booked" v={`${stats.avgBookedPct}%`} />
              </dl>
            </section>
          </div>

          {/* Projects */}
          <div className="mt-12">
            <h2 className="mb-5 text-xl font-bold text-white">
              MahaRERA projects ({projects.length})
            </h2>
            <BuilderProjects projects={projects} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Kpi({
  icon,
  color,
  value,
  label,
}: {
  icon: React.ReactNode;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/60 p-4">
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <div className="mt-1 text-[12px] text-[var(--fg-muted)]">{label}</div>
    </div>
  );
}

function Row({ k, v, danger }: { k: string; v: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-[var(--fg-muted)]">{k}</dt>
      <dd
        className="font-semibold"
        style={{ color: danger ? "#ff5252" : "#fff" }}
      >
        {v}
      </dd>
    </div>
  );
}
