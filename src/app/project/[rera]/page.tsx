import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  CalendarClock,
  CalendarCheck,
  AlertTriangle,
  Scale,
  FileCheck2,
  Landmark,
  ArrowUpRight,
  ShieldCheck,
  Ruler,
  Layers3,
  Home,
  BadgeCheck,
} from "lucide-react";
import {
  PROJECTS,
  projectByRera,
  builderBySlug,
  projectsByBuilder,
  STATUS_META,
} from "@/data/rera";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { CopyButton } from "@/components/CopyButton";
import { formatINR } from "@/lib/utils";
import { LiveProjectLoader } from "@/components/project/LiveProjectLoader";

// Pre-render the curated projects; resolve any other registration number live.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ rera: p.rera }));
}

// Allow registration numbers outside generateStaticParams to render on demand.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rera: string }>;
}): Promise<Metadata> {
  const { rera } = await params;
  const p = projectByRera(rera);
  if (!p) {
    return {
      title: `MahaRERA ${rera} — Live project lookup`,
      description: `Live MahaRERA registry details for registration ${rera}.`,
    };
  }
  return {
    title: `${p.name} — ${p.builder} · MahaRERA ${p.rera}`,
    description: `${p.name} by ${p.builder} in ${p.locality}, ${p.city}. Status: ${p.status}. ${p.configs.join(", ")}. MahaRERA registration ${p.rera}.`,
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ rera: string }>;
}) {
  const { rera } = await params;
  const p = projectByRera(rera);

  // Unknown to the curated set → resolve live from MahaRERA (client-side, via
  // the dynamic /api/rera route) so this page stays static for curated slugs.
  if (!p) {
    return <LiveProjectLoader rera={rera} />;
  }

  const builder = builderBySlug(p.builderSlug);
  const related = projectsByBuilder(p.builderSlug)
    .filter((x) => x.rera !== p.rera)
    .slice(0, 3);
  const meta = STATUS_META[p.status];
  const fundedPct = Math.min(
    100,
    Math.round((p.financials.receivedCr / p.financials.estimatedCostCr) * 100)
  );
  const riskFlags = [p.complaints > 5, p.reraExtended, p.litigation, p.status === "Lapsed"].filter(Boolean).length;

  return (
    <>
      <SiteNav />
      <main className="min-h-dvh">
        {/* Header band */}
        <div className="relative overflow-hidden border-b border-white/[0.06] pt-24 pb-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid radial-fade opacity-40" />
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[900px] max-w-[110vw] -translate-x-1/2 blur-[90px] opacity-40"
            style={{ background: `radial-gradient(circle, ${meta.color}33, transparent 70%)` }}
          />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> All projects
            </Link>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusBadge status={p.status} />
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[var(--fg-muted)]">
                    {p.propertyType}
                  </span>
                  {riskFlags === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--green)]/25 bg-[var(--green)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--green)]">
                      <BadgeCheck size={12} /> Clean record
                    </span>
                  )}
                </div>
                <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-[40px]">
                  {p.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-[var(--fg-muted)]">
                  <Link
                    href={`/builder/${p.builderSlug}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-[var(--accent)]"
                  >
                    <Building2 size={14} /> {p.builder}
                  </Link>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-[var(--accent)]" />
                    {p.locality}, {p.city} · {p.region}
                  </span>
                </div>
              </div>

              {/* RERA number card */}
              <div className="shrink-0 rounded-2xl border border-white/[0.1] bg-[var(--bg-card)]/70 px-5 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
                  MahaRERA Registration
                </div>
                <div className="mt-1.5 font-mono text-lg font-bold tracking-tight text-[var(--accent)]">
                  {p.rera}
                </div>
                <div className="mt-2 flex items-center gap-4 text-[11px] text-[var(--fg-muted)]">
                  <CopyButton value={p.rera} className="hover:text-white" />
                  <a
                    href="https://maharera.maharashtra.gov.in/registered-project-search"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    Verify on MahaRERA <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {/* Headline stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeadStat
              icon={<Home size={16} />}
              label="Ticket size"
              value={`${formatINR(p.priceMin)} – ${formatINR(p.priceMax)}`}
            />
            <HeadStat
              icon={<Ruler size={16} />}
              label="Carpet area"
              value={`${p.carpetAreaMin}–${p.carpetAreaMax} ft²`}
            />
            <HeadStat
              icon={<Landmark size={16} />}
              label="Avg. rate"
              value={`₹${p.pricePerSqft.toLocaleString("en-IN")}/ft²`}
            />
            <HeadStat
              icon={<Layers3 size={16} />}
              label="Configuration"
              value={p.configs.join(" · ")}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Timeline */}
              <Panel title="Registration & delivery timeline" icon={<CalendarClock size={16} />}>
                <div className="relative pl-6">
                  <span className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-px bg-white/10" />
                  <TimelineRow
                    color="var(--violet)"
                    title="Registered with MahaRERA"
                    date={fmtDate(p.registeredOn)}
                    done
                  />
                  <TimelineRow
                    color={meta.color}
                    title={
                      p.status === "Completed"
                        ? "RERA declared completion"
                        : "RERA proposed completion"
                    }
                    date={fmtDate(p.proposedCompletion)}
                    done={p.status === "Completed"}
                  />
                  {p.completedOn ? (
                    <TimelineRow
                      color="var(--green)"
                      title="Completion / OC received"
                      date={fmtDate(p.completedOn)}
                      done
                      last
                    />
                  ) : (
                    <TimelineRow
                      color="var(--fg-dim)"
                      title={
                        p.status === "Lapsed"
                          ? "Registration lapsed — not delivered on time"
                          : "Awaiting completion certificate"
                      }
                      date="Pending"
                      last
                    />
                  )}
                </div>
              </Panel>

              {/* Compliance & risk */}
              <Panel title="Compliance & risk signals" icon={<ShieldCheck size={16} />}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <RiskTile
                    icon={<AlertTriangle size={15} />}
                    label="Complaints"
                    value={String(p.complaints)}
                    danger={p.complaints > 5}
                  />
                  <RiskTile
                    icon={<CalendarCheck size={15} />}
                    label="RERA extended"
                    value={p.reraExtended ? "Yes" : "No"}
                    danger={p.reraExtended}
                  />
                  <RiskTile
                    icon={<Scale size={15} />}
                    label="Litigation"
                    value={p.litigation ? "Yes" : "None"}
                    danger={p.litigation}
                  />
                  <RiskTile
                    icon={<FileCheck2 size={15} />}
                    label="Status"
                    value={p.status === "Lapsed" ? "Lapsed" : "Active"}
                    danger={p.status === "Lapsed"}
                  />
                </div>
                <p className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                  {riskFlags === 0 ? (
                    <>
                      <span className="font-semibold text-[var(--green)]">
                        Low risk.
                      </span>{" "}
                      No open complaints, no timeline extensions and no litigation
                      on record — a clean MahaRERA profile.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-[var(--amber)]">
                        {riskFlags} signal{riskFlags > 1 ? "s" : ""} to review.
                      </span>{" "}
                      Check the extension history and any complaints on the
                      MahaRERA portal before booking.
                    </>
                  )}
                </p>
              </Panel>

              {/* Amenities */}
              <Panel title="Amenities & features" icon={<Home size={16} />}>
                <div className="flex flex-wrap gap-2">
                  {p.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-[var(--fg-muted)]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </Panel>
            </div>

            {/* RIGHT sidebar */}
            <div className="space-y-6">
              {/* Quick facts */}
              <Panel title="Project at a glance" icon={<Layers3 size={16} />}>
                <dl className="divide-y divide-white/[0.06] text-[13.5px]">
                  <Fact k="Towers / wings" v={String(p.towers)} />
                  <Fact k="Total units" v={p.totalUnits.toLocaleString("en-IN")} />
                  <Fact k="Land parcel" v={`${p.landAreaAcres} acres`} />
                  <Fact k="Inventory booked" v={`${p.bookedPct}%`} />
                  <Fact
                    k="Registered on"
                    v={fmtDate(p.registeredOn)}
                  />
                </dl>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--fg-dim)]">Sales momentum</span>
                    <span className="font-semibold text-white">
                      {p.bookedPct}% booked
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#ff6a2b,#ff2d6f)]"
                      style={{ width: `${p.bookedPct}%` }}
                    />
                  </div>
                </div>
              </Panel>

              {/* Financials */}
              <Panel title="Project financials" icon={<Landmark size={16} />}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-[10px] uppercase tracking-wide text-[var(--fg-dim)]">
                      Est. project cost
                    </div>
                    <div className="mt-1 text-lg font-bold text-white">
                      ₹{p.financials.estimatedCostCr.toLocaleString("en-IN")} Cr
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-[10px] uppercase tracking-wide text-[var(--fg-dim)]">
                      Amount received
                    </div>
                    <div className="mt-1 text-lg font-bold text-[var(--green)]">
                      ₹{p.financials.receivedCr.toLocaleString("en-IN")} Cr
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--fg-dim)]">Funding progress</span>
                    <span className="font-semibold text-white">{fundedPct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#40c4ff,#00e676)]"
                      style={{ width: `${fundedPct}%` }}
                    />
                  </div>
                </div>
              </Panel>

              {/* Banks */}
              <Panel title="Home-loan approved by" icon={<FileCheck2 size={16} />}>
                <div className="flex flex-wrap gap-2">
                  {p.bankApproved.map((b) => (
                    <span
                      key={b}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] font-medium text-[var(--fg)]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </Panel>

              {/* Builder mini */}
              {builder && (
                <Link
                  href={`/builder/${builder.slug}`}
                  className="group block rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/60 p-5 transition-colors hover:border-[var(--violet)]/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
                      Developer
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-[var(--fg-dim)] group-hover:text-[var(--violet)]"
                    />
                  </div>
                  <div className="mt-2 text-[15px] font-bold text-white">
                    {builder.name}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <MiniKV k="On-time" v={`${builder.onTimeDeliveryPct}%`} />
                    <MiniKV k="Delivered" v={`${builder.deliveredSqftMn}M ft²`} />
                    <MiniKV k="Rating" v={`⭐ ${builder.rating}`} />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-5 text-xl font-bold text-white">
                More from {p.builder}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <ProjectCard key={r.rera} project={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/* ---- local presentational bits ---- */
function HeadStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/60 p-4">
      <div className="flex items-center gap-1.5 text-[var(--accent)]">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
          {label}
        </span>
      </div>
      <div className="mt-2 text-[15px] font-bold text-white">{value}</div>
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/50 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        <span className="text-[var(--accent)]">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineRow({
  color,
  title,
  date,
  done,
  last,
}: {
  color: string;
  title: string;
  date: string;
  done?: boolean;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "pb-6"}>
      <span
        className="absolute -left-[1px] mt-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2"
        style={{
          borderColor: color,
          background: done ? color : "var(--bg-card)",
        }}
      />
      <div className="text-[14px] font-semibold text-white">{title}</div>
      <div className="mt-0.5 text-[12.5px] text-[var(--fg-muted)]">{date}</div>
    </div>
  );
}

function RiskTile({
  icon,
  label,
  value,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: danger ? "rgba(255,82,82,0.3)" : "rgba(255,255,255,0.07)",
        background: danger ? "rgba(255,82,82,0.06)" : "rgba(255,255,255,0.02)",
      }}
    >
      <div
        className="flex items-center gap-1.5"
        style={{ color: danger ? "#ff5252" : "var(--fg-dim)" }}
      >
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div
        className="mt-1.5 text-[15px] font-bold"
        style={{ color: danger ? "#ff5252" : "#fff" }}
      >
        {value}
      </div>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-[var(--fg-muted)]">{k}</dt>
      <dd className="font-semibold text-white">{v}</dd>
    </div>
  );
}

function MiniKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] py-2">
      <div className="text-[13px] font-bold text-white">{v}</div>
      <div className="text-[10px] text-[var(--fg-dim)]">{k}</div>
    </div>
  );
}
