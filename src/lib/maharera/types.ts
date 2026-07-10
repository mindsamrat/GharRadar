// -----------------------------------------------------------------------------
// Types for the live MahaRERA lookup pipeline
// -----------------------------------------------------------------------------

/**
 * Where a lookup result came from.
 *  - "live"  → freshly fetched & parsed from the MahaRERA portal
 *  - "cache" → served from the in-memory cache of a previous live fetch
 *  - "seed"  → served from the bundled seed dataset (src/data/rera.ts)
 *  - "none"  → nothing found anywhere
 */
export type Provenance = "live" | "cache" | "seed" | "none";

/**
 * The subset of project data that the public MahaRERA portal actually
 * discloses on a registered-project detail page. Everything is optional
 * because the portal's layout varies by project and registration vintage —
 * we never fabricate a value we could not read. Fields we cannot read stay
 * `undefined` and are rendered as "Not disclosed" rather than a fake number.
 */
export interface LiveProject {
  rera: string;
  name?: string;
  promoter?: string;
  projectType?: string;
  status?: string;
  registeredOn?: string; // as printed by MahaRERA (dd/mm/yyyy or ISO)
  proposedCompletion?: string;
  revisedCompletion?: string;
  district?: string;
  taluka?: string;
  village?: string;
  pincode?: string;
  totalArea?: string; // e.g. "12,345.67 sq.mts"
  totalBuildings?: string;
  totalApartments?: string;
  litigations?: string;
  /** Direct link back to the source page on the MahaRERA portal. */
  sourceUrl?: string;
  /** Raw label→value pairs we scraped, for fields we don't model explicitly. */
  extra?: Record<string, string>;
}

export interface LookupResult {
  rera: string;
  provenance: Provenance;
  /** Present when provenance is "live" or "cache". */
  live?: LiveProject;
  /** Present when provenance is "seed" — the slug of the bundled project. */
  seedRera?: string;
  /** ISO timestamp the data was fetched/served. */
  fetchedAt?: string;
  /** Human-readable note, e.g. why we fell back to seed data. */
  note?: string;
  /** True when the live upstream was attempted (even if it failed). */
  attemptedLive: boolean;
}
