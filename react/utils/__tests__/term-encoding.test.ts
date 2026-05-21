import { encodeSearchTerm } from '../term-encoding'

// These tests pin the contract described in
// is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
// (US-1 — history link survives reserved characters in the term, and the
// see-all link in the autocomplete tile list shares the same encoding).

describe('encodeSearchTerm', () => {
  it('returns the term unchanged when it contains no URL-significant characters', () => {
    expect(encodeSearchTerm('shoes')).toBe('shoes')
  })

  it('encodes "/" using standard percent-encoding ("%2F"), matching the search bar', () => {
    // This is the canonical reference: vtex.store-components/react/SearchBar.tsx
    // calls `encodeURIComponent(inputValue)` on the typed term before navigating.
    expect(encodeSearchTerm('12/3 Romex')).toBe('12%2F3%20Romex')
  })

  it('encodes every "/" in a term that contains multiple slashes', () => {
    expect(encodeSearchTerm('1/2/3 cable')).toBe('1%2F2%2F3%20cable')
  })

  it('is idempotent against legacy entries that may already be encoded', () => {
    // History items from the cookie may already be percent-encoded. The helper
    // must not double-encode them.
    const encodedOnce = encodeSearchTerm('12/3 Romex')
    const encodedTwice = encodeSearchTerm(encodedOnce)

    expect(encodedTwice).toBe(encodedOnce)
  })

  it('preserves an already-encoded "%2F" without double-encoding it as "%252F"', () => {
    expect(encodeSearchTerm('12%2F3 Romex')).toBe('12%2F3%20Romex')
  })

  it('also recognises the lowercase "%2f" form', () => {
    expect(encodeSearchTerm('12%2f3 Romex')).toBe('12%2F3%20Romex')
  })

  it('falls back to verbatim encoding when the input contains a malformed percent-triplet', () => {
    // "%ZZ" is not a valid triplet; decodeURIComponent throws, so the helper
    // must fall back to encoding the literal "%" as "%25" instead of crashing.
    expect(encodeSearchTerm('foo%ZZ')).toBe('foo%25ZZ')
  })
})
