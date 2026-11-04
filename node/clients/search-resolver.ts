import { AppGraphQLClient, InstanceOptions, IOContext } from "@vtex/api";

/**
 * Client for vtex.search-resolver, which serves the vtex.search-graphql
 * schema and routes search and autocomplete requests to Intelligent Search.
 *
 * vtex.search 2.x uses the same fields through vtex.store-resources queries.
 */
export class SearchResolver extends AppGraphQLClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("vtex.search-resolver@1.x", context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        "x-vtex-provider": "vtex.search-graphql@0.75.2",
      },
    });
  }

  public topSearches = () =>
    this.query<{ topSearches: SearchSuggestions | null }, {}>(
      TOP_SEARCHES_QUERY,
      {},
      "search-resolver-top-searches",
    ).then(data => data.topSearches);

  public autocompleteSearchSuggestions = (fullText: string) =>
    this.query<
      { autocompleteSearchSuggestions: SearchSuggestions | null },
      { fullText: string }
    >(
      AUTOCOMPLETE_SEARCH_SUGGESTIONS_QUERY,
      { fullText },
      "search-resolver-autocomplete-search-suggestions",
    ).then(data => data.autocompleteSearchSuggestions);

  public productSuggestions = (variables: ProductSuggestionsVariables) =>
    this.query<
      { productSuggestions: ProductSuggestions | null },
      ProductSuggestionsVariables
    >(
      PRODUCT_SUGGESTIONS_QUERY,
      variables,
      "search-resolver-product-suggestions",
    ).then(data => data.productSuggestions);

  public productSearch = (variables: ProductSearchVariables) =>
    this.query<{ productSearch: ProductSearch | null }, ProductSearchVariables>(
      PRODUCT_SEARCH_QUERY,
      variables,
      "search-resolver-product-search",
    ).then(data => data.productSearch);

  private async query<Data extends object, Variables extends object>(
    query: string,
    variables: Variables,
    metric: string,
  ): Promise<Data> {
    const result = await this.graphql.query<Data, Variables>(
      { query, variables, throwOnError: true },
      { metric },
    );

    if (!result.data) {
      throw new Error(`vtex.search-resolver returned no data (${metric})`);
    }

    return result.data;
  }
}

export interface SearchSuggestionAttribute {
  key: string;
  value: string;
  labelValue: string;
}

export interface SearchSuggestion {
  term: string;
  count: number;
  attributes: SearchSuggestionAttribute[] | null;
}

export interface SearchSuggestions {
  searches: (SearchSuggestion | null)[] | null;
}

export interface SearchBanner {
  id: string | null;
  name: string | null;
  area: string | null;
  html: string | null;
}

export interface SelectedFacet {
  key: string;
  value: string;
}

export interface ProductSuggestions {
  count: number;
  products: any[];
}

export interface ProductSearch {
  products: any[] | null;
  recordsFiltered: number | null;
  operator: string | null;
  redirect: string | null;
  suggestion: SearchSuggestions | null;
  correction: {
    text: string | null;
    highlighted: string | null;
    misspelled: boolean | null;
    correction: boolean | null;
  } | null;
  banners: SearchBanner[] | null;
}

export interface ProductSuggestionsVariables {
  fullText: string;
  facetKey?: string;
  facetValue?: string;
  productOriginVtex: boolean;
  count?: number;
}

export interface ProductSearchVariables {
  fullText?: string;
  selectedFacets?: SelectedFacet[];
  orderBy?: string;
  from?: number;
  to?: number;
  operator?: "and" | "or";
  fuzzy?: string;
  productOriginVtex: boolean;
}

// Same product fields that 1.5.1 requested from vtex.search-resolver
// (productsByIdentifier) and that the 1.x front-end fragment reads.
const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    cacheId
    productId
    description
    productName
    productReference
    linkText
    brand
    brandId
    link
    categories
    priceRange {
      sellingPrice {
        highPrice
        lowPrice
      }
      listPrice {
        highPrice
        lowPrice
      }
    }
    specificationGroups {
      name
      specifications {
        name
        values
      }
    }
    items(filter: ALL_AVAILABLE) {
      itemId
      name
      nameComplete
      complementName
      ean
      variations {
        name
        values
      }
      referenceId {
        Key
        Value
      }
      measurementUnit
      unitMultiplier
      images {
        cacheId
        imageId
        imageLabel
        imageTag
        imageUrl
        imageText
      }
      sellers {
        sellerId
        sellerName
        commertialOffer {
          discountHighlights {
            name
          }
          teasers {
            name
            conditions {
              minimumQuantity
              parameters {
                name
                value
              }
            }
            effects {
              parameters {
                name
                value
              }
            }
          }
          Installments(criteria: MAX) {
            Value
            InterestRate
            TotalValuePlusInterestRate
            NumberOfInstallments
            Name
          }
          Price
          ListPrice
          taxPercentage
          PriceWithoutDiscount
          RewardValue
          PriceValidUntil
          AvailableQuantity
        }
      }
    }
    productClusters {
      id
      name
    }
    properties {
      name
      values
    }
  }
`;

const SEARCH_SUGGESTIONS_FIELDS = `
  searches {
    term
    count
    attributes {
      key
      value
      labelValue
    }
  }
`;

const TOP_SEARCHES_QUERY = `
  query TopSearches {
    topSearches {
      ${SEARCH_SUGGESTIONS_FIELDS}
    }
  }
`;

const AUTOCOMPLETE_SEARCH_SUGGESTIONS_QUERY = `
  query AutocompleteSearchSuggestions($fullText: String!) {
    autocompleteSearchSuggestions(fullText: $fullText) {
      ${SEARCH_SUGGESTIONS_FIELDS}
    }
  }
`;

const PRODUCT_SUGGESTIONS_QUERY = `
  query ProductSuggestions(
    $fullText: String!
    $facetKey: String
    $facetValue: String
    $productOriginVtex: Boolean
    $count: Int
  ) {
    productSuggestions(
      fullText: $fullText
      facetKey: $facetKey
      facetValue: $facetValue
      productOriginVtex: $productOriginVtex
      count: $count
    ) {
      count
      products {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FIELDS}
`;

const PRODUCT_SEARCH_QUERY = `
  query ProductSearch(
    $fullText: String
    $selectedFacets: [SelectedFacetInput]
    $orderBy: String
    $from: Int
    $to: Int
    $operator: Operator
    $fuzzy: String
    $productOriginVtex: Boolean
  ) {
    productSearch(
      fullText: $fullText
      selectedFacets: $selectedFacets
      orderBy: $orderBy
      from: $from
      to: $to
      operator: $operator
      fuzzy: $fuzzy
      productOriginVtex: $productOriginVtex
    ) {
      recordsFiltered
      operator
      redirect
      products {
        ...ProductFields
      }
      suggestion {
        ${SEARCH_SUGGESTIONS_FIELDS}
      }
      correction {
        text
        highlighted
        misspelled
        correction
      }
      banners {
        id
        name
        area
        html
      }
    }
  }
  ${PRODUCT_FIELDS}
`;
