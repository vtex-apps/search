interface SearchResult {
  query: string;
  total: number;
  products: any[];
  redirect?: string;
  attributes?: Attribute[];
}

interface Attribute {
  visible: boolean;
  active: boolean;
  key: string;
  label: string;
  type: "text" | "number";
  minValue?: number;
  maxValue?: number;
  values: {
    count: number;
    active: boolean;
    key: string;
    label: string;
    proxyUrl: string;
  }[];
}
