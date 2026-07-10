// -----------------------------------------------------------------------------
// Configuration for the live MahaRERA lookup.
//
// The official portal (https://maharera.maharashtra.gov.in) exposes NO public
// API and actively blocks datacenter / bot traffic (403 + captcha). Serverless
// functions run on datacenter IPs, so a bare fetch will often be blocked in
// production. To make the lookup work reliably you can route requests through a
// scraping proxy that presents residential IPs and solves captchas
// (ScraperAPI, ScrapingBee, BrightData, Zyte, …) by setting MAHARERA_PROXY_URL.
//
// Everything here is overridable via environment variables so the endpoint and
// upstream strategy can be adjusted without a code change.
// -----------------------------------------------------------------------------

const DEFAULT_BASE = "https://maharera.maharashtra.gov.in";

export const mahareraConfig = {
  /** Base origin of the MahaRERA portal. */
  base: process.env.MAHARERA_BASE_URL || DEFAULT_BASE,

  /**
   * The project search results endpoint. The portal renders an HTML results
   * page; we parse it to find the detail link for the registration number.
   * Overridable because the portal path has changed over time.
   */
  searchPath:
    process.env.MAHARERA_SEARCH_PATH || "/projects-search-result",

  /**
   * Optional scraping-proxy URL. Two accepted shapes:
   *   1. Placeholder style — include `{url}` where the (URL-encoded) target
   *      should be substituted, e.g.
   *        https://api.scrapingbee.com/?api_key=KEY&url={url}
   *   2. Prefix style — no placeholder; the encoded target is appended, e.g.
   *        https://api.scraperapi.com/?api_key=KEY&url=
   * When unset, requests go directly to the portal.
   */
  proxyUrl: process.env.MAHARERA_PROXY_URL || "",

  /** Request timeout in milliseconds. */
  timeoutMs: Number(process.env.MAHARERA_TIMEOUT_MS || 12000),

  /** Cache TTL for successful live lookups, in milliseconds (default 6h). */
  cacheTtlMs: Number(process.env.MAHARERA_CACHE_TTL_MS || 6 * 60 * 60 * 1000),

  /**
   * Master switch. When "false", the lookup skips the network entirely and
   * only serves seed data. Useful for local dev or blocked environments.
   * Defaults to enabled.
   */
  liveEnabled:
    (process.env.MAHARERA_LIVE_ENABLED ?? "true").toLowerCase() !== "false",
} as const;

/**
 * Wrap a target URL through the configured scraping proxy, if any.
 * Returns the target unchanged when no proxy is configured.
 */
export function withProxy(targetUrl: string): string {
  const p = mahareraConfig.proxyUrl;
  if (!p) return targetUrl;
  if (p.includes("{url}")) return p.replace("{url}", encodeURIComponent(targetUrl));
  return p + encodeURIComponent(targetUrl);
}

/** Browser-like headers to reduce the chance of an immediate bot block. */
export const browserHeaders: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif," +
    "image/webp,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
  "Upgrade-Insecure-Requests": "1",
};
