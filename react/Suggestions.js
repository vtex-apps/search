import React from "react";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import Suggestions from "./components/Suggestions";
import { path } from "ramda";

const withSuggestion = Component => () => {
  const { searchQuery } = useSearchPage();
  const suggestion =
    searchQuery.suggestion ||
    path(["data", "productSearch", "suggestion"], searchQuery);

  return <Component suggestion={suggestion} />;
};

export default withSuggestion(Suggestions);
