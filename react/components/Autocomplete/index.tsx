import { faHistory } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { ItemList } from "./components/ItemList/ItemList";
import { Item } from "./components/ItemList/types";
import { TileList } from "./components/TileList/TileList";
import stylesCss from "./styles.css";
import { withRuntime } from "../../utils/withRuntime";
import BiggyClient from "../../utils/biggy-client";
import { Product } from "../../models/product";

interface AutoCompleteProps {
  isOpen: boolean;
  runtime: { account: string };
  inputValue: string;
  queryFromHover: { key: string; value: string };
}

interface AutoCompleteState {
  topSearchedItems: Item[];
  suggestionItems: Item[];
  history: Item[];
  products: Product[];
  totalProducts: number;
  isFocused: boolean;
}

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  autocompleteRef: React.RefObject<any>;
  client: BiggyClient;

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props);

    this.client = new BiggyClient(this.props.client);
    this.autocompleteRef = React.createRef();

    this.state = {
      topSearchedItems: [],
      history: [],
      products: [],
      isFocused: false,
      totalProducts: 0,
    };
  }

  componentDidMount() {
    this.updateTopSearches();
    this.updateHistory();
  }

  shouldUpdate(prevProps: AutoCompleteProps) {
    return prevProps.inputValue !== this.props.inputValue;
  }

  componentDidUpdate(
    prevProps: AutoCompleteProps,
    _: AutoCompleteState,
    __: any,
  ) {
    const { inputValue } = this.props;

    if (this.shouldUpdate(prevProps)) {
      if (inputValue === null || inputValue === "") {
        this.updateTopSearches();
        this.updateHistory();
      } else {
        this.updateSuggestions().then(() => this.updateProducts());
      }
    }
  }

  async updateSuggestions() {
    const result = await this.client.suggestionSearches(
      this.props.runtime.account,
      this.props.inputValue,
    );
    const { searches } = result.data.suggestionSearches;

    const items = searches.map(query => {
      const attributes = query.attributes || [];

      return {
        term: query.term,
        attributes: attributes.map(att => ({
          label: att.labelValue,
          value: att.value,
          link: `/search/${att.key}/${att.value}?query=${query.term}`,
          groupValue: query.term,
          key: att.key,
        })),
      };
    });

    const suggestionItems: Item[] = items.map(suggestion => ({
      label: suggestion.term,
      value: suggestion.term,
      groupValue: suggestion.term,
      link: `/search?query=${suggestion.term}`,
      attributes: suggestion.attributes,
    }));

    this.setState({ suggestionItems });
  }

  async updateProducts() {
    // const term = this.props.inputValue;
    // if (!term) {
    //   this.setState({
    //     products: [],
    //     totalProducts: 0,
    //   });
    //   return;
    // }
    // const result = await this.client.suggestionProducts(
    //   this.props.runtime.account,
    //   term,
    //   query.key,
    //   query.value,
    // );
    // const { suggestionProducts } = result.data;
    // const products = suggestionProducts.products.map(
    //   product =>
    //     new Product(
    //       product.id,
    //       product.name,
    //       product.url,
    //       product.price,
    //       product.installment,
    //       product.images && product.images.length > 0
    //         ? product.images[0].value
    //         : '',
    //       product.oldPrice,
    //       product.extraInfo,
    //     ),
    // );
    // this.setState({
    //   products,
    //   totalProducts: suggestionProducts.count,
    // });
  }

  async updateTopSearches() {
    const result = await this.client.topSearches(this.props.runtime.account);
    const { searches } = result.data.topSearches;

    const topSearchedItems = searches.map(
      (query, index) =>
        ({
          prefix: `${index + 1}º`,
          value: query.term,
          link: `/search?query=${query.term}`,
        } as Item),
    );

    this.setState({ topSearchedItems });
  }

  updateHistory() {
    const history = this.client.searchHistory().map((item: string) => {
      return {
        label: item,
        value: item,
        link: `/search?query=${item}`,
        icon: faHistory,
      };
    });

    this.setState({
      history,
    });
  }

  renderSuggestions() {
    const hasSuggestion =
      !!this.state.suggestionItems && this.state.suggestionItems.length > 0;

    const title = hasSuggestion ? "Sugestões" : "Sem sugestões";

    return (
      <ItemList
        title={title}
        items={this.state.suggestionItems || []}
        modifier="suggestion"
        showTitle={!hasSuggestion}
        onItemHover={() => {
          console.log("hover");
        }}
      />
    );
  }

  contentWhenQueryIsEmpty() {
    return (
      <div>
        <ItemList
          modifier="top-search"
          title={"NEEDSINTL"}
          items={this.state.topSearchedItems || []}
          showTitle={false}
        />

        <ItemList
          modifier="history"
          title={"NEEDSINTL"}
          items={this.state.history || []}
          showTitle={false}
        />
      </div>
    );
  }

  contentWhenQueryIsNotEmpty() {
    return (
      <div>
        {this.renderSuggestions()}
        <TileList
          term={this.props.inputValue || ""}
          shelfProductCount={3}
          title={"NEEDSINTL"}
          products={this.state.products || []}
          showTitle={false}
          totalProducts={this.state.totalProducts || 0}
        />
      </div>
    );
  }

  renderContent() {
    const query = this.props.inputValue.trim();

    return query && query !== ""
      ? this.contentWhenQueryIsNotEmpty()
      : this.contentWhenQueryIsEmpty();
  }

  render() {
    const hiddenClass = !this.props.isOpen
      ? stylesCss["biggy-js-container--hidden"]
      : "";

    return (
      <div style={{ width: "50vw" }}>
        <section
          ref={this.autocompleteRef}
          // tslint:disable-next-line: max-line-length
          className={`${stylesCss["biggy-autocomplete"]} ${hiddenClass} w-100`}
        >
          {this.renderContent()}
        </section>
      </div>
    );
  }
}

export default withApollo(withRuntime(AutoComplete));
