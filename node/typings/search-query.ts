interface SearchQueryInput {
  query: string;
  orderBy: OrderBy;
  from: number;
  to: number;

  // Below are Biggy's search specific options
  operator: string;
  fuzzy: number;
  leap: boolean;
  attributePath: string;
}
