import { path } from "ramda";
import { SearchResultInput } from "../commons/inputs";
import { IContext } from "..";

export const search = {
  searchResult: async (_: any, args: SearchResultInput, ctx: IContext) => {
    const { biggySearch } = ctx.clients;

    try {
      const result = (await biggySearch.searchResult(args)) || {};
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
    } catch (err) {
      if (path(["response", "status"], err) === 302) {
        const redirect = path(["response", "headers", "location"], err);
        return { redirect, products: [] };
      }

      throw err;
    }
  },
};
