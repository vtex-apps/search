import { convertBiggyProduct } from "../commons/compatibility-layer";
import { SegmentData } from "@vtex/api";
import { path, map, prop, isEmpty, sort, indexOf, propOr } from "ramda";

enum Origin {
  BIGGY = "BIGGY",
  VTEX = "VTEX",
}

export enum IndexingType {
  API = "API",
  XML = "XML",
}

interface ProductArgs {
  origin: Origin;
  segment?: SegmentData;
  indexingType: IndexingType;
}

export const products = {
  products: async (searchResult: any, args: ProductArgs, ctx: Context) => {
    const { origin } = args;
    const products = propOr([], "products", searchResult);

    if (origin === Origin.BIGGY) {
      return productsOriginBiggy(products, args);
    }

    return productsOriginVTEX(products, ctx);
  },
};

/**
 * Get Products from Biggy's API and convert the values to a format
 * that is usable for the client-side components.
 *
 * @param {any[]} originalProducts Products.
 * @param {ProductArgs} args Query args.
 * @returns
 */
async function productsOriginBiggy(originalProducts: any[], args: ProductArgs) {
  const products: any[] = [];
  const tradePolicy = path<string | undefined>(["segment", "channel"], args);

  originalProducts.forEach((product: any) => {
    products.push(convertBiggyProduct(product, tradePolicy, args.indexingType));
  });

  return products;
}

/**
 * Get Product's IDs returned by Biggy's API and then query the VTEX Catalog
 * API for those products. (This considerably slows down the search experience)
 *
 * @param {any[]} originalProducts Products.
 * @param {Context} ctx Context.
 * @returns
 */
async function productsOriginVTEX(originalProducts: any[], ctx: Context) {
  let products: any[] = [];

  const productIds = map<any, string>((product: any) => {
    return prop("product", product) || prop("id", product) || "";
  }, originalProducts);

  if (!isEmpty(productIds)) {
    const { searchGraphql } = ctx.clients;

    // Get products' model from VTEX search API
    products = await searchGraphql.productsById(productIds);

    // Maintain biggySearch's order.
    products = sort(
      (a, b) =>
        indexOf(a.productId, productIds) - indexOf(b.productId, productIds),
      products,
    );
  }

  return products;
}
