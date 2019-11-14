import { IContext } from "./queries";

import {
  SuggestionProductsInput,
  SuggestionSearchesInput,
  TopSearchesInput,
} from "../commons/inputs";

export const autocomplete = {
  topSearches: async (_: any, args: TopSearchesInput, ctx: IContext) => {
    const { biggySearch } = ctx.clients;

    const result = (await biggySearch.topSearches(args)) || {};
    result.searches = result.searches || [];

    return result;
  },

  suggestionSearches: async (
    _: any,
    args: SuggestionSearchesInput,
    ctx: IContext,
  ) => {
    const { biggySearch } = ctx.clients;

    const result = (await biggySearch.suggestionSearches(args)) || {};
    result.searches = result.searches || [];

    return result;
  },

  suggestionProducts: async (
    _: any,
    args: SuggestionProductsInput,
    ctx: IContext,
  ) => {
    const { biggySearch } = ctx.clients;

    const result = (await biggySearch.suggestionProducts(args)) || { count: 0 };
    result.products = result.products || [];

    result.products.forEach((product: any) => {
      const mapInfo = product.extraInfo || {};
      const extraInfo: { key: string; value: string }[] = [];

      // Transform ExtraInfo from Map<String, String> to Array<KeyValueTuple>.
      for (const key of Object.keys(mapInfo)) {
        extraInfo.push({ key, value: mapInfo[key] });
      }

      product.extraInfo = extraInfo;
    });

    return result;
  },
};
