import { IContext } from "../../context";

export const search = {
  searchResult: async (_: any, args: SearchResultInput, ctx: IContext) => {
    const { biggySearch } = ctx.clients;

    const result = await biggySearch.searchResult(args);

    return result;
  },
};
