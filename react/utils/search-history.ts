import { getCookie, setCookie } from './dom-utils'

/**
 * Persistence layer for the autocomplete search-history list.
 *
 * History is stored in the `biggy-search-history` cookie as a comma-separated
 * list of percent-encoded entries. Per-entry encoding is what makes the comma
 * a safe separator: any character (including `,`, `=`, `;`, `%`) survives the
 * round-trip because it is escaped as `%XX` before being joined.
 *
 * Spec: is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
 */

const HISTORY_COOKIE_KEY = 'biggy-search-history'
const HISTORY_SEPARATOR = ','
const DEFAULT_HISTORY_LIMIT = 5

function encodeHistoryEntry(term: string): string {
  return encodeURIComponent(term)
}

function decodeHistoryEntry(entry: string): string {
  try {
    return decodeURIComponent(entry)
  } catch {
    // Legacy entries written before per-entry encoding may contain a raw `%`
    // that is not part of a valid triplet; fall back to the literal value.
    return entry
  }
}

export function readSearchHistory(): string[] {
  const raw = getCookie(HISTORY_COOKIE_KEY) ?? ''

  return raw
    .split(HISTORY_SEPARATOR)
    .filter(entry => !!entry)
    .map(decodeHistoryEntry)
}

export function prependSearchHistory(
  term: string,
  limit: number = DEFAULT_HISTORY_LIMIT
): void {
  if (term == null || term.trim() === '') {
    return
  }

  let history = readSearchHistory()

  if (history.indexOf(term) < 0) {
    history.unshift(term)
    history = history.slice(0, limit)
  }

  setCookie(
    HISTORY_COOKIE_KEY,
    history.map(encodeHistoryEntry).join(HISTORY_SEPARATOR)
  )
}
