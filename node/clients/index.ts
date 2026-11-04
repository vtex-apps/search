import { IOClients } from "@vtex/api";
import { SearchResolver } from "./search-resolver";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get searchResolver() {
    return this.getOrSet("searchResolver", SearchResolver);
  }
}
