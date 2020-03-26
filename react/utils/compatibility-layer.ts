import unescape from "unescape";

/*
 * Functions designed to provide compatibility between our search components
 * and store-components components.
 */

function textOverflow(text: string, maxWidth: number) {
  return text.length > maxWidth ? `${text.substr(0, maxWidth - 3)}...` : text;
}

type UpdateQuery = (prev: any, options: { fetchMoreResult: any }) => void;
type FetchMoreOptions = {
  variables: { from: number; to: number; page?: number; count?: number };
  updateQuery: UpdateQuery;
};
type RefetchVariables = {
  from: number;
  to: number;
  count: number;
  page: number;
};
type FetchMore = (options: FetchMoreOptions) => Promise<any>;
type Refetch = (options: Partial<RefetchVariables>) => Promise<any>;

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
  initialPage: number,
): FetchMore => async ({ variables, updateQuery = () => {} }) => {
  const { to } = variables;
  const page = variables.page
    ? variables.page
    : Math.floor(to / maxItemsPerPage) + 1;

  await fetchMore({
    updateQuery: makeUpdateQuery(page, initialPage),
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
 * Our Query depends on a `page` variable, but store-components' SearchContext
 * works with `from` and `to` variables. This methods provides a layer when
 * refetch is called to transform `from` and `to` into `page` and `count`.
 *
 * @param refetch Apollo's refetch function for our query.
 */
export const makeRefetch = (refetch: Refetch): Refetch => async variables => {
  const { from, to } = variables;
  const hasPagination =
    typeof from !== "undefined" && typeof to !== "undefined";

  const count = hasPagination ? to! - from! + 1 : undefined;
  const page = hasPagination
    ? Math.round((to! + 1) / (to! - from!))
    : undefined;

  return await refetch({ ...variables, page, count });
};

/**
 * UpdateQuery factory for our own query.
 *
 * @param page Page to search for.
 */
const makeUpdateQuery: (page: number, initialPage: number) => UpdateQuery = (
  page,
  initialPage,
) => (prev, { fetchMoreResult }) => {
  if (!fetchMoreResult) return prev;

  const products =
    page < initialPage
      ? [
          ...fetchMoreResult.searchResult.products,
          ...prev.searchResult.products,
        ]
      : [
          ...prev.searchResult.products,
          ...fetchMoreResult.searchResult.products,
        ];

  return {
    ...fetchMoreResult,
    searchResult: {
      ...fetchMoreResult.searchResult,
      products,
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
        name: unescape(textOverflow(value.label, 40)),
        link: value.proxyUrl,
        linkEncoded: value.proxyUrl,
        map: attribute.key,
        selected: false,
        value: `z${value.key}`,
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
      return "discount:desc";
    default:
      return "";
  }
}

export function convertURLToAttributePath(
  attributePath: string,
  map: string,
  priceRange: string,
  priceRangeKey: string,
) {
  const facets = (attributePath || "").split("/");
  const apiUrlTerms = (map || "")
    .split(",")
    .slice(1)
    .map((item, index) => `${item}/${facets[index].replace(/^z/, "")}`);

  const url = apiUrlTerms.join("/");

  if (priceRange && priceRangeKey) {
    const [from, to] = priceRange.split(" TO ");
    return `${url}/${priceRangeKey}/${from}:${to}`;
  }

  return url;
}
