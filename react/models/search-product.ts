import { IProductSku } from "./product";

export interface ISearchProductText {
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
  brand: string;
  product: string;
  categories: string[];
  skus: IProductSku[];
}

interface IElasticProductImage {
  name: string;
  value: string;
}

export interface IElasticProductInstallment {
  count: number;
  value: number;
  interest: boolean;
  valueText: string;
}

interface IElasticProductText {
  key: string;
  value: string;
  labelKey: string;
  labelValue: string;
}

export interface IExtraInfo {
  key: string;
  value: string;
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
