# Banner

Banner is the Intelligent Search feature that displays banners on the customer search results page, depending on the search context.

## Before you begin

Make sure you have added the `search` app to your theme dependencies within the `manifest.json`, as shown below:

```json
  "dependencies": {
    "vtex.search": "2.x"
  }
```

Check the [Search](https://developers.vtex.com/docs/apps/vtex.search) app documentation for more details on this step.

## Configuration

The banner entity is composed of the following fields:

| Field | Description |
| - | - |
| `Active` | Indicates if the banner is active or not. |
| `Banner name` | Unique identifier for the banner. |
| `Type banner` | Specifies the type of banner, which can be either `HTML` or `IMAGE`. |
| `HTML` / `Image URL` | HTML code or image to be inserted. |
| `Area` | Indicates the section of the page where the banner will be displayed. It's important when multiple banners are present on the same page. |
| `Terms` | List of terms for this banner. |
| `Period` | The period that this banner will be active. |
| `Attributes` | List of selected attributes for this banner. |

## Usage

Add the `search-banner` block to `search-result-layout.desktop` or `search-result-layout.mobile`. For example:

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
| `area` | `String` | Indicates the area. It must match the area configured in the banner. | - |
| `blockClass` | `String` | Defines a custom class to the banner div. | - |
| `horizontalAlignment` | `String` | Defines the horizontal alignment for the banner. | `"center"` |

The possible values for `horizontalAlignment` are:

| Values |
| --------- |
| `"left"` |
| `"right"` |
| `"center"`|

## Customization

To apply CSS customizations to this and other blocks, follow the instructions in the guide [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles    |
| -------------- |
| `searchBanner` |
