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

export interface IProductSku {
  id: string;
  references: string;
  price: number;
  oldPrice: number;
  installment: {
    count: number;
    value: number;
  };
  sellers: Array<{
    id: string;
    price: number;
    oldPrice: number;
    installment: {
      count: number;
      value: number;
    };
  }>;
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
  items: IProductSummarySku[];
  categories: string[];
  sku: IProductSummarySku | undefined;
}

export interface ISeller {
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
}

interface IProductSummarySku {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  images: ISkuImage[];
  sellers: ISeller[];
  image: ISkuImage;
  seller: ISeller;
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
    public skus?: IProductSku[],
    public extraInfo?: IProductExtraInfo[],
    public secondaryImageUrl?: string,
  ) {}

  public hasOldPrice() {
    return this.oldPrice && this.oldPrice !== 0 && this.oldPrice < this.price;
  }

  public isAvailable() {
    return (
      this.price &&
      this.price > 0 &&
      this.skus &&
      this.skus.some(sku => sku.sellers && sku.sellers.length > 0)
    );
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

    const skus: IProductSummarySku[] = this.skus
      ? this.skus.map(sku => {
          const sellers: ISeller[] = sku.sellers
            ? sku.sellers.map(seller => {
                const price = seller.price || sku.price || this.price;
                const oldPrice =
                  seller.oldPrice || sku.oldPrice || this.oldPrice;
                const installment =
                  seller.installment || sku.installment || this.installment;

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
              })
            : [];

          return {
            sellers,
            seller: sellers[0],
            itemId: sku.id,
            name: this.name,
            nameComplete: this.name,
            complementName: this.name,
            images: [mainImage],
            image: mainImage,
          };
        })
      : [];

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
      items: skus,
      sku: skus.find(sku => sku.sellers && sku.sellers.length > 0),
    };
  }

  private slugifyUrl(url: string) {
    const parts = url.replace(/\/p$/, "").split("/");
    return parts[parts.length - 1];
  }
}
