import { BuilderTrust, ReraProject } from "./types";

/** Whole months between two ISO dates (b - a), floored at 0. */
function monthsBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const months =
    (d2.getFullYear() - d1.getFullYear()) * 12 +
    (d2.getMonth() - d1.getMonth());
  return months;
}

/**
 * Delay in months for a single project: how far the delivered (or currently
 * revised) date slipped past the originally promised completion date.
 * Returns 0 for projects that met or beat their promise.
 */
export function projectDelayMonths(p: ReraProject): number {
  const settled = p.actualCompletion ?? p.revisedCompletion;
  if (!settled) return 0; // no revision filed and not yet complete → not counted as delay
  return Math.max(0, monthsBetween(p.proposedCompletion, settled));
}

/**
 * Composite Delivery Trust Score (0-100) for a builder, from its projects.
 *
 * The score rewards on-time delivery and completion, and penalises delays,
 * lapsed registrations, and complaint density. It is intentionally transparent:
 * every deduction is reflected in `reasons` so buyers see *why*.
 */
export function computeTrust(projects: ReraProject[]): BuilderTrust {
  const total = projects.length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const ongoing = projects.filter((p) => p.status === "Ongoing" || p.status === "New").length;
  const delayed = projects.filter((p) => p.status === "Delayed").length;
  const lapsed = projects.filter((p) => p.status === "Lapsed").length;
  const totalComplaints = projects.reduce((s, p) => s + p.complaints, 0);
  const totalUnits = projects.reduce((s, p) => s + p.totalUnits, 0) || 1;

  // Delay signal: average delay across projects that have a settled/ revised date.
  const withDelay = projects
    .map(projectDelayMonths)
    .filter((_, i) => projects[i].actualCompletion || projects[i].revisedCompletion);
  const avgDelayMonths = withDelay.length
    ? withDelay.reduce((s, m) => s + m, 0) / withDelay.length
    : 0;

  // Delivery ratio: completed vs. everything that should have delivered by now
  // (completed + delayed + lapsed). Ongoing projects are excluded — not due yet.
  const dueCount = completed + delayed + lapsed;
  const onTimeCompleted = projects.filter(
    (p) => p.status === "Completed" && projectDelayMonths(p) <= 3
  ).length;
  const onTimeRate = dueCount ? onTimeCompleted / dueCount : 1;

  // ---- Scoring (start at 100, deduct) ----
  let score = 100;
  const reasons: string[] = [];

  // 1. Lapsed registrations are the strongest red flag.
  if (lapsed > 0) {
    const pen = Math.min(40, lapsed * 18);
    score -= pen;
    reasons.push(`${lapsed} registration${lapsed > 1 ? "s" : ""} lapsed without completion`);
  }

  // 2. Average delay across the portfolio.
  if (avgDelayMonths >= 1) {
    const pen = Math.min(30, avgDelayMonths * 2.2);
    score -= pen;
    reasons.push(`Avg. ${avgDelayMonths.toFixed(1)} month delay vs. promised timelines`);
  }

  // 3. Currently delayed projects.
  if (delayed > 0) {
    const pen = Math.min(20, delayed * 6);
    score -= pen;
    reasons.push(`${delayed} project${delayed > 1 ? "s" : ""} currently past original deadline`);
  }

  // 4. Complaint density (complaints per 100 units).
  const complaintDensity = (totalComplaints / totalUnits) * 100;
  if (complaintDensity >= 0.5) {
    const pen = Math.min(15, complaintDensity * 4);
    score -= pen;
    reasons.push(`${totalComplaints} MahaRERA complaints across portfolio`);
  }

  // ---- Positive reinforcement (so strong builders read as strong) ----
  if (completed > 0 && onTimeRate >= 0.8 && delayed === 0 && lapsed === 0) {
    reasons.unshift(`${completed} project${completed > 1 ? "s" : ""} delivered on or near time`);
  } else if (completed > 0) {
    reasons.push(`${completed} project${completed > 1 ? "s" : ""} completed to date`);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const { grade, label } = gradeFor(score);

  return {
    score,
    grade,
    label,
    avgDelayMonths: Math.round(avgDelayMonths * 10) / 10,
    onTimeRate: Math.round(onTimeRate * 100) / 100,
    totalProjects: total,
    completed,
    ongoing,
    delayed,
    lapsed,
    totalComplaints,
    reasons: reasons.slice(0, 4),
  };
}

function gradeFor(score: number): { grade: BuilderTrust["grade"]; label: string } {
  if (score >= 85) return { grade: "A+", label: "Highly Reliable" };
  if (score >= 72) return { grade: "A", label: "Reliable" };
  if (score >= 58) return { grade: "B", label: "Mostly Dependable" };
  if (score >= 40) return { grade: "C", label: "Mixed Record" };
  return { grade: "D", label: "High Risk" };
}

export const TRUST_COLORS: Record<BuilderTrust["grade"], string> = {
  "A+": "#00e676",
  A: "#76ff03",
  B: "#ffd600",
  C: "#ff6d00",
  D: "#ff1744",
};
