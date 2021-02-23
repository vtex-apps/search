export interface ISearchProductText {
  key: string
  value: string
  labelKey: string
  labelValue: string
}

export interface ISearchProduct {
  id: string
  name: string
  url: string
  images: IElasticProductImage[]
  oldPrice: number
  price: number
  oldPriceText: string
  priceText: string
  installment: IElasticProductInstallment
  attributes: IElasticProductText[]
  extraInfo: IExtraInfo[]
  brand: string
  product: string
  categories: string[]
  skus: IProductSku[]
}

interface IProductSku {
  id: string
  references: string
  price: number
  oldPrice: number
  installment: {
    count: number
    value: number
  }
  sellers: Array<{
    id: string
    price: number
    oldPrice: number
    installment: {
      count: number
      value: number
    }
  }>
}

interface IElasticProductImage {
  name: string
  value: string
}

export interface IElasticProductInstallment {
  count: number
  value: number
  interest: boolean
  valueText: string
}

interface IElasticProductText {
  key: string
  value: string
  labelKey: string
  labelValue: string
}

export interface IExtraInfo {
  key: string
  value: string
}

export interface ISearchProductImage {
  name: string
  value: string
}

export interface ISearchProductInstallment {
  count: number
  value: number
  interest: boolean
  valueText: string
}

export interface ISearchProductExtraInfo {
  key: string
  value: string
}
