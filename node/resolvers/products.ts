import { convertBiggyProduct } from "../commons/compatibility-layer";

enum Origin {
  BIGGY,
  VTEX,
}

export const products = {
  products: (searchResult: any, { origin }: { origin: Origin }) => {
    console.log(origin);
    if (origin === Origin.BIGGY) {
      return searchResult.products.map(convertBiggyProduct);
    }

    return searchResult.products.map(convertBiggyProduct);
  },
};
