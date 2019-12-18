import React from "react";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import DidYouMean from "./components/DidYouMean";

const withDidYouMeanTerm = Component => () => {
  const { searchQuery } = useSearchPage();
  const correction = searchQuery.correction;

  return <Component correction={correction} />;
};

export default withDidYouMeanTerm(DidYouMean);
