import { prependSearchHistory, readSearchHistory } from '../search-history'

// These tests pin the cookie-encoding contract for the autocomplete history
// list. The cookie value is a comma-separated string, but each individual
// entry must be percent-encoded so any character (including `,`, `=`, `;`,
// `%`) can appear in a term without colliding with the separator.
//
// Spec: is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md

describe('search-history cookie storage', () => {
  let cookieJar: string

  beforeEach(() => {
    cookieJar = ''

    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => cookieJar,
      set: (value: string) => {
        // Naive cookie-jar: replace if the same key exists, otherwise append.
        const [pair] = value.split(';')
        const [key] = pair.split('=')
        const existing = cookieJar
          .split('; ')
          .filter(c => c && !c.startsWith(`${key}=`))

        existing.push(pair)
        cookieJar = existing.join('; ')
      },
    })
  })

  it('round-trips a term containing a comma without splitting it into two entries', () => {
    prependSearchHistory('shoes, size 10')

    expect(readSearchHistory()).toEqual(['shoes, size 10'])
  })

  it('preserves multiple entries when one of them contains a comma', () => {
    prependSearchHistory('emergency')
    prependSearchHistory('shoes, size 10')
    prependSearchHistory('emt')

    expect(readSearchHistory()).toEqual(['emt', 'shoes, size 10', 'emergency'])
  })

  it('handles terms containing a forward slash', () => {
    prependSearchHistory('12/3 Romex')

    expect(readSearchHistory()).toEqual(['12/3 Romex'])
  })

  it('handles terms containing percent characters', () => {
    prependSearchHistory('50% off')

    expect(readSearchHistory()).toEqual(['50% off'])
  })

  it('handles terms containing semicolons and equal signs', () => {
    prependSearchHistory('key=value;next')

    expect(readSearchHistory()).toEqual(['key=value;next'])
  })

  it('does not duplicate an entry that already exists in the history', () => {
    prependSearchHistory('shoes')
    prependSearchHistory('boots')
    prependSearchHistory('shoes')

    expect(readSearchHistory()).toEqual(['boots', 'shoes'])
  })

  it('caps the history at the provided limit', () => {
    prependSearchHistory('a', 3)
    prependSearchHistory('b', 3)
    prependSearchHistory('c', 3)
    prependSearchHistory('d', 3)

    expect(readSearchHistory()).toEqual(['d', 'c', 'b'])
  })

  it('returns an empty array when the cookie is missing', () => {
    expect(readSearchHistory()).toEqual([])
  })

  it('ignores empty or whitespace-only terms', () => {
    prependSearchHistory('')
    prependSearchHistory('   ')

    expect(readSearchHistory()).toEqual([])
  })
})
