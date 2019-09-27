export interface TopSearchesInput {
  store: string;
  paidNavigation?: boolean;
}

export interface SuggestionSearchesInput {
  store: string;
  term: string;
}

export interface SuggestionProductsInput {
  store: string;
  term: string;
  attributeKey?: string;
  attributeValue?: string;
}

export interface SearchResultInput {
  store: string;
  attributePath: string;
  query: string;
  page: number;
  count: number;
  sort: string;
  operator: string;
  fuzzy: number;
}
