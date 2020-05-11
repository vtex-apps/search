import React from "react";
import { Link } from "vtex.render-runtime";
import styles from "./styles.css";
import { FormattedMessage } from "react-intl";
import searchSuggestionsQuery from "vtex.store-resources/QuerySearchSuggestions";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import { useQuery } from "react-apollo";

interface Suggestion {
  searches: {
    term: string;
    count: number;
  }[];
}

const Suggestions = () => {
  const {
    searchQuery: {
      variables: { fullText },
    },
  } = useSearchPage();

  const { loading, data } = useQuery(searchSuggestionsQuery, {
    variables: {
      fullText,
    },
  });

  if (!loading) {
    console.log("my data");
    console.log(searchSuggestionsQuery);
  } else {
    console.log(loading);
  }

  const suggestion: Suggestion | undefined = data?.searchSuggestions?.searches;

  if (loading || !suggestion || suggestion.searches.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.suggestionListWrapper} flex flex-row items-center`}
    >
      <p className={`${styles.suggestionsListPrefix} mr5 b f7 ma0`}>
        <FormattedMessage id="store/searchSuggestions" />
        {": "}
      </p>
      <ul className={`${styles.suggestionsList} list flex pa0 ma0`}>
        {suggestion.searches.map(search => (
          <li className={styles.suggestionsListItem} key={search.term}>
            <Link
              className={`${styles.suggestionsListLink} link f7`}
              to={`/${search.term}?map=ft`}
            >
              {search.term}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
