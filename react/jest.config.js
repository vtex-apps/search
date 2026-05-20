// managed-by: spec/fix-autocomplete-history-link-encoding
// Extends the @vtex/test-tools preset. Coverage thresholds are intentionally
// not enforced yet — see Decision 3 in
// is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md.
module.exports = {
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/typings/**',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
}
