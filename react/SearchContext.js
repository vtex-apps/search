import React, { useMemo } from "react";
import { Query } from "react-apollo";
import { useRuntime } from "vtex.render-runtime";
import { onSearchResult, SearchClickPixel } from "vtex.sae-analytics";
import searchResultQuery from "./graphql/searchResult.gql";
import { vtexOrderToBiggyOrder } from "./utils/vtex-utils";
import VtexSearchResult from "./models/vtex-search-result";
import logError from "./api/log";
import useRedirect from "./useRedirect";

const getUrlByAttributePath = (
  attributePath,
  map,
  priceRange,
  priceRangeKey,
) => {
  const facets = attributePath ? attributePath.split("/") : [];
  const apiUrlTerms = map
    ? map
        .split(",")
        .slice(1)
        .map((item, index) => `${item}/${facets[index]}`)
    : [];

  const url = apiUrlTerms.join("/");

  if (priceRange && priceRangeKey) {
    const [from, to] = priceRange.split(" TO ");
    return `${url}/${priceRangeKey}/${from}:${to}`;
  }

  return url;
};

const SearchContext = props => {
  const { account, workspace, route } = useRuntime();
  const { setRedirect } = useRedirect();

  const {
    params: { path: attributePath },
    query: { _query, map, order, operator, fuzzy, priceRange, bgy_leap: leap },
  } = props;

  const url = useMemo(
    () =>
      getUrlByAttributePath(
        attributePath,
        map,
        priceRange,
        props.priceRangeKey,
      ),
    [attributePath, map, priceRange],
  );

  const initialVariables = {
    operator,
    fuzzy,
    query: _query,
    page: 1,
    store: account,
    attributePath: url,
    sort: vtexOrderToBiggyOrder(order),
    count: props.maxItemsPerPage,
    leap: !!leap,
  };

  const onFetchMoreFunction = fetchMore => ({ variables, updateQuery }) => {
    const { to } = variables;
    const page = parseInt(to / props.maxItemsPerPage, 10) + 1;

    return (
      fetchMore({
        variables: { ...variables, page },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || page === 1) return prev;

          return {
            ...fetchMoreResult,
            searchResult: {
              ...fetchMoreResult.searchResult,
              products: [
                ...prev.searchResult.products,
                ...fetchMoreResult.searchResult.products,
              ],
            },
          };
        },
      })
        /* If the object from updateQuery is not returned, search-result gets an infinite loading.
         * A PR to search-result project is required
         */
        .then(() =>
          updateQuery(
            { productSearch: { products: [] } },
            {
              fetchMoreResult: {
                productSearch: { products: [] },
              },
            },
          ),
        )
    );
  };

  try {
    if (!_query) throw new Error("Empty search is not allowed");

    return (
      <Query
        query={searchResultQuery}
        variables={initialVariables}
        onCompleted={onSearchResult}
      >
        {({ loading, error, data, fetchMore }) => {
          if (error) {
            logError(account, workspace, route.path, error);
          }

          if (data.searchResult && data.searchResult.redirect) {
            setRedirect(data.searchResult.redirect);
          }

          const vtexSearchResult =
            error || !data
              ? VtexSearchResult.emptySearch()
              : new VtexSearchResult(
                  _query,
                  1,
                  props.maxItemsPerPage,
                  order,
                  attributePath,
                  map,
                  priceRange,
                  onFetchMoreFunction(fetchMore),
                  data,
                  loading,
                  !!props.priceRangeKey,
                );

          return (
            <>
              <SearchClickPixel query={_query} />

              {React.cloneElement(props.children, {
                searchResult:
                  error || !data
                    ? {
                        query: props.params.query,
                      }
                    : data.searchResult,
                ...props,
                ...vtexSearchResult,
              })}
            </>
          );
        }}
      </Query>
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    logError(account, workspace, route.path, error);

    const vtexSearchResult = VtexSearchResult.emptySearch();

    return React.cloneElement(props.children, {
      searchResult: {
        query: _query,
      },
      ...props,
      ...vtexSearchResult,
    });
  }
};

export default SearchContext;
