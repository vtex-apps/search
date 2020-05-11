import { Service, ServiceContext } from "@vtex/api";
import { Clients } from "./clients";
import { schemaDirectives } from "./directives";
import { autocomplete } from "./resolvers/autocomplete";
import { search } from "./resolvers/search";
import { extraInfo } from "./resolvers/extra-info";
import { products } from "./resolvers/products";

const TEN_SECOND_MS = 10 * 1000;

declare global {
  type Context = ServiceContext<Clients>;
}

export default new Service({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: TEN_SECOND_MS,
      },
    },
  },
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
