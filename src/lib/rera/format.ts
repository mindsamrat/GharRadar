import { ProjectStatus } from "./types";

export const STATUS_COLOR: Record<ProjectStatus, string> = {
  Completed: "#00e676",
  Ongoing: "#29b6f6",
  New: "#b388ff",
  Delayed: "#ff6d00",
  Lapsed: "#ff1744",
};

export function fmtMonthYear(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function delayLabel(months: number): string {
  if (months <= 0) return "On time";
  if (months < 12) return `${months} mo late`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y}y ${m}m late` : `${y}y late`;
}
