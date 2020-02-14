# VTEX Search

The VTEX Search is an app that handles the result of our Search and Engagement API, used to provide
a more complete search experience.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Usage](#usage)
  - [Custom Search Page URL](#custom-search-page-url)
  - [Autocomplete](#autocomplete)
  - [Order Options](#order-options)
  - [Enhanced Search Result](#enhanced-search-result)
  - [PriceRange](#pricerange)
  - [Plug & Play](#plug--play)
  - [Catalog Integration](#catalog-integration)
  - [Admin Permission](#admin-permission)
  - [Google Analytics Configuration](#google-analytics-configuration)
- [Blocks API](#blocks-api)
  - [Demo Store-Theme](#demo-store-theme)
  - [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Usage

The first step to start using this app is to install the `vtex.search` and the `vtex.admin-search` in the desired workspace, using:

```sh
vtex install vtex.search vtex.admin-search
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

### Order Options

We don't yet support some of the ordering options that are supported by the current search implementation,
so they should be hidden so that it doesn't confuse your customers. You can hide ordering options by
passing them to the `hiddenOptions` prop on the `order-by` component.

```json
{
  "order-by": {
    "props": {
      "hiddenOptions": [
        "OrderByReleaseDateDESC",
        "OrderByNameASC",
        "OrderByNameDESC"
      ]
    }
  }
}
```

### Enhanced Search Result

This app has three new components to improve the search result experience. They are:

- [`did-you-mean`](DidYouMean.md). A possible misspelling correction for the current query.
- [`search-suggestion`](Suggestions.md). A list of search terms similar to the query.
- [`search-banner`](Banner.md). A banner that can be configured by query.

To add these components to your search-result page, you need to use the `search-result-layout.desktop.enhanced` and `search-result-layout.mobile.enhanced` instead of `search-result-layout.desktop` and `search-result-layout.mobile`. Here is an implementation example:

```json
"search-result-layout.desktop.enhanced": {
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
  "search-banner#one": {
    "props": {
      "area": "one",
      "blockClass": "myBanner",
      "horizontalAlignment": "center"
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

### Catalog Integration

For this new search experience to work properly a Token and App Key need to be generated. You can follow an in-depth tutorial on how to create both the Token and the App Key
[here](https://help.vtex.com/tutorial/criar-appkey-e-apptoken-para-autenticar-integracoes).
Finally, in the admin's sidebar, click on **Search** and then on **Integration Settings**. Inform the generated keys and click on **Save**

You'll also need to set up the affiliate API endpoint, you can follow [this tutorial](https://help.vtex.com/tutorial/configuring-affiliates--tutorials_187)
on how to properly set up this step.

The Search endpoint used for the affiliate API should be:

```
http://api.biggylabs.com.br/track-api/v2/affiliate
```

If you end up having any questions about this step, feel free to send an e-mail to `biggy@vtex.com.br`
with the subject `[YOUR STORE] Search App - Catalog Integration`.

### Admin Permission

If you are facing the following error message:

```
User indicated by VtexIdclientAutCookie is not authorized to access the indicated resource
```

your user doesn't have permission to change the search configurations. Ask an admin to give you the `Search Settings - General Settings` permission.

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

### Configuration

:hammer: Work in Progress...

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/search/issues). Also, feel free to [open issues](https://github.com/vtex-apps/search/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
