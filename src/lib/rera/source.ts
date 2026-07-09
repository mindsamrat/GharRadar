import { Builder, BuilderProfile, ReraProject } from "./types";
import { BUILDERS, PROJECTS } from "./dataset";
import { computeTrust } from "./trust";

/**
 * Data-source abstraction for MahaRERA records.
 *
 * The UI and API only ever talk to a `ReraSource`. Today it's backed by the
 * seeded dataset (`SeededSource`). To go live, implement `MahaReraScraperSource`
 * against the public MahaRERA portal — the search endpoints accept project name,
 * registration number, and promoter name — normalise each project page into the
 * `ReraProject` shape, and swap the export at the bottom of this file. No UI or
 * API code has to change.
 *
 * NOTE: the scraper must run where outbound access to
 * `maharera.maharashtra.gov.in` is allowed (your backend / a cron job). It is
 * blocked inside the sandboxed dev environment by network policy.
 */
export interface ReraSource {
  searchBuilders(query: string): Promise<BuilderSearchHit[]>;
  searchProjects(query: string): Promise<ReraProject[]>;
  getBuilderProfile(slug: string): Promise<BuilderProfile | null>;
  getProjectByRegNo(regNo: string): Promise<ReraProject | null>;
}

export interface BuilderSearchHit {
  builder: Builder;
  projectCount: number;
  score: number; // trust score, for sorting/badging
  matchedProject?: string; // which project name matched, if the hit came via a project
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** Matches a MahaRERA registration number in any spacing/case, e.g. "p519 00047880". */
function looksLikeRegNo(q: string): boolean {
  return /^p\d[\d\s-]{6,}$/i.test(q.trim());
}
const stripRegNo = (s: string) => s.replace(/[\s-]/g, "").toLowerCase();

class SeededSource implements ReraSource {
  private builders = BUILDERS;
  private projects = PROJECTS;

  private projectsFor(slug: string): ReraProject[] {
    return this.projects.filter((p) => p.builderSlug === slug);
  }

  async searchBuilders(query: string): Promise<BuilderSearchHit[]> {
    const q = norm(query);
    if (!q) {
      // No query → return all builders, best score first (browse mode).
      return this.builders
        .map((b) => this.toHit(b))
        .sort((a, b) => b.score - a.score);
    }

    // Registration-number search resolves straight to the owning builder.
    if (looksLikeRegNo(query)) {
      const rq = stripRegNo(query);
      const proj = this.projects.find((p) => stripRegNo(p.regNo).includes(rq));
      if (proj) {
        const b = this.builders.find((x) => x.slug === proj.builderSlug)!;
        return [this.toHit(b, proj.name)];
      }
      return [];
    }

    const hits = new Map<string, BuilderSearchHit>();

    // 1. Match on builder name / aka.
    for (const b of this.builders) {
      const names = [b.name, ...(b.aka ?? [])].map(norm);
      if (names.some((n) => n.includes(q))) hits.set(b.slug, this.toHit(b));
    }

    // 2. Match on project name → surface its builder.
    for (const p of this.projects) {
      if (norm(p.name).includes(q) || norm(p.locality).includes(q)) {
        const b = this.builders.find((x) => x.slug === p.builderSlug)!;
        if (!hits.has(b.slug)) hits.set(b.slug, this.toHit(b, p.name));
      }
    }

    return [...hits.values()].sort((a, b) => b.score - a.score);
  }

  async searchProjects(query: string): Promise<ReraProject[]> {
    const q = norm(query);
    if (looksLikeRegNo(query)) {
      const rq = stripRegNo(query);
      return this.projects.filter((p) => stripRegNo(p.regNo).includes(rq));
    }
    if (!q) return this.projects;
    return this.projects.filter(
      (p) =>
        norm(p.name).includes(q) ||
        norm(p.locality).includes(q) ||
        norm(p.district).includes(q)
    );
  }

  async getBuilderProfile(slug: string): Promise<BuilderProfile | null> {
    const builder = this.builders.find((b) => b.slug === slug);
    if (!builder) return null;
    const projects = this.projectsFor(slug).sort(
      (a, b) => new Date(b.registeredOn).getTime() - new Date(a.registeredOn).getTime()
    );
    return { builder, projects, trust: computeTrust(projects) };
  }

  async getProjectByRegNo(regNo: string): Promise<ReraProject | null> {
    const rq = stripRegNo(regNo);
    return this.projects.find((p) => stripRegNo(p.regNo) === rq) ?? null;
  }

  private toHit(b: Builder, matchedProject?: string): BuilderSearchHit {
    const projects = this.projectsFor(b.slug);
    return {
      builder: b,
      projectCount: projects.length,
      score: computeTrust(projects).score,
      matchedProject,
    };
  }
}

// Swap this line for `new MahaReraScraperSource()` once the scraper is wired.
export const reraSource: ReraSource = new SeededSource();
