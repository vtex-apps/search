/**
 * Encodes a search term so it can be safely interpolated as the `:term` segment
 * of the `store.search` route by `vtex.render-runtime`'s `<Link>` component.
 *
 * `vtex.render-runtime` interpolates path params verbatim into the route
 * template, so a raw `/` in the term would split it into multiple route
 * segments and break the navigation. We need standard percent-encoding
 * (`/` → `%2F`, ` ` → `%20`, …) — the same primitive that the canonical
 * search bar (`vtex.store-components/react/SearchBar.tsx#handleGoToSearchPage`)
 * applies via `encodeURIComponent(inputValue)` since 2021-02 (vtex-apps/store-components#0e9a0ee5).
 *
 * This helper is used for both:
 *   - History item links (terms from the `biggy-search-history` cookie)
 *   - The "see all" link in autocomplete (user-typed terms)
 *
 * The implementation is **idempotent** against pre-encoded input to handle
 * legacy cookie entries that may already contain `%XX` triplets (because
 * `addTermToHistory` persists whatever it parses from `?_q=`, which can
 * itself be encoded).
 *
 * For a brand-new term that contains no `%XX` triplet, this produces identical
 * output to the search bar — so a typed term and a clicked-history term land
 * on the *same URL*.
 *
 * Spec: is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
 */
export function encodeSearchTerm(rawTerm: string): string {
  return safeEncodeURIComponent(rawTerm)
}

/**
 * Encode a string for use as a single URL path segment, while being
 * **idempotent** against terms that may already contain percent-encoded
 * triplets (legacy cookies, copy-pasted values).
 *
 * If the input is already a valid percent-encoded string, `decodeURIComponent`
 * returns the decoded form and `encodeURIComponent` re-emits the canonical
 * encoding — so applying this helper twice yields the same output as applying
 * it once.
 *
 * If the input contains a literal `%` that is *not* part of a valid triplet,
 * `decodeURIComponent` throws; in that case we fall back to encoding the
 * original string verbatim, which preserves the `%` as `%25`.
 */
function safeEncodeURIComponent(rawTerm: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(rawTerm))
  } catch {
    return encodeURIComponent(rawTerm)
  }
}
