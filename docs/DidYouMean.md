# DidYouMean

`DidYouMean` is a component used to suggest a possible misspelling correction to the current query.

## Before you begin

Make sure you have added the `search` app to your theme dependencies in the `manifest.json` as shown below:

```json
  "dependencies": {
    "vtex.search": "2.x"
  }
```

Check the [Search](https://developers.vtex.com/docs/apps/vtex.search) app documentation for more details on this step.

## Usage

Add the `did-you-mean` block to the `search-result-layout.desktop` or `search-result-layout.mobile`. For example:

```json
"search-result-layout.desktop": {
    "children": [
        "flex-layout.row#didyoumean",
    ],
    "flex-layout.row#didyoumean": {
        "children": ["did-you-mean"]
    }
}
```

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles        |
| ------------------ |
| `didYouMeanPrefix` |
| `didYouMeanTerm`   |
