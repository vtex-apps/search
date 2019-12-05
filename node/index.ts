import { ClientsConfig, Service, IOContext } from "@vtex/api";
import { Clients, BiggySearchClient } from "./clients";
import { autocomplete } from "./resolvers/autocomplete";
import { search } from "./resolvers/search";

const FIFTEEN_SECOND_MS = 15 * 1000;

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: FIFTEEN_SECOND_MS,
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
