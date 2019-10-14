export interface ISearchProductText {
  key: string;
  value: string;
  labelKey: string;
  labelValue: string;
}

export interface ISearchProduct {
  id: string;
  product: string;
  name: string;
  brand: string;
  url: string;
  images: ISearchProductImage[];
  oldPrice: number;
  price: number;
  oldPriceText: string;
  priceText: string;
  installment: ISearchProductInstallment;
  attributes: ISearchProductText[];
  extraInfo: ISearchProductExtraInfo[];
}

export interface ISearchProductImage {
  name: string;
  value: string;
}

export interface ISearchProductInstallment {
  count: number;
  value: number;
  interest: boolean;
  valueText: string;
}

export interface ISearchProductExtraInfo {
  key: string;
  value: string;
}
