import { path } from "ramda";
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import {
  SuggestionSearchesInput,
  SuggestionProductsInput,
  SearchResultInput,
} from "../commons/inputs";

export class BiggySearchClient extends ExternalClient {
  private store: string;

  constructor(context: IOContext, options?: InstanceOptions) {
    super("http://search.biggylabs.com.br/search-api/v1/", context, options);

    const { account } = context;
    this.store = account;
  }

  public async topSearches(): Promise<any> {
    try {
      const result = await this.http.get<any>(
        `${this.store}/api/top_searches`,
        {
          metric: "top-searches",
        },
      );

      return result || { searches: [] };
    } catch (err) {
      // TODO: Add logging
      return { searches: [] };
    }
  }

  public async suggestionSearches({
    term,
  }: SuggestionSearchesInput): Promise<any> {
    try {
      const result = await this.http.get<any>(
        `${this.store}/api/suggestion_searches`,
        {
          params: {
            term,
          },
          metric: "suggestion-searches",
        },
      );

      return result || { searches: [] };
    } catch (err) {
      // TODO: Add logging
      return { searches: [] };
    }
  }

  public async suggestionProducts({
    term,
    attributeKey,
    attributeValue,
  }: SuggestionProductsInput): Promise<any> {
    try {
      const result = await this.http.get<any>(
        `${this.store}/api/suggestion_products`,
        {
          params: {
            term,
            key: attributeKey,
            value: attributeValue,
          },
          metric: "suggestion-products",
        },
      );

      return result || { count: 0, products: [] };
    } catch (err) {
      // TODO: Add logging
      return { count: 0, products: [] };
    }
  }

  public async searchResult({
    attributePath,
    query,
    page,
    count,
    sort,
    operator,
    fuzzy,
    leap,
  }: SearchResultInput): Promise<any> {
    try {
      const result = await this.http.get<any>(
        `${this.store}/api/search/${attributePath || ""}`,
        {
          params: {
            query,
            page,
            count,
            sort,
            operator,
            fuzzy,
            bgy_leap: leap ? true : undefined,
          },
          metric: "search-result",
        },
      );

      return result || { products: [] };
    } catch (err) {
      if (path(["response", "status"], err) === 302) {
        const redirect = path(["response", "headers", "location"], err);
        return { redirect, products: [] };
      }

      // TODO: Add logging
      return { products: [] };
    }
  }
}
