import ApolloClient, { ApolloQueryResult } from "apollo-client";
import { ISearchProduct, ISearchProductText } from "../models/search-product";
import { getCookie, setCookie } from "../utils/dom-utils";

import searchResult from "../graphql/searchResult.gql";
import suggestionProducts from "../graphql/suggestionProducts.gql";
import suggestionSearches from "../graphql/suggestionSearches.gql";
import topSearches from "../graphql/topSearches.gql";

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

  public searchResult(
    attributePath: string,
    query: string,
    page: number,
    sort?: string,
    count?: number,
    operator?: string,
    fuzzy?: string,
  ) {
    return this.client.query({
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
  attributes: ISearchProductText[];
}
