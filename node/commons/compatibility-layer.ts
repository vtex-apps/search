import { propOr } from "ramda";
import VtexSeller from "./models/VtexSeller";
import { IndexingType } from "../resolvers/products";

export const convertBiggyProduct = (
  product: any,
  tradePolicy?: string,
  indexingType?: IndexingType,
) => {
  const categories: string[] = product.categories
    ? product.categories.map((_: any, index: number) => {
        const subArray = product.categories.slice(0, index);
        return `/${subArray.join("/")}/`;
      })
    : [];

  const skus: any[] = propOr([], "skus", product).map(
    convertSKU(product, indexingType, tradePolicy),
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
    brandId: -1,
    link: product.url,
    description: product.link,
    items: skus,
    sku: skus.find(sku => sku.sellers && sku.sellers.length > 0),
  };
};

const getSellersIndexedByApi = (
  product: any,
  sku: any,
  tradePolicy?: string,
) => {
  const selectedPolicy = tradePolicy
    ? sku.policies.find((policy: any) => policy.id === tradePolicy)
    : sku.policies[0];

  const biggySellers = (selectedPolicy && selectedPolicy.sellers) || [];

  return biggySellers.map((seller: any) => {
    const price = seller.price || sku.price || product.price;
    const oldPrice = seller.oldPrice || sku.oldPrice || product.oldPrice;
    const installment = seller.installment || product.installment;

    return new VtexSeller(seller.id, price, oldPrice, installment);
  });
};

const getSellersIndexedByXML = (product: any) => {
  const { installment, price, oldPrice } = product;
  return [new VtexSeller("1", price, oldPrice, installment)];
};

const convertSKU = (
  product: any,
  indexingType?: IndexingType,
  tradePolicy?: string,
) => (sku: any) => {
  const image = {
    cacheId: product.product || product.id,
    imageId: product.product || product.id,
    imageLabel: "principal",
    imageUrl: product.images[0].value,
    imageText: "principal",
  };

  const sellers =
    indexingType === IndexingType.XML
      ? getSellersIndexedByXML(product)
      : getSellersIndexedByApi(product, sku, tradePolicy);

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
