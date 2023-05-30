// /* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { IconClose, IconClock } from 'vtex.styleguide'
import { ProductListContext } from 'vtex.product-list-context'
import { withDevice } from 'vtex.device-detector'
import debounce from 'debounce'
import { withPixel } from 'vtex.pixel-manager/PixelContext'

import BiggyClient from '../../utils/biggy-client'
import stylesCss from './styles.css'
import TileList from './components/TileList/TileList'
import {
  Item,
  instanceOfAttributeItem,
  AttributeItem,
} from './components/ItemList/types'
import { ItemList } from './components/ItemList/ItemList'
import { withRuntime } from '../../utils/withRuntime'
import { decodeUrlString, encodeUrlString } from '../../utils/string-utils'
import {
  EventType,
  handleAutocompleteSearch,
  handleItemClick,
  handleProductClick,
  handleSeeAllClick,
} from '../../utils/pixel'
import getSession from '../../utils/getSession'

const MAX_TOP_SEARCHES_DEFAULT = 10
const MAX_SUGGESTED_TERMS_DEFAULT = 5
const MAX_SUGGESTED_PRODUCTS_DEFAULT = 3
const MAX_HISTORY_DEFAULT = 5

// eslint-disable-next-line no-shadow, no-restricted-syntax
export enum ProductLayout {
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL',
}

interface AutoCompleteProps {
  isOpen: boolean
  runtime: { page: string; rootPath?: string }
  inputValue: string
  maxTopSearches: number
  maxSuggestedTerms: number
  maxSuggestedProducts: number
  maxHistory: number
  autocompleteWidth: number
  productLayout?: ProductLayout
  hideTitles: boolean
  historyFirst: boolean
  isMobile: boolean
  customBreakpoints?: {
    md: {
      width: number
      maxSuggestedProducts: number
    }
    lg: {
      width: number
      maxSuggestedProducts: number
    }
    xlg: {
      width: number
      maxSuggestedProducts: number
    }
  }
  __unstableProductOrigin: 'BIGGY' | 'VTEX'
  __unstableProductOriginVtex: boolean
  simulationBehavior: 'default' | 'skip' | null
  hideUnavailableItems: boolean
  push: (data: any) => void
  HorizontalProductSummary?: React.ComponentType<{
    product: Product
    actionOnClick: () => void
  }>
  customPage?: string
  closeMenu: () => void
  orderBy?: string
}

interface AutoCompleteState {
  topSearchedItems: Item[]
  suggestionItems: Item[]
  history: Item[]
  products: any[]
  totalProducts: number
  queryFromHover: { key?: string; value?: string }
  dynamicTerm: string
  isProductsLoading: boolean
  currentHeightWhenOpen: number
}

const { ProductListProvider } = ProductListContext

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  autocompleteRef: React.RefObject<any>
  client: BiggyClient
  isIOS: boolean

  public readonly state: AutoCompleteState = {
    topSearchedItems: [],
    history: [],
    products: [],
    suggestionItems: [],
    totalProducts: 0,
    queryFromHover: {},
    dynamicTerm: '',
    isProductsLoading: false,
    currentHeightWhenOpen: 0,
  }

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props)

    this.client = new BiggyClient(this.props.client)
    this.autocompleteRef = React.createRef()
    this.isIOS = navigator && !!navigator.userAgent.match(/(iPod|iPhone|iPad)/)
  }

  fitAutocompleteInWindow() {
    if (
      !window ||
      !this.autocompleteRef.current ||
      !this.props.isMobile ||
      this.isIOS
    ) {
      return
    }

    const windowHeight = window.innerHeight
    const autocompletePosition = this.autocompleteRef.current.getBoundingClientRect()
      .y

    const autocompleteHeight = this.autocompleteRef.current.offsetHeight
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const autocompleteEnd = autocompletePosition + autocompleteHeight

    const currentHeight = autocompleteHeight - (autocompleteEnd - windowHeight)

    this.autocompleteRef.current.style.maxHeight = `${currentHeight}px`
  }

  addEvents() {
    window.addEventListener(
      'resize',
      debounce(this.fitAutocompleteInWindow.bind(this), 100)
    )
  }

  componentDidMount() {
    this.updateTopSearches()
    this.updateHistory()
    this.addEvents()
  }

  shouldUpdate(prevProps: AutoCompleteProps) {
    return (
      prevProps.inputValue !== this.props.inputValue ||
      (!prevProps.isOpen && this.props.isOpen)
    )
  }

  addTermToHistory() {
    const path = window.location.href.split('_q=')

    if (path[1]) {
      const term = path[1].split('&')[0]

      try {
        return this.client.prependSearchHistory(decodeURI(term))
      } catch {
        return this.client.prependSearchHistory(term)
      }
    }
  }

  closeModal() {
    if (this.props.closeMenu) {
      this.props.closeMenu()
    }
  }

  componentDidUpdate(prevProps: AutoCompleteProps) {
    if (!this.shouldUpdate(prevProps)) {
      return
    }

    this.addTermToHistory()
    this.fitAutocompleteInWindow()

    const { inputValue } = this.props

    this.setState({
      dynamicTerm: inputValue,
      queryFromHover: undefined,
    })

    if (inputValue === null || inputValue === '') {
      this.updateTopSearches()
      this.updateHistory()

      this.setState({
        suggestionItems: [],
        products: [],
      })
    } else {
      this.updateSuggestions()
        .then(() => {
          this.fitAutocompleteInWindow()

          return this.updateProducts(inputValue)
        })
        .then(() => this.fitAutocompleteInWindow())
    }
  }

  highlightTerm(label: string, query: string) {
    const splittedLabel = label.split(query)

    return (
      <>
        {splittedLabel.map((str: string, index: number) => {
          return (
            <>
              {str}
              {index !== splittedLabel.length - 1 ? (
                <span className="b">{query}</span>
              ) : null}
            </>
          )
        })}
      </>
    )
  }

  async updateSuggestions() {
    const result = await this.client.suggestionSearches(this.props.inputValue)
    const { searches } = result.data.autocompleteSearchSuggestions
    const { maxSuggestedTerms = MAX_SUGGESTED_TERMS_DEFAULT } = this.props

    const items = searches.slice(0, maxSuggestedTerms).map(query => {
      const attributes = query.attributes || []

      return {
        term: query.term,
        attributes: attributes.map(att => ({
          label: att.labelValue,
          value: att.value,
          link: `/${query.term}/${att.value}/?map=ft,${att.key}`,
          groupValue: query.term,
          key: att.key,
        })),
      }
    })

    const suggestionItems: Item[] = items.map(suggestion => ({
      label: this.highlightTerm(
        suggestion.term.toLowerCase(),
        this.props.inputValue.toLocaleLowerCase()
      ),
      value: suggestion.term,
      groupValue: suggestion.term,
      link: `/${suggestion.term}?map=ft`,
      attributes: suggestion.attributes,
    }))

    this.setState({ suggestionItems })
  }

  async updateProducts(itemTerm: string) {
    const term = itemTerm

    const {
      __unstableProductOrigin,
      __unstableProductOriginVtex = false,
      simulationBehavior = 'default',
      hideUnavailableItems = false,
      orderBy,
    } = this.props

    const { queryFromHover } = this.state

    if (!term) {
      this.setState({
        products: [],
        totalProducts: 0,
      })

      return
    }

    if (__unstableProductOrigin) {
      console.warn(
        'The prop `__unstableProductOrigin` has been deprecated. Use the boolean prop `__unstableProductOriginVtex` instead.'
      )
    }

    this.setState({
      isProductsLoading: true,
    })

    const session = await getSession(this.props.runtime.rootPath)
    const shippingOptions =
      session?.map((item: Record<string, string>) => item.value) ?? []

    const result = await this.client.suggestionProducts(
      term,
      queryFromHover ? queryFromHover.key : undefined,
      queryFromHover ? queryFromHover.value : undefined,
      __unstableProductOrigin === 'VTEX' || __unstableProductOriginVtex,
      simulationBehavior,
      hideUnavailableItems,
      orderBy,
      this.props.maxSuggestedProducts || MAX_SUGGESTED_PRODUCTS_DEFAULT,
      shippingOptions
    )

    if (!queryFromHover) {
      const { count, operator, misspelled } = result.data.productSuggestions

      handleAutocompleteSearch(
        this.props.push,
        operator,
        misspelled,
        count,
        term
      )
    }

    this.setState({
      isProductsLoading: false,
    })

    const { productSuggestions } = result.data

    const products = productSuggestions.products.slice(
      0,
      this.getProductCount()
    )

    this.setState({
      products,
      totalProducts: productSuggestions.count,
    })
  }

  async updateTopSearches() {
    const result = await this.client.topSearches()
    const { searches } = result.data.topSearches
    const { maxTopSearches = MAX_TOP_SEARCHES_DEFAULT } = this.props

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
          link: `/${query.term}?map=ft`,
        } as Item)
    )

    this.setState({ topSearchedItems })
  }

  updateHistory() {
    const history = this.client
      .searchHistory()
      .slice(0, this.props.maxHistory || MAX_HISTORY_DEFAULT)
      .map((item: string) => {
        return {
          label: decodeUrlString(item),
          value: item,
          link: `/${item}?map=ft`,
          icon: <IconClock />,
        }
      })

    this.setState({
      history,
    })
  }

  handleItemHover = (item: Item | AttributeItem) => {
    if (instanceOfAttributeItem(item)) {
      this.setState({
        dynamicTerm: item.groupValue,
        queryFromHover: {
          key: item.key,
          value: item.value,
        },
      })
      this.updateProducts(item.groupValue)
    } else {
      this.setState({
        dynamicTerm: item.value,
        queryFromHover: {
          key: undefined,
          value: undefined,
        },
      })
      this.updateProducts(item.value)
    }
  }

  renderSuggestions() {
    const hasSuggestion =
      !!this.state.suggestionItems && this.state.suggestionItems.length > 0

    const titleMessage = hasSuggestion ? (
      <FormattedMessage id="store/suggestions" />
    ) : (
      <FormattedMessage id="store/emptySuggestion" />
    )

    return (
      <ItemList
        title={titleMessage}
        items={this.state.suggestionItems || []}
        modifier="suggestion"
        showTitle={!hasSuggestion || !this.props.hideTitles}
        onItemHover={this.handleItemHover}
        showTitleOnEmpty={this.props.maxSuggestedTerms !== 0}
        onItemClick={(value, position) => {
          handleItemClick(
            this.props.push,
            this.props.runtime.page,
            EventType.SearchSuggestionClick
          )(value, position)
          this.closeModal()
        }}
        customPage={this.props.customPage}
        closeModal={() => this.closeModal()}
      />
    )
  }

  contentWhenQueryIsEmpty() {
    return (
      <div
        className={stylesCss['history-and-top-wrapper']}
        style={{
          flexDirection: this.props.historyFirst ? 'row-reverse' : 'row',
        }}
      >
        {!this.props.isMobile ||
        (this.props.isMobile && !this.props.historyFirst) ||
        this.state.history.length === 0 ? (
          <ItemList
            modifier="top-search"
            title={<FormattedMessage id="store/topSearches" />}
            items={this.state.topSearchedItems || []}
            showTitle={!this.props.hideTitles}
            onItemClick={(value, position) => {
              handleItemClick(
                this.props.push,
                this.props.runtime.page,
                EventType.TopSearchClick
              )(value, position)
              this.closeModal()
            }}
            customPage={this.props.customPage}
            closeModal={() => this.closeModal()}
          />
        ) : null}

        {!this.props.isMobile ||
        (this.props.isMobile && this.props.historyFirst) ? (
          <ItemList
            modifier="history"
            title={<FormattedMessage id="store/history" />}
            items={this.state.history || []}
            showTitle={!this.props.hideTitles}
            onItemClick={(value, position) => {
              handleItemClick(
                this.props.push,
                this.props.runtime.page,
                EventType.HistoryClick
              )(value, position)
              this.closeModal()
            }}
            customPage={this.props.customPage}
            closeModal={() => this.closeModal()}
          />
        ) : null}
      </div>
    )
  }

  contentWhenQueryIsNotEmpty() {
    const { products, totalProducts, isProductsLoading } = this.state
    const { hideTitles, push, runtime, inputValue } = this.props
    const inputValueEncoded = encodeUrlString(inputValue)

    return (
      <>
        {this.renderSuggestions()}
        <TileList
          term={inputValueEncoded || ''}
          customPage={this.props.customPage}
          shelfProductCount={this.getProductCount()}
          title={
            <FormattedMessage
              id="store/suggestedProducts"
              values={{ term: inputValue }}
            />
          }
          products={products || []}
          showTitle={!hideTitles}
          totalProducts={totalProducts || 0}
          layout={this.getProductLayout()}
          isLoading={isProductsLoading}
          onProductClick={(id, position) => {
            handleProductClick(push, runtime.page)(id, position)
            this.closeModal()
          }}
          onSeeAllClick={term => {
            handleSeeAllClick(push, runtime.page)(term)
            this.closeModal()
          }}
          HorizontalProductSummary={this.props.HorizontalProductSummary}
        />
      </>
    )
  }

  renderContent() {
    const query = this.props.inputValue.trim()

    return query && query !== ''
      ? this.contentWhenQueryIsNotEmpty()
      : this.contentWhenQueryIsEmpty()
  }

  hasContent() {
    const { topSearchedItems, suggestionItems, history, products } = this.state

    return (
      topSearchedItems.length > 0 ||
      suggestionItems.length > 0 ||
      history.length > 0 ||
      products.length > 0
    )
  }

  getProductLayout = () => {
    const { productLayout, isMobile } = this.props

    if (typeof productLayout !== 'undefined') {
      return productLayout
    }

    return isMobile ? ProductLayout.Horizontal : ProductLayout.Vertical
  }

  getProductCount() {
    const {
      customBreakpoints,
      isMobile,
      maxSuggestedProducts = MAX_SUGGESTED_PRODUCTS_DEFAULT,
    } = this.props

    if (!window || isMobile || !customBreakpoints) {
      return maxSuggestedProducts
    }

    const windowWidth = window.innerWidth

    if (
      !customBreakpoints.md ||
      !customBreakpoints.lg ||
      !customBreakpoints.xlg
    ) {
      return maxSuggestedProducts
    }

    if (windowWidth >= customBreakpoints.xlg.width) {
      return customBreakpoints.xlg.maxSuggestedProducts
    }

    if (windowWidth >= customBreakpoints.lg.width) {
      return customBreakpoints.lg.maxSuggestedProducts
    }

    if (windowWidth >= customBreakpoints.md.width) {
      return customBreakpoints.md.maxSuggestedProducts
    }

    return maxSuggestedProducts
  }

  render() {
    const hiddenClass =
      !this.props.isOpen || !this.hasContent()
        ? stylesCss['biggy-js-container--hidden']
        : ''

    return (
      <div
        className={stylesCss['biggy-autocomplete-wrapper']}
        style={{
          width: this.props.autocompleteWidth
            ? `${this.props.autocompleteWidth}vw`
            : undefined,
        }}
      >
        <section
          ref={this.autocompleteRef}
          // tslint:disable-next-line: max-line-length
          className={`${stylesCss['biggy-autocomplete']} ${hiddenClass} w-100`}
          style={{
            flexDirection:
              this.getProductLayout() === ProductLayout.Horizontal
                ? 'column'
                : 'row',
          }}
        >
          <ProductListProvider listName="autocomplete-result-list">
            {this.renderContent()}
            {this.props.isMobile ? (
              <button
                onClick={() => this.closeModal()}
                className={stylesCss['close-btn']}
              >
                <IconClose />
              </button>
            ) : null}
          </ProductListProvider>
        </section>
      </div>
    )
  }
}

export default withPixel(withDevice(withApollo(withRuntime(AutoComplete))))
