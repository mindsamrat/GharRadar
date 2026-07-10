// -----------------------------------------------------------------------------
// MahaRERA registration-number helpers
// -----------------------------------------------------------------------------
// Format: a leading letter category code + digits.
//   P  → Project        (e.g. P51900047880)
//   C  → Commercial / correction registrations in some vintages
//   A  → Agent
// Project numbers are the letter + 11 digits (5-digit division + 6-digit
// serial), but older/edge registrations vary in length, so we stay lenient.
// -----------------------------------------------------------------------------

const RERA_RE = /^[PAC]\d{9,12}$/i;

/** Normalise a raw user string into a canonical registration number. */
export function normalizeRera(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

/** True when the string looks like a MahaRERA registration number. */
export function isReraNumber(input: string): boolean {
  return RERA_RE.test(normalizeRera(input));
}

/** True when a query is "RERA-number shaped" enough to offer a live lookup. */
export function looksLikeReraQuery(input: string): boolean {
  const s = normalizeRera(input);
  // A leading P/A/C followed by several digits — even if not yet complete.
  return /^[PAC]\d{4,}$/i.test(s);
}
