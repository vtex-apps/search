import { ParamsContext, RecorderState, Service, ServiceContext } from "@vtex/api";
import { Clients } from "./clients";
import { schemaDirectives } from "./directives";
import { autocomplete } from "./resolvers/autocomplete";
import { search } from "./resolvers/search";
import { extraInfo } from "./resolvers/extra-info";
import { products } from "./resolvers/products";

const FIFTEEN_SECOND_MS = 15 * 1000;

declare global {
  type Context = ServiceContext<Clients>;
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: FIFTEEN_SECOND_MS,
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
