interface IVtexFacet {
  quantity: number;
  name: string;
  link: string;
  linkEncoded: string;
  selected: boolean;
  value: string;
}

export interface IVtexFilter {
  name: string;
  facets: IVtexFacet[];
}
