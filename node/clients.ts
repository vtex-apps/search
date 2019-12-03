import { IOClients, IOContext } from "@vtex/api";
import { BiggySearch } from "./clients/biggy-search";

export interface IContext {
  vtex: IOContext;
  clients: {
    biggySearch: BiggySearch;
  };
}

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get biggySearch() {
    return this.getOrSet("biggySearch", BiggySearch);
  }
}
