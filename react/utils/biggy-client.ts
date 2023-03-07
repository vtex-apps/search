import ApolloClient, { ApolloQueryResult } from 'apollo-client'
import suggestionProducts from 'vtex.store-resources/QuerySuggestionProducts'
import suggestionSearches from 'vtex.store-resources/QueryAutocompleteSearchSuggestions'
import topSearches from 'vtex.store-resources/QueryTopSearches'

import { getCookie, setCookie } from './dom-utils'
import { ISearchProduct } from '../models/search-product'

export default class BiggyClient {
  private historyKey = 'biggy-search-history'

  constructor(private client: ApolloClient<any>) {}

  public async topSearches(): Promise<
    ApolloQueryResult<{ topSearches: ISearchesOutput }>
  > {
    return this.client.query({
      query: topSearches,
    })
  }

  public async suggestionSearches(
    term: string
  ): Promise<
    ApolloQueryResult<{ autocompleteSearchSuggestions: ISearchesOutput }>
  > {
    return this.client.query({
      query: suggestionSearches,
      variables: {
        fullText: term,
      },
    })
  }

  // eslint-disable-next-line max-params
  public async suggestionProducts(
    term: string,
    attributeKey?: string,
    attributeValue?: string,
    productOrigin = false,
    simulationBehavior: 'default' | 'skip' | null = 'default',
    hideUnavailableItems = false,
    orderBy?: string,
    count?: number,
    shippingOptions?: string[]
  ): Promise<ApolloQueryResult<{ productSuggestions: IProductsOutput }>> {
    return this.client.query({
      query: suggestionProducts,
      variables: {
        simulationBehavior,
        hideUnavailableItems,
        orderBy,
        fullText: term,
        facetKey: attributeKey,
        facetValue: attributeValue,
        productOriginVtex: productOrigin,
        count,
        shippingOptions,
      },
      fetchPolicy: 'network-only',
    })
  }

  public searchHistory(): string[] {
    const history = getCookie(this.historyKey) || ''

    return history.split(',').filter(x => !!x)
  }

  public prependSearchHistory(term: string, limit = 5) {
    if (term == null || term.trim() === '') {
      return
    }

    let history = this.searchHistory()

    if (history.indexOf(term) < 0) {
      history.unshift(term)
      history = history.slice(0, limit)
    }

    setCookie(this.historyKey, history.join(','))
  }
}

interface ISearchesOutput {
  searches: ISuggestionQueryResponseSearch[]
}

interface IProductsOutput {
  products: ISearchProduct[]
  count: number
  misspelled: boolean
  operator: string
}

interface ISuggestionQueryResponseSearch {
  term: string
  count: number
  attributes: IElasticProductText[]
}

interface IElasticProductText {
  key: string
  value: string
  labelKey: string
  labelValue: string
}

export interface IElasticProductInstallment {
  count: number
  value: number
  interest: boolean
  valueText: string
}

interface IElasticProductText {
  key: string
  value: string
  labelKey: string
  labelValue: string
}

export interface IExtraInfo {
  key: string
  value: string
}
