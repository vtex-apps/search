import { GraphQLResolveInfo } from "graphql";
import { IndexingType } from "./products";
import { toSuggestionSearches, wantsVtexProductOrigin } from "./utils";

export interface SuggestionSearchesArgs {
  term: string;
}

export interface SuggestionProductsArgs {
  term: string;
  attributeKey?: string;
  attributeValue?: string;
  indexingType?: IndexingType;
  count?: number;
}

export const autocomplete = {
  topSearches: async (_: any, __: any, ctx: Context) => {
    const { searchResolver } = ctx.clients;

    const topSearches = await searchResolver.topSearches();

    return { searches: toSuggestionSearches(topSearches) };
  },

  suggestionSearches: async (
    _: any,
    args: SuggestionSearchesArgs,
    ctx: Context,
  ) => {
    const { searchResolver } = ctx.clients;

    const suggestions = await searchResolver.autocompleteSearchSuggestions(
      args.term,
    );

    return { searches: toSuggestionSearches(suggestions) };
  },

  /**
   * The sales channel comes from the request segment, which @vtex/api
   * forwards to vtex.search-resolver. `indexingType` has no equivalent and is
   * ignored. `count` is the number of products the front end shows (its
   * `maxSuggestedProducts`); without it the search engine returns 5.
   */
  suggestionProducts: async (
    _: any,
    args: SuggestionProductsArgs,
    ctx: Context,
    info: GraphQLResolveInfo,
  ) => {
    const { searchResolver } = ctx.clients;

    const result = await searchResolver.productSuggestions({
      fullText: args.term,
      facetKey: args.attributeKey,
      facetValue: args.attributeValue,
      productOriginVtex: wantsVtexProductOrigin(info),
      count: args.count != null && args.count > 0 ? args.count : undefined,
    });

    return {
      count: result?.count ?? 0,
      products: result?.products ?? [],
    };
  },
};
