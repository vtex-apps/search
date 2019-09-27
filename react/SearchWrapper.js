import React, { Fragment } from "react";
import { Helmet, useRuntime } from "vtex.render-runtime";

const SearchWrapper = props => {
  const { getSettings } = useRuntime();
  const { storeName, metaTagKeywords } = getSettings("vtex.store") || {};

  const title =
    props.searchResult && props.searchResult.query
      ? `${props.searchResult.query} - ${storeName}`
      : storeName;

  const { children } = props;
  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          props.searchResult &&
            props.searchResult.query && {
              name: "keywords",
              content: `${props.searchResult.query}, ${metaTagKeywords}`,
            },
          props.searchResult &&
            props.searchResult.query && {
              name: "robots",
              content: "noindex,follow",
            },
        ].filter(Boolean)}
      />
      {children}
    </Fragment>
  );
};

export default SearchWrapper;
