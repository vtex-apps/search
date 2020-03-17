import React from "react";
import { Link } from "vtex.render-runtime";
import styles from "./styles.css";
import { FormattedMessage } from "react-intl";

interface SuggestionsProps {
  suggestion: {
    searches: {
      term: string;
      count: number;
    }[];
  };
}

const Suggestions = (props: SuggestionsProps) => {
  const { suggestion } = props;

  if (!suggestion || suggestion.searches.length === 0) {
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
              to={"/search"}
              query={`_query=${search.term}`}
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
