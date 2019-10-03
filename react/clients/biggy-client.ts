import ApolloClient, { ApolloQueryResult } from "apollo-client";
import { IElasticProductText, ISearchProduct } from "../models/search-product";
import { getCookie, setCookie } from "../utils/dom-utils";

import productsById from "../graphql/productsById.gql";
import searchResult from "../graphql/searchResult.gql";
import suggestionProducts from "../graphql/suggestionProducts.gql";
import suggestionSearches from "../graphql/suggestionSearches.gql";
import topSearches from "../graphql/topSearches.gql";
import { ISearchResult } from "../models/search-result";

export class BiggyClient {
  private historyKey = "biggy-search-history";

  constructor(private account: string, private client: ApolloClient<any>) {}

  public async topSearches(
    paidNavigation?: boolean,
  ): Promise<ApolloQueryResult<{ topSearches: ISearchesOutput }>> {
    return this.client.query({
      query: topSearches,
      variables: {
        store: this.account,
        paidNavigation,
      },
    });
  }

  public async suggestionSearches(
    term: string,
  ): Promise<ApolloQueryResult<{ suggestionSearches: ISearchesOutput }>> {
    return this.client.query({
      query: suggestionSearches,
      variables: {
        store: this.account,
        term,
      },
    });
  }

  public async suggestionProducts(
    term: string,
    attributeKey?: string,
    attributeValue?: string,
  ): Promise<ApolloQueryResult<{ suggestionProducts: IProductsOutput }>> {
    return this.client.query({
      query: suggestionProducts,
      variables: {
        store: this.account,
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
    const result = await this.client.query<{ searchResult: ISearchResult }>({
      query: searchResult,
      variables: {
        store: this.account,
        attributePath,
        query,
        page,
        sort,
        count,
        operator,
        fuzzy,
      },
    });

    if (
      result &&
      result.data &&
      result.data.searchResult &&
      result.data.searchResult.products
    ) {
      const ids = (result.data.searchResult.products as any[]).map(
        (p: any) => p.id,
      );

      result.data.searchResult.products = (await this.productsById(
        ids,
      )).data.productsByIdentifier;
    }

    return result;
  }

  private async productsById(ids: string[]) {
    return this.client.query<{ productsByIdentifier: any[] }>({
      query: productsById,
      variables: { ids },
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

interface ISuggestionQueryResponseSearch {
  term: string;
  count: number;
  attributes: IElasticProductText[];
}
