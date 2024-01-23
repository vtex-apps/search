# Banner

Banners is the Intelligent Search feature that displays banners on the search results page of the customer, depending on the context of the search.

## Before you begin

Make sure you have added the `search` app to your theme dependencies in the `manifest.json` as shown below:

```json
  "dependencies": {
    "vtex.search": "2.x"
  }
```

Check the [Search](https://developers.vtex.com/docs/apps/vtex.search) app documentation for more details on this step.

## Configuration

The banner entity is composed by the following fields:

| Field | Description |
| - | - |
| `Active` | Indicates if the banner is active or not. |
| `Banner name` | Field used as an ID. |
| `Type banner` | Indicates the banner type, which can be `HTML` or `IMAGE`. |
| `HTML` / `Image URL` | HTML code or image to be inserted. |
| `Area` | Indicates in which area the banner should appear. It is important when there are multiple banners in the same page. |
| `Terms` | List of terms for this banner. |
| `Period` | The period that this banner will be active. |
| `Attributes` | List of selected attributes for this banner. |

## Usage

Add the `search-banner` block to the `search-result-layout.desktop` or `search-result-layout.mobile`. For example:

```json
{
  "search-result-layout.desktop": {
    "children": [
      "flex-layout.row#banner-one"
    ]
  },
  "search-banner#one": {
    "props": {
      "area": "one",
      "blockClass": "myBanner",
      "horizontalAlignment": "center"
    }
  },
  "flex-layout.row#banner-one": {
    "children": [
      "search-banner#one"
    ]
  }
}
```

## Props

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `area` | `String` | Idicates the area. It needs to match the area configured in the banner. | - |
| `blockClass` | `String` | Defines a custom class for the banner div. | - |
| `horizontalAlignment` | `String` | Defines the horizontal alignment for the banner. | `"center"` |

The possible values for `horizontalAlignment` are:
| Values |
| --------- |
| `"left"` |
| `"right"` |
| `"center"`|

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles    |
| -------------- |
| `searchBanner` |
