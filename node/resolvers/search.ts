import { SearchResultInput } from "../commons/inputs";

export const search = {
  searchResult: async (_: any, args: SearchResultInput, ctx: any) => {
    const { biggySearch } = ctx.clients;
    const { segment } = ctx.vtex;
    args.tradePolicy = segment && segment.channel;

    const result = await biggySearch.searchResult(args);

    return result;
  },
};
