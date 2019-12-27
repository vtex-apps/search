import { convertBiggyProduct } from "../commons/compatibility-layer";
import { map, prop, isEmpty, sort, indexOf } from "ramda";
import { IContext } from "..";

enum Origin {
  BIGGY,
  VTEX,
}

export const products = {
  products: async (
    searchResult: any,
    { origin }: { origin: Origin },
    ctx: IContext,
  ) => {
    if (origin === Origin.BIGGY) {
      return searchResult.products.map(convertBiggyProduct);
    }

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
  },
};
