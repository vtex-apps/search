import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { prop } from "ramda";
import { SearchClickPixel } from "vtex.sae-analytics";

import {
  convertOrderBy,
  convertURLToAttributePath,
} from "./utils/compatibility-layer.ts";
import useRedirect from "./components/useRedirect";
import SearchQuery from "./components/SearchQuery";

const SearchContext = props => {
  const { setRedirect } = useRedirect();

  const {
    children,
    priceRangeKey,
    maxItemsPerPage,
    __unstableProductOrigin: productOrigin,
    params: { path: attributePath },
    query: { _query, map, order, operator, fuzzy, priceRange, bgy_leap: leap },
  } = props;

  const url = useMemo(
    () =>
      convertURLToAttributePath(attributePath, map, priceRange, priceRangeKey),
    [attributePath, map, priceRange],
  );

  const variables = {
    operator,
    fuzzy,
    productOrigin,
    query: _query,
    page: 1,
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
  __unstableProductOrigin: PropTypes.oneOf(["BIGGY", "VTEX"]),
};

SearchContext.defaultProps = {
  priceRangeKey: undefined,
  maxItemsPerPage: 20,
  __unstableProductOrigin: "BIGGY",
};

export default SearchContext;
