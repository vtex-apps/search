import { convertAttribute } from "../../commons/compatibility-layer";

// TODO: Improve typing
export const facets = {
  facets: (searchResult: SearchResult): any => {
    const { attributes } = searchResult;

    const allSpecifications = attributes?.map(convertAttribute) || [];
    const specificationFilters = allSpecifications.filter(spec => spec.map !== "priceRange")
    const priceRanges = allSpecifications.filter(spec => spec.map === "priceRange")

    return { priceRanges, specificationFilters };
  },
};
