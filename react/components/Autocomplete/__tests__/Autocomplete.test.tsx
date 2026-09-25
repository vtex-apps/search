import React from 'react'
import { render, act, flushPromises, fireEvent } from '@vtex/test-tools/react'

import { AutoComplete, ProductLayout } from '../index'
import TileList from '../components/TileList/TileList'

const mockSuggestionProducts = jest.fn()
const mockBuyClick = jest.fn()

jest.mock(
  'vtex.styleguide',
  () => ({ IconClose: () => null, IconClock: () => null, Spinner: () => null }),
  { virtual: true }
)
jest.mock(
  'vtex.product-list-context',
  () => ({
    ProductListContext: {
      ProductListProvider: ({ children }: any) => children,
    },
  }),
  { virtual: true }
)
jest.mock('vtex.device-detector', () => ({ withDevice: (c: any) => c }), {
  virtual: true,
})
jest.mock(
  'vtex.pixel-manager/PixelContext',
  () => ({ withPixel: (c: any) => c }),
  {
    virtual: true,
  }
)
// The product card mirrors a store product-summary: a link that navigates
// (actionOnClick) with a "Comprar" button that stops React propagation and a
// "+ un" button that stops native propagation.
jest.mock(
  'vtex.render-runtime',
  () => {
    const mockReact = jest.requireActual('react')

    const stopNativePropagation = (node: HTMLElement | null) => {
      if (node && !node.dataset.bound) {
        node.dataset.bound = 'true'
        node.addEventListener('click', event => event.stopPropagation())
      }
    }

    return {
      Link: ({ children, query, onClick }: any) =>
        mockReact.createElement(
          'a',
          {
            href: '#',
            'data-testid': query ? 'see-all' : 'product-link',
            'data-query': query,
            onClick: (event: any) => {
              event.preventDefault()
              onClick?.()
            },
          },
          children
        ),
      ExtensionPoint: ({ product, actionOnClick }: any) =>
        mockReact.createElement(
          'a',
          {
            href: '#',
            'data-testid': `product-${product.productId}`,
            onClick: (event: any) => {
              event.preventDefault()
              actionOnClick()
            },
          },
          mockReact.createElement('span', null, product.productName),
          mockReact.createElement(
            'button',
            {
              type: 'button',
              'data-testid': `buy-${product.productId}`,
              onClick: (event: any) => {
                event.preventDefault()
                event.stopPropagation()
                mockBuyClick()
              },
            },
            'Comprar'
          ),
          mockReact.createElement(
            'button',
            {
              type: 'button',
              'data-testid': `add-${product.productId}`,
              ref: stopNativePropagation,
            },
            '+ un'
          )
        ),
      useRuntime: () => ({}),
    }
  },
  { virtual: true }
)
jest.mock(
  'vtex.product-summary/ProductSummaryCustom',
  () => ({ mapCatalogProductToProductSummary: (product: any) => product }),
  { virtual: true }
)
jest.mock(
  'vtex.product-context',
  () => ({ ProductContextProvider: ({ children }: any) => children }),
  { virtual: true }
)
jest.mock(
  'vtex.product-price',
  () => ({ SellingPrice: () => null, ListPrice: () => null }),
  { virtual: true }
)
jest.mock('../../../utils/getSession', () => () => Promise.resolve(null))
jest.mock('../../../utils/biggy-client', () =>
  jest.fn().mockImplementation(() => ({
    suggestionProducts: (...args: any[]) => mockSuggestionProducts(...args),
    suggestionSearches: () =>
      Promise.resolve({
        data: { autocompleteSearchSuggestions: { searches: [] } },
      }),
    topSearches: () =>
      Promise.resolve({ data: { topSearches: { searches: [] } } }),
    searchHistory: () => [],
    prependSearchHistory: () => {},
  }))
)

const productsResponse = (searchId: string, count = 1) => ({
  data: {
    productSuggestions: {
      searchId,
      count,
      operator: 'and',
      misspelled: false,
      products: Array.from({ length: count }, (_, i) => ({
        productId: String(i + 1),
        productName: `Product ${i + 1}`,
        items: [],
      })),
    },
  },
})

const settle = async () => {
  await act(async () => {
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line no-await-in-loop
      await flushPromises()
    }
  })
}

const baseProps = {
  isOpen: true,
  inputValue: '',
  runtime: { page: 'store.home' },
  maxSuggestedProducts: 3,
}

const setup = (extraProps: Record<string, unknown> = {}) => {
  const push = jest.fn()
  const closeMenu = jest.fn()
  const ref = React.createRef<any>()
  const utils = render(
    <AutoComplete
      ref={ref}
      {...(baseProps as any)}
      push={push}
      closeMenu={closeMenu}
      {...(extraProps as any)}
    />
  )

  const rerender = (props: Record<string, unknown>) =>
    utils.rerender(
      <AutoComplete
        ref={ref}
        {...(baseProps as any)}
        push={push}
        closeMenu={closeMenu}
        {...(extraProps as any)}
        {...(props as any)}
      />
    )

  const hover = async (item: any) => {
    await act(async () => {
      ref.current.handleItemHover(item)
    })
    await settle()
  }

  const searchEvents = () =>
    push.mock.calls
      .map(([event]) => event)
      .filter(event => event.eventType === 'search')
      .map(event => event.search.text)

  const productClicks = () =>
    push.mock.calls
      .map(([event]) => event)
      .filter(event => event.eventType === 'product_click')
      .map(event => ({ id: event.product.productId, term: event.term }))

  const seeAllEvents = () =>
    push.mock.calls
      .map(([event]) => event)
      .filter(event => event.eventType === 'see_all_click')
      .map(event => event.search.term)

  return {
    ...utils,
    ref,
    push,
    closeMenu,
    rerender,
    hover,
    searchEvents,
    productClicks,
    seeAllEvents,
  }
}

const deferred = () => {
  let resolve: (value: unknown) => void = () => {}
  const promise = new Promise(res => {
    resolve = res
  })

  return { promise, resolve }
}

const attribute = (key: string, value: string, groupValue = 'shampoo') => ({
  groupValue,
  key,
  value,
  label: value,
  link: `/${groupValue}/${value}`,
})

const term = (value: string) => ({ label: value, value, link: `/${value}` })

const facetArgs = (callIndex: number) =>
  mockSuggestionProducts.mock.calls[callIndex].slice(0, 3)

beforeEach(() => {
  mockSuggestionProducts.mockReset()
  mockBuyClick.mockReset()
})

describe('Autocomplete hover facet (US-3)', () => {
  it('sends the hovered attribute facet in the same request', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { rerender, hover } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()

    await hover(attribute('brand', 'dove'))
    await hover(attribute('brand', 'seda'))

    expect(facetArgs(0)).toEqual(['shampoo', undefined, undefined])
    expect(facetArgs(1)).toEqual(['shampoo', 'brand', 'dove'])
    expect(facetArgs(2)).toEqual(['shampoo', 'brand', 'seda'])
  })

  it('sends no facet for a term hover that follows an attribute hover', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { rerender, hover } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()

    await hover(attribute('brand', 'dove'))
    await hover(term('condicionador'))

    expect(facetArgs(2)).toEqual(['condicionador', undefined, undefined])
  })

  it('sends no facet for a typed term after an attribute hover', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { rerender, hover } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()
    await hover(attribute('brand', 'dove'))

    rerender({ inputValue: 'sabonete' })
    await settle()

    expect(facetArgs(2)).toEqual(['sabonete', undefined, undefined])
  })
})

describe('Autocomplete legacy search event (US-1)', () => {
  it('emits once when a typed term returns a new searchId', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { rerender, searchEvents } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()

    expect(searchEvents()).toEqual(['shampoo'])
  })

  it('does not emit when reopening returns the same searchId, but still updates products', async () => {
    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A', 1))
    const { ref, rerender, searchEvents } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A', 2))
    rerender({ inputValue: 'shampoo', isOpen: false })
    rerender({ inputValue: 'shampoo', isOpen: true })
    await settle()

    expect(mockSuggestionProducts).toHaveBeenCalledTimes(2)
    expect(searchEvents()).toEqual(['shampoo'])
    expect(ref.current.state.products).toHaveLength(2)
  })

  it('does not emit when an attribute hover returns the same searchId', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { rerender, hover, searchEvents } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()
    await hover(attribute('brand', 'dove'))

    expect(searchEvents()).toEqual(['shampoo'])
  })

  it('emits for every hover that returns a new searchId, like Activity Flow', async () => {
    const { rerender, hover, searchEvents } = setup()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A'))
    rerender({ inputValue: 'shampoo' })
    await settle()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('B'))
    await hover(attribute('brand', 'dove'))

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('C'))
    await hover(term('condicionador'))

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('C'))
    await hover(term('condicionador'))

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('B'))
    await hover(attribute('brand', 'dove'))

    expect(searchEvents()).toEqual([
      'shampoo',
      'shampoo',
      'condicionador',
      'shampoo',
    ])
  })

  it('emits when a new typed term returns a new searchId', async () => {
    const { rerender, searchEvents } = setup()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A'))
    rerender({ inputValue: 'shampoo' })
    await settle()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('B'))
    rerender({ inputValue: 'sabonete' })
    await settle()

    expect(searchEvents()).toEqual(['shampoo', 'sabonete'])
  })

  it('emits when the same term is retyped and returns a new searchId', async () => {
    const { rerender, searchEvents } = setup()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A'))
    rerender({ inputValue: 'shampoo' })
    await settle()

    rerender({ inputValue: '' })
    await settle()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('B'))
    rerender({ inputValue: 'shampoo' })
    await settle()

    expect(searchEvents()).toEqual(['shampoo', 'shampoo'])
  })

  it('emits when the same term is retyped after clearing and returns the same searchId', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { rerender, searchEvents } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()

    rerender({ inputValue: '' })
    await settle()

    rerender({ inputValue: 'shampoo' })
    await settle()

    expect(searchEvents()).toEqual(['shampoo', 'shampoo'])
  })

  it('does not expose the previous searchId while the next term loads', async () => {
    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('Z', 0))
    const { container, rerender } = setup()

    rerender({ inputValue: 'zzzxqwerty' })
    await settle()
    expect(container.querySelector('[data-af-search-id="Z"]')).not.toBeNull()

    rerender({ inputValue: '' })
    await settle()

    mockSuggestionProducts.mockReturnValueOnce(new Promise(() => {}))
    rerender({ inputValue: 'shampoo' })
    await settle()

    expect(container.querySelector('[data-af-element]')).toBeNull()
  })

  it('emits for a zero-result search that returns a searchId', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('Z', 0))
    const { rerender, searchEvents } = setup()

    rerender({ inputValue: 'xyzabc' })
    await settle()

    expect(searchEvents()).toEqual(['xyzabc'])
  })

  it('does not emit when the response has no searchId', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse(''))
    const { rerender, searchEvents } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()

    expect(searchEvents()).toEqual([])
  })
})

describe('TileList zero-result impression (US-2)', () => {
  const tileListProps = {
    term: 'xyzabc',
    title: 'Products',
    products: [],
    showTitle: false,
    shelfProductCount: 3,
    totalProducts: 0,
    layout: ProductLayout.Vertical,
    isLoading: false,
    clickTerm: 'xyzabc',
    onProductClick: () => {},
    onProductNavigate: () => {},
    onSeeAllClick: () => {},
    searchId: 'Z',
  }

  const impressionNodes = (container: HTMLElement) =>
    container.querySelectorAll('[data-af-onimpression]')

  it('renders an empty instrumented node when there are no products', () => {
    const { container } = render(<TileList {...tileListProps} />)
    const nodes = impressionNodes(container)

    expect(nodes).toHaveLength(1)
    expect(nodes[0].getAttribute('data-af-element')).toBe('search-autocomplete')
    expect(nodes[0].getAttribute('data-af-search-id')).toBe('Z')
    expect(nodes[0].childNodes).toHaveLength(0)
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })

  it('renders nothing without a searchId', () => {
    const { container } = render(<TileList {...tileListProps} searchId="" />)

    expect(container.innerHTML).toBe('')
  })

  it('renders nothing without a term', () => {
    const { container } = render(<TileList {...tileListProps} term="" />)

    expect(container.innerHTML).toBe('')
  })

  it('keeps the same node and updates the attribute when the searchId changes', () => {
    const { container, rerender } = render(<TileList {...tileListProps} />)
    const [before] = impressionNodes(container)

    rerender(<TileList {...tileListProps} searchId="Y" />)
    const [after] = impressionNodes(container)

    expect(after).toBe(before)
    expect(after.getAttribute('data-af-search-id')).toBe('Y')
  })

  it('keeps the product list instrumentation when there are products', () => {
    const { container } = render(
      <TileList
        {...tileListProps}
        products={[{ productId: '1', items: [] }]}
        totalProducts={1}
      />
    )

    const nodes = impressionNodes(container)

    expect(nodes).toHaveLength(1)
    expect(nodes[0].getAttribute('data-af-search-id')).toBe('Z')
    expect(container.querySelectorAll('li[data-af-onclick]')).toHaveLength(1)
  })

  it('shows the zero-result node in the autocomplete for a term without results', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('Z', 0))
    const { container, rerender } = setup()

    rerender({ inputValue: 'xyzabc' })
    await settle()

    const nodes = impressionNodes(container)

    expect(nodes).toHaveLength(1)
    expect(nodes[0].getAttribute('data-af-search-id')).toBe('Z')
  })

  it('moves the impression node to the new searchId when a prefix returns products', async () => {
    const { container, rerender, searchEvents } = setup()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('C', 0))
    rerender({ inputValue: 'zzzx' })
    await settle()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('D', 2))
    rerender({ inputValue: 'sh' })
    await settle()

    const nodes = impressionNodes(container)

    expect(nodes).toHaveLength(1)
    expect(nodes[0].getAttribute('data-af-search-id')).toBe('D')
    expect(nodes[0].querySelectorAll('li')).toHaveLength(2)
    expect(searchEvents()).toEqual(['zzzx', 'sh'])
  })
})

describe('Autocomplete legacy click term (US-1)', () => {
  it('sends the raw multi-word term when the product link is clicked', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { getByTestId, rerender, productClicks, closeMenu } = setup()

    rerender({ inputValue: 'shampoo anticaspa' })
    await settle()
    fireEvent.click(getByTestId('product-1'))

    expect(productClicks()).toEqual([{ id: '1', term: 'shampoo anticaspa' }])
    expect(closeMenu).toHaveBeenCalledTimes(1)
  })

  it('sends the raw term when it has a slash, a percent sign, an ampersand or an accent', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { getByTestId, rerender, productClicks } = setup()

    rerender({ inputValue: 'café 1/2 100% & cia' })
    await settle()
    fireEvent.click(getByTestId('product-1'))

    expect(productClicks()).toEqual([{ id: '1', term: 'café 1/2 100% & cia' }])
  })

  it('keeps the encoded term in the see-all link and sends no product click', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { getByTestId, rerender, productClicks, seeAllEvents } = setup()

    rerender({ inputValue: 'shampoo anticaspa' })
    await settle()
    const seeAll = getByTestId('see-all')

    fireEvent.click(seeAll)

    expect(seeAll.getAttribute('data-query')).toBe(
      'map=ft&_q=shampoo%20anticaspa'
    )
    expect(seeAllEvents()).toEqual(['shampoo%20anticaspa'])
    expect(productClicks()).toEqual([])
  })
})

describe('Autocomplete legacy click area (US-2)', () => {
  it('counts a click on the buy button once and keeps the panel open', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { getByTestId, rerender, productClicks, closeMenu } = setup()

    rerender({ inputValue: 'tomate' })
    await settle()
    fireEvent.click(getByTestId('buy-1'))

    expect(productClicks()).toEqual([{ id: '1', term: 'tomate' }])
    expect(mockBuyClick).toHaveBeenCalledTimes(1)
    expect(closeMenu).not.toHaveBeenCalled()
  })

  it('counts every click on a button that stops native propagation', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { getByTestId, rerender, productClicks, closeMenu } = setup()

    rerender({ inputValue: 'tomate' })
    await settle()
    const addButton = getByTestId('add-1')

    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)

    expect(productClicks()).toHaveLength(3)
    expect(closeMenu).not.toHaveBeenCalled()
  })

  it('counts the product link once, on the clicked product', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A', 3))
    const { getByTestId, rerender, productClicks, closeMenu } = setup()

    rerender({ inputValue: 'tomate' })
    await settle()
    fireEvent.click(getByTestId('product-2'))

    expect(productClicks()).toEqual([{ id: '2', term: 'tomate' }])
    expect(closeMenu).toHaveBeenCalledTimes(1)
  })

  it('counts the link of the horizontal default item once', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { getByTestId, rerender, productClicks, closeMenu } = setup({
      productLayout: ProductLayout.Horizontal,
    })

    rerender({ inputValue: 'tomate' })
    await settle()
    fireEvent.click(getByTestId('product-link'))

    expect(productClicks()).toEqual([{ id: '1', term: 'tomate' }])
    expect(closeMenu).toHaveBeenCalledTimes(1)
  })

  it('counts the link of a custom horizontal summary once', async () => {
    const HorizontalProductSummary = ({ actionOnClick }: any) => (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <a data-testid="horizontal-link" onClick={actionOnClick}>
        product
      </a>
    )

    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { getByTestId, rerender, productClicks, closeMenu } = setup({
      productLayout: ProductLayout.Horizontal,
      HorizontalProductSummary,
    })

    rerender({ inputValue: 'tomate' })
    await settle()
    fireEvent.click(getByTestId('horizontal-link'))

    expect(productClicks()).toEqual([{ id: '1', term: 'tomate' }])
    expect(closeMenu).toHaveBeenCalledTimes(1)
  })

  it('sends no click for a product without productId', async () => {
    mockSuggestionProducts.mockResolvedValue({
      data: {
        productSuggestions: {
          ...productsResponse('A').data.productSuggestions,
          products: [{ productId: '', productName: 'No id', items: [] }],
        },
      },
    })
    const { container, rerender, productClicks } = setup()

    rerender({ inputValue: 'tomate' })
    await settle()
    const item = container.querySelector('li') as HTMLElement

    fireEvent.click(item)

    expect(item.hasAttribute('data-af-onclick')).toBe(false)
    expect(productClicks()).toEqual([])
  })

  it('does not block the buy button or the navigation when the legacy push throws', async () => {
    const onWindowError = (event: ErrorEvent) => event.preventDefault()
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    window.addEventListener('error', onWindowError)

    try {
      mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
      const { getByTestId, rerender, push, closeMenu } = setup()

      rerender({ inputValue: 'tomate' })
      await settle()
      push.mockImplementation(() => {
        throw new Error('pixel failure')
      })

      fireEvent.click(getByTestId('buy-1'))
      fireEvent.click(getByTestId('product-1'))

      expect(mockBuyClick).toHaveBeenCalledTimes(1)
      expect(closeMenu).toHaveBeenCalledTimes(1)
    } finally {
      window.removeEventListener('error', onWindowError)
      consoleError.mockRestore()
    }
  })
})

describe('Autocomplete legacy click after hover (US-3)', () => {
  it('credits the hovered suggestion term', async () => {
    const { getByTestId, rerender, hover, productClicks } = setup()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A'))
    rerender({ inputValue: 'shampoo' })
    await settle()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('B'))
    await hover(term('shampoo ketoconazol'))
    fireEvent.click(getByTestId('product-1'))

    expect(productClicks()).toEqual([{ id: '1', term: 'shampoo ketoconazol' }])
  })

  it('credits the term sent with an attribute hover', async () => {
    const { getByTestId, rerender, hover, productClicks } = setup()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A'))
    rerender({ inputValue: 'sham' })
    await settle()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('B'))
    await hover(attribute('category-1', 'cuidado-personal', 'shampoo'))
    fireEvent.click(getByTestId('product-1'))

    expect(productClicks()).toEqual([{ id: '1', term: 'shampoo' }])
  })

  it('credits the term of the response on screen when responses arrive out of order', async () => {
    const { ref, getByTestId, rerender, hover, productClicks } = setup()

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('A'))
    rerender({ inputValue: 'shampoo' })
    await settle()

    const slow = deferred()

    mockSuggestionProducts.mockReturnValueOnce(slow.promise)
    await hover(term('shampoo ketoconazol'))

    mockSuggestionProducts.mockResolvedValueOnce(productsResponse('C'))
    await hover(term('condicionador'))

    slow.resolve(productsResponse('B'))
    await settle()
    fireEvent.click(getByTestId('product-1'))

    expect(ref.current.state.searchId).toBe('B')
    expect(productClicks()).toEqual([{ id: '1', term: 'shampoo ketoconazol' }])
  })

  it('clears the clicked term with the searchId when the query is cleared', async () => {
    mockSuggestionProducts.mockResolvedValue(productsResponse('A'))
    const { ref, rerender } = setup()

    rerender({ inputValue: 'shampoo' })
    await settle()
    expect(ref.current.state.searchTerm).toBe('shampoo')

    rerender({ inputValue: '' })
    await settle()

    expect(ref.current.state.searchId).toBe('')
    expect(ref.current.state.searchTerm).toBe('')
  })
})
