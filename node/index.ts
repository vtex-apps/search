import { ClientsConfig, Service, IOContext } from "@vtex/api";
import { Clients } from "./clients";
import { schemaDirectives } from "./directives";
import { autocomplete } from "./resolvers/autocomplete";
import { search } from "./resolvers/search";
import { extraInfo } from "./resolvers/extra-info";
import { products } from "./resolvers/products";
import { BiggySearchClient } from "./clients/biggy-search";
import { SearchGraphQL } from "./clients/search-graphql";

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
    schemaDirectives: schemaDirectives as Record<string, any>,
    resolvers: {
      Query: {
        ...autocomplete,
        ...search,
      },
      ResultResponse: {
        ...products,
      },
      SuggestionProductsOutput: {
        ...products,
      },
      SearchProduct: {
        ...extraInfo,
      },
    },
  },
});

interface Segment {
  channel: string;
}

export interface IContext {
  vtex: IOContext & { segment: Segment };
  clients: {
    biggySearch: BiggySearchClient;
    searchGraphQL: SearchGraphQL;
  };
}
