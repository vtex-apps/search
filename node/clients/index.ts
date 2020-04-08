import { IOClients } from "@vtex/api";
import { BiggySearchClient } from "./biggy-search";
import { SearchResolver } from "./search-resolver";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get biggySearch() {
    return this.getOrSet("biggySearch", BiggySearchClient);
  }

  public get searchResolver() {
    return this.getOrSet("searchResolver", SearchResolver);
  }
}
