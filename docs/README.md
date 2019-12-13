# VTEX Search

The VTEX Search is an app that handles the result of our Search and Engagement API, used to provide
a more complete search experience.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Usage](#usage)
  - [Custom Search Page URL](#custom-search-page-url)
  - [Autocomplete](#autocomplete)
  - [Order Options](#order-options)
  - [Catalog Integration](#catalog-integration)
- [Blocks API](#blocks-api)
  - [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

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

### Catalog Integration

For this new search experience to work properly a Token and App Key need to be generated and sent
to `biggy@vtex.com.br`. We will continue our case-by-case conversation via this e-mail once this
step is done. You can follow an in-depth tutorial on how to create both the Token and the App Key
[here](https://help.vtex.com/tutorial/criar-appkey-e-apptoken-para-autenticar-integracoes).

You'll also need to set up the affiliate API endpoint, you can follow [this tutorial](https://help.vtex.com/tutorial/configuring-affiliates--tutorials_187)
on how to properly set up this step.

The Search endpoint used for the affiliate API should be:

```
http://api.biggylabs.com.br/track-api/v2/affiliate
```

If you end up having any questions about this step, feel free to send an e-mail to `biggy@vtex.com.br`
with the subject `[YOUR STORE] Search App - Catalog Integration`.

## Blocks API

When implementing this app as a block, various inner blocks may be available.

```json
{
  "store.search.v2": {
    "allowed": ["search-result", "search-result-layout"]
  }
}
```

### Configuration

:hammer: Work in Progress...

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/search/issues). Also, feel free to [open issues](https://github.com/vtex-apps/search/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
