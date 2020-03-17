import React from "react";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import DidYouMean from "./components/DidYouMean";
import { path } from "ramda";

const withDidYouMeanTerm = Component => () => {
  const { searchQuery } = useSearchPage();
  const correction =
    searchQuery.correction ||
    path(["data", "productSearch", "correction"], searchQuery);

  return <Component correction={correction} />;
};

export default withDidYouMeanTerm(DidYouMean);
