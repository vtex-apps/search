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
      this.context.logger.error(err);
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
      this.context.logger.error(err);
      return { searches: [] };
    }
  }

  public async suggestionProducts({
    term,
    attributeKey,
    attributeValue,
    tradePolicy,
  }: SuggestionProductsInput): Promise<any> {
    try {
      const attributes: { key: string; value: string }[] = [];

      if (attributeKey && attributeValue) {
        attributes.push({
          key: attributeKey,
          value: attributeValue,
        });
      }

      if (tradePolicy) {
        attributes.push({
          key: "trade-policy",
          value: tradePolicy,
        });
      }

      const result = await this.http.post<any>(
        `${this.store}/api/suggestion_products`,
        {
          term,
          attributes,
        },
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
      this.context.logger.error(err);
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
    tradePolicy,
  }: SearchResultInput): Promise<any> {
    try {
      const path = `${this.store}/api/search/${attributePath || ""}${
        tradePolicy ? `/trade-policy/${tradePolicy}` : ""
      }`;

      const result = await this.http.get<any>(path, {
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
      });

      return result || { products: [] };
    } catch (err) {
      let redirect: string | undefined;
      if (path(["response", "status"], err) === 302) {
        redirect = path(["response", "headers", "location"], err);
      }

      this.context.logger.error(err);
      return {
        redirect,
        query,
        operator: operator || "and",
        total: 0,
        products: [],
      };
    }
  }
}
