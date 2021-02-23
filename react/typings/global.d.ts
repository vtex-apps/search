declare global {
  interface Product {
    brand: string
    brandId: number
    cacheId: string
    categories?: string[]
    clusterHighlights?: Array<{ id: string; name: string }>
    categoryTree?: Array<{ slug: string }>
    description?: string | null
    items: SKU[]
    link: string
    linkText: string
    priceRange: ProductPriceRange
    productClusters?: Array<{ id: string; name: string }>
    productId: string
    productName: string
    productReference: string
    properties?: Array<{ name: string; values: string[] }>
    sku?: SKU
    specificationGroups: SpecificationGroup[]
  }

  interface ProductPriceRange {
    sellingPrice: PriceRange
    listPrice: PriceRange
  }

  interface PriceRange {
    highPrice: number
    lowPrice: number
  }

  interface SpecificationGroup {
    name?: string
    originalName?: string
    specifications?: SpecificationGroupProperty[]
  }

  interface SpecificationGroupProperty {
    originalName: string
    name: string
    values: string[]
  }

  interface SKU {
    complementName?: string
    ean?: string
    image?: Image
    images: Image[]
    itemId: string
    measurementUnit: string | null
    name: string
    nameComplete?: string
    referenceId: Array<{
      Key: string
      Value: string
    }> | null
    seller?: Seller
    sellers: Seller[]
    unitMultiplier?: number
    variations: Array<{ name: string; values: string[] }>
  }

  interface Image {
    cacheId?: string
    imageId?: string
    imageLabel: string | null
    imageTag?: string
    imageUrl: string
    imageText?: string | null
  }

  interface Seller {
    addToCartLink?: string
    commertialOffer: CommertialOffer
    sellerId: string
    sellerDefault?: boolean
    sellerName?: string
  }

  interface CommertialOffer {
    AvailableQuantity: number
    Installments: Installment[]
    ListPrice: number
    Price: number
    PriceWithoutDiscount: number
    RewardValue?: number
    Tax: number
    discountHighlights?: Array<{ name: string }>
    spotPrice?: number
    taxPercentage: number
    teasers?: Array<{ name: string }>
  }

  interface Installment {
    InterestRate: number
    Name: string
    NumberOfInstallments: number
    PaymentSystemName?: string
    TotalValuePlusInterestRate: number
    Value: number
  }
}

export {}
