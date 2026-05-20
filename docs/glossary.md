<!-- managed-by: golden-path v1 -->

# Glossary

Repo-local terms used in `vtex.search`. For cross-repo terminology (segment, trade policy, facets wire format, reserved facet keys, etc.), see [`is-io-specs/docs/glossary.md`](https://github.com/vtex/is-io-specs/blob/main/docs/glossary.md).

| Term | Meaning |
|---|---|
| **Autocomplete** | The suggestion dropdown rendered while the shopper is typing in a search input. Implemented by the `autocomplete-result-list.v2` block (`react/Autocomplete.js`). |
| **`autocomplete-result-list.v2`** | The active autocomplete block exported by this app. Requires `product-summary` as a child. There is no `.v1` exported here. |
| **`did-you-mean`** | A search-correction prompt rendered on the search results page when the IS backend suggests a spell-corrected query. Component: `react/DidYouMean.js`. |
| **`search-suggestions`** | Text-side suggestions list (separate from product suggestions). Component: `react/Suggestions.js`. |
| **`search-banner`** | A banner slot driven by IS results metadata. Component: `react/Banner.js`. |
| **BiggyClient** | The Apollo-client wrapper exported from `react/index.ts` for host apps. Source: `react/utils/biggy-client.ts`. Exposes `topSearches`, `suggestionSearches`, `suggestionProducts`, plus `searchHistory` / `prependSearchHistory` cookie helpers. |
| **`biggy-search-history` cookie** | Local search history rendered by Autocomplete. Format: comma-joined list capped at 5 entries. Owned by this repo. |
| **`sp-variant` cookie** | A/B variant identifier read by `BiggyClient.suggestionProducts` and passed to IS as the `variant` GraphQL variable. Read-only here; written elsewhere by the IS A/B routing system. |
| **vtex.store-resources** | Platform app providing the GraphQL queries this repo issues (`QueryAutocompleteSearchSuggestions`, `QuerySuggestionProducts`, `QueryTopSearches`). All search queries this app makes go through here. |
| **`react/models/search-product.ts`** | TypeScript interface for the product shape returned by IS for autocomplete previews. |
| **`prereleasy`** | The `manifest.json:scripts.prereleasy` hook (`bash pre.sh`). Runs as part of `vtex release`. |
| **Legacy `node/` folder** | `node/package.json` and `node/yarn.lock` exist but no `node` builder is declared in `manifest.json`. Treat as dead — Toolbelt does not package it. |
