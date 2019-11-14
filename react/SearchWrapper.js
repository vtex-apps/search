import React from "react";
import { Helmet, useRuntime } from "vtex.render-runtime";
import PropTypes from "prop-types";

const SearchWrapper = props => {
  const { getSettings } = useRuntime();
  const { storeName, metaTagKeywords } = getSettings("vtex.store") || {};

  const { searchResult } = props;

  const title =
    searchResult && searchResult.query
      ? `${searchResult.query} - ${storeName}`
      : storeName;

  const { children } = props;
  return (
    <>
      <Helmet
        title={title}
        meta={[
          searchResult &&
            searchResult.query && {
              name: "keywords",
              content: `${searchResult.query}, ${metaTagKeywords}`,
            },
          searchResult &&
            searchResult.query && {
              name: "robots",
              content: "noindex,follow",
            },
        ].filter(Boolean)}
      />
      {children}
    </>
  );
};

SearchWrapper.propTypes = {
  searchResult: PropTypes.shape({
    query: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default SearchWrapper;
