export interface IElasticProductText {
  key: string;
  value: string;
  labelKey: string;
  labelValue: string;
}

export interface ISearchProduct {
  id: string;
  name: string;
  url: string;
  images: IElasticProductImage[];
  oldPrice: number;
  price: number;
  oldPriceText: string;
  priceText: string;
  installment: IElasticProductInstallment;
  attributes: IElasticProductText[];
  extraInfo: IExtraInfo[];
}

export interface IElasticProductImage {
  name: string;
  value: string;
}

export interface IElasticProductInstallment {
  count: number;
  value: number;
  interest: boolean;
  valueText: string;
}

export interface IElasticProductText {
  key: string;
  value: string;
  labelKey: string;
  labelValue: string;
}

export interface IExtraInfo {
  key: string;
  value: string;
}
