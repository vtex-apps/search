import React from "react";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import Suggestions from "./components/Suggestions";

const withSuggestion = Component => () => {
  const { searchQuery } = useSearchPage();
  const suggestion = searchQuery.suggestion;

  return <Component suggestion={suggestion} />;
};

export default withSuggestion(Suggestions);
