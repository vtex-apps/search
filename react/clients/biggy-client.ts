import ApolloClient, { ApolloQueryResult } from "apollo-client";
import { IElasticProductText, ISearchProduct } from "../models/search-product";
import { getCookie, setCookie } from "../utils/dom-utils";

import getConfig from "../graphql/getConfig.gql";
import searchResult from "../graphql/searchResult.gql";
import suggestionProducts from "../graphql/suggestionProducts.gql";
import suggestionSearches from "../graphql/suggestionSearches.gql";
import topSearches from "../graphql/topSearches.gql";

export class BiggyClient {
  private historyKey = "biggy-search-history";

  constructor(private client: ApolloClient<any>) {}

  public async config(): Promise<ApolloQueryResult<{ getConfig: IConfig }>> {
    return this.client.query({
      query: getConfig,
    });
  }

  public async topSearches(
    paidNavigation?: boolean,
  ): Promise<ApolloQueryResult<{ topSearches: ISearchesOutput }>> {
    const { store } = (await this.config()).data.getConfig;

    return this.client.query({
      query: topSearches,
      variables: {
        store,
        paidNavigation,
      },
    });
  }

  public async suggestionSearches(
    term: string,
  ): Promise<ApolloQueryResult<{ suggestionSearches: ISearchesOutput }>> {
    const { store } = (await this.config()).data.getConfig;

    return this.client.query({
      query: suggestionSearches,
      variables: {
        store,
        term,
      },
    });
  }

  public async suggestionProducts(
    term: string,
    attributeKey?: string,
    attributeValue?: string,
  ): Promise<ApolloQueryResult<{ suggestionProducts: IProductsOutput }>> {
    const { store } = (await this.config()).data.getConfig;

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

  public searchHistory(): string[] {
    const history = getCookie(this.historyKey) || "";

    return history.split(",").filter(x => !!x);
  }

  public prependSearchHistory(term: string, limit: number = 5) {
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

  public async searchResult(
    attributePath: string,
    query: string,
    page: number,
    sort?: string,
    count?: number,
    operator?: string,
    fuzzy?: string,
  ) {
    const { store } = (await this.config()).data.getConfig;

    return this.client.query({
      query: searchResult,
      variables: {
        store,
        attributePath,
        query,
        page,
        sort,
        count,
        operator,
        fuzzy,
      },
    });
  }
}

interface ISearchesOutput {
  searches: ISuggestionQueryResponseSearch[];
}

interface IProductsOutput {
  products: ISearchProduct[];
  count: number;
}

interface IConfig {
  apiKey: string;
  store: string;
}

interface ISuggestionQueryResponseSearch {
  term: string;
  count: number;
  attributes: IElasticProductText[];
}
