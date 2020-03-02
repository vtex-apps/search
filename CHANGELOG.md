# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Stop caching price sensitive requests locally.

## [0.6.17] - 2020-02-20

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
