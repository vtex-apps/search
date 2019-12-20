export const convertOderBy = (orderBy: OrderBy): string => {
  switch (orderBy) {
    case "OrderByPriceDESC":
      return "price:desc";
    case "OrderByPriceASC":
      return "price:asc";
    case "OrderByTopSaleDESC":
      return "orders:desc";
    case "OrderByReviewRateDESC":
      return ""; // Not Supported
    case "OrderByNameDESC":
      return "name:desc";
    case "OrderByNameASC":
      return "name:asc";
    case "OrderByReleaseDateDESC":
      return "fields.release:desc";
    case "OrderByBestDiscountDESC":
      return ""; // Not Supported
    default:
      return "";
  }
};

export function convertAttribute(attribute: Attribute): any {
  if (attribute.type === "number") {
    return {
      map: "priceRange",
      name: attribute.label,
      slug: `de-${attribute.minValue}-a-${attribute.maxValue}`,
    };
  }

  return {
    name: attribute.label,
    map: attribute.key,
    facets: attribute.values.map((value: any) => {
      return {
        quantity: value.count,
        name: value.label,
        link: value.proxyUrl,
        linkEncoded: value.proxyUrl,
        map: attribute.key,
        selected: false,
        value: `z${value.key}`,
      };
    }),
  };
}
