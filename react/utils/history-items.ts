import { encodeUrlString } from './string-utils'

/**
 * Returns the value that should be passed as `params.term` to a
 * `vtex.render-runtime` `<Link page='store.search'>` when rendering a row in
 * the autocomplete history list.
 *
 * History entries come from the shopper-typed search bar and may contain `/`
 * characters. `vtex.render-runtime` interpolates path params verbatim into the
 * route template (`/:term`), so a raw `/` would split the term into multiple
 * route segments and break the navigation. This helper applies the same
 * codebase-internal placeholder (`$2F`) used by the "see all" link in
 * TileList, keeping every autocomplete navigation aligned.
 *
 * `encodeUrlString` is idempotent (it only rewrites `/`), so re-encoding a
 * legacy cookie entry that already contains `$2F` is a no-op.
 *
 * Spec: is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
 */
export function buildHistoryItemValue(rawTerm: string): string {
  return encodeUrlString(rawTerm)
}
