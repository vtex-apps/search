import { fromAttributeResponseKeyToVtexFilter } from "../utils/vtex-utils";
import { Product } from "./product";

class VtexSearchResult {
  constructor(
    query,
    page,
    itemsPerPage,
    orderBy,
    attributePath,
    mapQuery,
    priceRange,
    fetchMore,
    data,
    isLoading,
    showPriceRange,
  ) {
    const searchResult = data ? data.searchResult : undefined;

    const products = searchResult
      ? searchResult.products.map(product =>
          new Product(
            product.product,
            product.name,
            product.brand,
            product.url,
            product.price,
            product.priceText,
            product.installment,
            product.images && product.images.length > 0
              ? product.images[0].value
              : "",
            product.oldPrice,
            product.oldPriceText,
            product.categories,
            product.skus,
            product.extraInfo,
          ).toSummary(),
        )
      : [];

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
      loading: isLoading,
      networkStatus: 7,
      recordsFiltered: !searchResult ? 0 : searchResult.total,
      correction: searchResult ? searchResult.correction : undefined,
      suggestion: searchResult ? searchResult.suggestion : undefined,
      banners: searchResult ? searchResult.banners : undefined,
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
