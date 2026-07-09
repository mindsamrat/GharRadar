// Data model mirroring the fields MahaRERA exposes on its public project pages.
// Kept deliberately close to the real schema so the live scraper (see source.ts)
// can populate these types with zero UI changes.

export type City = "Mumbai" | "Pune";

export type ProjectStatus =
  | "Completed" // OC received / registration marked complete
  | "Ongoing" // under construction, within timeline
  | "Delayed" // revised completion pushed past the original promise
  | "Lapsed" // registration expired without completion
  | "New"; // recently registered, work just begun

export interface ReraProject {
  /** MahaRERA registration number, e.g. "P51900047880" */
  regNo: string;
  name: string;
  /** Foreign key to Builder.slug */
  builderSlug: string;
  city: City;
  /** MahaRERA district (Mumbai City / Mumbai Suburban / Pune / Thane ...) */
  district: string;
  locality: string;
  /** Residential / Commercial / Mixed / Plotted */
  projectType: string;
  status: ProjectStatus;
  /** ISO date the project was registered with MahaRERA */
  registeredOn: string;
  /** Original completion date declared at registration */
  proposedCompletion: string;
  /** Latest revised completion date, if the builder filed an extension */
  revisedCompletion?: string;
  /** Actual completion date, if finished */
  actualCompletion?: string;
  totalUnits: number;
  /** Total project area in square metres */
  totalArea: number;
  towers: number;
  /** Count of complaints filed against the project on MahaRERA */
  complaints: number;
  /** Count of active litigations disclosed */
  litigations: number;
  priceRange: string;
  /** Self-declared construction progress, 0-100 */
  progressPercent: number;
}

export interface Builder {
  slug: string;
  name: string;
  /** Alternate / brand names used for search, e.g. Macrotech is searched as "Lodha" */
  aka?: string[];
  headquarters: string;
  since: number;
  /** Company / Individual / Partnership / LLP / Society */
  promoterType: string;
}

export interface BuilderTrust {
  /** 0-100 composite delivery-trust score */
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D";
  label: string;
  /** Average delay in months across the builder's delayed/completed projects */
  avgDelayMonths: number;
  /** Share of registered projects actually delivered, 0-1 */
  onTimeRate: number;
  totalProjects: number;
  completed: number;
  ongoing: number;
  delayed: number;
  lapsed: number;
  totalComplaints: number;
  /** Human-readable reasons that drove the score, best first */
  reasons: string[];
}

export interface BuilderProfile {
  builder: Builder;
  projects: ReraProject[];
  trust: BuilderTrust;
}
