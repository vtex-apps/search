export enum IndexingType {
  API = "API",
  XML = "XML",
}

/**
 * `products` field of `ResultResponse` and `SuggestionProductsOutput`.
 *
 * vtex.search-resolver already returns products in the VTEX shape, so they
 * are passed through. The `origin` and `indexingType` arguments are read by
 * the parent resolvers when calling vtex.search-resolver.
 */
export const products = {
  products: (parent: { products?: any[] | null }) => parent.products ?? [],
};
