> :warning:
>
> **Warning:** You’re reading the documentation for `vtex.search@0.x`.
>
> Consider chatting with Search & Personalization team about a migration.
>
> You can read about [latest version](https://github.com/vtex-apps/search/).

# VTEX Intelligent Search

The VTEX Search is an app that handles the result of our Search and Personalization API, used to provide
a more complete search experience.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Usage](#usage)
  - [Indexing Process](#indexing-process)
  - [Custom Search Page URL](#custom-search-page-url)
  - [Autocomplete](#autocomplete)
  - [Search Result Complements](#search-result-complements)
  - [PriceRange](#pricerange)
  - [Plug & Play](#plug--play)
  - [Google Analytics Configuration](#google-analytics-configuration)
- [Blocks API](#blocks-api)
  - [Demo Store-Theme](#demo-store-theme)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Usage

The first step to start using this app is to install the `vtex.search@0.x` and the `vtex.admin-search` in the desired workspace, using:

```sh
vtex install vtex.search@0.x vtex.admin-search
```

This app uses our store builder with the blocks architecture.
To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app you need to import it in your dependencies on the `manifest.json`.

```json
{
  "dependencies": {
    "vtex.search": "0.x"
  }
}
```

Then, add the `store.search.v2` block into your app theme.

```json
{
  "store.search.v2": {
    "blocks": ["search-result-layout"]
  }
}
```

### Indexing Process

After installing our suite of apps, your workspace is ready to begin it's Search journey, but first we need to index your
account's catalog in our Search Engine.

Go to your Admin page and click on the menu [Search > Integration Settings](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/6wKQgKmu2FT6084BJT7z5V)
and start the Indexing Process.

![](https://images.ctfassets.net/alneenqid6w5/6Dhh6x6Roi1vRePJDtbOFY/d642a9f13d421ef3f3062a5ff261ff39/config-int-EN.png)

### Custom Search Page URL

This will provide your store with a new route `/search` that will handle all search navigation
from now on, but first, you need to redirect the `search-bar` requests to this new route, using
the `customSearchPageUrl` prop on the `search-bar` component.

```json
{
  "search-bar": {
    "props": {
      "customSearchPageUrl": "/search?_query=${term}"
    }
  }
}
```

### Autocomplete

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
      "customSearchPageUrl": "/search?_query=${term}",
      "openAutocompleteOnFocus": true
    }
  }
}
```

A full documentation of our custom autocomplete can be found [here](Autocomplete.md).

### Search Result Complements

This app has three new components to improve the search result experience. They are:

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
      "preventRouteChange": false,
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

### PriceRange

![pricerange](https://user-images.githubusercontent.com/40380674/74041833-28bb0c80-49a5-11ea-8e20-7720ac63548f.gif)

In order to add the PriceRange feature in the filter navigator, add `priceRangeKey` in the `context` prop of `store.search.v2`. The value is the price filter key (usually `price`, `precio` or `preco`).

```json
"store.search.v2": {
  "blocks": ["search-result-layout"],
  "props": {
    "context": {
      "priceRangeKey": "price",
    }
  }
},
```

### Plug & Play

For our app to be as _Plug & Play_ as possible it's necessary to follow the good conventions for developing
[`store-themes`](https://github.com/vtex-apps/store-theme) like using open-source components developed by
the [`vtex-apps`](https://github.com/vtex-apps) organization.

Our app is heavily dependent, as seen above, on two major components: [`search-bar`](https://github.com/vtex-apps/store-components/blob/master/docs/SearchBar.md)
and [`search-result`](https://vtex.io/docs/app/vtex.search-result). Our components are developed with the default
implementations in mind, so keep that in mind when using custom components. For custom or closed-source components
to work perfectly with our own, it should resemble both these components as closely as possible.

If you're using any type of custom components on your `store-theme` we can't guarantee the _Plug & Play_
functionality of the components provided by this app.

### Google Analytics Configuration

Our search engine uses `_query` as the querystring for the search term. If you want to track the search in GA you need to register it.

Inside Google Analytics, go to Admin → View → View Settings. Then, on the Site Search Settings block, add a new parameter called `_query` into Query Parameter input. Query Parameter field accepts up to 5 different parameters.

![image](https://user-images.githubusercontent.com/40380674/71663408-de09fd00-2d33-11ea-96bb-f9c6e48312a8.png)

## Blocks API

When implementing this app as a block, various inner blocks may be available.

```json
{
  "store.search.v2": {
    "allowed": ["search-result", "search-result-layout"]
  }
}
```

### Demo Store-Theme

You can find our demo store-theme with our search app already installed and configured by following this [`repository`](https://github.com/vtex-apps/search-demo-theme).

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/search/issues). Also, feel free to [open issues](https://github.com/vtex-apps/search/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
