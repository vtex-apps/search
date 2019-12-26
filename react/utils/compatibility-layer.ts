/*
 * Functions designed to provide compatibility between our search components
 * and store-components components.
 */

type UpdateQuery = (prev: any, options: { fetchMoreResult: any }) => void;
type FetchMoreOptions = {
  variables: { to: number; page?: number };
  updateQuery: UpdateQuery;
};
type FetchMore = (options: FetchMoreOptions) => Promise<any>;

/**
 * Our Query depends on a `page` variable, but store-components' SearchContext
 * works with `from` and `to` variables. This methods provides a layer when
 * fetchMore is called to transform `to` into `page`.
 *
 * @param fetchMore Apollo's fetchMore function for our query.
 */
export const makeFetchMore = (
  fetchMore: FetchMore,
  maxItemsPerPage: number,
): FetchMore => async ({ variables, updateQuery }) => {
  const { to } = variables;
  const page = variables.page
    ? variables.page
    : Math.floor(to / maxItemsPerPage) + 1;

  await fetchMore({
    updateQuery: makeUpdateQuery(page),
    variables: { ...variables, page },
  });

  return updateQuery(
    { productSearch: { products: [] } },
    {
      fetchMoreResult: {
        productSearch: { products: [] },
      },
    },
  );
};

/**
 * UpdateQuery factory for our own query.
 *
 * @param page Page to search for.
 */
const makeUpdateQuery: (page: number) => UpdateQuery = page => (
  prev,
  { fetchMoreResult },
) => {
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
};

/**
 * Convert Biggy attributes into VTEX Catalog facets.
 *
 * @export
 * @param {*} attribute A searchResult attribute.
 * @returns A Catalog facet.
 */
export function fromAttributesToFacets(attribute: any) {
  if (attribute.type === "number") {
    return {
      map: "priceRange",
      name: attribute.label,
      slug: `de-${attribute.minValue}-a-${attribute.maxValue}`,
    };
  }

  return {
    name: attribute.label,
    facets: attribute.values.map((value: any) => {
      return {
        quantity: value.count,
        name: unescape(value.label),
        link: value.proxyUrl,
        linkEncoded: value.proxyUrl,
        map: attribute.key,
        selected: false,
        value: value.key,
      };
    }),
  };
}

type OrderBy =
  | "OrderByPriceDESC"
  | "OrderByPriceASC"
  | "OrderByTopSaleDESC"
  | "OrderByReviewRateDESC"
  | "OrderByNameDESC"
  | "OrderByNameASC"
  | "OrderByReleaseDateDESC"
  | "OrderByBestDiscountDESC";

/**
 * Convert from VTEX OrderBy into Biggy's sort.
 *
 * @export
 * @param {OrderBy} orderBy VTEX OrderBy.
 * @returns {string} Biggy's sort.
 */
export function convertOrderBy(orderBy: OrderBy): string {
  switch (orderBy) {
    case "OrderByPriceDESC":
      return "price:desc";
    case "OrderByPriceASC":
      return "price:asc";
    case "OrderByTopSaleDESC":
      return "orders:desc";
    case "OrderByReviewRateDESC":
      return ""; // TODO: Not Supported
    case "OrderByNameDESC":
      return "name:desc";
    case "OrderByNameASC":
      return "name:asc";
    case "OrderByReleaseDateDESC":
      return "fields.release:desc";
    case "OrderByBestDiscountDESC":
      return ""; // TODO: Not Supported
    default:
      return "";
  }
}
