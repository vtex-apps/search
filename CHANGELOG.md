# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.16.4] - 2023-06-15
### Fixed
- Add `rootPath` to Session API calls.

## [2.16.3] - 2023-06-13

### Fixed

- Readme content.

## [2.16.2] - 2023-06-13

## [2.16.1] - 2023-05-17
### Fixed
- Fixes of i18n on readme.md according to task LOC-10514.

## [2.16.0] - 2023-05-03

## [2.15.0] - 2023-03-17

### Added
- `shippingOptions` to product suggestions query.

## [2.14.2] - 2023-01-05

### Fixed

- Hover on search suggestion.

## [2.14.1] - 2022-12-22

### Added

- Indonesian translation.

## [2.14.0] - 2022-09-15

### Added

- Romanian translations.

## [2.13.1] - 2022-07-07

### Fixed

- Product suggestions that was not respecting the `maxSuggestedProducts` value.

## [2.13.0] - 2022-04-28

### Added

- French and Thai translation.

## [2.12.0] - 2022-03-10

### Added

- Norwegian and Norwegian variant translation.

## [2.11.0] - 2022-02-14

### Added

- `orderBy` to the `productSuggestions` query.

## [2.10.0] - 2022-02-14

### Added

- Arabic translation.

## [2.9.0] - 2021-12-13

### Added

- `_q` query string to Autocomplete links.

## [2.8.6] - 2021-12-08

### Fixed

- Safely decoding URI components to prevent errors when the search query contains breaking characters such as "%"

## [2.8.5] - 2021-12-03

### Fixed

- General review of the documentation (`README.md` file).

## [2.8.4] - 2021-08-19

## Removed

- `__unstableProductOriginVtex` was removed from the documentation on README.md.

## [2.8.3] - 2021-07-12

### Fixed

- Link to see more products.

## [2.8.2] - 2021-07-05

### Fixed

- Autocomplete did not display products for search terms with percentage.

## [2.8.1] - 2021-06-29

### Added

- `closeModal` function to the `Attribute` component and to the close button.

## [2.8.0] - 2021-04-29

### Removed

- End to end tests.

## [2.7.1] - 2021-03-22

### Fixed

- Close autocomplete when clicking on an item inside it.

## [2.7.0] - 2021-03-18

### Added

- `tileListFooter` CSS handler.

## [2.6.0] - 2021-03-11

### Added

- `customPage` prop to the `autocomplete-result-list.v2`.

## [2.5.0] - 2021-02-23

### Added

- `HorizontalProductSummary` prop to the `autocomplete-result-list.v2`.

## [2.4.0] - 2021-02-01

### Added

- `hideUnavailableItems` prop to the `autocomplete-result-list.v2`.

## [2.3.1] - 2021-01-19

### Fixed

- Added encoding and decoding function in `string-utils` preventing unexpected behaviors in url

## [2.3.0] - 2021-01-12

### Changed

- Eslint config.

## [2.2.1] - 2020-12-15

### Fixed

- Added sanitize function in `string-utils` and using in `history` label in `Autocomplete`

## [2.2.0] - 2020-12-02

### Added

- End to end tests setup.

## [2.1.1] - 2020-12-01

### Added

- Adding new classes to style `itemList`

## [2.1.0] - 2020-11-17

### Added

- Pixel events to the autocomplete.

## [2.0.3] - 2020-09-17

### Fixed

- Add tileListList component `classname`.

## [2.0.2] - 2020-09-16

### Fixed

- Price on the mobile Autocomplete that displayed `NaN` when there is no `taxPercentage`.

## [2.0.1] - 2020-09-08

### Fixed

- Error when the `searchQuery` is missing.

## [2.0.0] - 2020-08-18

### Removed

- Node builder.

## [1.4.1] - 2020-08-12

### Fixed

- Error in dispatch when using the Autocomplete.

## [1.4.0] - 2020-07-30

### Added

- New `customPage` prop on `Suggestion`

## [1.3.1] - 2020-07-22

### Fixed

- Deal with missing `fulltext` in `searchSuggestions` query.

## [1.3.0] - 2020-07-15

### Added

- ListPrice in CustomListItem.

## [1.2.0] - 2020-07-09

### Fixed

- `taxPercentage` in autocomplete price.

## [1.1.0] - 2020-06-17

### Changed

- `correction`, `suggestions`, and `banners` are now comming from graphql instead of `searchContext`.

## [1.0.19] - 2020-06-09

### Removed

- `vtex.sae-analytics@1.x` as dependency.

## [1.0.18] - 2020-06-05

### Fixed

- Remove stock filter from `convertBiggyProduct`.

## [1.0.17] - 2020-06-05

### Added

- `cacheId` to the `convertBiggyProduct`.

## [1.0.16] - 2020-06-05

### Fixed

- History that was not being updated.

## [1.0.15] - 2020-06-03

### Changed

- Remove cacheId

## [1.0.14] - 2020-06-02

### Fixed

- Remove hardcoded value in messages.

## [1.0.13] - 2020-06-02

### Changed

- Replace `See more` to `See all`.

## [1.0.12] - 2020-05-26

## [1.0.11] - 2020-05-20

### Fixed

- Update the app documentation (README.md file)

## [1.0.10] - 2020-05-20

### Changed

- Use the prop `__unstableProductOriginVtex` instead of `__unstableProductOrigin`.

## [1.0.9] - 2020-05-19

### Fixed

- Use `Link` instead of `a`in the "See more" button.

## [1.0.8] - 2020-05-14

### Changed

- The documentation now has a description for configuring Google Analytics.

## [1.0.7] - 2020-05-12

### Fixed

- Change `autocomplete` overflow css property from `scroll` to `auto`

## [1.0.6] - 2020-05-05

### Changed

- Update documentation.

## [1.0.5] - 2020-04-27

### Fixed

- Change `to` to `the` in the `README.md`.

### Changed

- Remove `preventRouteChange`

## [1.0.4] - 2020-04-27

### Added

- Add Indexing Process to doc.

## [1.0.3] - 2020-04-15

### Added

- Version disclaimer.

## [1.0.2] - 2020-04-15

### Fixed

- `vtex.search` version on readme.

## [1.0.1] - 2020-04-09

### Changed

- Upgrade `vtex.search-resolver` to version `v1.x`

## [1.0.0] - 2020-04-09

### Changed

- Change URLs and keep only `Autocomplete`, `Didyoumean`, `Suggestion` and `Banner` components.

## [0.11.10] - 2020-04-08

### Changed

- Bump version.

## [0.11.9] - 2020-04-08

### Changed

- Change from `search-graphql` to `search-resolver`

## [0.11.8] - 2020-04-08

### Fixed

- `selected` property was hardcoded

## [0.11.7] - 2020-04-07

### Fixed

- Removed wrong `provider`.

## [0.11.6] - 2020-04-07

### Fixed

- Some queries intermittently failing due to having ambiguous providers.

## [0.11.5] - 2020-04-03

### Fixed

- Missing `unescape` import.

## [0.11.4] - 2020-04-03

### Changed

- Change from `unshift` to `push`.

## [0.11.3] - 2020-03-31

### Fixed

- API sends all images instead of only the first one.
- API sends only SKUs with `stock` higher than `0`.

## [0.11.2] - 2020-03-30

### Fixed

- `suggestionsListItem` handle.

### Changed

- Use `segmentToken` instead of `getSegment`.

## [0.11.1] - 2020-03-27

### Fixed

- Reference being set in compatibility layer incorrectly.

## [0.11.0] - 2020-03-26

### Added

- Reference and description to product.

## [0.10.0] - 2020-03-25

### Added

- `__unstableIndexingType` props.

### Fixed

- Bug where the pagination component was not being reset.
- Refetch using `attributePath` instead of `_query`

## [0.9.0] - 2020-03-19

### Added

- Handle for suggestions links.

## [0.8.2] - 2020-03-19

### Fixed

- Fix `refetch` function.

## [0.8.1] - 2020-03-17

### Added

- `context` directive to the autocomplete queries.

### Changed

- `DidYouMean`, `Suggestions` and `Banner` data path.

### Fixed

- Bug where the suggestion's label appears even when there is no suggestion.

## [0.8.0]

### Added

- Custom maximum suggested products in autocomplete based on breakpoints.

## [0.7.3] - 2020-03-09

### Added

- Check if the SKU has any price.

## [0.7.2] - 2020-03-09

### Fixed

- Pass the ordering type to the client-side, so that it activates the side effect in the `useFetchMore` hook
- Side effect on change props to reset current page

## [0.7.1] - 2020-03-06

### Added

- Hardcoded addition of the attribute brandId, only stores with product origin=biggy

## [0.7.0] - 2020-03-02

### Changed

- Stop caching price sensitive requests locally.
- Use `ft` in map instead of `s`.
- Removed undesired error supression.

### Fixed

- `react` builder dependency vulnerability warning.

## [0.6.17] - 2020-02-20

### Changed

- Autocomplete title tag.

## [0.6.16] - 2020-02-19

### Added

- Client-side logging.

## [0.6.15] - 2020-02-14

### Added

- Logging in `node` builder.

## [0.6.14] - 2020-02-14

### Changed

- Removes allowed from interface

## [0.6.13] - 2020-02-13

### Added

- Include text overflow to facet label

## [0.6.12] - 2020-02-13

### Added

- Add attributes in autcomplete with `z` in the url

## [0.6.11] - 2020-02-13

### Fixed

- Remove attributes from autcomplete temporarily

## [0.6.10] - 2020-02-13

### Fixed

- Remove attributes from autcomplete temporarily

## [0.6.9] - 2020-02-07

### Added

- Query Args to facets.

## [0.6.8] - 2020-02-06

### Added

- OrderBy discount.

## [0.6.7] - 2020-02-03

### Changed

- Doc workspace demo

## [0.6.6] - 2020-02-01

### Changed

- Change to segment scope on searchResult

## [0.6.5] - 2020-01-31

### Fixed

- `setPage` was not synchronized

## [0.6.0] - 2020-01-23

### Changed

- Products are now based in trade policies.

## [0.5.3] - 2020-01-17

### Added

- Fit autocomplete function in android devices.

## [0.5.2] - 2020-01-17

### Fixed

- Use `product.link` instead of `slugifyUrl`.

## [0.5.1] - 2020-01-16

### Added

## [0.5.0] - 2020-01-13

### Changed

- Page is now a state instead of being defined by `from` and `too`

### Added

- GA documentation

## [0.4.2] - 2020-01-09

### Added

- Query and operator info on redirect return.

## [0.4.0] - 2019-12-27

### Added

- `__unstableProductOrigin` prop into generic app.

## [0.3.6] - 2019-12-26

### Added

- Autocomplete
- DidYouMean
- Suggestions
- Banner

## [0.3.5] - 2019-12-19

### Added

- Temporary workaround on facet values sorting.

## [0.3.4] - 2019-12-16

### Changed

- Improve documentation.

## [0.3.3] - 2019-12-11

### Changed

- Improve documentation.

## [0.3.2] - 2019-12-09

### Fixed

- Changed to `_query` in `SearchClickPixel`.

## [0.3.1] - 2019-12-06

### Changed

- Old `SearchAnalytics` calls to `sae-analytics`

### Added

- Redirect functionality.

## [0.3.0] - 2019-11-26

### Changed

- Change querystring from `query` to `_query`

## [0.2.3] - 2019-11-25

## [0.2.2] - 2019-11-25

## [0.2.1] - 2019-11-21

### Added

- `docs` builder.

## [0.2.0] - 2019-11-14

### Added

- BiggyClient
- `brand`, `categories` and `sellers` to the object sent to `search-result`
- Pricerange

### Fixed

- Error when the data from the search result query was not finished.

### Changed

- Object sent to `search-result`

## [0.1.0] - 2019-10-31

### Changed

- Initial release.
