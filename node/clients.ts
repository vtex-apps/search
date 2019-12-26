import { path } from "ramda";
import {
  ExternalClient,
  InstanceOptions,
  IOClients,
  IOContext,
} from "@vtex/api";
import {
  SearchResultInput,
  SuggestionProductsInput,
  SuggestionSearchesInput,
  TopSearchesInput,
} from "./commons/inputs";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get biggySearch() {
    return this.getOrSet("biggySearch", BiggySearchClient);
  }
}

export class BiggySearchClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("http://search.biggylabs.com.br/search-api/v1/", context, options);
  }

  public async topSearches({ store }: TopSearchesInput): Promise<any> {
    return this.http.get<any>(`${store}/api/top_searches`, {
      metric: "top-searches",
    });
  }

  public async suggestionSearches({
    store,
    term,
  }: SuggestionSearchesInput): Promise<any> {
    return this.http.get<any>(`${store}/api/suggestion_searches`, {
      params: {
        term,
      },
      metric: "suggestion-searches",
    });
  }

  public async suggestionProducts({
    store,
    term,
    attributeKey,
    attributeValue,
  }: SuggestionProductsInput): Promise<any> {
    return this.http.get<any>(`${store}/api/suggestion_products`, {
      params: {
        term,
        key: attributeKey,
        value: attributeValue,
      },
      metric: "suggestion-products",
    });
  }

  public async searchResult({
    store,
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
        `${store}/api/search/${attributePath || ""}`,
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

      throw err;
    }
  }
}
