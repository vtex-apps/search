📢 Use this project, [contribute](https://github.com/vtex-apps/search) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Search

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

The VTEX Search app handles the new [**VTEX Intelligent Search**](https://help.vtex.com/tracks/vtex-intelligent-search) solution in IO stores by providing new UI components to enhance the search experience, such as the autocomplete feature.

![search-app-gif](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-search-0.gif)

## Configuration

The Search app requires the `vtex.admin-search@1.x` and `vtex.search-resolver@1.x` apps to be installed in your store. For more information, read the [Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search) documentation.

To configure the Search app, see the sections below.

### Adding the Search app to your theme dependencies

Add the `search` app to your theme dependencies in the `manifest.json` as shown below:

```diff
  "dependencies": {
+   "vtex.search": "2.x"
  }
```

You can now use all blocks exported by the `search` app. See the full list below:

| Block name                    | Description                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autocomplete-result-list.v2` | Provides customized autocomplete features in the search bar component, such as top searches, search history, product suggestions, or term suggestions. You can read more about the Intelligent Search [autocomplete feature](https://help.vtex.com/en/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/4gXFsEWjF7QF7UtI2GAvhL) in the VTEX Help Center. |
| `search-banner`               | Renders a customized banner based on the search query.                                                                                                                                                                                                                                                                                                        |
| `did-you-mean`                | Helps users with possible misspelling corrections for the current search query.                                                                                                                                                                                                                                                                               |
| `search-suggestions`          | Renders a list of similar search terms for the current search query.                                                                                                                                                                                                                                                                                          |

> ℹ️ The `search-banner`, `did-you-mean`, and `search-suggestions` blocks require [Search Result app](https://developers.vtex.com/docs/apps/vtex.search-result) version `3.x` or higher installed in your theme.

### Adding Search blocks to the theme

First, declare the `autocomplete-result-list.v2` block as a child block of the [`search-bar` block](https://developers.vtex.com/docs/apps/vtex.store-components/searchbar), exported by the Store Components app. Example:

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

| Prop name                  | Type                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                       | Default value |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `maxTopSearches`           | `number`                | Maximum number of items in the top searches list.                                                                                                                                                                                                                                                                                                                                                                                 | `10`          |
| `maxHistory`               | `number`                | Maximum number of items in the search history list.                                                                                                                                                                                                                                                                                                                                                                               | `5`           |
| `maxSuggestedProducts`     | `number`                | Maximum number of items in the suggested products list.                                                                                                                                                                                                                                                                                                                                                                           | `3`           |
| `maxSuggestedTerms`        | `number`                | Maximum number of items in the suggested terms list.                                                                                                                                                                                                                                                                                                                                                                              | `3`           |
| `autocompleteWidth`        | `number`                | Autocomplete list width (percentage). This value must be between `0` and `100`.                                                                                                                                                                                                                                                                                                                                                   | `undefined`   |
| `productLayout`            | `enum`                  | Determines the layout the suggested products list will have when rendered. Possible values are `HORIZONTAL` and `VERTICAL`.                                                                                                                                                                                                                                                                                                       | `undefined`   |
| `hideTitles`               | `boolean`               | Determines whether all component titles will be hidden when rendered (`true`) or not (`false`).                                                                                                                                                                                                                                                                                                                                   | `false`       |
| `hideUnavailableItems`     | `boolean`               | Determines whether autocomplete should hide unavailable items (`true`) or not (`false`).                                                                                                                                                                                                                                                                                                                                          | `false`       |
| `historyFirst`             | `boolean`               | Determines whether the search history list should be prioritized over the other lists (`true`) or not (`false`).                                                                                                                                                                                                                                                                                                                  | `false`       |
| `customBreakpoints`        | `object`                | Determines the maximum number of recommended products per breakpoints. Possible values are `md`, `lg`, or `xlg`.                                                                                                                                                                                                                                                                                                                  | -             |
| `simulationBehavior`       | `"skip"` or `"default"` | If you want faster searches and are not so concern about having the most up-to-date prices and promotions, use `"skip"`.                                                                                                                                                                                                                                                                                                          | `default`     |
| `HorizontalProductSummary` | `product-summary` block | By default, the mobile autocomplete uses the `CustomListItem` component to render the suggested products using a horizontal layout. But sending a `product-summary` block here will render your customized Product Summary component. Read our documentation to learn [how to build a horizontal Product Summary](https://developers.vtex.com/docs/guides/vtex-io-documentation-building-a-horizontal-product-summary) component. | `undefined`   |

##### The `customBreakpoints` object

| Prop name | Type     | Description                                                                  | Default value |
| --------- | -------- | ---------------------------------------------------------------------------- | ------------- |
| `md`      | `object` | Defines the maximum number of recommended products for the `md` breakpoint.  | `undefined`   |
| `lg`      | `object` | Defines the maximum number of recommended products for the `lg` breakpoint.  | `undefined`   |
| `xlg`     | `object` | Defines the maximum number of recommended products for the `xlg` breakpoint. | `undefined`   |

##### The `md`, `lg`, and `xlg` objects

| Prop name              | Type     | Description                           | Default value |
| ---------------------- | -------- | ------------------------------------- | ------------- |
| `width`                | `number` | Breakpoint minimum width.             | `undefined`   |
| `maxSuggestedProducts` | `number` | Maximum number of suggested products. | `undefined`   |

The `autocomplete-result-list.v2` block also allows you to add a list of child blocks to it. You can declare a theme block and have it rendered among the autocomplete features. Example:

```json
{
  "autocomplete-result-list.v2": {
    "blocks": ["product-summary"]
  }
}
```

Now, you can add the last three search blocks: `search-banner`, `did-you-mean`, and `search-suggestions`.

These blocks, as opposed to `autocomplete-result-list.v2`, need to be added under the `search-result-layout.desktop` or the `search-result-layout.mobile` blocks, following the Search Results block hierarchy.

Once added, the blocks can be declared using their respective props for configuration. Example:

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

| Prop name             | Type     | Description                                                                                                                                                  | Default value |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `area`                | `string` | Area where the banner will be displayed in the store. This needs to match the predefined area value in the banner configuration.                             | `undefined`   |
| `blockClass`          | `string` | Unique block ID to be used in [CSS customizations](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization). | `undefined`   |
| `horizontalAlignment` | `string` | Defines the horizontal alignment of the banner. Possible values are `left`, `center`, or `right`.                                                            | `center`      |

## App behavior: Improving search experience

To improve the user's search experience in stores where the VTEX Intelligent Search engine is supported, the app have the following options:

- **Stores using Universal Analytics (UA)**
The Search app provides blocks that, when rendered as components, will improve the user's search experience in stores where the VTEX Intelligent Search engine is supported.

These components use `_q` as the query-string for the search term, meaning that if you want to track user searches in these components, you will need to add the `_q` query-string to the store's Google Analytics. To activate this behavior, refer to [Set up Site Search](https://support.google.com/analytics/answer/1012264?hl=en#zippy=%2Cin-this-article) Google's documentation.

**Please note that although the Search app's blocks enhance the search experience in VTEX stores, this feature is only compatible with VTEX stores using UA. As UA will be discontinued on July 1st, 2023, we highly recommend that you update your store to GA4. For more information of the migration, see the [release notes](https://developers.vtex.com/updates/release-notes/2023-05-04-google-tag-manager-new-version) and follow the option below.**

- **Store using Google Analytics 4 (GA4)**
Install the VTEX Google Tag Manager app, which includes the `search` event within the app's data layer. This app is responsible for tracking the user's search activity. For instructions on setting up Google Tag Manager, consult the [Setting up Google Tag Manager](https://developers.vtex.com/docs/guides/vtex-io-documentation-setting-up-google-tag-manager) documentation.

## Customization

In order to apply CSS customizations to this and other blocks, follow the instructions given in the recipe on [Using CSS handles for store customizations](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS handles           |
| --------------------- |
| `searchBanner`        |
| `didYouMeanPrefix`    |
| `didYouMeanTerm`      |
| `suggestionsList`     |
| `suggestionsListItem` |
| `suggestionsListLink` |
| `itemListSubItemLink` |
| `itemListLink`        |
| `itemListLinkTitle`   |

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
