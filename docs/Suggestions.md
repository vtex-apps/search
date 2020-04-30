# Suggestions

`Suggestions` is a component used in the `vtex.store.search.v2` to suggest search terms similar to the current query.

## Configuration

1. Import the Suggestions's app to your theme's dependencies in the `manifest.json`, for example:

```json
  dependencies: {
    "vtex.search": "0.x"
  }
```

2. Add the `search-suggestions` block to the `search-result-layout.desktop` or `search-result-layout.mobile`. For example:

```json
"search-result-layout.desktop": {
    "children": [
        "flex-layout.row#suggestion",
    ],
    "flex-layout.row#suggestion": {
        "children": ["search-suggestions"]
    }
}
```

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles             |
| ----------------------- |
| `suggestionsList`       |
| `suggestionsListPrefix` |
| `suggestionsListLink`   |
| `suggestionsListItem`   |
