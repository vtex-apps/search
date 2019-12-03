import React, { useMemo } from "react";
import { Query } from "react-apollo";
import { clone, compose, map as mapF, path, pathOr } from "ramda";
import { useRuntime } from "vtex.render-runtime";
import {
  vtexOrderToBiggyOrder,
  fromAttributeResponseKeyToVtexFilter,
} from "./utils/vtex-utils";
import VtexSearchResult from "./models/vtex-search-result";
import logError from "./api/log";

import searchResultQuery from "./graphql/searchResult.gql";
import productsByIdQuery from "./graphql/productsById.gql";

const triggerSearchQueryEvent = data => {
  if (!data) return;
  const { query, operator, correction, total } = data.searchResult;

  const event = new CustomEvent("biggy.search.query", {
    detail: {
      query: query === "" ? "<empty>" : query,
      operator,
      misspelled: correction && correction.misspelled,
      match: total,
    },
  });

  window.dispatchEvent(event);
};

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

  const {
    params: { path: attributePath },
    query: { _query, map, order, operator, fuzzy, priceRange },
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

  const emptySearch = error => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      logError(account, workspace, route.path, error);
    }

    const vtexSearchResult = VtexSearchResult.emptySearch();

    return React.cloneElement(props.children, {
      searchResult: {
        query: _query,
      },
      ...props,
      ...vtexSearchResult,
    });
  };

  if (!_query) {
    return emptySearch(new Error("Empty search is not allowed"));
  }

  return (
    <Query
      query={searchResultQuery}
      variables={initialVariables}
      onCompleted={data => triggerSearchQueryEvent(data)}
    >
      {searchResult => {
        if (!searchResult.data) {
          return emptySearch();
        }

        const productIds = mapF(
          path(["product"]),
          pathOr([], ["data", "searchResult", "products"], searchResult),
        );

        return (
          <Query
            query={productsByIdQuery}
            variables={{ ids: productIds }}
            fetchPolicy="network-only"
          >
            {productsById => {
              if (!productsById.data) {
                return emptySearch();
              }

              const searchResultCopy = clone(searchResult);

              const facets = pathOr(
                [],
                ["data", "searchResult", "attributes"],
                searchResultCopy,
              )
                .filter(facet => facet.visible)
                .map(attr => fromAttributeResponseKeyToVtexFilter(attr));

              const recordsFiltered = pathOr(
                0,
                ["data", "searchResult", "total"],
                searchResultCopy,
              );

              searchResultCopy.data = {
                productSearch: {
                  products: productsById.data.productsByIdentifier,
                  breadcrumb: [
                    { name: _query, href: `/search?_query=${_query}` },
                  ],
                  recordsFiltered,
                },
                facets: {
                  departments: [],
                  brands: [],
                  specificationFilters: facets.filter(
                    facet => facet.map !== "priceRange",
                  ),
                  categoriesTrees: [],
                  priceRanges: props.priceRangeKey
                    ? facets.filter(facet => facet.map === "priceRange")
                    : [],
                },
                recordsFiltered,
              };

              searchResultCopy.variables = {
                withFacets: true,
                query: `search${
                  attributePath && attributePath !== ""
                    ? `/${attributePath}`
                    : ""
                }`,
                map: map || "s",
                orderBy: "",
                from: 0,
                to: props.maxItemsPerPage * initialVariables.page - 1,
                facetQuery: "search",
                facetMap: "b",
              };

              searchResultCopy.loading =
                searchResult.loading || productsById.loading;
              searchResultCopy.fetchMore = compose(
                searchResult.fetchMore,
                onFetchMoreFunction,
              );
              searchResultCopy.refetch = () =>
                searchResult.refetch(searchResult.variables);

              // const vtexSearchResult = new VtexSearchResult(
              //   _query,
              //   productsById.data.productsByIdentifier,
              //   1,
              //   props.maxItemsPerPage,
              //   order,
              //   attributePath,
              //   map,
              //   priceRange,
              //   onFetchMoreFunction(searchResult.fetchMore),
              //   searchResult,
              //   searchResult.loading && productsById.loading,
              //   !!props.priceRangeKey,
              // );

              return React.cloneElement(props.children, {
                ...props,
                priceRange,
                map: map || "s",
                orderBy: order || "",
                pagination: "show-more",
                searchResultOriginal: searchResult,
                searchResult: searchResult.data.searchResult,
                searchQuery: searchResultCopy,
                loading: searchResultCopy.loading,
              });
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default SearchContext;
