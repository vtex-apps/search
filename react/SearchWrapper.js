import React from "react";
import { Helmet, useRuntime } from "vtex.render-runtime";
import PropTypes from "prop-types";
import { isEmpty, reject, prop } from "ramda";

const getCanonicalHost = () =>
  // eslint-disable-next-line no-underscore-dangle
  window.__hostname__ || prop("hostname", window.location);

const SearchWrapper = ({ children, searchResult: { query } }) => {
  const { route, getSettings } = useRuntime();
  const { storeName, metaTagKeywords } = getSettings("vtex.store") || {};

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
  searchResult: PropTypes.shape({
    query: PropTypes.string,
  }).isRequired,
};

export default SearchWrapper;
