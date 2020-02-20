import { convertBiggyProduct } from "../commons/compatibility-layer";
import { SegmentData } from "@vtex/api";
import { path, map, prop, isEmpty, sort, indexOf } from "ramda";

enum Origin {
  BIGGY = "BIGGY",
  VTEX = "VTEX",
}

interface ProductArgs {
  origin: Origin;
  segment?: SegmentData;
}

export const products = {
  products: async (searchResult: any, args: ProductArgs, ctx: Context) => {
    const { origin } = args;

    if (origin === Origin.BIGGY) {
      return productsOriginBiggy(searchResult, args);
    }

    return productsOriginVTEX(searchResult, ctx);
  },
};

/**
 * Get Products from Biggy's API and convert the values to a format
 * that is usable for the client-side components.
 *
 * @param {*} searchResult Search Result.
 * @param {ProductArgs} args Query args.
 * @returns
 */
async function productsOriginBiggy(searchResult: any, args: ProductArgs) {
  const products: any[] = [];
  const tradePolicy = path<string | undefined>(["segment", "channel"], args);

  searchResult.products.forEach((product: any) => {
    products.push(convertBiggyProduct(product, tradePolicy));
  });

  return products;
}

/**
 * Get Product's IDs returned by Biggy's API and then query the VTEX Catalog
 * API for those products. (This considerably slows down the search experience)
 *
 * @param {*} searchResult Search Result.
 * @param {Context} ctx Context.
 * @returns
 */
async function productsOriginVTEX(searchResult: any, ctx: Context) {
  const { searchGraphQL } = ctx.clients;

  let products: any[] = searchResult.products;
  const productIds = map<any, string>((product: any) => {
    return prop("product", product) || prop("id", product) || "";
  }, products);

  if (!isEmpty(productIds)) {
    // Get products' model from VTEX search API
    products = await searchGraphQL.productsById(productIds);

    // Maintain biggySearch's order.
    products = sort(
      (a, b) =>
        indexOf(a.productId, productIds) - indexOf(b.productId, productIds),
      products,
    );
  }

  return products;
}
