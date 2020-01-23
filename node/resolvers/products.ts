import { convertBiggyProduct } from "../commons/compatibility-layer";
import { map, prop, isEmpty, sort, indexOf } from "ramda";

enum Origin {
  BIGGY = "BIGGY",
  VTEX = "VTEX",
}

export const products = {
  products: async (
    searchResult: any,
    { origin }: { origin: Origin },
    ctx: any,
  ) => {
    if (origin === Origin.BIGGY) {
      const { segment } = ctx.vtex;
      const products: any[] = [];

      searchResult.products.forEach((product: any) => {
        try {
          products.push(
            convertBiggyProduct(product, segment && segment.channel),
          );
        } catch (e) {
          // TODO: add logging
        }
      });

      return products;
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
