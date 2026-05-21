import {
  decodeUrlString,
  encodeUrlString,
  removeBaseUrl,
} from '../string-utils'

describe('encodeUrlString', () => {
  it('returns the input verbatim when there are no slash characters', () => {
    expect(encodeUrlString('shoes')).toBe('shoes')
    expect(encodeUrlString('')).toBe('')
    expect(encodeUrlString('12 3 Romex')).toBe('12 3 Romex')
  })

  it('replaces every "/" with the "$2F" placeholder', () => {
    expect(encodeUrlString('12/3 Romex')).toBe('12$2F3 Romex')
    expect(encodeUrlString('/leading')).toBe('$2Fleading')
    expect(encodeUrlString('trailing/')).toBe('trailing$2F')
    expect(encodeUrlString('1/2/3 cable')).toBe('1$2F2$2F3 cable')
  })

  it('is idempotent (encoding an already-encoded value is a no-op)', () => {
    const once = encodeUrlString('12/3 Romex')
    const twice = encodeUrlString(once)

    expect(twice).toBe(once)
  })

  it('preserves a literal "%2F" already present in the term (no double-encoding)', () => {
    // Legacy / copy-pasted terms may already contain a percent-encoded slash.
    // encodeUrlString must not turn "%2F" into "%2$2F" or similar.
    expect(encodeUrlString('12%2F3 Romex')).toBe('12%2F3 Romex')
  })
})

describe('decodeUrlString', () => {
  it('returns the input verbatim when there is no "$2F" placeholder', () => {
    expect(decodeUrlString('shoes')).toBe('shoes')
    expect(decodeUrlString('')).toBe('')
    expect(decodeUrlString('12 3 Romex')).toBe('12 3 Romex')
  })

  it('replaces "$2F" (case-insensitive) with "/"', () => {
    expect(decodeUrlString('12$2F3 Romex')).toBe('12/3 Romex')
    expect(decodeUrlString('12$2f3 Romex')).toBe('12/3 Romex')
    expect(decodeUrlString('1$2F2$2F3 cable')).toBe('1/2/3 cable')
  })

  it('is the inverse of encodeUrlString for terms that do not contain "$2F" naturally', () => {
    const samples = ['shoes', '12/3 Romex', '/leading', 'trailing/', 'a/b/c']

    for (const term of samples) {
      expect(decodeUrlString(encodeUrlString(term))).toBe(term)
    }
  })
})

describe('removeBaseUrl', () => {
  it('strips a leading http(s) origin', () => {
    expect(removeBaseUrl('https://example.com/foo?bar=1')).toBe('/foo?bar=1')
    expect(removeBaseUrl('http://example.com:8080/foo')).toBe('/foo')
  })

  it('returns the input unchanged when no origin is present', () => {
    expect(removeBaseUrl('/foo?bar=1')).toBe('/foo?bar=1')
  })
})
