import { searchAll, type SearchResult } from "@/data/rera";

export { searchAll };
export type { SearchResult };

/** Resolve a search result to its destination route. */
export function slugForResult(r: SearchResult): string {
  return r.kind === "builder"
    ? `/builder/${r.item.slug}`
    : `/project/${r.item.rera}`;
}
