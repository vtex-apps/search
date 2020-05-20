📢 Use this project, [contribute](https://github.com/vtex-apps/search) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Search

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The VTEX Search app is responsible for handling the new [**VTEX Intelligent Search**](https://help.vtex.com/tracks/vtex-intelligent-search) solution in IO stores by providing new UI components that enhance the search experience, such as the autocomplete feature.

![search-app-gif](https://user-images.githubusercontent.com/52087100/82367576-6d196800-99ea-11ea-9672-77fa2b90a581.gif)

## Configuration

:warning: The proper functioning of the Search app components relies on having already installed apps `vtex.admin-search` and `vtex.search-resolver@1.x` in your store. For more on this, access our Help Center track on [**VTEX Intelligent Search**](https://help.vtex.com/tracks/vtex-intelligent-search).

### Step 1 - Adding the Search app to your theme's dependencies

Add the `search` app to your theme's dependencies in the `manifest.json` as showed below:

```diff
  "dependencies": {
+   "vtex.search": "1.x"
  }
```

You are now able to use all of the blocks exported by the `search` app. Check the full list below:

| Block name | Description |
| -------------- | ----------------------------------------------- |
| `autocomplete-result-list.v2` | Provides customized autocomplete features in the search bar component, such as top searches, search history, product suggestions or term suggestions. You can read more about the Intelligent Search [autocomplete feature](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/4gXFsEWjF7QF7UtI2GAvhL) on VTEX Help Center. |
| `search-banner` | Renders a customized banner according to the search query performed. |
| `did-you-mean` | Helps users with possible misspelling corrections for the current search query. |
| `search-suggestions` | Renders a list of similar search terms for the current search query. |

:warning: The blocks `banner`, `did-you-mean` and `suggestions` require you to have [Search Results app](https://vtex.io/docs/components/all/vtex.search-result@3.59.0/) version 3.x or higher installed in your theme.

### Step 2 - Adding the Search's blocks into the theme

First, declare the `autocomplete-result-list.v2` block as a child block of the [`search-bar` block](https://vtex.io/docs/components/all/vtex.store-components/searchbar), exported by the Store Components app. For example:

```json
{
  "search-bar": {
    "blocks": ["autocomplete-result-list.v2"],
    "props": {
      "openAutocompleteOnFocus": true
    }
  }
}
```

#### `autocomplete-result-list.v2` props

The `autocomplete-result-list.v2` block also allows you to add a list of child blocks onto it.

This means that you can declare a theme block of your choosing and have it rendered among the autocomplete features. For example:

```json
{
  "autocomplete-result-list.v2": {
    "blocks": ["product-summary"]
  }
}
``` 

| Prop name                     | Type                                              | Description                                                   | Default value |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ | ------------- |
| `maxTopSearches`              | `Number`                                          | Maximum number of terms in the top searches list              | `10`          |
| `maxHistory`                  | `Number`                                          | Maximum number of terms in the search history list            | `5`           |
| `maxSuggestedProducts`        | `Number`                                          | Maximum number of suggested products                          | `3`           |
| `maxSuggestedTerms`           | `Number`                                          | Maximum number of suggested terms                             | `3`           |
| `autocompleteWidth`           | `Number`                                          | Autocomplete width. Number between `0` and `100`              | -             |
| `productLayout`               | [`ProductLayoutEnum`](#productlayoutenum)         | Defines the product layout in the suggested products list     | -             |
| `hideTitles`                  | `Boolean`                                         | If true, all the titles will be hidden                        | `false`       |
| `historyFirst`                | `Boolean`                                         | If true, the history list will be prioritized                 | `false`       |
| `customBreakpoints`           | [`CustomBreakpointsProp`](#custombreakpointsprop) | Defines a maximum number of suggested products by breakpoints | -             |
| `__unstableProductOriginVtex` | `Boolean`                                         | You can use this property as `true` if any of your product-summary props come with a `null` value. This is because some product information does not come by default in the Search. | `false`       |

##### ProductLayoutEnum

| Enum name    | Enum value   |
| ------------ | ------------ |
| `Horizontal` | `HORIZONTAL` |
| `Vertical`   | `VERTICAL`   |

##### CustomBreakpointsProp

| Prop name | Type                                | Description                                  |
| --------- | ----------------------------------- | -------------------------------------------- |
| `md`      | [`BreakpointProp`](#breakpointprop) | Defines the options for the `md` breakpoint  |
| `lg`      | [`BreakpointProp`](#breakpointprop) | Defines the options for the `lg` breakpoint  |
| `xlg`     | [`BreakpointProp`](#breakpointprop) | Defines the options for the `xlg` breakpoint |

##### BreakpointProp

| Prop name              | Type     | Description                                             |
| ---------------------- | -------- | ------------------------------------------------------- |
| `width`                | `Number` | Minimum width for the breakpoint                        |
| `maxSuggestedProducts` | `Number` | Maximum number of suggested products for the breakpoint |

Now, the time has come to add the last 3 search blocks: `search-banner`, `did-you-mean` and `search-suggestions`.

Those blocks, differently from `autocomplete-result-list.v2`, need to be added under the `search-result-layout.desktop` or the `search-result-layout.mobile` blocks, according to the Search Results block hierarchy.

Once added, these can be declared using their respective props for their configuration. For example:

```json
{
  "search-result-layout.desktop": {
    "children": [
      "flex-layout.row#did-you-mean",
      "flex-layout.row#suggestion",
      "flex-layout.row#banner-one",
      "flex-layout.row#result"
    ],
    "props": {
      "pagination": "show-more",
      "preventRouteChange": true,
      "mobileLayout": {
        "mode1": "small",
        "mode2": "normal"
      }
    }
  },

  "flex-layout.row#did-you-mean": {
    "children": ["did-you-mean"]
  },
  "flex-layout.row#suggestion": {
    "children": ["search-suggestions"]
  },
  "flex-layout.row#banner-one": {
    "children": ["search-banner#one"]
  },

  "search-banner#one": {
    "props": {
      "area": "one",
      "blockClass": "myBanner",
      "horizontalAlignment": "center"
    }
  }
}
```

#### `search-banner` props

| Prop name             | Type     | Description                                                             | Default value |
| --------------------- | -------- | ----------------------------------------------------------------------- | ------------- |
| `area`                | `String` | Idicates the area. It needs to match the area configured in the banner. | -             |
| `blockClass`          | `String` | Defines a custom class for the banner div.                              | -             |
| `horizontalAlignment` | `String` | Defines the horizontal alignment for the banner.                        | `"center"`    |

The possible values for `horizontalAlignment` are `"left"`, `"right"` and `"center"`
  
## Modus Operandi

The Search app is merely responsible for offering blocks that when rendered as components will improve the user's search experience in stores where the VTEX Intelligent Search engine is already supported. 
  
These components use `_q` as the query-string for the search term, meaning that if you wish to **track the searches** of your users in these components you'll need to add the `_q` query-string to the store's Google Analytics.

Find out how to do this by accessing our [Google Analytics search tracking](https://vtex.io/docs/recipes/store-management/setting-up-google-analytics-search-tracking/) documentation.
  
## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

### Banner

| CSS Handles    |
| -------------- |
| `searchBanner` |

### DidYouMean

| CSS Handles        |
| ------------------ |
| `didYouMeanPrefix` |
| `didYouMeanTerm`   |

### Suggestions

| CSS Handles             |
| ----------------------- |
| `suggestionsList`       |
| `suggestionsListPrefix` |
| `suggestionsListLink`   |
| `suggestionsListItem`   |


<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes out to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
