# Autocomplete

## Description

`Autocomplete` is an alternative for the default VTEX autocomplete. It includes

- Top searches list
- Search history list
- Product suggestion
- Search term suggestion

## Usage

Add `autocomplete-result-list.v2` into the blocks of a `search-bar`. We also recommend to set `customSearchPageUrl` and `openAutocompleteOnFocus` as shown.

```json
{
  "autocomplete-result-list.v2": {
    "blocks": ["product-summary"]
  },
  "search-bar": {
    "blocks": ["autocomplete-result-list.v2"],
    "props": {
      "customSearchPageUrl": "/search?_query=${term}",
      "openAutocompleteOnFocus": true
    }
  }
}
```

### Props

| Prop name              | Type                                      | Description                                               | Default value |
| ---------------------- | ----------------------------------------- | --------------------------------------------------------- | ------------- |
| `maxTopSearches`       | `Number`                                  | Maximum number of terms in the top searches list          | `10`          |
| `maxHistory`           | `Number`                                  | Maximum number of terms in the search history list        | `5`           |
| `maxSuggestedProducts` | `Number`                                  | Maximum number of suggested products                      | `3`           |
| `maxSuggestedTerms`    | `Number`                                  | Maximum number of suggested terms                         | `3`           |
| `autocompleteWidth`    | `Number`                                  | Autocomplete width. Number between `0` and `100`          | -             |
| `productLayout`        | [`ProductLayoutEnum`](#productlayoutenum) | Defines the product layout in the suggested products list | -             |
| `hideTitles`           | `Boolean`                                 | If true, all the titles will be hidden                    | `false`       |
| `historyFirst`         | `Boolean`                                 | If true, the history list will be prioritized             | `false`       |

#### ProductLayoutEnum

| Enum name    | Enum value   |
| ------------ | ------------ |
| `Horizontal` | `HORIZONTAL` |
| `Vertical`   | `VERTICAL`   |
