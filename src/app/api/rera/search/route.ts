import type { NextRequest } from "next/server";
import { reraSource } from "@/lib/rera/source";

// GET /api/rera/search?q=<builder | project | RERA no>
// Returns matching builders (each already carrying its trust score) plus any
// directly-matched projects. Not cached — results should reflect the latest
// data source (live scraper cache when wired).
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  const [builders, projects] = await Promise.all([
    reraSource.searchBuilders(q),
    q ? reraSource.searchProjects(q) : Promise.resolve([]),
  ]);

  return Response.json({ query: q, builders, projects });
}
