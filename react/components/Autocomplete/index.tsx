import { faHistory } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { ItemList } from "./components/ItemList/ItemList";
import {
  Item,
  instanceOfAttributeItem,
  AttributeItem,
} from "./components/ItemList/types";
import { TileList } from "./components/TileList/TileList";
import stylesCss from "./styles.css";
import { withRuntime } from "../../utils/withRuntime";
import BiggyClient from "../../utils/biggy-client";
import { Product } from "../../models/product";

const MAX_TOP_SEARCHES_DEFAULT = 5;
const MAX_SUGGESTED_TERMS_DEFAULT = 5;
const MAX_SUGGESTED_PRODUCTS_DEFAULT = 3;
const MAX_HISTORY_DEFAULT = 5;

interface AutoCompleteProps {
  isOpen: boolean;
  runtime: { account: string };
  inputValue: string;
  maxTopSearches: number;
  maxSuggestedTerms: number;
  maxSuggestedProducts: number;
  maxHistory: number;
}

interface AutoCompleteState {
  topSearchedItems: Item[];
  suggestionItems: Item[];
  history: Item[];
  products: Product[];
  totalProducts: number;
  isFocused: boolean;
  queryFromHover: { key?: string; value?: string };
  dynamicTerm: string;
}

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  autocompleteRef: React.RefObject<any>;
  client: BiggyClient;

  public readonly state: AutoCompleteState = {
    topSearchedItems: [],
    history: [],
    products: [],
    suggestionItems: [],
    isFocused: false,
    totalProducts: 0,
    queryFromHover: {},
    dynamicTerm: "",
  };

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props);

    this.client = new BiggyClient(this.props.client);
    this.autocompleteRef = React.createRef();
  }

  componentDidMount() {
    this.updateTopSearches();
    this.updateHistory();
  }

  shouldUpdate(prevProps: AutoCompleteProps) {
    return prevProps.inputValue !== this.props.inputValue;
  }

  componentDidUpdate(prevProps: AutoCompleteProps) {
    if (this.shouldUpdate(prevProps)) {
      const { inputValue } = this.props;

      this.setState({
        dynamicTerm: inputValue,
      });

      if (inputValue === null || inputValue === "") {
        this.updateTopSearches();
        this.updateHistory();

        this.setState({
          suggestionItems: [],
          products: [],
        });
      } else {
        this.updateSuggestions().then(() => this.updateProducts());
      }
    }
  }

  async updateSuggestions() {
    const result = await this.client.suggestionSearches(
      "exitocol",
      this.props.inputValue,
    );
    const { searches } = result.data.suggestionSearches;
    const { maxSuggestedTerms = MAX_SUGGESTED_TERMS_DEFAULT } = this.props;

    const items = searches.slice(0, maxSuggestedTerms).map(query => {
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
    const term = this.state.dynamicTerm;
    const { queryFromHover } = this.state;

    if (!term) {
      this.setState({
        products: [],
        totalProducts: 0,
      });
      return;
    }

    const result = await this.client.suggestionProducts(
      "exitocol",
      term,
      queryFromHover ? queryFromHover.key : undefined,
      queryFromHover ? queryFromHover.value : undefined,
    );
    const { suggestionProducts } = result.data;

    const {
      maxSuggestedProducts = MAX_SUGGESTED_PRODUCTS_DEFAULT,
    } = this.props;

    const products = suggestionProducts.products
      .slice(0, maxSuggestedProducts)
      .map(
        product =>
          new Product(
            product.id,
            product.name,
            product.brand,
            product.url,
            product.price,
            product.priceText,
            product.installment,
            product.images && product.images.length > 0
              ? product.images[0].value
              : "",
            product.oldPrice,
            product.oldPriceText,
            product.categories,
            product.skus,
            product.extraInfo,
          ),
      );

    this.setState({
      products,
      totalProducts: suggestionProducts.count,
    });
  }

  async updateTopSearches() {
    const result = await this.client.topSearches("exitocol");
    const { searches } = result.data.topSearches;
    const { maxTopSearches = MAX_TOP_SEARCHES_DEFAULT } = this.props;

    const topSearchedItems = searches.slice(0, maxTopSearches).map(
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
    const history = this.client
      .searchHistory()
      .slice(0, this.props.maxHistory || MAX_HISTORY_DEFAULT)
      .map((item: string) => {
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

  updateQueryByItemHover(item: Item | AttributeItem) {
    if (instanceOfAttributeItem(item)) {
      this.setState({
        dynamicTerm: item.groupValue,
        queryFromHover: {
          key: item.key,
          value: item.value,
        },
      });
    } else {
      this.setState({
        dynamicTerm: item.value,
        queryFromHover: {
          key: undefined,
          value: undefined,
        },
      });
    }

    this.updateProducts();
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
        onItemHover={this.updateQueryByItemHover.bind(this)}
        showTitleOnEmpty={this.props.maxSuggestedTerms !== 0}
      />
    );
  }

  contentWhenQueryIsEmpty() {
    return (
      <>
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
      </>
    );
  }

  contentWhenQueryIsNotEmpty() {
    return (
      <>
        {this.renderSuggestions()}
        <TileList
          term={this.props.inputValue || ""}
          shelfProductCount={
            this.props.maxSuggestedProducts || MAX_SUGGESTED_PRODUCTS_DEFAULT
          }
          title={"NEEDSINTL"}
          products={this.state.products || []}
          showTitle={false}
          totalProducts={this.state.totalProducts || 0}
        />
      </>
    );
  }

  renderContent() {
    const query = this.props.inputValue.trim();

    return query && query !== ""
      ? this.contentWhenQueryIsNotEmpty()
      : this.contentWhenQueryIsEmpty();
  }

  hasContent() {
    const { topSearchedItems, suggestionItems, history, products } = this.state;

    return (
      topSearchedItems.length > 0 ||
      suggestionItems.length > 0 ||
      history.length > 0 ||
      products.length > 0
    );
  }

  render() {
    const hiddenClass =
      !this.props.isOpen || !this.hasContent()
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
