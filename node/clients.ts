import {
  ExternalClient,
  InstanceOptions,
  IOClients,
  IOContext,
} from "@vtex/api";
import { path, or } from "ramda";

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
  }: SearchResultInput): Promise<SearchResult> {
    try {
      const result = await this.http.get<SearchResult>(
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

      console.log(result.total);

      return or(result, { query, total: 0, products: [] });
    } catch (err) {
      // On redirect, return a redirect object.
      if (path(["response", "status"], err) === 302) {
        const redirect = path<string>(["response", "headers", "location"], err);

        return { redirect, query, total: 0, products: [] };
      }

      throw err;
    }
  }
}
