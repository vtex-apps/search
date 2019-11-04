import React, { useMemo } from 'react';
import { Query } from 'react-apollo';
import { useRuntime } from 'vtex.render-runtime';
import searchResultQuery from './graphql/searchResult.gql';
import { vtexOrderToBiggyOrder } from './utils/vtex-utils';
import VtexSearchResult from './models/vtex-search-result';
import logError from './api/log';

const triggerSearchQueryEvent = (data) => {
  if (!data) return;
  const {
    query, operator, correction, total,
  } = data.searchResult;

  const event = new CustomEvent('biggy.search.query', {
    detail: {
      query: query === '' ? '<empty>' : query,
      operator,
      misspelled: correction && correction.misspelled,
      match: total,
    },
  });

  window.dispatchEvent(event);
};

const getUrlByAttributePath = (attributePath, map, priceRange) => {
  const facets = attributePath ? attributePath.split('/') : [];
  const apiUrlTerms = map
    ? map
      .split(',')
      .slice(1)
      .map((item, index) => `${item}/${facets[index]}`)
    : [];

  const url = apiUrlTerms.join('/');

  if (priceRange) {
    const [from, to] = priceRange.split(' TO ');
    return `${url}/precio/${from}:${to}`;
  }

  return url;
};

const SearchContext = (props) => {
  const { account, workspace, route } = useRuntime();

  const {
    params: { path: attributePath },
    query: {
      query, map, order, operator, fuzzy, priceRange,
    },
  } = props;

  const url = useMemo(
    () => getUrlByAttributePath(attributePath, map, priceRange),
    [attributePath, map, priceRange],
  );

  const initialVariables = {
    query,
    operator,
    fuzzy,
    page: 1,
    store: account,
    attributePath: url,
    sort: vtexOrderToBiggyOrder(order),
    count: props.maxItemsPerPage,
  };

  const onFetchMoreFunction = (fetchMore) => ({ variables, updateQuery }) => {
    const { to } = variables;
    const page = parseInt(to / props.maxItemsPerPage, 10) + 1;

    return (
      fetchMore({
        variables: { ...variables, page },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || page === 1) return prev;

          return {
            ...fetchMoreResult,
            searchResult: {
              ...fetchMoreResult.searchResult,
              products: [
                ...prev.searchResult.products,
                ...fetchMoreResult.searchResult.products,
              ],
            },
          };
        },
      })
        /* If the object from updateQuery is not returned, search-result gets an infinite loading.
      A PR to search-result project is required
    */
        .then(() => updateQuery(
          { productSearch: { products: [] } },
          {
            fetchMoreResult: {
              productSearch: { products: [] },
            },
          },
        ))
    );
  };

  try {
    if (!query) throw new Error('Empty search is not allowed');

    return (
      <Query
        query={searchResultQuery}
        variables={initialVariables}
        onCompleted={(data) => triggerSearchQueryEvent(data)}
      >
        {({
          loading, error, data, fetchMore,
        }) => {
          if (error) {
            logError(account, workspace, route.path, error);
          }

          const vtexSearchResult = error || !data
            ? VtexSearchResult.emptySearch()
            : new VtexSearchResult(
              query,
              1,
              props.maxItemsPerPage,
              order,
              attributePath,
              map,
              priceRange,
              onFetchMoreFunction(fetchMore),
              data,
              loading,
            );

          return React.cloneElement(props.children, {
            searchResult:
              error || !data
                ? {
                  query: props.params.query,
                }
                : data.searchResult,
            ...props,
            ...vtexSearchResult,
          });
        }}
      </Query>
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    logError(account, workspace, route.path, error);

    const vtexSearchResult = VtexSearchResult.emptySearch();

    return React.cloneElement(props.children, {
      searchResult: {
        query: props.params.query,
      },
      ...props,
      ...vtexSearchResult,
    });
  }
};

export default SearchContext;
