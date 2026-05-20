<!-- managed-by: golden-path v1 -->

# Search

VTEX IO Store Framework app exporting the **search-companion blocks** for VTEX storefronts: autocomplete result list (v2), did-you-mean, suggestions, and search banner. It also exports a `BiggyClient` utility used by host apps to query autocomplete suggestions and top searches.

This app is part of the **Intelligent Search IO apps** topology. See [`AGENTS.md`](AGENTS.md) for cross-repo context, autonomy limits, and architecture pointers; see the parent workspace at [`is-io-specs`](https://github.com/vtex/is-io-specs) for cross-repo specs and the constitution.

For full block reference (props, CSS handles, theming) see [`docs/README.md`](docs/README.md).

## Prerequisites

- [Node.js](https://nodejs.org/) — current dependency tree is locked to the Node 12 era (TypeScript 3.9.7, eslint 6/7). Use `nvm install 12` if you need a matching local toolchain.
- [Yarn 1](https://yarnpkg.com/) (`packageManager` is pinned to `yarn@1.22.22` via Corepack).
- [VTEX Toolbelt](https://github.com/vtex/toolbelt): `npm i -g vtex`. Required for `make dev`, `make link`, and any release.
- VTEX account + workspace credentials (`vtex login <account>`).

## How to run

```sh
make dev    # yarn install (root + react) + vtex setup
make link   # vtex link in the active workspace (confirms account first)
```

> `make link` targets the active VTEX account/workspace. Run `vtex whoami` before linking.

## How to test

```sh
make lint         # eslint, no auto-fix
make format-check # prettier --check
make check        # alias for lint (no Jest/Mocha runner is configured)
```

End-to-end coverage lives in the [`vtex/search-tests`](https://github.com/vtex/search-tests) Cypress suite, which runs in CI on every PR against the `biggy` account.

## How to publish

```sh
vtex release patch stable     # or minor / major
```

The `prereleasy` hook (`bash pre.sh`, declared in `manifest.json:scripts`) runs as part of the release. The default branch is `master`. **Never run `vtex publish` or `vtex deploy` directly** without coordinated review.

## Documentation

- **Block reference (consumer-facing):** [`docs/README.md`](docs/README.md), [`docs/Autocomplete.md`](docs/Autocomplete.md), [`docs/Banner.md`](docs/Banner.md), [`docs/DidYouMean.md`](docs/DidYouMean.md), [`docs/Suggestions.md`](docs/Suggestions.md).
- **Agent guidance + autonomy limits:** [`AGENTS.md`](AGENTS.md) (canonical), [`CLAUDE.md`](CLAUDE.md) (symlink).
- **Cross-repo architecture + constitution:** [`is-io-specs`](https://github.com/vtex/is-io-specs).
- **Changelog:** [`CHANGELOG.md`](CHANGELOG.md).
- **Security policy:** [`SECURITY.md`](SECURITY.md).
