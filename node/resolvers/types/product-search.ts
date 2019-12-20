export const productSearch = {
  productSearch: async (searchResult: SearchResult): Promise<ProductSearch> => {
    const { products } = searchResult;

    return {
      products,
      recordsFiltered: searchResult.total,
      breadcrumb: [
        {
          name: searchResult.query,
          href: `/search?_query=${searchResult.query}`,
        },
      ],
    };
  },
};
interface ProductSearch {
  products: any[];
  recordsFiltered: number;
  titleTag?: String;
  metaTagDescription?: String;
  breadcrumb: Breadcrumb[];
}

interface Breadcrumb {
  name: string;
  href: string;
}
