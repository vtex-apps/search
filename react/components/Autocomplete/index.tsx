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
import { decodeUrlString } from '../../utils/string-utils'
import { encodeSearchTerm } from '../../utils/term-encoding'
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
    placement: string
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
  dynamicTerm: string
  isProductsLoading: boolean
  currentHeightWhenOpen: number
  searchId: string
  lastEmittedSearchId: string
}

const { ProductListProvider } = ProductListContext

export class AutoComplete extends React.Component<
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
    dynamicTerm: '',
    isProductsLoading: false,
    currentHeightWhenOpen: 0,
    searchId: '',
    lastEmittedSearchId: '',
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
        // `decodeURIComponent` (not `decodeURI`) so reserved characters like
        // `%2F` are also decoded. The history cookie stores canonical, fully
        // decoded terms — `BiggyClient.prependSearchHistory` re-encodes each
        // entry per-term before joining, so `,` and other separators are safe.
        return this.client.prependSearchHistory(decodeURIComponent(term))
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

    this.setState({ dynamicTerm: inputValue })

    if (inputValue === null || inputValue === '') {
      this.updateTopSearches()
      this.updateHistory()

      this.setState({
        suggestionItems: [],
        products: [],
        ...this.clearedSearchState(),
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

  async updateProducts(
    itemTerm: string,
    hoverFacet?: { key?: string; value?: string }
  ) {
    const term = itemTerm

    const {
      __unstableProductOrigin,
      __unstableProductOriginVtex = false,
      simulationBehavior = 'default',
      hideUnavailableItems = false,
      orderBy,
    } = this.props

    if (!term) {
      this.setState({
        products: [],
        totalProducts: 0,
        ...this.clearedSearchState(),
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

    const advertisementOptions: AdvertisementOptions = {
      showSponsored: true,
      sponsoredCount: 2,
      repeatSponsoredProducts: false,
      advertisementPlacement: 'autocomplete',
    }

    const result = await this.client.suggestionProducts(
      term,
      hoverFacet?.key,
      hoverFacet?.value,
      __unstableProductOrigin === 'VTEX' || __unstableProductOriginVtex,
      simulationBehavior,
      hideUnavailableItems,
      orderBy,
      this.props.maxSuggestedProducts || MAX_SUGGESTED_PRODUCTS_DEFAULT,
      shippingOptions,
      advertisementOptions
    )

    const { productSuggestions } = result.data
    const { count, operator, misspelled, searchId } = productSuggestions
    const { lastEmittedSearchId } = this.state

    // Activity Flow emits once per mounted TileList node and again when its
    // `data-af-search-id` changes. Cached IS responses reuse the searchId, so
    // the legacy event only fires for a searchId the current node has not
    // shown yet (see clearedSearchState for the remount case).
    const isNewSearch = !!searchId && searchId !== lastEmittedSearchId

    if (isNewSearch) {
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

    const products = productSuggestions.products.slice(
      0,
      this.getProductCount()
    )

    this.setState({
      products,
      totalProducts: count,
      searchId: searchId || '',
      lastEmittedSearchId: isNewSearch ? searchId : lastEmittedSearchId,
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
    // History entries come from the shopper-typed search bar (via the
    // biggy-search-history cookie) and may contain `/` characters.
    // `vtex.render-runtime` `<Link>` interpolates `params.term` verbatim into
    // the route slug, so a raw `/` would split the term into multiple path
    // segments and break the search route. `encodeSearchTerm` (in
    // utils/term-encoding) runs the same `encodeURIComponent` primitive the
    // canonical search bar uses, with an idempotency safety net for legacy
    // cookie entries — so a clicked history row produces the same URL the
    // search bar would emit for the same term. The visible label stays
    // decoded so rows remain readable.
    // Spec: is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
    const history = this.client
      .searchHistory()
      .slice(0, this.props.maxHistory || MAX_HISTORY_DEFAULT)
      .map((item: string) => {
        const encodedTerm = encodeSearchTerm(item)

        return {
          label: decodeUrlString(item),
          value: encodedTerm,
          link: `/${encodedTerm}?map=ft`,
          icon: <IconClock />,
        }
      })

    this.setState({
      history,
    })
  }

  /**
   * Clearing the query unmounts the TileList. Its next mount must not carry
   * the previous searchId: Activity Flow would emit an impression for it
   * before the new response arrives. Resetting the last emitted searchId too
   * makes the legacy event fire for the response the new node shows, even
   * when the IS cache returns the same searchId.
   */
  clearedSearchState() {
    return { searchId: '', lastEmittedSearchId: '' }
  }

  handleItemHover = (item: Item | AttributeItem) => {
    if (instanceOfAttributeItem(item)) {
      this.setState({ dynamicTerm: item.groupValue })
      this.updateProducts(item.groupValue, {
        key: item.key,
        value: item.value,
      })
    } else {
      this.setState({ dynamicTerm: item.value })
      this.updateProducts(item.value, { key: undefined, value: undefined })
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
    const { products, totalProducts, isProductsLoading, searchId } = this.state
    const { hideTitles, push, runtime, inputValue } = this.props
    // Encode the live search term so the "see all" link below produces the
    // same URL the search bar would emit if the shopper hit Enter on the same
    // input. Without this, a `/` in the term would split the path into
    // multiple route segments and the resulting PLP would 404.
    // Spec: is-io-specs/specs/fix-autocomplete-history-link-encoding/spec.md
    const inputValueEncoded = encodeSearchTerm(inputValue)

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
          onProductClick={(id, position, term) => {
            handleProductClick(push, runtime.page)(id, position, term)
            this.closeModal()
          }}
          onSeeAllClick={term => {
            handleSeeAllClick(push, runtime.page)(term)
            this.closeModal()
          }}
          HorizontalProductSummary={this.props.HorizontalProductSummary}
          searchId={searchId}
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
