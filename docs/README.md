> :warning:
>
> **Warning:** You’re reading the documentation for `vtex.search@1.x`.
>
> You can read about [version 0.x here](https://github.com/vtex-apps/search/tree/0.x).

# VTEX Intelligent Search

The VTEX Search is an app that handles the result of the new [VTEX Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search),
used to provide a more complete search experience, by providing new functionality, components and a centralized hub for everything related to Search!

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Usage](#usage)
  - [Indexing Process](#indexing-process)
  - [UI Components](#ui-components)
    - [Autocomplete](#autocomplete)
    - [Search Result Complements](#search-result-complements)
  - [Admin Permission](#admin-permission)
  - [Google Analytics Configuration](#google-analytics-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Usage

The first step to start using [VTEX Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search) is to install
our suite of apps, that includes:

- `vtex.admin-search`, responsible for the VTEX Admin experience for [VTEX Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search). :computer:
- `vtex.search-resolver`, the underlying implementation of our search engine. :nerd_face:

You can do this easily by running:

```sh
vtex install vtex.admin-search vtex.search-resolver@1.x
```

The app you're reading the documentation right now, `vtex.search`, became the house of new UI components closely
related to the Search experience, it's not necessary to install it in your workspace and will be covered in [UI Components](#ui-components).

> :loudspeaker: **Important:** After installation, all navigation and search pages will be delivered by the new VTEX Search.
>
> Confirm that the [Indexing Process step](#indexing-process) has been completed successfully before promoting the app to `master`.

### Indexing Process

After installing our suite of apps, your workspace is ready to begin it's Search journey, but first we need to index your
account's catalog in our Search Engine.

Go to your Admin page and click on the menu [Search > Integration Settings](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/6wKQgKmu2FT6084BJT7z5V)
and start the Indexing Process.

![](https://images.ctfassets.net/alneenqid6w5/6Dhh6x6Roi1vRePJDtbOFY/d642a9f13d421ef3f3062a5ff261ff39/config-int-EN.png)

### UI Components

If you want to use our UI components you need import this app in your dependencies on the `manifest.json`.

```json
{
  "dependencies": {
    "vtex.search": "1.x"
  }
}
```

This app provides the following blocks:

- [Autocomplete](#autocomplete)
- [Banner](#search-result-complements)
- [DidYouMean](#search-result-complements)
- [Suggestions](#search-result-complements)

#### Autocomplete

We provide a customized autocomplete with new features. It includes:

- Top Searches.
- Search History.
- Product Suggestions.
- Term Suggestions.

You can read a detailed explanation of Autocomplete and it's features [here](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/4gXFsEWjF7QF7UtI2GAvhL).

To use our autocomplete, first, you need to declare a block for it in your `store/blocks.json`.

```json
{
  "autocomplete-result-list.v2": {
    "blocks": ["product-summary"]
  }
}
```

Finally, append this block to your Search Bar. To improve the client experience, we also recommend to add the `openAutocompleteOnFocus` prop.

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

> :loudspeaker: **Important:** These improvements work only in version 3.x of
> [search-result](https://vtex.io/docs/components/search/vtex.search-result@3.x/)

This app provides three new components to improve the search result experience. They are:

- [`did-you-mean`](DidYouMean.md). A possible misspelling correction for the current query.
- [`search-suggestion`](Suggestions.md). A list of search terms similar to the query.
- [`search-banner`](Banner.md). A banner that can be configured by query.

Add any of these components into the `search-result-layout.desktop` or the `search-result-layout.mobile` block.

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

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/search/issues).
Also, feel free to [open issues](https://github.com/vtex-apps/search/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
