import { SegmentData } from "@vtex/api";
import { path } from "ramda";
import { IndexingType } from "./products";

export interface SearchResultArgs {
  attributePath: string;
  query: string;
  page: number;
  count: number;
  sort: string;
  operator: string;
  fuzzy: number;
  leap: boolean;
  tradePolicy?: string;
  segment?: SegmentData;
  indexingType?: IndexingType;
}

export const search = {
  searchResult: async (_: any, args: SearchResultArgs, ctx: Context) => {
    const { biggySearch } = ctx.clients;
    const tradePolicy = path<string | undefined>(["segment", "channel"], args);

    const result = await biggySearch.searchResult({ ...args, tradePolicy });

    return result;
  },
};
