import { propOr } from "ramda";

export const convertBiggyProduct = (product: any) => {
  const categories: string[] = product.categories
    ? product.categories.map((_: any, index: number) => {
        const subArray = product.categories.slice(0, index);
        return `/${subArray.join("/")}/`;
      })
    : [];

  const skus = propOr<any[], any[], any[]>([], "skus", product).map(
    convertSKU(product),
  );

  return {
    categories,
    cacheId: product.link,
    productId: product.product || product.id,
    productName: product.name,
    productReference: product.product || product.id,
    linkText: product.link,
    brand:
      product.brand ||
      product.extraInfo["marca"] ||
      product.extraInfo["brand"] ||
      "",
    link: product.url,
    description: product.link,
    items: skus,
    sku: skus.find(sku => sku.sellers && sku.sellers.length > 0),
  };
};

const convertSKU = (product: any) => (sku: any) => {
  const image = {
    cacheId: product.product || product.id,
    imageId: product.product || product.id,
    imageLabel: "principal",
    imageUrl: product.images[0].value,
    imageText: "principal",
  };

  const sellers = propOr<any[], any[], any[]>([], "sellers", sku).map(
    (seller: any) => {
      const price = seller.price || sku.price || product.price;
      const oldPrice = seller.oldPrice || sku.oldPrice || product.oldPrice;
      const installment =
        seller.installment || sku.installment || product.installment;

      return {
        sellerId: seller.id,
        sellerName: "",
        commertialOffer: {
          AvailableQuantity: 10000,
          discountHighlights: [],
          teasers: [],
          Installments: installment
            ? [
                {
                  Value: installment.value,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: price,
                  NumberOfInstallments: installment.count,
                  Name: "",
                },
              ]
            : null,
          Price: price,
          ListPrice: oldPrice,
          PriceWithoutDiscount: price,
        },
      };
    },
  );

  return {
    sellers,
    image,
    seller: sellers[0],
    itemId: sku.id,
    name: product.name,
    nameComplete: product.name,
    complementName: product.name,
    images: [image],
  };
};
