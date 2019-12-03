import { path } from "ramda";
import { fromAttributeResponseKeyToVtexFilter } from "../utils/vtex-utils";

class VtexSearchResult {
  constructor(
    query,
    products,
    page,
    itemsPerPage,
    orderBy,
    attributePath,
    mapQuery,
    priceRange,
    fetchMore,
    searchResultQuery,
    isLoading,
    showPriceRange,
  ) {
    const searchResult = path(["data", "searchResult"], searchResultQuery);

    const facets =
      !searchResult || !searchResult.attributes
        ? []
        : searchResult.attributes
            .filter(facet => facet.visible)
            .map(attr => fromAttributeResponseKeyToVtexFilter(attr));

    const map = mapQuery || "s";

    this.page = page;

    this.searchQuery = {
      fetchMore,
      data: {
        productSearch: {
          titleTag: null,
          metaTagDescription: null,
          products,
          breadcrumb: [{ name: query, href: `/search?_query=${query}` }],
          recordsFiltered: !searchResult ? 0 : searchResult.total,
        },
        facets: {
          departments: [],
          brands: [],
          specificationFilters: facets.filter(
            facet => facet.map !== "priceRange",
          ),
          categoriesTrees: [],
          priceRanges: showPriceRange
            ? facets.filter(facet => facet.map === "priceRange")
            : [],
        },
      },
      variables: {
        withFacets: true,
        query: `search${
          attributePath && attributePath !== "" ? `/${attributePath}` : ""
        }`,
        map,
        orderBy: "",
        from: 0,
        to: itemsPerPage * page - 1,
        facetQuery: "search",
        facetMap: "b",
      },
      refetch: () => {},
      loading: isLoading,
      networkStatus: 7,
      recordsFiltered: !searchResult ? 0 : searchResult.total,
    };

    this.map = map;
    this.orderBy = orderBy || "";
    this.priceRange = priceRange;
    this.from = 0;
    this.to = itemsPerPage * page - 1;
    this.treePath = "";
    this.preview = true;
    this.querySchema = { maxItemsPerPage: 4, orderByField: orderBy || "" };
    this.pagination = "show-more";
    this.params = { term: query };
    this.query = query;
    this.showMore = false;
    this.breadcrumbsProps = {};
  }

  static emptySearch() {
    return new VtexSearchResult(
      "",
      1,
      this.maxItemsPerPage,
      "OrderByPriceDESC",
      "",
      "",
      () => {},
      null,
      false,
    );
  }
}

export default VtexSearchResult;
