import { IOContext } from "@vtex/api";
import { BiggySearchClient } from "./clients";

export interface IContext {
  vtex: IOContext;
  clients: {
    biggySearch: BiggySearchClient;
  };
}
