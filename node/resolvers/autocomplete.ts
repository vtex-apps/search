import {
  SuggestionProductsInput,
  SuggestionSearchesInput,
} from "../commons/inputs";
import { IContext } from "..";

export const autocomplete = {
  topSearches: async (_: any, __: any, ctx: IContext) => {
    const { biggySearch } = ctx.clients;

    return await biggySearch.topSearches();
  },

  suggestionSearches: async (
    _: any,
    args: SuggestionSearchesInput,
    ctx: IContext,
  ) => {
    const { biggySearch } = ctx.clients;

    return await biggySearch.suggestionSearches(args);
  },

  suggestionProducts: async (
    _: any,
    args: SuggestionProductsInput,
    ctx: IContext,
  ) => {
    const { biggySearch } = ctx.clients;

    return await biggySearch.suggestionProducts(args);
  },
};
