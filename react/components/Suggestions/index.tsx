import React, { FC } from "react";
import { Link } from "vtex.render-runtime";
import styles from "./styles.css";
import { FormattedMessage } from "react-intl";
import searchSuggestionsQuery from "vtex.store-resources/QuerySearchSuggestions";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import { useQuery } from "react-apollo";

interface SuggestionsProps {
  customPage: string;
}

interface Suggestion {
  searches: {
    term: string;
    count: number;
  }[];
}

const Suggestions: FC<SuggestionsProps> = ({ customPage }) => {
  const {
    searchQuery: {
      variables: { fullText },
    },
  } = useSearchPage();

  if (!fullText) {
    return null;
  }

  const { loading, data } = useQuery(searchSuggestionsQuery, {
    variables: {
      fullText,
    },
  });

  const suggestion: Suggestion | undefined = data?.searchSuggestions;

  if (loading || !suggestion || suggestion.searches.length === 0) {
    return null;
  }

  const getSearchPage = customPage
    ? (term: string) => ({
        page: customPage,
        query: "map=ft",
        params: { term },
      })
    : (term: string) => ({ to: `/${term}?map=ft` });

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
              {...getSearchPage(search.term)}
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
