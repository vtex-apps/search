# Autocomplete

Autocomplete is the [Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb) feature that displays previous search results based on current and previous searches. These results are presented in four different lists, which can be together or separated, depending on the customer's interaction. It includes:

- Top Searches.
- Search History.
- Search Suggestions.
- Product Suggestions.

During the interaction with the search bar, VTEX Intelligent Search immediately displays the set of Top Searches and Search History (if the customer has done searches before).

When the user starts typing, the system displays the Search suggestions and the Product suggestions and removes the previous lists.

You can read a detailed explanation of Autocomplete and its features in the [Autocomplete](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/4gXFsEWjF7QF7UtI2GAvhL) user guide.

## Before you begin

Make sure you have added the `search` app to your theme dependencies in the `manifest.json` as shown below:

```json
  "dependencies": {
    "vtex.search": "2.x"
  }
```

Check the [Search](https://developers.vtex.com/docs/apps/vtex.search) app documentation for more details on this step.

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

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `maxTopSearches` | `Number` | Maximum number of terms in the top searches list. | `10` |
| `maxHistory` | `Number` | Maximum number of terms in the search history list. | `5` |
| `maxSuggestedProducts` | `Number` | Maximum number of suggested products. | `3` |
| `maxSuggestedTerms` | `Number` | Maximum number of suggested terms. | `3` |
| `autocompleteWidth` | `Number` | Autocomplete width. Number between `0` and `100`. | - |
| `productLayout` | [`ProductLayoutEnum`](#productlayoutenum) | Defines the product layout in the suggested products list. | - |
| `hideTitles` | `Boolean` | If true, all the titles will be hidden. | `false` |
| `historyFirst` | `Boolean` | If true, the Search History list will be prioritized. | `false` |
| `customBreakpoints` | [`CustomBreakpointsProp`](#custombreakpointsprop) | Defines a maximum number of suggested products by breakpoints. | -             |
| `__unstableProductOriginVtex` | `Boolean` | You can use this property as `true` if any of your product-summary props come with a `null` value. This is because some product information does not come by default in the Search. | `false` |
| `simulationBehavior` | `"skip"` or `"default"` | If you want faster searches and do not care about most up to date prices and promotions, use `"skip"` value. | `default` |
| `customPage` | `string` | Defines a custom page to the autocomplete links. Example: `store.search.custom`. |  `store.search` |
| `orderBy` | `enum` | Decides which order products must follow when displayed. The possible values are named after the order type: `OrderByTopSaleDESC`, `OrderByReleaseDateDESC`, `OrderByBestDiscountDESC`, `OrderByPriceDESC`, `OrderByPriceASC`, `OrderByNameASC`, `OrderByNameDESC` or `OrderByScoreDESC` ([relevance Score](https://help.vtex.com/en/tutorial/how-does-the-score-field-work--1BUZC0mBYEEIUgeQYAKcae)). `ASC` and `DESC` stand for ascending order and descending order, respectively. | `OrderByScoreDESC` |

#### ProductLayoutEnum

| Enum name    | Enum value   |
| ------------ | ------------ |
| `Horizontal` | `HORIZONTAL` |
| `Vertical`   | `VERTICAL`   |

#### CustomBreakpointsProp

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `md` | [`BreakpointProp`](#breakpointprop) | Defines the options for the `md` breakpoint.  | - |
| `lg` | [`BreakpointProp`](#breakpointprop) | Defines the options for the `lg` breakpoint. | - |
| `xlg` | [`BreakpointProp`](#breakpointprop) | Defines the options for the `xlg` breakpoint. | - |

#### BreakpointProp

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `width` | `Number` | Minimum width for the breakpoint. | - |
| `maxSuggestedProducts` | `Number` | Maximum number of suggested products for the breakpoint. | - |
