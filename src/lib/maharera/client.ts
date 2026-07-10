// -----------------------------------------------------------------------------
// Network client for the MahaRERA portal — proxy-ready, timeout-guarded.
// -----------------------------------------------------------------------------

import { browserHeaders, mahareraConfig, withProxy } from "./config";

export class MahareraFetchError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly kind:
      | "blocked" // 403 / captcha / bot wall
      | "http" // other non-2xx
      | "timeout"
      | "network" = "network"
  ) {
    super(message);
    this.name = "MahareraFetchError";
  }
}

/**
 * Fetch a URL from the MahaRERA portal (optionally via the configured scraping
 * proxy), returning the response body as text. Throws a typed
 * MahareraFetchError on timeout, bot-block, or other failure.
 */
export async function mahareraFetch(targetUrl: string): Promise<string> {
  const url = withProxy(targetUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), mahareraConfig.timeoutMs);

  try {
    const res = await fetch(url, {
      headers: browserHeaders,
      redirect: "follow",
      signal: controller.signal,
      // Always hit the network; caching is handled one layer up.
      cache: "no-store",
    });

    if (res.status === 403 || res.status === 429) {
      throw new MahareraFetchError(
        `MahaRERA returned ${res.status} (bot/rate wall). Configure MAHARERA_PROXY_URL to route via a scraping proxy.`,
        res.status,
        "blocked"
      );
    }
    if (!res.ok) {
      throw new MahareraFetchError(
        `MahaRERA returned HTTP ${res.status}`,
        res.status,
        "http"
      );
    }

    const body = await res.text();

    // Some bot walls answer 200 with a challenge/captcha page — detect it.
    if (/captcha|are you a human|cf-challenge|access denied|request blocked/i.test(body)) {
      throw new MahareraFetchError(
        "MahaRERA served a captcha/challenge page. Configure MAHARERA_PROXY_URL to route via a scraping proxy.",
        res.status,
        "blocked"
      );
    }

    return body;
  } catch (err) {
    if (err instanceof MahareraFetchError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new MahareraFetchError(
        `MahaRERA request timed out after ${mahareraConfig.timeoutMs}ms`,
        undefined,
        "timeout"
      );
    }
    throw new MahareraFetchError(
      `MahaRERA request failed: ${err instanceof Error ? err.message : String(err)}`,
      undefined,
      "network"
    );
  } finally {
    clearTimeout(timer);
  }
}
