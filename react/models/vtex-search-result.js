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
    fetchMore,
    searchResult,
    isLoading,
  ) {
    const products = searchResult
      ? searchResult.products.map(product =>
          new Product(
            product.product,
            product.name,
            product.brand,
            product.url,
            product.price,
            product.installment,
            product.images && product.images.length > 0
              ? product.images[0].value
              : "",
            product.oldPrice,
            product.categories,
            product.skus,
            product.extraInfo,
          ).toSummary(),
        )
      : [];

    let attrPriceRangeIndex;

    const facets =
      searchResult && searchResult.attributes
        ? searchResult.attributes.map((attr, idx) => {
            if (attr.type === "number") attrPriceRangeIndex = idx;
            return fromAttributeResponseKeyToVtexFilter(attr);
          })
        : [];

    const priceRangeFacet =
      typeof attrPriceRangeIndex === "number"
        ? facets.splice(attrPriceRangeIndex, 1)
        : [];

    const map = mapQuery || "s";

    this.page = page;

    this.searchQuery = {
      fetchMore,
      data: {
        products,
        productSearch: {
          titleTag: null,
          metaTagDescription: null,
          products,
          breadcrumb: [{ name: query, href: `/search?query=${query}` }],
          recordsFiltered: !searchResult ? 0 : searchResult.total,
        },
        facets: {
          departments: [],
          brands: [],
          specificationFilters: facets,
          categoriesTrees: [],
          priceRanges: priceRangeFacet,
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
    };

    this.map = map;
    this.orderBy = orderBy || "";
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
