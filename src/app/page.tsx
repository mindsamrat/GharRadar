"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MICRO_MARKETS, MicroMarket } from "@/data/mumbai";
import Sidebar from "@/components/Sidebar";
import {
  Search,
  IndianRupee,
  TrendingUp,
  Shield,
  Wind,
  Navigation,
  ShieldCheck,
} from "lucide-react";

// Leaflet must be loaded client-side only (no SSR)
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-[#0d0d18] flex items-center justify-center">
      <div className="text-gray-600 text-sm animate-pulse">Loading map...</div>
    </div>
  ),
});

type Overlay = "price" | "invest" | "safety" | "aqi";
type Filter = "all" | "premium" | "mid" | "affordable" | "growth";

const OVERLAY_OPTIONS: {
  key: Overlay;
  label: string;
  icon: typeof IndianRupee;
}[] = [
  { key: "price", label: "Price Map", icon: IndianRupee },
  { key: "invest", label: "Investment Score", icon: TrendingUp },
  { key: "safety", label: "Safety", icon: Shield },
  { key: "aqi", label: "Air Quality", icon: Wind },
];

const FILTER_OPTIONS: Filter[] = [
  "all",
  "premium",
  "mid",
  "affordable",
  "growth",
];

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<MicroMarket | null>(null);
  const [overlay, setOverlay] = useState<Overlay>("price");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<MicroMarket[]>([]);

  const filtered = useMemo(() => {
    let data = MICRO_MARKETS;
    if (filter === "premium")
      data = data.filter(
        (d) => d.type === "Premium" || d.type === "Ultra Premium"
      );
    else if (filter === "mid")
      data = data.filter((d) => d.type === "Mid-Range");
    else if (filter === "affordable")
      data = data.filter(
        (d) => d.type === "Affordable" || d.type === "Budget"
      );
    else if (filter === "growth")
      data = data.filter((d) => d.type === "Growth");

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

  return (
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <header
        className="border-b border-white/[0.06] px-4 py-3 sticky top-0 z-50 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(18,18,31,0.95) 100%)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #ff6d00, #ff1744)",
              }}
            >
              <Navigation size={18} color="#fff" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">GharRadar</span>
              <span className="text-[10px] text-orange-500 ml-2 bg-orange-500/15 px-2 py-0.5 rounded-full font-semibold">
                MUMBAI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/rera"
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition"
              style={{
                background: "rgba(0,230,118,0.12)",
                border: "1px solid rgba(0,230,118,0.4)",
                color: "#00e676",
              }}
            >
              <ShieldCheck size={14} /> Builder Track Record
            </Link>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-2.5 text-gray-600"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search area or zone..."
                className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-white text-xs w-48 outline-none focus:border-orange-500/40 transition placeholder:text-gray-600"
              />
            </div>
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareList([]);
              }}
              className="rounded-lg px-3.5 py-2 text-xs font-semibold transition"
              style={{
                background: compareMode
                  ? "rgba(0,230,118,0.15)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${compareMode ? "#00e676" : "rgba(255,255,255,0.1)"}`,
                color: compareMode ? "#00e676" : "#aaa",
              }}
            >
              {compareMode ? `Compare (${compareList.length}/3)` : "Compare"}
            </button>
          </div>
        </div>

        {/* Overlay + filter toggles */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {OVERLAY_OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => setOverlay(o.key)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition"
              style={{
                background:
                  overlay === o.key
                    ? "rgba(255,109,0,0.15)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${overlay === o.key ? "#ff6d00" : "rgba(255,255,255,0.08)"}`,
                color: overlay === o.key ? "#ff6d00" : "#888",
                fontWeight: overlay === o.key ? 600 : 400,
              }}
            >
              <o.icon size={12} /> {o.label}
            </button>
          ))}

          <div className="border-l border-white/[0.08] mx-1" />

          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full px-3 py-1.5 text-[11px] capitalize transition"
              style={{
                background:
                  filter === f ? "rgba(255,255,255,0.1)" : "transparent",
                border: `1px solid ${filter === f ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: filter === f ? "#fff" : "#666",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* MAP */}
        <div className="flex-1 relative">
          {/* Map legend */}
          <div className="absolute top-3 left-3 z-[1000] bg-[rgba(10,10,15,0.92)] border border-white/[0.08] rounded-xl p-3 text-[10px] backdrop-blur-sm">
            <div className="font-semibold mb-1.5 text-gray-400 uppercase tracking-wider text-[9px]">
              {overlay === "price"
                ? "₹ per sqft"
                : overlay === "invest"
                  ? "Investment Score"
                  : overlay === "safety"
                    ? "Safety Score"
                    : "AQI Index"}
            </div>
            {overlay === "price" &&
              [
                ["₹40K+", "#ff1744"],
                ["₹25K-40K", "#ff6d00"],
                ["₹18K-25K", "#ffd600"],
                ["₹13K-18K", "#76ff03"],
                ["₹9K-13K", "#00e676"],
                ["< ₹9K", "#00bfa5"],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-2 mb-0.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: c, boxShadow: `0 0 8px ${c}55` }}
                  />
                  <span className="text-gray-400">{l}</span>
                </div>
              ))}
            {overlay === "invest" &&
              [
                ["8.5+ Hot", "#00e676"],
                ["7.5-8.5 Good", "#76ff03"],
                ["6.5-7.5 OK", "#ffd600"],
                ["< 6.5 Low", "#ff6d00"],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-2 mb-0.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: c, boxShadow: `0 0 8px ${c}55` }}
                  />
                  <span className="text-gray-400">{l}</span>
                </div>
              ))}
            {overlay === "safety" &&
              [
                ["8+ Safe", "#00e676"],
                ["7-8 Good", "#76ff03"],
                ["6-7 Average", "#ffd600"],
                ["< 6 Risky", "#ff6d00"],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-2 mb-0.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: c, boxShadow: `0 0 8px ${c}55` }}
                  />
                  <span className="text-gray-400">{l}</span>
                </div>
              ))}
            {overlay === "aqi" &&
              [
                ["0-50 Good", "#00e676"],
                ["51-100 Moderate", "#ffd600"],
                ["101-150 Unhealthy*", "#ff6d00"],
                ["150+ Unhealthy", "#ff1744"],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-2 mb-0.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
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

        {/* SIDEBAR */}
        <div className="w-[380px] max-w-[400px] border-l border-white/[0.06] bg-white/[0.01] overflow-y-auto hidden lg:block">
          <Sidebar
            selectedArea={selectedArea}
            onClearSelection={() => setSelectedArea(null)}
            compareMode={compareMode}
            compareList={compareList}
            onAreaClick={handleAreaClick}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="px-5 py-2.5 border-t border-white/[0.06] flex justify-between items-center text-[10px] text-gray-600">
        <span>
          GharRadar v1.0 &bull; Data from IGR Maharashtra, CPCB, NCRB
        </span>
        <span>Kingdom of Massimo x Startup Ace</span>
      </footer>
    </div>
  );
}
