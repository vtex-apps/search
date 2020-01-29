export interface SuggestionSearchesInput {
  term: string;
}

export interface SuggestionProductsInput {
  term: string;
  attributeKey?: string;
  attributeValue?: string;
  tradePolicy?: string;
}

export interface SearchResultInput {
  attributePath: string;
  query: string;
  page: number;
  count: number;
  sort: string;
  operator: string;
  fuzzy: number;
  leap: boolean;
  tradePolicy?: string;
}
