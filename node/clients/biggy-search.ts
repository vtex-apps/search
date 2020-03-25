import { path, prop } from "ramda";
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { SearchResultArgs } from "../resolvers/search";
import {
  SuggestionProductsArgs,
  SuggestionSearchesArgs,
} from "../resolvers/autocomplete";
import { IndexingType } from "../resolvers/products";

export class BiggySearchClient extends ExternalClient {
  private store: string;

  constructor(context: IOContext, options?: InstanceOptions) {
    super("http://search.biggylabs.com.br/search-api/v1/", context, options);

    const { account } = context;
    this.store = account;
  }

  public async topSearches(): Promise<any> {
    const result = await this.http.get<any>(`${this.store}/api/top_searches`, {
      metric: "top-searches",
    });

    return result;
  }

  public async suggestionSearches(args: SuggestionSearchesArgs): Promise<any> {
    const { term } = args;

    const result = await this.http.get<any>(
      `${this.store}/api/suggestion_searches`,
      {
        params: {
          term,
        },
        metric: "suggestion-searches",
      },
    );

    return result;
  }

  public async suggestionProducts(args: SuggestionProductsArgs): Promise<any> {
    const {
      term,
      attributeKey,
      attributeValue,
      tradePolicy,
      indexingType,
    } = args;
    const attributes: { key: string; value: string }[] = [];

    if (attributeKey && attributeValue) {
      attributes.push({
        key: attributeKey,
        value: attributeValue,
      });
    }

    if (indexingType !== IndexingType.XML && tradePolicy) {
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
        metric: "suggestion-products",
      },
    );

    return result;
  }

  public async searchResult(args: SearchResultArgs): Promise<any> {
    const {
      attributePath = "",
      query,
      page,
      count,
      sort,
      operator,
      fuzzy,
      leap,
      tradePolicy,
      indexingType,
    } = args;

    const policyAttr =
      tradePolicy && indexingType !== IndexingType.XML
        ? `/trade-policy/${tradePolicy}`
        : "";
    const url = `${this.store}/api/search/${attributePath}${policyAttr}`;

    const result = await this.http.getRaw(url, {
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
      validateStatus: (status: number) => {
        // Search Redirect usese 302 when a query should be redirected.
        return (status >= 200 && status < 300) || status === 302;
      },
    });

    let redirect: string | undefined;
    if (prop("status", result) === 302) {
      redirect = path(["headers", "location"], result);
    }

    const data = result.data;
    return { ...data, redirect };
  }
}
