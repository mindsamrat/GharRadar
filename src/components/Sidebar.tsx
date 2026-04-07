"use client";

import {
  MicroMarket,
  Project,
  UPCOMING_PROJECTS,
  INFRA_PROJECTS,
  MICRO_MARKETS,
  getPriceColor,
  getInvestColor,
  getSafetyColor,
  getAqiColor,
  getAqiLabel,
  getFloodColor,
  formatPrice,
  generatePriceTrend,
} from "@/data/mumbai";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  MapPin,
  TrendingUp,
  Shield,
  Wind,
  Train,
  Building2,
  Plus,
  X,
  ChevronDown,
  Star,
  IndianRupee,
} from "lucide-react";

interface SidebarProps {
  selectedArea: MicroMarket | null;
  onClearSelection: () => void;
  compareMode: boolean;
  compareList: MicroMarket[];
  onAreaClick: (m: MicroMarket) => void;
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 flex-1 min-w-[130px]">
      <div className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon size={13} color={color || "#888"} />}
        <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono">
          {label}
        </span>
      </div>
      <div
        className="text-[22px] font-bold"
        style={{ color: color || "#fff" }}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Sidebar({
  selectedArea,
  onClearSelection,
  compareMode,
  compareList,
  onAreaClick,
}: SidebarProps) {
  const [showProjects, setShowProjects] = useState(false);
  const [showInfra, setShowInfra] = useState(false);
  const [tab, setTab] = useState<"overview" | "trends" | "projects">("overview");
  const [addingProject, setAddingProject] = useState(false);
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: "",
    area: "",
    builder: "",
    priceRange: "",
    completion: "",
    type: "Mid-Range",
  });

  const topInvest = useMemo(
    () => [...MICRO_MARKETS].sort((a, b) => b.investScore - a.investScore).slice(0, 5),
    []
  );
  const topYield = useMemo(
    () => [...MICRO_MARKETS].sort((a, b) => b.rentYield - a.rentYield).slice(0, 5),
    []
  );

  const allProjects = [...UPCOMING_PROJECTS, ...customProjects];

  const addCustomProject = () => {
    if (newProject.name && newProject.area) {
      setCustomProjects((prev) => [
        ...prev,
        {
          ...newProject,
          id: 100 + prev.length,
          rera: "Pending",
          status: "Announced",
        },
      ]);
      setNewProject({ name: "", area: "", builder: "", priceRange: "", completion: "", type: "Mid-Range" });
      setAddingProject(false);
    }
  };

  const priceDistribution = useMemo(
    () => [
      { range: "< 10K", count: MICRO_MARKETS.filter((m) => m.pricePerSqft < 10000).length, fill: "#00bfa5" },
      { range: "10-15K", count: MICRO_MARKETS.filter((m) => m.pricePerSqft >= 10000 && m.pricePerSqft < 15000).length, fill: "#00e676" },
      { range: "15-20K", count: MICRO_MARKETS.filter((m) => m.pricePerSqft >= 15000 && m.pricePerSqft < 20000).length, fill: "#ffd600" },
      { range: "20-35K", count: MICRO_MARKETS.filter((m) => m.pricePerSqft >= 20000 && m.pricePerSqft < 35000).length, fill: "#ff6d00" },
      { range: "35K+", count: MICRO_MARKETS.filter((m) => m.pricePerSqft >= 35000).length, fill: "#ff1744" },
    ],
    []
  );

  // ---- COMPARE MODE ----
  if (compareMode && compareList.length > 0) {
    return (
      <div className="p-4">
        <div className="text-sm font-bold text-white mb-3">
          Comparing {compareList.length} Areas
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="text-left p-2 border-b border-white/10 text-gray-500">
                  Metric
                </th>
                {compareList.map((c) => (
                  <th
                    key={c.id}
                    className="text-right p-2 border-b border-white/10 text-white text-[10px]"
                  >
                    {c.name.split("(")[0].trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: "pricePerSqft" as const, label: "Price/sqft", fmt: (v: number) => `₹${(v / 1000).toFixed(1)}K` },
                { key: "priceChange" as const, label: "1Y Change", fmt: (v: number) => `+${v}%`, best: "max" as const },
                { key: "safety" as const, label: "Safety", fmt: (v: number) => `${v}`, best: "max" as const },
                { key: "aqi" as const, label: "AQI", fmt: (v: number) => `${v}`, best: "min" as const },
                { key: "rentYield" as const, label: "Rent Yield", fmt: (v: number) => `${v}%`, best: "max" as const },
                { key: "investScore" as const, label: "Invest Score", fmt: (v: number) => `${v}`, best: "max" as const },
                { key: "waterHrs" as const, label: "Water (hrs)", fmt: (v: number) => `${v}h`, best: "max" as const },
              ].map((r) => {
                const vals = compareList.map((c) => c[r.key]);
                const bestVal =
                  r.best === "max" ? Math.max(...vals) : r.best === "min" ? Math.min(...vals) : null;
                return (
                  <tr key={r.key}>
                    <td className="p-1.5 border-b border-white/[0.04] text-gray-500">
                      {r.label}
                    </td>
                    {compareList.map((c) => (
                      <td
                        key={c.id}
                        className="text-right p-1.5 border-b border-white/[0.04]"
                        style={{
                          color: bestVal !== null && c[r.key] === bestVal ? "#00e676" : "#ccc",
                          fontWeight: bestVal !== null && c[r.key] === bestVal ? 700 : 400,
                        }}
                      >
                        {r.fmt(c[r.key])}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <td className="p-1.5 border-b border-white/[0.04] text-gray-500">Flood Risk</td>
                {compareList.map((c) => (
                  <td
                    key={c.id}
                    className="text-right p-1.5 border-b border-white/[0.04]"
                    style={{ color: getFloodColor(c.flooding) }}
                  >
                    {c.flooding}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ---- SELECTED AREA ----
  if (!compareMode && selectedArea) {
    const m = selectedArea;
    const areaProjects = allProjects.filter(
      (p) =>
        m.name.toLowerCase().includes(p.area.toLowerCase()) ||
        p.area.toLowerCase().includes(m.name.split("(")[0].trim().split(" ")[0].toLowerCase())
    );

    return (
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-lg font-bold text-white">{m.name}</div>
            <div className="text-[11px] text-gray-500">
              {m.zone} &bull; {m.type}
            </div>
          </div>
          <button onClick={onClearSelection} className="text-gray-600 hover:text-white transition">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-3.5">
          {(["overview", "trends", "projects"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-[11px] capitalize font-medium transition"
              style={{
                background: tab === t ? "rgba(255,109,0,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${tab === t ? "#ff6d00" : "rgba(255,255,255,0.06)"}`,
                color: tab === t ? "#ff6d00" : "#888",
                fontWeight: tab === t ? 600 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="flex gap-2 flex-wrap mb-3">
              <StatCard
                label="Price/sqft"
                value={`₹${(m.pricePerSqft / 1000).toFixed(1)}K`}
                color={getPriceColor(m.pricePerSqft)}
                icon={IndianRupee}
              />
              <StatCard
                label="1Y Change"
                value={`+${m.priceChange}%`}
                color="#00e676"
                icon={TrendingUp}
              />
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <StatCard label="Safety" value={m.safety} color={getSafetyColor(m.safety)} icon={Shield} />
              <StatCard
                label="AQI"
                value={m.aqi}
                sub={getAqiLabel(m.aqi)}
                color={getAqiColor(m.aqi)}
                icon={Wind}
              />
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <StatCard label="Rent Yield" value={`${m.rentYield}%`} sub="Annual" icon={Building2} />
              <StatCard
                label="Invest Score"
                value={m.investScore}
                color={getInvestColor(m.investScore)}
                icon={Star}
              />
            </div>

            {/* Livability */}
            <div className="bg-white/[0.03] rounded-xl p-3.5 border border-white/[0.06] mb-3">
              <div className="font-semibold text-xs text-white mb-2.5">Livability</div>
              {[
                {
                  label: "Water Supply",
                  value: `${m.waterHrs}h/day`,
                  color: m.waterHrs >= 18 ? "#00e676" : "#ff6d00",
                },
                { label: "Flood Risk", value: m.flooding, color: getFloodColor(m.flooding) },
                { label: "Metro Access", value: m.metroProximity, color: "#ccc" },
                { label: "Upcoming Projects", value: `${m.upcoming} projects`, color: "#ccc" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-[11px] text-gray-500">{item.label}</span>
                  <span className="text-xs font-medium" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* 2BHK estimate */}
            <div className="rounded-xl p-3.5 border border-orange-500/20" style={{ background: "linear-gradient(135deg, rgba(255,109,0,0.08), rgba(255,23,68,0.08))" }}>
              <div className="text-[9px] text-orange-500 font-semibold uppercase tracking-wider mb-1">
                Est. 2BHK (650 sqft carpet)
              </div>
              <div className="text-[22px] font-bold text-white">
                ₹{formatPrice(m.pricePerSqft * 650)}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Est. rent: ₹{Math.round((m.pricePerSqft * 650 * m.rentYield) / 1200).toLocaleString("en-IN")}/mo
              </div>
            </div>
          </>
        )}

        {tab === "trends" && (
          <>
            <div className="font-semibold text-xs text-white mb-2.5">Price Trend (12 Months)</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={generatePriceTrend(m.pricePerSqft, m.priceChange)}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6d00" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff6d00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 9 }} axisLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 9 }} axisLine={false} domain={["dataMin - 500", "dataMax + 500"]} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "₹/sqft"]}
                />
                <Area type="monotone" dataKey="price" stroke="#ff6d00" strokeWidth={2} fill="url(#priceGrad)" />
              </AreaChart>
            </ResponsiveContainer>

            <div className="font-semibold text-xs text-white mt-4 mb-2.5">Top Rental Yields</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={topYield} layout="vertical">
                <XAxis type="number" tick={{ fill: "#666", fontSize: 9 }} axisLine={false} domain={[0, 5]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#aaa", fontSize: 9 }}
                  width={90}
                  axisLine={false}
                  tickFormatter={(v: string) => v.split("(")[0].trim()}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [`${v}%`, "Yield"]}
                />
                <Bar dataKey="rentYield" radius={[0, 4, 4, 0]}>
                  {topYield.map((e, i) => (
                    <Cell key={i} fill={e.id === m.id ? "#ff6d00" : "rgba(255,109,0,0.3)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {tab === "projects" && (
          <>
            <div className="font-semibold text-xs text-white mb-2.5">
              Upcoming Projects Near {m.name.split("(")[0].trim()}
            </div>
            {areaProjects.length === 0 ? (
              <div className="text-gray-600 text-xs py-5 text-center">
                No tracked projects in this area yet
              </div>
            ) : (
              areaProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.06] mb-2"
                >
                  <div className="font-semibold text-white text-xs">{p.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {p.builder} &bull; {p.type}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[11px] text-orange-500">₹{p.priceRange}</span>
                    <span className="text-[10px] text-green-400">{p.completion}</span>
                  </div>
                  <div className="text-[9px] text-gray-600 mt-1">RERA: {p.rera}</div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    );
  }

  // ---- DEFAULT: OVERVIEW ----
  return (
    <div className="p-4">
      <div className="font-bold text-sm text-white mb-1">Mumbai Market Overview</div>
      <div className="text-[11px] text-gray-600 mb-4">
        Click any area on the map to see details. Zoom in to explore streets and landmarks.
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <StatCard
          label="Avg Price/sqft"
          value={`₹${(MICRO_MARKETS.reduce((a, b) => a + b.pricePerSqft, 0) / MICRO_MARKETS.length / 1000).toFixed(1)}K`}
          icon={IndianRupee}
        />
        <StatCard label="Areas Tracked" value={MICRO_MARKETS.length} icon={MapPin} />
      </div>

      {/* Top investment */}
      <div className="mb-4">
        <div className="font-semibold text-xs text-orange-500 mb-2">Top Investment Zones</div>
        {topInvest.map((m) => (
          <div
            key={m.id}
            onClick={() => onAreaClick(m)}
            className="flex justify-between items-center p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg mb-1.5 cursor-pointer hover:bg-white/[0.05] transition"
          >
            <div>
              <div className="font-semibold text-white text-xs">{m.name}</div>
              <div className="text-[10px] text-gray-500">
                ₹{(m.pricePerSqft / 1000).toFixed(1)}K/sqft &bull; +{m.priceChange}% YoY
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-base" style={{ color: getInvestColor(m.investScore) }}>
                {m.investScore}
              </div>
              <div className="text-[9px] text-gray-600">score</div>
            </div>
          </div>
        ))}
      </div>

      {/* Infrastructure */}
      <div className="mb-4">
        <div
          onClick={() => setShowInfra(!showInfra)}
          className="flex items-center justify-between cursor-pointer p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.06] hover:bg-white/[0.05] transition"
        >
          <div className="flex items-center gap-2">
            <Train size={14} color="#ffd600" />
            <span className="font-semibold text-xs">Infrastructure Pipeline</span>
            <span className="text-[10px] text-gray-600">{INFRA_PROJECTS.length} projects</span>
          </div>
          <ChevronDown
            size={14}
            color="#666"
            className="transition-transform"
            style={{ transform: showInfra ? "rotate(180deg)" : "none" }}
          />
        </div>
        {showInfra && (
          <div className="mt-2 flex flex-col gap-2">
            {INFRA_PROJECTS.map((p, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.06]">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-white text-xs">{p.name}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      color: p.status.includes("Open") || p.status === "Operational" ? "#00e676" : "#ffd600",
                      background:
                        p.status.includes("Open") || p.status === "Operational"
                          ? "rgba(0,230,118,0.1)"
                          : "rgba(255,214,0,0.1)",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500">
                  {p.route} &bull; {p.completion}
                </div>
                <div className="text-[10px] text-orange-500 mt-1">{p.impact}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Projects */}
      <div className="mb-4">
        <div
          onClick={() => setShowProjects(!showProjects)}
          className="flex items-center justify-between cursor-pointer p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.06] hover:bg-white/[0.05] transition"
        >
          <div className="flex items-center gap-2">
            <Building2 size={14} color="#ffd600" />
            <span className="font-semibold text-xs">Upcoming Projects ({allProjects.length})</span>
          </div>
          <ChevronDown
            size={14}
            color="#666"
            className="transition-transform"
            style={{ transform: showProjects ? "rotate(180deg)" : "none" }}
          />
        </div>
        {showProjects && (
          <div className="mt-2">
            {allProjects.map((p) => (
              <div key={p.id} className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.05] mb-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-white text-[11px]">{p.name}</span>
                  <span className="text-[9px]" style={{ color: p.status === "Announced" ? "#888" : "#ffd600" }}>
                    {p.status}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">
                  {p.area} &bull; {p.builder} &bull; ₹{p.priceRange}
                </div>
              </div>
            ))}
            <button
              onClick={() => setAddingProject(true)}
              className="w-full py-2.5 bg-orange-500/[0.08] border border-dashed border-orange-500/30 rounded-lg text-orange-500 text-[11px] cursor-pointer flex items-center justify-center gap-1.5 mt-1 hover:bg-orange-500/[0.15] transition"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {addingProject && (
        <div className="bg-white/[0.04] rounded-xl p-3.5 border border-orange-500/20 mb-4">
          <div className="flex justify-between mb-2.5">
            <span className="font-semibold text-xs text-white">Add New Project</span>
            <button onClick={() => setAddingProject(false)} className="text-gray-600 hover:text-white">
              <X size={14} />
            </button>
          </div>
          {(["name", "area", "builder", "priceRange", "completion"] as const).map((field) => (
            <input
              key={field}
              value={newProject[field]}
              onChange={(e) => setNewProject((p) => ({ ...p, [field]: e.target.value }))}
              placeholder={
                field === "priceRange"
                  ? "e.g. 80L - 1.5Cr"
                  : field === "completion"
                    ? "e.g. Dec 2027"
                    : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-2 text-white text-[11px] mb-1.5 outline-none focus:border-orange-500/40 transition"
            />
          ))}
          <select
            value={newProject.type}
            onChange={(e) => setNewProject((p) => ({ ...p, type: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-2 text-white text-[11px] mb-2 outline-none"
          >
            {["Luxury", "Premium", "Mid-Range", "Affordable", "Township"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={addCustomProject}
            className="w-full py-2.5 rounded-lg text-white text-xs font-semibold cursor-pointer"
            style={{ background: "linear-gradient(135deg, #ff6d00, #ff1744)" }}
          >
            Add Project
          </button>
        </div>
      )}

      {/* Price Distribution */}
      <div className="mb-4">
        <div className="font-semibold text-xs text-white mb-2.5">Price Distribution (₹/sqft)</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={priceDistribution}>
            <XAxis dataKey="range" tick={{ fill: "#888", fontSize: 9 }} axisLine={false} />
            <YAxis tick={{ fill: "#666", fontSize: 9 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 11,
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [`${v} areas`, "Count"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {priceDistribution.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
