import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";

export class BiggySearch extends ExternalClient {
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
  }: SearchResultInput): Promise<any> {
    return this.http.get<any>(`${store}/api/search/${attributePath || ""}`, {
      params: {
        query,
        page,
        count,
        sort,
        operator,
        fuzzy,
      },
      metric: "search-result",
    });
  }
}
