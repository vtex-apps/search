import ApolloClient, { ApolloQueryResult } from "apollo-client";
import { getCookie, setCookie } from "./dom-utils";

import suggestionProducts from "../graphql/suggestionProducts.gql";
import suggestionSearches from "../graphql/suggestionSearches.gql";
import topSearches from "../graphql/topSearches.gql";

export default class BiggyClient {
  private historyKey = "biggy-search-history";

  constructor(private client: ApolloClient<any>) {}

  async topSearches(
    store: string,
    paidNavigation?: boolean,
  ): Promise<ApolloQueryResult<{ topSearches: ISearchesOutput }>> {
    return this.client.query({
      query: topSearches,
      variables: {
        store,
        paidNavigation,
      },
    });
  }

  async suggestionSearches(
    store: string,
    term: string,
  ): Promise<ApolloQueryResult<{ suggestionSearches: ISearchesOutput }>> {
    return this.client.query({
      query: suggestionSearches,
      variables: {
        store,
        term,
      },
    });
  }

  async suggestionProducts(
    store: string,
    term: string,
    attributeKey?: string,
    attributeValue?: string,
  ): Promise<ApolloQueryResult<{ suggestionProducts: IProductsOutput }>> {
    return this.client.query({
      query: suggestionProducts,
      variables: {
        store,
        term,
        attributeKey,
        attributeValue,
      },
    });
  }

  searchHistory(): string[] {
    const history = getCookie(this.historyKey) || "";

    return history.split(",").filter(x => !!x);
  }

  prependSearchHistory(term: string, limit: number = 5) {
    if (term == null || term.trim() === "") {
      return;
    }

    let history = this.searchHistory();

    if (history.indexOf(term) < 0) {
      history.unshift(term);
      history = history.slice(0, limit);
    }

    setCookie(this.historyKey, history.join(","));
  }
}

interface ISearchesOutput {
  searches: ISuggestionQueryResponseSearch[];
}

interface IProductsOutput {
  products: ISearchProduct[];
  count: number;
}

interface ISuggestionQueryResponseSearch {
  term: string;
  count: number;
  attributes: IElasticProductText[];
}

interface IElasticProductText {
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
