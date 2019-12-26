import { useQuery } from "react-apollo";
import PropTypes from "prop-types";
import { path, prop, propOr, isEmpty, reject } from "ramda";
import { onSearchResult } from "vtex.sae-analytics";
import BiggyClient from "../utils/biggy-client.ts";
import {
  makeFetchMore,
  fromAttributesToFacets,
} from "../utils/compatibility-layer.ts";

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
}) => {
  const searchResult = useQuery(searchResultQuery, {
    variables,
    ssr: false,
    fetchPolicy: "network-only",
    onCompleted: data => {
      saveTermInHistory(variables.query);
      onSearchResult(data);
    },
  });

  const redirect = prop("redirect", searchResult);
  searchResult.loading = searchResult.loading || redirect;

  const products = [];

  const fetchMore = makeFetchMore(searchResult.fetchMore, variables.count);
  const recordsFiltered = propOr(0, "total", searchResult);

  const facets = propOr([], "attributes", searchResult)
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
    },
    recordsFiltered,
  };

  searchQuery.variables = {
    withFacets: true,
    query: reject(isEmpty, ["search", attributePath]).join("/"),
    map: map || "s",
    orderBy: "",
    from: 0,
    to: variables.count * variables.page - 1,
    facetQuery: "search",
    facetMap: "b",
  };

  searchQuery.loading = searchResult.loading;
  searchQuery.fetchMore = fetchMore;
  searchQuery.refetch = () => searchResult.refetch();

  return children({
    ...searchQuery.variables,
    ...searchQuery,
    searchResult: {
      ...searchResult,
      ...path(["data", "searchResult"], searchResult),
    },
    redirect,
    searchQuery,
    pagination: "show-more",
    params: { term: variables.query },
    query: variables.query,
    showMore: false,
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
    store: PropTypes.string,
    attributePath: PropTypes.string,
    sort: PropTypes.string,
    count: PropTypes.number,
    leap: PropTypes.bool,
    fuzzy: PropTypes.bool,
  }).isRequired,
};

export default SearchQuery;
