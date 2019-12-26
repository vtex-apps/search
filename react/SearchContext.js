import React, { useMemo } from "react";
import { prop } from "ramda";
import { useRuntime } from "vtex.render-runtime";
import { SearchClickPixel } from "vtex.sae-analytics";

import { vtexOrderToBiggyOrder } from "./utils/vtex-utils";
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
  const { account } = useRuntime();
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

  const initialVariables = {
    operator,
    fuzzy,
    query: _query,
    page: 1,
    store: "exitocol", // TODO: remove
    attributePath: url,
    sort: vtexOrderToBiggyOrder(order),
    count: maxItemsPerPage,
    leap: !!leap,
  };

  if (!_query) throw new Error("Empty search is not allowed");

  return (
    <SearchQuery
      priceRangeKey={priceRangeKey}
      attributePath={attributePath}
      map={map}
      variables={initialVariables}
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

export default SearchContext;
