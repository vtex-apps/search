import { ClientsConfig, Service } from "@vtex/api";
import { Clients } from "./clients";
import { searchQuery } from "./resolvers/query/search-query";
import { autocomplete } from "./resolvers/query/autocomplete";
import { search } from "./resolvers/query/search";
import { extraInfo } from "./resolvers/types/extra-info";
import { productSearch } from "./resolvers/types/product-search";
import { product } from "./resolvers/types/product";
import { facets } from "./resolvers/types/facets";

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
        ...searchQuery,
      },
      ElasticProduct: {
        ...extraInfo,
      },
      SearchQuery: {
        ...productSearch,
        ...facets,
      },
      Product: {
        ...product,
      },
    },
  },
});
