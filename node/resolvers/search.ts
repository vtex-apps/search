import { GraphQLResolveInfo } from "graphql";
import { SelectedFacet } from "../clients/search-resolver";
import { IndexingType } from "./products";
import { toSuggestionSearches, wantsVtexProductOrigin } from "./utils";

export interface SearchResultArgs {
  attributePath: string;
  query: string;
  page: number;
  count: number;
  sort: string;
  operator: string;
  fuzzy: number;
  leap: boolean;
  indexingType?: IndexingType;
}

const RELEVANCE = "OrderByScoreDESC";

// Sorts accepted by `searchResult` (`field:order`, the fields biggy-search
// supported), mapped to vtex.search-graphql `orderBy` values. `popularity`
// has no equivalent and uses best sellers, the closest one. Anything else
// falls back to relevance.
const ORDER_BY: Record<string, string> = {
  "relevance:desc": RELEVANCE,
  "popularity:desc": "OrderByTopSaleDESC",
  "orders:desc": "OrderByTopSaleDESC",
  "price:asc": "OrderByPriceASC",
  "price:desc": "OrderByPriceDESC",
  "name:asc": "OrderByNameASC",
  "name:desc": "OrderByNameDESC",
  "release:desc": "OrderByReleaseDateDESC",
  "discount:desc": "OrderByBestDiscountDESC",
};

/**
 * Turns an attribute path (`key/value/key/value…`) into selected facets.
 */
const toSelectedFacets = (attributePath?: string) => {
  const parts = (attributePath ?? "").split("/").filter(part => part !== "");
  const facets: SelectedFacet[] = [];

  for (let index = 0; index + 1 < parts.length; index += 2) {
    facets.push({ key: parts[index], value: parts[index + 1] });
  }

  return facets;
};

const toOperator = (operator?: string) =>
  operator === "and" || operator === "or" ? operator : undefined;

const paginationItem = (index: number) => ({ index, proxyUrl: null });

/**
 * Rebuilds the pagination object from page, page size and total.
 */
const toPagination = (page: number, count: number, total: number) => {
  const pages = count > 0 ? Math.ceil(total / count) : 0;

  return {
    count: pages,
    current: paginationItem(page),
    before: [],
    after: [],
    next: page < pages ? paginationItem(page + 1) : null,
    previous: page > 1 ? paginationItem(page - 1) : null,
    first: pages > 0 ? paginationItem(1) : null,
    last: pages > 0 ? paginationItem(pages) : null,
  };
};

export const search = {
  /**
   * Deprecated. Kept working with basic support, since biggy-search is no
   * longer called and few stores still use this field (one store in
   * October 2026, about once a day). New code should use vtex.search-graphql
   * `productSearch` and `facets`, as vtex.search 2.x and vtex.search-result do.
   *
   * Makes a single vtex.search-graphql `productSearch` call. What is returned:
   * - `products`, `total`, `operator`, `correction`, `suggestion`, `banners`,
   *   `redirect`: from `productSearch`.
   * - `pagination`: rebuilt from page, page size and total. `proxyUrl` is null.
   * - `options`: empty sort and page-size lists, which is what 1.5.1 returned
   *   for this field (compared on the biggy account, November 2026). Stores
   *   define sort and page-size choices in their theme.
   * - `attributes`: always empty. Filters would need an extra `facets` call,
   *   which isn't made for this rarely used field.
   * Ignored arguments: `leap` and `indexingType` (no equivalent). The sales
   * channel comes from the request segment, which @vtex/api forwards to
   * vtex.search-resolver.
   *
   * The schema marks the field `@deprecated`, so @vtex/api logs each use
   * (query, variables and headers, at most once a minute per worker), and
   * the response carries a `Deprecation: true` header.
   */
  searchResult: async (
    _: any,
    args: SearchResultArgs,
    ctx: Context,
    info: GraphQLResolveInfo,
  ) => {
    const { searchResolver } = ctx.clients;

    ctx.set("Deprecation", "true");

    const page = args.page && args.page > 0 ? args.page : 1;
    const hasPageSize = args.count != null && args.count > 0;
    const from = hasPageSize ? (page - 1) * args.count : undefined;
    const to = hasPageSize && from != null ? from + args.count - 1 : undefined;

    const result = await searchResolver.productSearch({
      from,
      to,
      fullText: args.query ?? "",
      fuzzy: args.fuzzy != null ? String(args.fuzzy) : undefined,
      operator: toOperator(args.operator),
      orderBy: (args.sort && ORDER_BY[args.sort]) || RELEVANCE,
      productOriginVtex: wantsVtexProductOrigin(info),
      selectedFacets: toSelectedFacets(args.attributePath),
    });

    const total = result?.recordsFiltered ?? 0;
    const products = result?.products ?? [];

    return {
      products,
      total,
      attributes: [],
      banners: result?.banners ?? [],
      correction: result?.correction ?? null,
      operator: result?.operator ?? null,
      options: { counts: [], sorts: [] },
      pagination: toPagination(
        page,
        hasPageSize ? args.count : products.length,
        total,
      ),
      query: args.query,
      redirect: result?.redirect ?? null,
      suggestion: result?.suggestion
        ? { searches: toSuggestionSearches(result.suggestion) }
        : null,
    };
  },
};
