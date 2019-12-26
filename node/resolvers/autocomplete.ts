import {
  SuggestionProductsInput,
  SuggestionSearchesInput,
  TopSearchesInput,
} from "../commons/inputs";
import { IContext } from "..";

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

    return result;
  },
};
