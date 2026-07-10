import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Building2,
  Home,
  IndianRupee,
  CheckCircle2,
  HardHat,
  Train,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { StatusDonut } from "@/components/charts/StatusDonut";
import { PriceBars } from "@/components/charts/PriceBars";
import {
  PROJECTS,
  BUILDERS,
  platformStats,
  builderStats,
  type ProjectStatus,
} from "@/data/rera";
import { INFRA_PROJECTS, MICRO_MARKETS } from "@/data/mumbai";

export const metadata: Metadata = {
  title: "Market Insights — Mumbai & Pune Real Estate",
  description:
    "City-level trends, builder league tables, pricing analysis and the infrastructure moving Mumbai & Pune property prices.",
};

export default function InsightsPage() {
  const s = platformStats();

  const donut: { status: ProjectStatus; count: number }[] = (
    ["Completed", "Under Construction", "New Launch", "Lapsed"] as ProjectStatus[]
  ).map((status) => ({
    status,
    count: PROJECTS.filter((p) => p.status === status).length,
  }));

  // Top localities by ₹/sqft (residential), spread across both cities
  const priceRows = [...PROJECTS]
    .filter((p) => p.propertyType === "Residential")
    .sort((a, b) => b.pricePerSqft - a.pricePerSqft)
    .filter(
      (p, i, arr) => arr.findIndex((x) => x.locality === p.locality) === i
    )
    .slice(0, 9)
    .map((p) => ({ label: p.locality, value: p.pricePerSqft, city: p.city }));

  // Builder league table
  const league = BUILDERS.map((b) => ({ b, st: builderStats(b.slug) }))
    .sort((a, b) => b.b.onTimeDeliveryPct - a.b.onTimeDeliveryPct)
    .slice(0, 8);

  const growth = MICRO_MARKETS.filter((m) => m.type === "Growth").sort(
    (a, b) => b.investScore - a.investScore
  );

  return (
    <>
      <SiteNav />
      <main className="min-h-dvh">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-white/[0.06] pt-28 pb-12">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid radial-fade opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[820px] max-w-[110vw] -translate-x-1/2 blur-[90px] opacity-40 glow-accent" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              03 · Market Insights
            </span>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              The market, read from the data
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-muted)]">
              Aggregated MahaRERA registrations, pricing and the infrastructure
              reshaping Mumbai &amp; Pune — the trends behind the headlines.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          {/* KPI band */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Kpi icon={<Building2 size={15} />} label="Projects">
              <CountUp to={s.projects} />+
            </Kpi>
            <Kpi icon={<HardHat size={15} />} label="Developers">
              <CountUp to={s.builders} />
            </Kpi>
            <Kpi icon={<Home size={15} />} label="Units tracked">
              <CountUp to={s.units} />
            </Kpi>
            <Kpi icon={<IndianRupee size={15} />} label="Investment (Cr)">
              ₹<CountUp to={s.investmentCr} />
            </Kpi>
            <Kpi icon={<CheckCircle2 size={15} />} label="Completed">
              <CountUp to={s.completed} />
            </Kpi>
            <Kpi icon={<TrendingUp size={15} />} label="Ongoing">
              <CountUp to={s.ongoing} />
            </Kpi>
          </div>

          {/* Charts */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Panel title="Project status mix" sub="Across all tracked registrations">
                <div className="pt-2">
                  <StatusDonut data={donut} />
                </div>
              </Panel>
            </Reveal>
            <Reveal delay={80}>
              <Panel
                title="Priciest micro-markets"
                sub="Avg. ₹ per sq.ft · residential"
              >
                <PriceBars data={priceRows} />
              </Panel>
            </Reveal>
          </div>

          {/* Builder league */}
          <Reveal className="mt-10">
            <Panel
              title="Developer league table"
              sub="Ranked by on-time delivery record"
            >
              <div className="-mx-2 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--fg-dim)]">
                      <th className="px-3 py-2 font-semibold">#</th>
                      <th className="px-3 py-2 font-semibold">Developer</th>
                      <th className="px-3 py-2 text-right font-semibold">
                        On-time
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Avg delay
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Delivered
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Projects
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {league.map(({ b, st }, i) => (
                      <tr
                        key={b.slug}
                        className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-3 py-3 font-mono text-[var(--fg-dim)]">
                          {i + 1}
                        </td>
                        <td className="px-3 py-3">
                          <Link
                            href={`/builder/${b.slug}`}
                            className="group inline-flex items-center gap-1.5 font-semibold text-white hover:text-[var(--accent)]"
                          >
                            {b.name}
                            <ArrowUpRight
                              size={13}
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                            />
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span
                            className="font-semibold"
                            style={{
                              color:
                                b.onTimeDeliveryPct >= 88
                                  ? "#00e676"
                                  : b.onTimeDeliveryPct >= 84
                                    ? "#ffb300"
                                    : "#ff5252",
                            }}
                          >
                            {b.onTimeDeliveryPct}%
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right text-[var(--fg-muted)]">
                          {b.avgDelayMonths} mo
                        </td>
                        <td className="px-3 py-3 text-right text-[var(--fg-muted)]">
                          {b.deliveredSqftMn}M ft²
                        </td>
                        <td className="px-3 py-3 text-right text-[var(--fg-muted)]">
                          {st.total}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="inline-flex items-center gap-1 font-semibold text-[var(--amber)]">
                            <Star size={11} className="fill-current" />
                            {b.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </Reveal>

          {/* Infra + growth */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <Panel
                title="Infrastructure moving prices"
                sub="Metro, coastal road, airport & harbour link"
              >
                <ul className="space-y-3">
                  {INFRA_PROJECTS.map((p) => (
                    <li
                      key={p.name}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cyan)]/12 text-[var(--cyan)]">
                            <Train size={15} />
                          </span>
                          <div>
                            <div className="text-[14px] font-semibold text-white">
                              {p.name}
                            </div>
                            <div className="text-[11.5px] text-[var(--fg-muted)]">
                              {p.route}
                            </div>
                          </div>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                          style={{
                            background: p.status.includes("Open")
                              ? "rgba(0,230,118,0.12)"
                              : "rgba(255,179,0,0.12)",
                            color: p.status.includes("Open")
                              ? "#00e676"
                              : "#ffb300",
                          }}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="mt-2 text-[12.5px] text-[var(--fg-muted)]">
                        {p.impact}
                      </p>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>

            <Reveal delay={80}>
              <Panel
                title="Growth corridors"
                sub="Highest investment-score micro-markets"
              >
                <ul className="space-y-2.5">
                  {growth.map((m, i) => (
                    <li
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--green)]/12 font-mono text-[13px] font-bold text-[var(--green)]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-semibold text-white">
                          {m.name}
                        </div>
                        <div className="text-[11.5px] text-[var(--fg-muted)]">
                          {m.zone} · ₹{(m.pricePerSqft / 1000).toFixed(1)}K/ft²
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[15px] font-bold text-[var(--green)]">
                          {m.investScore}
                        </div>
                        <div className="text-[10px] text-[var(--fg-dim)]">
                          +{m.priceChange}% YoY
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/map"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)]"
                >
                  Explore on the map <ArrowUpRight size={14} />
                </Link>
              </Panel>
            </Reveal>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Kpi({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/60 p-4">
      <div className="flex items-center gap-1.5 text-[var(--accent)]">{icon}</div>
      <div className="mt-2 text-xl font-bold tabular-nums text-white">
        {children}
      </div>
      <div className="mt-0.5 text-[11px] text-[var(--fg-muted)]">{label}</div>
    </div>
  );
}

function Panel({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="h-full rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/50 p-6">
      <div className="mb-5">
        <h2 className="text-[15px] font-bold text-white">{title}</h2>
        {sub && (
          <p className="mt-0.5 text-[12px] text-[var(--fg-muted)]">{sub}</p>
        )}
      </div>
      {children}
    </section>
  );
}
