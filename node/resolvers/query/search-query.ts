import { IContext } from "../../context";
import { convertOderBy } from "../../commons/compatibility-layer";

export const searchQuery = {
  searchQuery: async (_: any, args: SearchQueryInput, ctx: IContext) => {
    const { biggySearch } = ctx.clients;
    // const { account: store } = ctx.vtex;
    const { from, to } = args;

    const count = to - from - 1;
    const page = Math.floor(to / (count + 1)) + 1;

    const sort = convertOderBy(args.orderBy);

    const result = await biggySearch.searchResult({
      page,
      count,
      sort,
      store: "exitocol", // TODO: Remove this
      ...args,
    });

    return result;
  },
};
