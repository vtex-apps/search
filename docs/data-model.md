<!-- managed-by: golden-path v1 -->

# Data model

`vtex.search` does not own a server-side data model. It is a Store Framework app rendering blocks and exposing one client utility (`BiggyClient`) that issues Apollo queries against `vtex.store-resources`. The "model" is therefore the contract between Autocomplete UI components, the GraphQL responses from `store-resources`, and the local cookies written by this app.

## Block contract (from `store/interfaces.json`)

| Block name | React component | Required children |
|---|---|---|
| `autocomplete-result-list.v2` | `Autocomplete` (`react/Autocomplete.js`) | `product-summary` (`vtex.product-summary`) |
| `did-you-mean` | `DidYouMean` (`react/DidYouMean.js`) | — |
| `search-suggestions` | `Suggestions` (`react/Suggestions.js`) | — |
| `search-banner` | `Banner` (`react/Banner.js`) | — |

For prop-level configuration (block content schemas, CSS handles), see the per-block markdown under `docs/`.

## Client surface — `BiggyClient` (`react/utils/biggy-client.ts`)

`BiggyClient` is constructed with an Apollo `ApolloClient<any>` instance and exposes three query methods plus history helpers.

### `topSearches()`

```ts
topSearches(): Promise<ApolloQueryResult<{ topSearches: ISearchesOutput }>>
```

Issues `vtex.store-resources/QueryTopSearches`. Returns the platform's currently popular search terms. No variables.

### `suggestionSearches(term)`

```ts
suggestionSearches(term: string): Promise<ApolloQueryResult<{ autocompleteSearchSuggestions: ISearchesOutput }>>
```

Issues `vtex.store-resources/QueryAutocompleteSearchSuggestions` with `{ fullText: term }`. Returns text-side autocomplete suggestions.

### `suggestionProducts(term, ...)`

```ts
suggestionProducts(
  term: string,
  attributeKey?: string,
  attributeValue?: string,
  productOrigin = false,
  simulationBehavior: 'default' | 'skip' | null = 'default',
  hideUnavailableItems = false,
  orderBy?: string,
  count?: number,
  shippingOptions?: string[],
  advertisementOptions?: AdvertisementOptions
): Promise<ApolloQueryResult<{ productSuggestions: IProductsOutput }>>
```

Issues `vtex.store-resources/QuerySuggestionProducts` with the named variables plus:

- `variant` ← cookie `sp-variant` (A/B routing)
- `origin` ← `'autocomplete'`

Uses `fetchPolicy: 'network-only'` (autocomplete should never serve stale Apollo cache).

> **Backwards compatibility:** Adding new optional params is safe. Removing or reordering existing ones is breaking for host apps importing `BiggyClient`.

### History helpers

```ts
searchHistory(): string[]
prependSearchHistory(term: string, limit = 5): void
```

Read/write the **`biggy-search-history`** cookie. Format: comma-joined list capped at 5 entries. Empty terms are ignored. Existing terms are deduped (moved to the front).

## Response shapes

```ts
interface ISearchesOutput {
  searches: {
    term: string
    count: number
    attributes: Array<{
      key: string
      value: string
      labelKey: string
      labelValue: string
    }>
  }[]
}

interface IProductsOutput {
  products: ISearchProduct[]   // see react/models/search-product
  count: number
  misspelled: boolean
  operator: string
  searchId: string
}
```

The shape of `ISearchProduct` is owned by the IS backend and surfaced through `vtex.store-resources`. Treat it as external.

## Cookies and local storage

| Key | Type | Owner | Purpose |
|---|---|---|---|
| `biggy-search-history` | cookie | **this repo** | Local search history for the autocomplete dropdown. Format: comma-joined list, max 5 entries. |
| `sp-variant` | cookie | external (IS A/B routing) | Read-only here. Forwarded to IS as the `variant` GraphQL variable. |

This app does **not** read or write `localStorage['vtex.search.pickupInPoint']` (owned by `vtex.delivery-promise-components`).
