"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { MICRO_MARKETS, MicroMarket } from "@/data/mumbai";
import Sidebar from "@/components/Sidebar";
import {
  Search,
  IndianRupee,
  TrendingUp,
  Shield,
  Wind,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[500px] w-full items-center justify-center bg-[#0b0b14]">
      <div className="animate-pulse text-sm text-gray-600">Loading map…</div>
    </div>
  ),
});

type Overlay = "price" | "invest" | "safety" | "aqi";
type Filter = "all" | "premium" | "mid" | "affordable" | "growth";

const OVERLAY_OPTIONS: { key: Overlay; label: string; icon: typeof IndianRupee }[] = [
  { key: "price", label: "Price Map", icon: IndianRupee },
  { key: "invest", label: "Investment", icon: TrendingUp },
  { key: "safety", label: "Safety", icon: Shield },
  { key: "aqi", label: "Air Quality", icon: Wind },
];

const FILTER_OPTIONS: Filter[] = ["all", "premium", "mid", "affordable", "growth"];

export function MapExplorer() {
  const [selectedArea, setSelectedArea] = useState<MicroMarket | null>(null);
  const [overlay, setOverlay] = useState<Overlay>("price");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<MicroMarket[]>([]);

  const filtered = useMemo(() => {
    let data = MICRO_MARKETS;
    if (filter === "premium")
      data = data.filter((d) => d.type === "Premium" || d.type === "Ultra Premium");
    else if (filter === "mid") data = data.filter((d) => d.type === "Mid-Range");
    else if (filter === "affordable")
      data = data.filter((d) => d.type === "Affordable" || d.type === "Budget");
    else if (filter === "growth") data = data.filter((d) => d.type === "Growth");

    if (search)
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.zone.toLowerCase().includes(search.toLowerCase())
      );
    return data;
  }, [filter, search]);

  const handleAreaClick = useCallback(
    (m: MicroMarket) => {
      if (compareMode) {
        setCompareList((prev) => {
          if (prev.find((p) => p.id === m.id))
            return prev.filter((p) => p.id !== m.id);
          if (prev.length >= 3) return prev;
          return [...prev, m];
        });
      } else {
        setSelectedArea(m);
      }
    },
    [compareMode]
  );

  const legendTitle =
    overlay === "price"
      ? "₹ per sqft"
      : overlay === "invest"
        ? "Investment Score"
        : overlay === "safety"
          ? "Safety Score"
          : "AQI Index";

  const legendItems: [string, string][] =
    overlay === "price"
      ? [
          ["₹40K+", "#ff1744"],
          ["₹25K–40K", "#ff6d00"],
          ["₹18K–25K", "#ffd600"],
          ["₹13K–18K", "#76ff03"],
          ["₹9K–13K", "#00e676"],
          ["< ₹9K", "#00bfa5"],
        ]
      : overlay === "invest"
        ? [
            ["8.5+ Hot", "#00e676"],
            ["7.5–8.5 Good", "#76ff03"],
            ["6.5–7.5 OK", "#ffd600"],
            ["< 6.5 Low", "#ff6d00"],
          ]
        : overlay === "safety"
          ? [
              ["8+ Safe", "#00e676"],
              ["7–8 Good", "#76ff03"],
              ["6–7 Average", "#ffd600"],
              ["< 6 Risky", "#ff6d00"],
            ]
          : [
              ["0–50 Good", "#00e676"],
              ["51–100 Moderate", "#ffd600"],
              ["101–150 Unhealthy*", "#ff6d00"],
              ["150+ Unhealthy", "#ff1744"],
            ];

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="border-b border-white/[0.06] bg-[var(--bg-elev)]/70 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[15px] font-bold text-white">
              Micro-market Map Explorer
            </h1>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Price · investment · safety · air quality across 25 Mumbai markets
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-2.5 text-gray-600"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search area or zone…"
                className="w-44 rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-white outline-none transition placeholder:text-gray-600 focus:border-[var(--accent)]/40"
              />
            </div>
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareList([]);
              }}
              className="rounded-lg px-3.5 py-2 text-xs font-semibold transition"
              style={{
                background: compareMode ? "rgba(0,230,118,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${compareMode ? "#00e676" : "rgba(255,255,255,0.1)"}`,
                color: compareMode ? "#00e676" : "#aaa",
              }}
            >
              {compareMode ? `Compare (${compareList.length}/3)` : "Compare"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {OVERLAY_OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => setOverlay(o.key)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition"
              style={{
                background: overlay === o.key ? "rgba(255,106,43,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${overlay === o.key ? "#ff6a2b" : "rgba(255,255,255,0.08)"}`,
                color: overlay === o.key ? "#ff6a2b" : "#888",
                fontWeight: overlay === o.key ? 600 : 400,
              }}
            >
              <o.icon size={12} /> {o.label}
            </button>
          ))}
          <div className="mx-1 border-l border-white/[0.08]" />
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full px-3 py-1.5 text-[11px] capitalize transition"
              style={{
                background: filter === f ? "rgba(255,255,255,0.1)" : "transparent",
                border: `1px solid ${filter === f ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: filter === f ? "#fff" : "#666",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map + sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1">
          <div className="absolute left-3 top-3 z-[1000] rounded-xl border border-white/[0.08] bg-[rgba(10,10,15,0.92)] p-3 text-[10px] backdrop-blur-sm">
            <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
              {legendTitle}
            </div>
            {legendItems.map(([l, c]) => (
              <div key={l} className="mb-0.5 flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: c, boxShadow: `0 0 8px ${c}55` }}
                />
                <span className="text-gray-400">{l}</span>
              </div>
            ))}
          </div>

          <MapView
            markets={filtered}
            overlay={overlay}
            selectedArea={selectedArea}
            compareMode={compareMode}
            compareList={compareList}
            onAreaClick={handleAreaClick}
          />
        </div>

        <div className="hidden w-[380px] max-w-[400px] overflow-y-auto border-l border-white/[0.06] bg-white/[0.01] lg:block">
          <Sidebar
            selectedArea={selectedArea}
            onClearSelection={() => setSelectedArea(null)}
            compareMode={compareMode}
            compareList={compareList}
            onAreaClick={handleAreaClick}
          />
        </div>
      </div>
    </div>
  );
}
