import { IAttributeResponseKey } from "../models/search-result";
import { IVtexFilter } from "../models/vtex-search-result-interfaces";

export function fromAttributeResponseKeyToVtexFilter(
  attribute: IAttributeResponseKey,
): IVtexFilter {
  return {
    name: attribute.label,
    facets: attribute.values.map(value => {
      return {
        quantity: value.count,
        name: value.label,
        link: value.proxyUrl,
        linkEncoded: value.proxyUrl,
        map: attribute.key,
        selected: false,
        value: value.key,
      };
    }),
  };
}

export function vtexOrderToBiggyOrder(vtexOrder: string) {
  switch (vtexOrder) {
    case "OrderByTopSaleDESC": {
      return "orders:desc";
    }
    case "OrderByBestDiscountDESC": {
      return "discount:desc";
    }
    case "OrderByPriceDESC": {
      return "price:desc";
    }
    case "OrderByPriceASC": {
      return "price:asc";
    }
    default: {
      return null;
    }
  }
}
