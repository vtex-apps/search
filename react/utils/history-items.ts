/**
 * Returns the value that should be passed as `params.term` to a
 * `vtex.render-runtime` `<Link page='store.search'>` when rendering a row in
 * the autocomplete history list.
 *
 * History entries come from the shopper-typed search bar and may contain `/`
 * characters. `vtex.render-runtime` interpolates path params verbatim into the
 * route template (`/:term`), so a raw `/` would split the term into multiple
 * route segments and break the navigation.
 *
 * Goal: produce the **same path slug as the search bar**, i.e. standard
 * percent-encoding (`/` → `%2F`). `encodeURIComponent` is the standard
 * primitive for that. Re-encoding a legacy cookie entry that already
 * contains a `%XX` triplet is safe because `encodeURIComponent` does not
 * touch `%` (its output for `%` is `%25`, but only when the input is a
 * literal `%`; an already-encoded triplet round-trips through
 * `decodeURIComponent` first to avoid double-encoding — see
 * `safeEncodeURIComponent` below).
 *
 * Spec: is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
 */
export function buildHistoryItemValue(rawTerm: string): string {
  return safeEncodeURIComponent(rawTerm)
}

/**
 * Encode a string for use as a single URL path segment, while being
 * **idempotent** against terms that may already contain percent-encoded
 * triplets (legacy cookies, copy-pasted values).
 *
 * If the input is already a valid percent-encoded string,
 * `decodeURIComponent` returns the decoded form and `encodeURIComponent`
 * re-emits the canonical encoding — so applying this helper twice yields
 * the same output as applying it once.
 *
 * If the input contains a literal `%` that is *not* part of a valid
 * triplet, `decodeURIComponent` throws; in that case we fall back to
 * encoding the original string verbatim, which preserves the `%` as `%25`.
 */
function safeEncodeURIComponent(rawTerm: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(rawTerm))
  } catch {
    return encodeURIComponent(rawTerm)
  }
}
