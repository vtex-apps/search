# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Upgrade node builder to `6.x`.
- Make `search-graphql` client call `graphql-server`.

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
