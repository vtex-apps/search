import React from 'react'
import { render, act, flushPromises } from '@vtex/test-tools/react'

import { AutoComplete } from '../index'

const mockSuggestionProducts = jest.fn()

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
jest.mock(
  'vtex.render-runtime',
  () => ({
    Link: ({ children }: any) => children,
    ExtensionPoint: () => null,
    useRuntime: () => ({}),
  }),
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

const setup = () => {
  const push = jest.fn()
  const ref = React.createRef<any>()
  const utils = render(
    <AutoComplete ref={ref} {...(baseProps as any)} push={push} />
  )

  const rerender = (props: Record<string, unknown>) =>
    utils.rerender(
      <AutoComplete
        ref={ref}
        {...(baseProps as any)}
        push={push}
        {...(props as any)}
      />
    )

  const hover = async (item: any) => {
    await act(async () => {
      ref.current.handleItemHover(item)
    })
    await settle()
  }

  return { ...utils, push, rerender, hover }
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
