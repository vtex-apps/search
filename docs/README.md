# VTEX Search

The VTEX Search is an app that handles the result of our Search and Engagement API, used to provide
a more complete search experience.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Usage](#usage)
  - [Catalog Integration](#catalog-integration)
  - [UI Components](#ui-components)
    - [Autocomplete](#autocomplete)
    - [Search Result Complements](#search-result-complements)
  - [Admin Permission](#admin-permission)
  - [Google Analytics Configuration](#google-analytics-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Usage

The first step to start using this app is to install the `vtex.admin-search` and the `vtex.search-resolver@1.x` in the desired workspace, using:

```sh
vtex install vtex.admin-search vtex.search-resolver@1.x
```

### Catalog Integration

### UI Components
If you want to use our UI components you need import this app in your dependencies on the `manifest.json`.

```json
{
  "dependencies": {
    "vtex.search": "0.x"
  }
}
```

#### Autocomplete

We provide a customized autocomplete with new features. It includes:

- Top searches list
- Search history list
- Product suggestion
- Search term suggestion

To use our autocomplete, first, you need to declare a block for it.

```json
{
  "autocomplete-result-list.v2": {
    "blocks": ["product-summary"]
  }
}
```

Finally, append this block in the search bar. To improve the client experience, we also recommend to add the `openAutocompleteOnFocus` prop.

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

A full documentation of our custom autocomplete can be found [here](Autocomplete.md).

#### Search Result Complements

This app has three new components to improve the search result experience. They are:

- [`did-you-mean`](DidYouMean.md). A possible misspelling correction for the current query.
- [`search-suggestion`](Suggestions.md). A list of search terms similar to the query.
- [`search-banner`](Banner.md). A banner that can be configured by query.

Add any of these components into the `search-result-layout.desktop` or the `search-result-layout.mobile` block.

```json
"search-result-layout.desktop": {
    "children": [
      "flex-layout.row#didyoumean",
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
  "flex-layout.row#didyoumean": {
    "children": ["did-you-mean"]
  },
  "flex-layout.row#suggestion": {
    "children": ["search-suggestions"]
  },
  "flex-layout.row#suggestion": {
    "children": ["search-banner#one"]
  },
  "search-banner#one": {
    "props": {
      "area": "one",
      "blockClass": "myBanner",
      "horizontalAlignment": "center"
    }
  }
```

### Admin Permission

If you are facing the following error message:

```
User indicated by VtexIdclientAutCookie is not authorized to access the indicated resource
```

your user doesn't have permission to change the search configurations. Ask an admin to give you the `Search Settings - General Settings` permission.

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/search/issues). Also, feel free to [open issues](https://github.com/vtex-apps/search/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
