import React from "react";
import { Helmet, useRuntime } from "vtex.render-runtime";
import PropTypes from "prop-types";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import { isEmpty, reject } from "ramda";

const getCanonicalHost = () =>
  // eslint-disable-next-line
  window.__hostname__ || prop("hostname", window.location);

const SearchWrapper = ({ children }) => {
  const { route, getSettings } = useRuntime();
  const { storeName, metaTagKeywords } = getSettings("vtex.store") || {};
  const {
    searchQuery: { query },
  } = useSearchPage();

  const title = reject(isEmpty, [query, storeName]).join(" - ");

  return (
    <>
      <Helmet
        title={title}
        meta={[
          query && {
            name: "keywords",
            content: `${query}, ${metaTagKeywords}`,
          },
          query && {
            name: "robots",
            content: "noindex,follow",
          },
        ].filter(Boolean)}
        link={[
          {
            rel: "canonical",
            href: encodeURI(`https://${getCanonicalHost()}${route.path}`),
          },
        ]}
      />
      {children}
    </>
  );
};

SearchWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default SearchWrapper;
