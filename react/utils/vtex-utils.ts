import { IAttributeResponseKey } from "../models/search-result";

const decode = require("unescape");

export function fromAttributeResponseKeyToVtexFilter(
  attribute: IAttributeResponseKey,
) {
  if (attribute.type === "number") {
    return {
      map: "priceRange",
      name: attribute.label,
      slug: `de-${attribute.minValue}-a-${attribute.maxValue}`,
    };
  }

  return {
    name: attribute.label,
    facets: attribute.values.map(value => {
      return {
        quantity: value.count,
        name: decode(value.label),
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
