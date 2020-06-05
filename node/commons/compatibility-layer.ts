import { propOr } from "ramda";
import VtexSeller from "./models/VtexSeller";
import { IndexingType } from "../resolvers/products";
import { ElasticImage } from "../typings/elasticProduct";
import { VtexImage } from "../typings/vtexProduct";

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

  const skus: any[] = propOr([], "skus", product)
    .map(convertSKU(product, indexingType, tradePolicy));

  return {
    categories,
    productId: product.id,
    cacheId: `sp-${product.id}`,
    productName: product.name,
    productReference: product.reference || product.product || product.id,
    linkText: product.link,
    brand:
      product.brand ||
      product.extraInfo["marca"] ||
      product.extraInfo["brand"] ||
      "",
    brandId: -1,
    link: product.url,
    description: product.description,
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

const getImageId = (imageUrl: string) => {
  const baseUrlRegex = new RegExp(/.+ids\/(\d+)/);
  return baseUrlRegex.test(imageUrl)
    ? baseUrlRegex.exec(imageUrl)![1]
    : undefined;
};

const elasticImageToVtexImage = (image: ElasticImage, imageId: string) => {
  return {
    imageId,
    cacheId: imageId,
    imageLabel: image.name,
    imageText: image.name,
    imageUrl: image.value,
  };
};

const convertImages = (images: ElasticImage[], indexingType?: IndexingType) => {
  const vtexImages: VtexImage[] = [];

  if (indexingType && indexingType === IndexingType.XML) {
    const selectedImage: ElasticImage = images[0];
    const imageId = getImageId(selectedImage.value);

    return imageId ? [elasticImageToVtexImage(selectedImage, imageId)] : [];
  }

  images.forEach(image => {
    const imageId = getImageId(image.value);
    imageId ? vtexImages.push(elasticImageToVtexImage(image, imageId)) : [];
  });

  return vtexImages;
};

const convertSKU = (
  product: any,
  indexingType?: IndexingType,
  tradePolicy?: string,
) => (sku: any) => {
  const images = convertImages(product.images, indexingType);

  const sellers =
    indexingType === IndexingType.XML
      ? getSellersIndexedByXML(product)
      : getSellersIndexedByApi(product, sku, tradePolicy);

  return {
    sellers,
    images,
    seller: sellers[0],
    itemId: sku.id,
    name: product.name,
    nameComplete: product.name,
    complementName: product.name,
    referenceId: [
      {
        Key: "RefId",
        Value: sku.reference,
      },
    ],
  };
};
