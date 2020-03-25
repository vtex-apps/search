import { useEffect } from "react";
import { useQuery } from "react-apollo";
import PropTypes from "prop-types";
import { path, pathOr, reject, isEmpty } from "ramda";
import { useRuntime } from "vtex.render-runtime";
import { onSearchResult } from "vtex.sae-analytics";
import BiggyClient from "../utils/biggy-client.ts";
import {
  makeFetchMore,
  makeRefetch,
  fromAttributesToFacets,
} from "../utils/compatibility-layer.ts";
import logError from "../utils/log.ts";

import searchResultQuery from "../graphql/searchResult.gql";

const saveTermInHistory = term => {
  new BiggyClient().prependSearchHistory(term);
};

const SearchQuery = ({
  children,
  priceRangeKey,
  map,
  attributePath,
  variables,
  order,
  currentPage,
}) => {
  const { account, workspace } = useRuntime();

  const searchResult = useQuery(searchResultQuery, {
    variables,
    ssr: false,
    fetchPolicy: "network-only",
  });

  useEffect(() => saveTermInHistory(variables.query), [variables.query]);
  useEffect(() => searchResult.data && onSearchResult(searchResult.data), [
    searchResult.data,
  ]);

  if (searchResult.error) {
    logError(account, workspace, attributePath, searchResult.error);
  }

  const redirect = path(["data", "searchResult", "redirect"], searchResult);
  searchResult.loading = searchResult.loading || redirect;

  const products = path(["data", "searchResult", "products"], searchResult);

  const fetchMore = makeFetchMore(
    searchResult.fetchMore,
    variables.count,
    variables.page,
  );
  const refetch = makeRefetch(searchResult.refetch);
  const recordsFiltered = pathOr(
    0,
    ["data", "searchResult", "total"],
    searchResult,
  );

  const facets = pathOr(
    [],
    ["data", "searchResult", "attributes"],
    searchResult,
  )
    .filter(facet => facet.visible)
    .map(attr => fromAttributesToFacets(attr));

  const searchQuery = {};
  searchQuery.data = {
    productSearch: {
      products,
      breadcrumb: [
        { name: variables.query, href: `/search?_query=${variables.query}` },
      ],
      recordsFiltered,
    },
    facets: {
      departments: [],
      brands: [],
      specificationFilters: facets.filter(facet => facet.map !== "priceRange"),
      categoriesTrees: [],
      priceRanges: priceRangeKey
        ? facets.filter(facet => facet.map === "priceRange")
        : [],
      queryArgs: {
        query: reject(isEmpty, ["search", attributePath]).join("/"),
        map: map || "ft",
      },
    },
    recordsFiltered,
  };

  searchQuery.variables = {
    withFacets: true,
    query: variables.query,
    map: map || "ft",
    orderBy: order,
    from: variables.count * (currentPage - 1),
    to: variables.count * currentPage - 1,
    facetQuery: "search",
    facetMap: "ft",
  };

  searchQuery.loading = searchResult.loading;
  searchQuery.fetchMore = fetchMore;
  searchQuery.refetch = refetch;

  return children({
    ...searchQuery.variables,
    ...searchQuery,
    ...variables,
    redirect,
    searchResult: {
      ...searchResult,
      ...path(["data", "searchResult"], searchResult),
    },
    searchQuery: {
      ...path(["data", "searchResult"], searchResult), // Suggestions, banners, etc.
      ...searchQuery,
    },
    maxItemsPerPage: variables.count,
    pagination: "show-more",
    params: { term: variables.query },
    query: variables.query,
    orderBy: order || "OrderByScoreDESC",
  });
};

SearchQuery.propTypes = {
  children: PropTypes.func.isRequired,
  priceRangeKey: PropTypes.string,
  map: PropTypes.string,
  attributePath: PropTypes.string,
  variables: PropTypes.shape({
    operator: PropTypes.string,
    query: PropTypes.string,
    page: PropTypes.number,
    attributePath: PropTypes.string,
    sort: PropTypes.string,
    count: PropTypes.number,
    leap: PropTypes.bool,
    fuzzy: PropTypes.bool,
  }).isRequired,
};

export default SearchQuery;
