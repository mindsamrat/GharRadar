// -----------------------------------------------------------------------------
// Tiny in-memory TTL cache for live lookups.
//
// Kept module-global so it survives across requests within a warm serverless
// instance. It is intentionally simple — a per-instance best-effort cache that
// spares the upstream portal from repeated hits for the same registration
// number. For durable/shared caching, swap this for Redis/KV behind the same
// get/set shape.
// -----------------------------------------------------------------------------

interface Entry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, Entry<unknown>>();

export function cacheGet<T>(key: string): T | undefined {
  const e = store.get(key) as Entry<T> | undefined;
  if (!e) return undefined;
  if (Date.now() > e.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return e.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}
