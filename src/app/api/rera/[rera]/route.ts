import { NextResponse } from "next/server";
import { lookupByRera } from "@/lib/maharera";

// Always run at request time — this hits the live MahaRERA portal.
export const dynamic = "force-dynamic";

/**
 * GET /api/rera/:rera
 * Resolves a MahaRERA registration number to live (or cached / seed) data.
 * Never throws to the client — provenance + note explain what happened.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ rera: string }> }
) {
  const { rera } = await params;
  const result = await lookupByRera(rera);

  const status = result.provenance === "none" && !result.attemptedLive ? 400 : 200;
  return NextResponse.json(result, {
    status,
    headers: {
      // Let the CDN cache successful live/cache hits briefly; never cache misses.
      "Cache-Control":
        result.provenance === "live" || result.provenance === "cache"
          ? "public, s-maxage=600, stale-while-revalidate=3600"
          : "no-store",
    },
  });
}
