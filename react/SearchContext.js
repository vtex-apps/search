import { withApollo } from "react-apollo";
import React, { Component } from "react";
import { BiggyClient } from "./clients/biggy-client";
import { vtexOrderToBiggyOrder } from "./utils/vtex-utils";
import { VtexSearchResult } from "./models/vtex-search-result";

export class SearchContext extends Component {
  maxItemsPerPage = 10;
  client;

  constructor(props) {
    super(props);
    this.state = { page: 1 };
    this.client = new BiggyClient(this.props.client);
    this.maxItemsPerPage = this.props.maxItemsPerPage || this.maxItemsPerPage;
  }

  fetchSearchResult(page = this.state.page) {
    const {
      params: { path: attributePath },
      query: { query, map, order },
    } = this.props;

    // cria url para a busca
    let url = attributePath;
    if (map && attributePath) {
      const facets = attributePath.split("/");
      const apiUrlTerms = map
        .split(",")
        .slice(1)
        .map((item, index) => `${item}/${facets[index]}`);
      url = apiUrlTerms.join("/");
    }

    return this.client.searchResult(
      url,
      query,
      page,
      vtexOrderToBiggyOrder(order),
      this.maxItemsPerPage,
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.query.query !== this.props.query.query ||
      prevProps.params.path !== this.props.params.path ||
      prevProps.query.order !== this.props.query.order
    ) {
      this.fetchSearchResult(1).then(result => {
        this.setState({
          page: 1,
          searchResult: result.data.searchResult,
          count: result.data.searchResult.total,
        });
      });
    }
  }

  componentDidMount() {
    this.fetchSearchResult(1).then(result => {
      this.setState({
        searchResult: result.data.searchResult,
        count: result.data.searchResult.total,
      });
    });
  }

  fetchMore = wrapper => {
    this.fetchSearchResult(this.state.page + 1).then(result => {
      this.setState({
        page: this.state.page + 1,
      });

      this.setState({
        searchResult: {
          ...this.state.searchResult,
          products: [
            ...this.state.searchResult.products,
            ...result.data.searchResult.products,
          ],
        },
      });

      wrapper.updateQuery(
        { productSearch: { products: [] } },
        {
          fetchMoreResult: {
            productSearch: { products: [] },
          },
        },
      );
    });
  };

  render() {
    try {
      const {
        params: { path: attributePath },
        query: { query, map, order },
        children,
      } = this.props;

      const vtexSearchResult = new VtexSearchResult(
        query,
        this.state.page,
        this.maxItemsPerPage,
        order,
        attributePath,
        map,
        this.fetchMore.bind(this),
        this.state.searchResult,
      );

      return React.cloneElement(children, {
        searchResult: this.state.searchResult || {
          query: this.props.params.query,
        },
        ...this.props,
        ...vtexSearchResult,
      });
    } catch (e) {
      const vtexSearchResult = new VtexSearchResult.emptySearch();

      return React.cloneElement(this.props.children, {
        searchResult: {
          query: this.props.params.query,
        },
        ...this.props,
        ...vtexSearchResult,
      });
    }
  }
}

export default withApollo(SearchContext);
