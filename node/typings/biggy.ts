interface TopSearchesInput {
  store: string;
  paidNavigation?: boolean;
}

interface SuggestionSearchesInput {
  store: string;
  term: string;
}

interface SuggestionProductsInput {
  store: string;
  term: string;
  attributeKey?: string;
  attributeValue?: string;
}

interface SearchResultInput {
  store: string;
  attributePath: string;
  query: string;
  page: number;
  count: number;
  sort: string;
  operator: string;
  fuzzy: number;
}
