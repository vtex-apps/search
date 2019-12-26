import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { prop } from "ramda";
// import { useRuntime } from "vtex.render-runtime";
import { SearchClickPixel } from "vtex.sae-analytics";

import { convertOrderBy } from "./utils/compatibility-layer.ts";
import useRedirect from "./useRedirect";
import SearchQuery from "./components/SearchQuery";

const getUrlByAttributePath = (
  attributePath,
  map,
  priceRange,
  priceRangeKey,
) => {
  const facets = attributePath ? attributePath.split("/") : [];
  const apiUrlTerms = map
    ? map
        .split(",")
        .slice(1)
        .map((item, index) => `${item}/${facets[index]}`)
    : [];

  const url = apiUrlTerms.join("/");

  if (priceRange && priceRangeKey) {
    const [from, to] = priceRange.split(" TO ");
    return `${url}/${priceRangeKey}/${from}:${to}`;
  }

  return url;
};

const SearchContext = props => {
  // const { account } = useRuntime();
  const { setRedirect } = useRedirect();

  const {
    children,
    priceRangeKey,
    maxItemsPerPage,
    params: { path: attributePath },
    query: { _query, map, order, operator, fuzzy, priceRange, bgy_leap: leap },
  } = props;

  const url = useMemo(
    () => getUrlByAttributePath(attributePath, map, priceRange, priceRangeKey),
    [attributePath, map, priceRange],
  );

  const variables = {
    operator,
    fuzzy,
    query: _query,
    page: 1,
    store: "exitocol", // TODO: remove
    attributePath: url,
    sort: convertOrderBy(order),
    count: maxItemsPerPage,
    leap: !!leap,
  };

  if (!_query) throw new Error("Empty search is not allowed");

  return (
    <SearchQuery
      priceRangeKey={priceRangeKey}
      attributePath={attributePath}
      map={map}
      variables={variables}
    >
      {result => {
        const redirect = prop("redirect", result);

        if (redirect) {
          setRedirect(redirect);
        }

        return (
          <>
            <SearchClickPixel query={_query} />

            {React.cloneElement(children, {
              ...result,
            })}
          </>
        );
      }}
    </SearchQuery>
  );
};

SearchContext.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  priceRangeKey: PropTypes.string,
  maxItemsPerPage: PropTypes.number,
  params: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.any.isRequired,
};

SearchContext.defaultProps = {
  priceRangeKey: undefined,
  maxItemsPerPage: 20,
};

export default SearchContext;
