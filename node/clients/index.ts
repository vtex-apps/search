import { IOClients } from "@vtex/api";
import { BiggySearchClient } from "./biggy-search";
import { SearchGraphql } from "./search-graphql";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get biggySearch() {
    return this.getOrSet("biggySearch", BiggySearchClient);
  }

  public get searchGraphql() {
    return this.getOrSet("searchGraphql", SearchGraphql);
  }
}
