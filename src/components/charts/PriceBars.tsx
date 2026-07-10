"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMounted } from "@/lib/useMounted";

interface Row {
  label: string;
  value: number;
  city: string;
}

const CITY_COLOR: Record<string, string> = {
  Mumbai: "#ff6a2b",
  Pune: "#40c4ff",
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-[rgba(11,11,19,0.97)] px-3 py-2 text-[12px] shadow-xl">
      <div className="font-semibold text-white">{d.label}</div>
      <div className="text-[var(--fg-muted)]">
        ₹{d.value.toLocaleString("en-IN")}/sq.ft · {d.city}
      </div>
    </div>
  );
}

export function PriceBars({ data }: { data: Row[] }) {
  const mounted = useMounted();
  if (!mounted) return <div style={{ height: 320 }} aria-hidden />;
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
      >
        <XAxis
          type="number"
          tick={{ fill: "#6a6a7e", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v / 1000}K`}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fill: "#9a9aae", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={92}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
          {data.map((d, i) => (
            <Cell key={i} fill={CITY_COLOR[d.city] ?? "#888"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
