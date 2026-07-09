import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";
import { reraSource } from "@/lib/rera/source";
import { TRUST_COLORS, projectDelayMonths } from "@/lib/rera/trust";
import { STATUS_COLOR, fmtMonthYear, delayLabel } from "@/lib/rera/format";
import type { ReraProject } from "@/lib/rera/types";

export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await reraSource.getBuilderProfile(slug);
  if (!profile) notFound();

  const { builder, projects, trust } = profile;
  const color = TRUST_COLORS[trust.grade];

  const buckets: { key: ReraProject["status"]; icon: typeof Clock }[] = [
    { key: "Completed", icon: CheckCircle2 },
    { key: "Ongoing", icon: Clock },
    { key: "Delayed", icon: AlertTriangle },
    { key: "Lapsed", icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header
        className="border-b border-white/[0.06] px-4 py-3 sticky top-0 z-50 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(18,18,31,0.95) 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link
            href="/rera"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Search
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" /> Track Record
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Builder header + trust score */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-wider">
              <Building2 size={13} /> {builder.promoterType} • HQ {builder.headquarters}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1.5">{builder.name}</h1>
            {builder.aka && builder.aka.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Also known as {builder.aka.join(", ")} • operating since {builder.since}
              </p>
            )}
          </div>

          {/* Trust dial */}
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
            <div className="relative" style={{ width: 88, height: 88 }}>
              <svg width="88" height="88" className="-rotate-90">
                <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="44"
                  cy="44"
                  r="38"
                  fill="none"
                  stroke={color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(trust.score / 100) * 238.8} 238.8`}
                  style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold leading-none" style={{ color }}>
                  {trust.score}
                </span>
                <span className="text-[9px] text-gray-500 mt-0.5">/ 100</span>
              </div>
            </div>
            <div>
              <div
                className="text-lg font-bold leading-tight"
                style={{ color }}
              >
                {trust.grade} · {trust.label}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">Delivery Trust Score</div>
              <div className="text-[10px] text-gray-600 mt-1.5 max-w-[180px]">
                Built from promised-vs-actual timelines, delays, lapsed
                registrations & complaints.
              </div>
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {buckets.map(({ key, icon: Icon }) => {
            const n = projects.filter((p) => p.status === key || (key === "Ongoing" && p.status === "New")).length;
            return (
              <div
                key={key}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Icon size={13} style={{ color: STATUS_COLOR[key] }} /> {key}
                </div>
                <div className="text-2xl font-bold mt-1">{n}</div>
              </div>
            );
          })}
        </div>

        {/* Why this score */}
        <div className="mt-6 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs mb-3">
            <Metric label="Avg. delay" value={`${trust.avgDelayMonths} mo`} />
            <Metric label="On-time delivery" value={`${Math.round(trust.onTimeRate * 100)}%`} />
            <Metric label="Total projects" value={String(trust.totalProjects)} />
            <Metric
              label="Complaints"
              value={String(trust.totalComplaints)}
              warn={trust.totalComplaints > 20}
            />
          </div>
          <div className="border-t border-white/[0.06] pt-3">
            <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
              Why this score
            </div>
            <ul className="space-y-1.5">
              {trust.reasons.map((r, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                  <span className="mt-0.5" style={{ color }}>
                    ›
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* All projects in one place */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            All projects
            <span className="text-[11px] text-gray-600 font-normal">
              ({projects.length}) — every MahaRERA registration, one place
            </span>
          </h2>
          <div className="space-y-2.5">
            {projects.map((p) => (
              <ProjectRow key={p.regNo} p={p} />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-700 mt-8 leading-relaxed">
          Source: MahaRERA public disclosures (demonstration dataset). Trust Score
          is GharRadar&apos;s own computation, not an official MahaRERA rating.
          Verify registration numbers on maharera.maharashtra.gov.in before any
          transaction.
        </p>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</div>
      <div className={`text-base font-bold ${warn ? "text-orange-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function ProjectRow({ p }: { p: ReraProject }) {
  const delay = projectDelayMonths(p);
  const sColor = STATUS_COLOR[p.status];
  const promised = fmtMonthYear(p.proposedCompletion);
  const settled = p.actualCompletion ?? p.revisedCompletion;

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
            {p.name}
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ color: sColor, background: `${sColor}1a` }}
            >
              {p.status}
            </span>
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1 flex-wrap">
            <MapPin size={11} /> {p.locality}, {p.district}
            <span className="text-gray-700">•</span>
            {p.projectType}
            <span className="text-gray-700">•</span>
            <span className="font-mono text-gray-400">{p.regNo}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-gray-300">{p.priceRange}</div>
          <div className="text-[10px] text-gray-600">{p.totalUnits} units · {p.towers} towers</div>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="mt-3 flex items-center gap-3 flex-wrap text-[11px]">
        <span className="text-gray-500">
          Promised <span className="text-gray-300">{promised}</span>
        </span>
        {settled && (
          <>
            <span className="text-gray-700">→</span>
            <span className="text-gray-500">
              {p.actualCompletion ? "Delivered" : "Revised to"}{" "}
              <span className="text-gray-300">{fmtMonthYear(settled)}</span>
            </span>
          </>
        )}
        <span
          className="ml-auto font-semibold px-2 py-0.5 rounded-full"
          style={{
            color: delay <= 0 ? "#00e676" : delay < 12 ? "#ffd600" : "#ff6d00",
            background:
              delay <= 0
                ? "rgba(0,230,118,0.12)"
                : delay < 12
                  ? "rgba(255,214,0,0.12)"
                  : "rgba(255,109,0,0.12)",
          }}
        >
          {delayLabel(delay)}
        </span>
      </div>

      {/* Progress + flags */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${p.progressPercent}%`, background: sColor }}
          />
        </div>
        <span className="text-[10px] text-gray-500 w-9 text-right">{p.progressPercent}%</span>
        {p.complaints > 0 && (
          <span className="text-[10px] text-orange-400/90 flex items-center gap-1">
            <MessageSquareWarning size={11} /> {p.complaints}
          </span>
        )}
      </div>
    </div>
  );
}
