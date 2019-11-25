import { ClientsConfig, LRUCache, Service, IOContext } from "@vtex/api";
import { Clients, BiggySearchClient } from "./clients";
import { autocomplete } from "./resolvers/autocomplete";
import { search } from "./resolvers/search";

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: 12000,
    },
    status: {
      memoryCache: new LRUCache<string, any>({ max: 5000 }),
    },
  },
};

export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        ...autocomplete,
        ...search,
      },
    },
  },
});

export interface IContext {
  vtex: IOContext;
  clients: {
    biggySearch: BiggySearchClient;
  };
}
