import { fromAttributeResponseKeyToVtexFilter } from "../utils/vtex-utils";

export class VtexSearchResult {
  constructor(
    query,
    page,
    itemsPerPage,
    orderBy,
    attributePath,
    map,
    fetchMore,
    searchResult,
    isLoading,
  ) {
    const products = searchResult ? searchResult.products : [];

    const facets =
      searchResult && searchResult.attributes
        ? searchResult.attributes
            .filter(attr => attr.key !== "preco")
            .map(attr => fromAttributeResponseKeyToVtexFilter(attr))
        : [];

    map = map || "s";

    this.page = page;

    this.searchQuery = {
      fetchMore: fetchMore,
      data: {
        productSearch: {
          titleTag: null,
          metaTagDescription: null,
          products: products,
          breadcrumb: [],
          recordsFiltered: !searchResult ? 0 : searchResult.total,
        },
        facets: {
          departments: [],
          brands: [],
          specificationFilters: facets,
          categoriesTrees: [],
          priceRanges: [],
        },
      },
      variables: {
        withFacets: true,
        query: `search${
          attributePath && attributePath !== "" ? "/" + attributePath : ""
        }`,
        map: map,
        orderBy: "",
        from: (page - 1) * itemsPerPage,
        to: itemsPerPage * page - 1,
        facetQuery: "search",
        facetMap: "b",
      },
      loading: isLoading,
      networkStatus: 7,
      recordsFiltered: !searchResult ? 0 : searchResult.total,
    };

    this.map = map;
    this.orderBy = orderBy || "";
    this.from = (page - 1) * itemsPerPage;
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
