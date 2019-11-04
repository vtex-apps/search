interface ISkuImage {
  cacheId: string;
  imageId: string;
  imageLabel: string;
  imageUrl: string;
  imageText: string;
}

export interface IProductExtraInfo {
  key: string;
  value: string;
}

export interface IProductInstallment {
  count: number;
  value: number;
  interest: boolean;
  valueText: string;
}

export interface IProductSummary {
  cacheId: string;
  productId: string;
  productName: string;
  productReference: string;
  linkText: string;
  brand: string;
  link: string;
  description: string;
  items: ISkuItem[];
  categories: string[];
}

interface ISkuItem {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  images: ISkuImage[];
  sellers: Array<{
    sellerId: string;
    sellerName: string;
    commertialOffer: {
      AvailableQuantity: number;
      discountHighlights: string[];
      teasers: any[];
      Installments:
        | [
            {
              Value: number;
              InterestRate: number;
              TotalValuePlusInterestRate: number;
              NumberOfInstallments: number;
              Name: string;
            },
          ]
        | null;
      Price: number;
      ListPrice: number;
      PriceWithoutDiscount: number;
    };
  }>;
  image: ISkuImage;
}

export class Product {
  constructor(
    public productId: string,
    public name: string,
    public brand: string,
    public productUrl: string,
    public price: number,
    public installment: IProductInstallment,
    public primaryImageUrl: string,
    public oldPrice: number,
    public categories?: string[],
    public skus?: any,
    public extraInfo?: IProductExtraInfo[],
    public secondaryImageUrl?: string,
  ) {}

  public hasOldPrice() {
    return this.oldPrice && this.oldPrice !== 0 && this.oldPrice < this.price;
  }

  public isAvailable() {
    return this.price && this.price > 0;
  }

  public findExtraInfoByKey(key: string) {
    if (!this.extraInfo) {
      return;
    }

    const info = this.extraInfo.find(currentInfo => currentInfo.key === key);

    return info ? info.value : null;
  }

  public toSummary(): IProductSummary {
    const mainImage: ISkuImage = {
      cacheId: this.productId,
      imageId: this.productId,
      imageLabel: "principal",
      imageUrl: this.primaryImageUrl,
      imageText: "principal",
    };

    const sku: ISkuItem = {
      itemId:
        this.skus && this.skus.length > 0 ? this.skus[0].id : this.productId,
      name: this.name,
      nameComplete: this.name,
      complementName: this.name,
      images: [mainImage],
      sellers: [
        {
          sellerId: this.findExtraInfoByKey("sellerId") || "1",
          sellerName: this.findExtraInfoByKey("sellerName") || "Seller Name",
          commertialOffer: {
            AvailableQuantity: 1000000,
            discountHighlights: [],
            teasers: [],
            Installments: this.installment
              ? [
                  {
                    Value: this.installment.value,
                    InterestRate: 0,
                    TotalValuePlusInterestRate: this.price,
                    NumberOfInstallments: this.installment.count,
                    Name: "",
                  },
                ]
              : null,
            Price: this.price,
            ListPrice: this.oldPrice || this.price,
            PriceWithoutDiscount: this.price,
          },
        },
      ],
      image: mainImage,
    };

    const categories: string[] = this.categories
      ? this.categories.map((_, index: number) => {
          const subArray = this.categories!.slice(0, index);
          return `/${subArray.join("/")}/`;
        })
      : [];

    return {
      categories,
      cacheId: this.name.replace(" ", "-"),
      productId: this.productId,
      productName: this.name,
      productReference: this.productId,
      linkText: this.slugifyUrl(this.productUrl),
      brand:
        this.brand ||
        this.findExtraInfoByKey("marca") ||
        this.findExtraInfoByKey("brand") ||
        "",
      link: this.productUrl,
      description: this.name,
      items: [sku],
    };
  }

  private slugifyUrl(url: string) {
    const parts = url.replace(/\/p$/, "").split("/");
    return parts[parts.length - 1];
  }
}
