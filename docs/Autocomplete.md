# Autocomplete

## Description

`Autocomplete` is an alternative for the default VTEX autocomplete. It includes:

- Top Searches.
- Search History.
- Product Suggestions.
- Term Suggestions.

You can read a detailed explanation of Autocomplete and it's features [here](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/4gXFsEWjF7QF7UtI2GAvhL).

## Usage

Add `autocomplete-result-list.v2` into the blocks of a `search-bar`. We also recommend to set `openAutocompleteOnFocus` as shown.

```json
{
  "autocomplete-result-list.v2": {
    "blocks": ["product-summary"]
  },
  "search-bar": {
    "blocks": ["autocomplete-result-list.v2"],
    "props": {
      "openAutocompleteOnFocus": true
    }
  }
}
```

### Props

| Prop name              | Type                                              | Description                                                   | Default value |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------- | ------------- |
| `maxTopSearches`       | `Number`                                          | Maximum number of terms in the top searches list              | `10`          |
| `maxHistory`           | `Number`                                          | Maximum number of terms in the search history list            | `5`           |
| `maxSuggestedProducts` | `Number`                                          | Maximum number of suggested products                          | `3`           |
| `maxSuggestedTerms`    | `Number`                                          | Maximum number of suggested terms                             | `3`           |
| `autocompleteWidth`    | `Number`                                          | Autocomplete width. Number between `0` and `100`              | -             |
| `productLayout`        | [`ProductLayoutEnum`](#productlayoutenum)         | Defines the product layout in the suggested products list     | -             |
| `hideTitles`           | `Boolean`                                         | If true, all the titles will be hidden                        | `false`       |
| `historyFirst`         | `Boolean`                                         | If true, the history list will be prioritized                 | `false`       |
| `customBreakpoints`    | [`CustomBreakpointsProp`](#custombreakpointsprop) | Defines a maximum number of suggested products by breakpoints | -             |

#### ProductLayoutEnum

| Enum name    | Enum value   |
| ------------ | ------------ |
| `Horizontal` | `HORIZONTAL` |
| `Vertical`   | `VERTICAL`   |

#### CustomBreakpointsProp

| Prop name | Type                                | Description                                  | Default value |
| --------- | ----------------------------------- | -------------------------------------------- | ------------- |
| `md`      | [`BreakpointProp`](#breakpointprop) | Defines the options for the `md` breakpoint  | -             |
| `lg`      | [`BreakpointProp`](#breakpointprop) | Defines the options for the `lg` breakpoint  | -             |
| `xlg`     | [`BreakpointProp`](#breakpointprop) | Defines the options for the `xlg` breakpoint | -             |

#### BreakpointProp

| Prop name              | Type     | Description                                             | Default value |
| ---------------------- | -------- | ------------------------------------------------------- | ------------- |
| `width`                | `Number` | Minimum width for the breakpoint                        | -             |
| `maxSuggestedProducts` | `Number` | Maximum number of suggested products for the breakpoint | -             |
