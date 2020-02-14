📢 Use this project, [contribute](https://github.com/vtex-apps/search) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Banner

`Banner` is a component used in the `vtex.store.search.v2`. It is a simple banner with the difference that you can configure the banner that will appear for each query.

## Configuration

1. Import the Banners's app to your theme's dependencies in the `manifest.json`, for example:

```json
  dependencies: {
    "vtex.search": "0.x"
  }
```

2. Go to [our console](https://console.biggy.com.br/bsearch/banners) and configure your banners. The banner form is composed by the following fields:

- `Active`. Indicates if banner is active or not.
- `Banner name`. Field used as an id.
- `Type banner`. Indicates the banner type. It can be `HTML` or `IMAGE`.
- `HTML`/`Image url`. Html or image to be inserted.
- `Area`. Indicates which area the banner should appear. It is importante when there is multiple banners in the same page.
- `Terms`. List of terms for this banner.
- `Period`. The period that this banner will be active.
- `Attributes`. List of selected attributes for this banner.

3. Add the `search-banner` block to the `search-result-layout.desktop` or `search-result-layout.mobile`. For example:

```json
"search-result-layout.desktop": {
    "children": [
        "flex-layout.row#banner-one",
    ],
    "search-banner#one": {
        "props": {
            "area": "one",
            "blockClass": "myBanner",
            "horizontalAlignment": "center"
        }
    },
    "flex-layout.row#banner-one": {
        "children": ["search-banner#one"]
    },
}
```

## Props

| Prop name             | Type     | Description                                                                                                             | Default value |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- |
| `area`                | `String` | Idicates the area. It needs to match the area configured in [our console](https://console.biggy.com.br/bsearch/banners) | -             |
| `blockClass`          | `String` | Defines a custom class for the banner div                                                                               | -             |
| `horizontalAlignment` | `String` | Defines the horizontal alignment for the banner                                                                         | `"center"`    |

The possible values for `horizontalAlignment` are:
| Values    |
| --------- |
| `"left"`  |
| `"right"` |
| `"center"`|

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles    |
| -------------- |
| `searchBanner` |
