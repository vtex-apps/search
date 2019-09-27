import { Apps, IOContext } from "@vtex/api";
import BiggySearchClient from "../clients";

declare var process: {
  env: {
    VTEX_APP_ID: string;
  };
};

export const queries = {
  getConfig: async (_: any, __: any, ctx: IContext) => {
    const apps = new Apps(ctx.vtex);
    const appId = process.env.VTEX_APP_ID;
    const settings = await apps.getAppSettings(appId);
    return settings;
  },
};

export interface IContext {
  vtex: IOContext;
  clients: {
    biggySearch: BiggySearchClient;
  };
}
