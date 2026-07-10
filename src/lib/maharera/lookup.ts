// -----------------------------------------------------------------------------
// Live MahaRERA lookup orchestrator.
//
// Resolution order for a registration number:
//   1. In-memory cache of a previous live fetch          → provenance "cache"
//   2. Bundled seed dataset (our 37 curated projects)     → provenance "seed"
//   3. Live fetch + parse from the MahaRERA portal        → provenance "live"
//   4. Nothing found / upstream blocked                   → provenance "none"
//
// Seed-known numbers short-circuit to the rich curated page. Any *other* real
// registration number is resolved live — which is the whole point: arbitrary
// real RERA numbers now resolve instead of 404-ing.
// -----------------------------------------------------------------------------

import { projectByRera } from "@/data/rera";
import { cacheGet, cacheSet } from "./cache";
import { mahareraConfig } from "./config";
import { mahareraFetch, MahareraFetchError } from "./client";
import {
  extractDetailUrl,
  looksLikeProjectPage,
  parseProjectDetail,
} from "./parse";
import { isReraNumber, normalizeRera } from "./rera-number";
import type { LiveProject, LookupResult } from "./types";

const cacheKey = (rera: string) => `maharera:live:${rera}`;

/** Build the search URL for a registration number on the portal. */
function searchUrl(rera: string): string {
  const u = new URL(mahareraConfig.searchPath, mahareraConfig.base);
  // The portal accepts the certificate/registration number as a query field;
  // exact field name is overridable via config if the portal changes.
  u.searchParams.set("project_certi_no", rera);
  u.searchParams.set("certificate_no", rera);
  return u.toString();
}

/** Attempt a live fetch + parse. Throws MahareraFetchError on upstream failure. */
async function fetchLive(rera: string): Promise<LiveProject | null> {
  const sUrl = searchUrl(rera);
  const searchHtml = await mahareraFetch(sUrl);

  // Try to follow through to a dedicated detail page; if we can't find one,
  // parse the search page itself (it often carries the row inline).
  const detailUrl = extractDetailUrl(searchHtml, rera, mahareraConfig.base);
  let project: LiveProject;

  if (detailUrl && detailUrl !== sUrl) {
    const detailHtml = await mahareraFetch(detailUrl);
    project = parseProjectDetail(detailHtml, rera, detailUrl);
  } else {
    project = parseProjectDetail(searchHtml, rera, sUrl);
  }

  return looksLikeProjectPage(project) ? project : null;
}

/**
 * Resolve a registration number to a LookupResult, never throwing — upstream
 * failures degrade to seed data or a "none" result with an explanatory note.
 */
export async function lookupByRera(input: string): Promise<LookupResult> {
  const rera = normalizeRera(input);

  if (!isReraNumber(rera)) {
    return {
      rera,
      provenance: "none",
      attemptedLive: false,
      note: "Not a valid MahaRERA registration number.",
    };
  }

  // 1. Cache
  const cached = cacheGet<LiveProject>(cacheKey(rera));
  if (cached) {
    return {
      rera,
      provenance: "cache",
      live: cached,
      attemptedLive: true,
      fetchedAt: new Date().toISOString(),
    };
  }

  // 2. Seed dataset (our curated projects render richly)
  const seed = projectByRera(rera);
  if (seed) {
    return {
      rera,
      provenance: "seed",
      seedRera: seed.rera,
      attemptedLive: false,
      note: "Served from the curated dataset.",
    };
  }

  // 3. Live
  if (!mahareraConfig.liveEnabled) {
    return {
      rera,
      provenance: "none",
      attemptedLive: false,
      note: "Live lookup is disabled (MAHARERA_LIVE_ENABLED=false).",
    };
  }

  try {
    const live = await fetchLive(rera);
    if (live) {
      cacheSet(cacheKey(rera), live, mahareraConfig.cacheTtlMs);
      return {
        rera,
        provenance: "live",
        live,
        attemptedLive: true,
        fetchedAt: new Date().toISOString(),
      };
    }
    return {
      rera,
      provenance: "none",
      attemptedLive: true,
      note: "No project found for this registration number on MahaRERA.",
    };
  } catch (err) {
    const note =
      err instanceof MahareraFetchError
        ? err.kind === "blocked"
          ? "MahaRERA blocked the request (bot wall/captcha). Set MAHARERA_PROXY_URL to route via a scraping proxy."
          : err.message
        : "Live lookup failed unexpectedly.";
    return { rera, provenance: "none", attemptedLive: true, note };
  }
}
