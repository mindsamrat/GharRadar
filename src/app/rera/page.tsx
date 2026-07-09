"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import type { BuilderSearchHit } from "@/lib/rera/source";
import type { ReraProject } from "@/lib/rera/types";
import { TRUST_COLORS } from "@/lib/rera/trust";
import { STATUS_COLOR } from "@/lib/rera/format";

interface SearchResponse {
  query: string;
  builders: BuilderSearchHit[];
  projects: ReraProject[];
}

export default function ReraSearchPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rera/search?q=${encodeURIComponent(q)}`);
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load (browse all builders) + debounced search on typing.
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => run(query), 250);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query, run]);

  const builders = data?.builders ?? [];
  const projects = data?.projects ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header
        className="border-b border-white/[0.06] px-4 py-3 sticky top-0 z-50 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(18,18,31,0.95) 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition shrink-0"
          >
            <ArrowLeft size={14} /> Map
          </Link>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00e676,#00bfa5)" }}
            >
              <ShieldCheck size={16} color="#04120b" />
            </div>
            <span className="font-bold">Builder Track Record</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full font-semibold">
              MahaRERA
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Check any builder before you buy
        </h1>
        <p className="text-gray-500 mt-2 text-sm max-w-2xl">
          Search by <span className="text-gray-300">builder name</span>,{" "}
          <span className="text-gray-300">project name</span>, or{" "}
          <span className="text-gray-300">MahaRERA number</span>. See every
          registered project in one place — completed, ongoing, delayed — with a
          Delivery Trust Score built from real timelines and complaints.
        </p>

        {/* Search box */}
        <div className="relative mt-6 max-w-2xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Lodha, Godrej Hillside, or P51900047880"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-sm outline-none focus:border-emerald-500/50 transition placeholder:text-gray-600"
          />
          {loading && (
            <Loader2
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 animate-spin"
            />
          )}
        </div>

        {/* Quick chips */}
        <div className="flex gap-2 flex-wrap mt-3">
          {["Lodha", "Godrej", "Kolte-Patil", "Oberoi", "Nirmal"].map((c) => (
            <button
              key={c}
              onClick={() => setQuery(c)}
              className="text-[11px] text-gray-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 transition"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {query ? `Builders matching "${query}"` : "All builders"}
            </h2>
            <span className="text-[11px] text-gray-600">
              {builders.length} builder{builders.length !== 1 ? "s" : ""}
            </span>
          </div>

          {!loading && builders.length === 0 && (
            <div className="text-center py-16 text-gray-600 text-sm">
              No builders or projects found for “{query}”.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {builders.map((hit) => (
              <BuilderCard key={hit.builder.slug} hit={hit} />
            ))}
          </div>

          {/* Direct project matches (when the query hit a specific project) */}
          {query && projects.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Matching projects
              </h2>
              <div className="grid gap-2">
                {projects.slice(0, 8).map((p) => (
                  <Link
                    key={p.regNo}
                    href={`/rera/builder/${p.builderSlug}`}
                    className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg px-4 py-3 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin size={11} /> {p.locality}, {p.city}
                        <span className="text-gray-700">•</span>
                        <span className="font-mono">{p.regNo}</span>
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ml-3"
                      style={{
                        color: STATUS_COLOR[p.status],
                        background: `${STATUS_COLOR[p.status]}1a`,
                      }}
                    >
                      {p.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function BuilderCard({ hit }: { hit: BuilderSearchHit }) {
  const { builder, projectCount, score, matchedProject } = hit;
  const grade =
    score >= 85 ? "A+" : score >= 72 ? "A" : score >= 58 ? "B" : score >= 40 ? "C" : "D";
  const color = TRUST_COLORS[grade];

  return (
    <Link
      href={`/rera/builder/${builder.slug}`}
      className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-xl p-4 transition flex items-center gap-4"
    >
      {/* Score dial */}
      <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
        <svg width="52" height="52" className="-rotate-90">
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle
            cx="26"
            cy="26"
            r="22"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 138.2} 138.2`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold leading-none" style={{ color }}>
            {score}
          </span>
          <span className="text-[8px] text-gray-500 mt-0.5">{grade}</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-semibold text-sm truncate group-hover:text-white flex items-center gap-1.5">
          <Building2 size={13} className="text-gray-500 shrink-0" />
          {builder.name}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          {builder.headquarters} • since {builder.since} • {projectCount} project
          {projectCount !== 1 ? "s" : ""}
        </div>
        {matchedProject && (
          <div className="text-[10px] text-emerald-400/80 mt-1 truncate">
            ↳ matched: {matchedProject}
          </div>
        )}
      </div>
    </Link>
  );
}
