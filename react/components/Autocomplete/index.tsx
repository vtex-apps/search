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
import BiggyClient from "../../utils/biggy-client";
import { FormattedMessage } from "react-intl";
import { IconClose, IconClock } from "vtex.styleguide";
import { withDevice } from "vtex.device-detector";
import debounce from "debounce";

const MAX_TOP_SEARCHES_DEFAULT = 10;
const MAX_SUGGESTED_TERMS_DEFAULT = 5;
const MAX_SUGGESTED_PRODUCTS_DEFAULT = 3;
const MAX_HISTORY_DEFAULT = 5;

export enum ProductLayout {
  Horizontal = "HORIZONTAL",
  Vertical = "VERTICAL",
}

interface AutoCompleteProps {
  isOpen: boolean;
  runtime: { account: string };
  inputValue: string;
  maxTopSearches: number;
  maxSuggestedTerms: number;
  maxSuggestedProducts: number;
  maxHistory: number;
  autocompleteWidth: number;
  productLayout?: ProductLayout;
  hideTitles: boolean;
  historyFirst: boolean;
  isMobile: boolean;
  __unstableProductOrigin: "BIGGY" | "VTEX";
}

interface AutoCompleteState {
  topSearchedItems: Item[];
  suggestionItems: Item[];
  history: Item[];
  products: any[];
  totalProducts: number;
  queryFromHover: { key?: string; value?: string };
  dynamicTerm: string;
  isProductsLoading: boolean;
  currentHeightWhenOpen: number;
}

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  autocompleteRef: React.RefObject<any>;
  client: BiggyClient;
  isIOS: boolean;

  public readonly state: AutoCompleteState = {
    topSearchedItems: [],
    history: [],
    products: [],
    suggestionItems: [],
    totalProducts: 0,
    queryFromHover: {},
    dynamicTerm: "",
    isProductsLoading: false,
    currentHeightWhenOpen: 0,
  };

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props);

    this.client = new BiggyClient(this.props.client);
    this.autocompleteRef = React.createRef();
    this.isIOS = navigator && !!navigator.userAgent.match(/(iPod|iPhone|iPad)/);
  }

  fitAutocompleteInWindow() {
    if (
      !window ||
      !this.autocompleteRef.current ||
      !this.props.isMobile ||
      this.isIOS
    ) {
      return;
    }

    const windowHeight = window.innerHeight;
    const autocompletePosition = this.autocompleteRef.current.getBoundingClientRect()
      .y;
    const autocompleteHeight = this.autocompleteRef.current.offsetHeight;
    const autocompleteEnd = autocompletePosition + autocompleteHeight;

    const currentHeight = autocompleteHeight - (autocompleteEnd - windowHeight);
    this.autocompleteRef.current.style.maxHeight = `${currentHeight}px`;
  }

  addEvents() {
    window.addEventListener(
      "resize",
      debounce(this.fitAutocompleteInWindow.bind(this), 100),
    );
  }

  componentDidMount() {
    this.updateTopSearches();
    this.updateHistory();
    this.addEvents();
  }

  shouldUpdate(prevProps: AutoCompleteProps) {
    return (
      prevProps.inputValue !== this.props.inputValue ||
      (!prevProps.isOpen && this.props.isOpen)
    );
  }

  componentDidUpdate(prevProps: AutoCompleteProps) {
    if (this.shouldUpdate(prevProps)) {
      this.fitAutocompleteInWindow();

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
        this.updateSuggestions()
          .then(() => {
            this.fitAutocompleteInWindow();
            return this.updateProducts();
          })
          .then(() => this.fitAutocompleteInWindow());
      }
    }
  }

  highlightTerm(label: string, query: string) {
    const splitedLabel = label.split(query);

    return (
      <>
        {splitedLabel.map((str: string, index: number) => {
          return (
            <>
              {str}
              {index !== splitedLabel.length - 1 ? (
                <span className="b">{query}</span>
              ) : null}
            </>
          );
        })}
      </>
    );
  }

  async updateSuggestions() {
    const result = await this.client.suggestionSearches(this.props.inputValue);
    const { searches } = result.data.suggestionSearches;
    const { maxSuggestedTerms = MAX_SUGGESTED_TERMS_DEFAULT } = this.props;

    const items = searches.slice(0, maxSuggestedTerms).map(query => {
      const attributes = query.attributes || [];

      return {
        term: query.term,
        attributes: attributes.map(att => ({
          label: att.labelValue,
          value: att.value,
          link: `/search/${att.key}/${att.value}?_query=${query.term}`,
          groupValue: query.term,
          key: att.key,
        })),
      };
    });

    const suggestionItems: Item[] = items.map(suggestion => ({
      label: this.highlightTerm(
        suggestion.term.toLowerCase(),
        this.props.inputValue.toLocaleLowerCase(),
      ),
      value: suggestion.term,
      groupValue: suggestion.term,
      link: `/search?_query=${suggestion.term}`,
      attributes: suggestion.attributes,
    }));

    this.setState({ suggestionItems });
  }

  async updateProducts() {
    const term = this.state.dynamicTerm;
    const { __unstableProductOrigin = "BIGGY" } = this.props;
    const { queryFromHover } = this.state;

    if (!term) {
      this.setState({
        products: [],
        totalProducts: 0,
      });
      return;
    }

    this.setState({
      isProductsLoading: true,
    });

    const result = await this.client.suggestionProducts(
      term,
      queryFromHover ? queryFromHover.key : undefined,
      queryFromHover ? queryFromHover.value : undefined,
      __unstableProductOrigin,
    );

    this.setState({
      isProductsLoading: false,
    });

    const { suggestionProducts } = result.data;

    const {
      maxSuggestedProducts = MAX_SUGGESTED_PRODUCTS_DEFAULT,
    } = this.props;

    const products = suggestionProducts.products.slice(0, maxSuggestedProducts);

    this.setState({
      products,
      totalProducts: suggestionProducts.count,
    });
  }

  async updateTopSearches() {
    const result = await this.client.topSearches();
    const { searches } = result.data.topSearches;
    const { maxTopSearches = MAX_TOP_SEARCHES_DEFAULT } = this.props;

    const topSearchedItems = searches.slice(0, maxTopSearches).map(
      (query, index) =>
        ({
          prefix: (
            <>
              {`${index + 1}`}
              <FormattedMessage id="store/ordinalNumber" />
            </>
          ),
          value: query.term,
          label: query.term,
          link: `/search?_query=${query.term}`,
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
          link: `/search?_query=${item}`,
          icon: <IconClock />,
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

    const titleMessageId = hasSuggestion
      ? "store/suggestions"
      : "store/emptySuggestion";

    return (
      <ItemList
        title={<FormattedMessage id={titleMessageId} />}
        items={this.state.suggestionItems || []}
        modifier="suggestion"
        showTitle={!hasSuggestion || !this.props.hideTitles}
        onItemHover={this.updateQueryByItemHover.bind(this)}
        showTitleOnEmpty={this.props.maxSuggestedTerms !== 0}
      />
    );
  }

  contentWhenQueryIsEmpty() {
    return (
      <div
        className={stylesCss["history-and-top-wrapper"]}
        style={{
          flexDirection: this.props.historyFirst ? "row-reverse" : "row",
        }}
      >
        {!this.props.isMobile ||
        (this.props.isMobile && !this.props.historyFirst) ||
        this.state.history.length === 0 ? (
          <ItemList
            modifier="top-search"
            title={<FormattedMessage id={"store/topSearches"} />}
            items={this.state.topSearchedItems || []}
            showTitle={!this.props.hideTitles}
          />
        ) : null}

        {!this.props.isMobile ||
        (this.props.isMobile && this.props.historyFirst) ? (
          <ItemList
            modifier="history"
            title={<FormattedMessage id={"store/history"} />}
            items={this.state.history || []}
            showTitle={!this.props.hideTitles}
          />
        ) : null}
      </div>
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
          title={
            <FormattedMessage
              id={"store/suggestedProducts"}
              values={{ term: this.props.inputValue }}
            />
          }
          products={this.state.products || []}
          showTitle={!this.props.hideTitles}
          totalProducts={this.state.totalProducts || 0}
          layout={this.getProductLayout()}
          isLoading={this.state.isProductsLoading}
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

  getProductLayout = () => {
    const { productLayout, isMobile } = this.props;

    if (typeof productLayout !== "undefined") {
      return productLayout;
    }

    return isMobile ? ProductLayout.Horizontal : ProductLayout.Vertical;
  };

  render() {
    const hiddenClass =
      !this.props.isOpen || !this.hasContent()
        ? stylesCss["biggy-js-container--hidden"]
        : "";

    return (
      <div
        className={stylesCss["biggy-autocomplete-wrapper"]}
        style={{
          width: this.props.autocompleteWidth
            ? `${this.props.autocompleteWidth}vw`
            : undefined,
        }}
      >
        <section
          ref={this.autocompleteRef}
          // tslint:disable-next-line: max-line-length
          className={`${stylesCss["biggy-autocomplete"]} ${hiddenClass} w-100`}
          style={{
            flexDirection:
              this.getProductLayout() === ProductLayout.Horizontal
                ? "column"
                : "row",
          }}
        >
          {this.renderContent()}
          {this.props.isMobile ? (
            <button className={stylesCss["close-btn"]}>
              <IconClose />
            </button>
          ) : null}
        </section>
      </div>
    );
  }
}

export default withDevice(withApollo(AutoComplete));
