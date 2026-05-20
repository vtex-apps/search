import { buildHistoryItemValue } from '../history-items'

// These tests pin the contract described in
// is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
// (US-1 — history link survives reserved characters in the term).
describe('buildHistoryItemValue', () => {
  it('returns the term unchanged when it contains no URL-significant characters', () => {
    expect(buildHistoryItemValue('shoes')).toBe('shoes')
  })

  it('encodes "/" using the codebase-internal "$2F" placeholder', () => {
    // Mirrors the encoding applied by Autocomplete#contentWhenQueryIsNotEmpty
    // (see TileList "see-all" link). History rows must use the same encoding
    // so the path slug survives interpolation by vtex.render-runtime <Link>.
    expect(buildHistoryItemValue('12/3 Romex')).toBe('12$2F3 Romex')
  })

  it('encodes every "/" in a term that contains multiple slashes', () => {
    expect(buildHistoryItemValue('1/2/3 cable')).toBe('1$2F2$2F3 cable')
  })

  it('is idempotent against legacy entries that may already be encoded', () => {
    const encodedOnce = buildHistoryItemValue('12/3 Romex')
    const encodedTwice = buildHistoryItemValue(encodedOnce)

    expect(encodedTwice).toBe(encodedOnce)
  })

  it('preserves a literal "%2F" instead of double-encoding it', () => {
    expect(buildHistoryItemValue('12%2F3 Romex')).toBe('12%2F3 Romex')
  })
})
