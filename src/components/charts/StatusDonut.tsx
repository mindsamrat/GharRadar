"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { STATUS_META, type ProjectStatus } from "@/data/rera";
import { useMounted } from "@/lib/useMounted";

export function StatusDonut({
  data,
}: {
  data: { status: ProjectStatus; count: number }[];
}) {
  const mounted = useMounted();
  const filtered = data.filter((d) => d.count > 0);
  const total = filtered.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0">
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filtered}
              dataKey="count"
              nameKey="status"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {filtered.map((d) => (
                <Cell key={d.status} fill={STATUS_META[d.status].color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        )}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-[10px] uppercase tracking-wide text-[var(--fg-dim)]">
            projects
          </span>
        </div>
      </div>
      <ul className="space-y-1.5">
        {filtered.map((d) => (
          <li key={d.status} className="flex items-center gap-2 text-[13px]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: STATUS_META[d.status].color }}
            />
            <span className="text-[var(--fg-muted)]">{d.status}</span>
            <span className="ml-auto font-semibold text-white">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
