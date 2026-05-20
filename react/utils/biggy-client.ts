import ApolloClient, { ApolloQueryResult } from 'apollo-client'
import suggestionProducts from 'vtex.store-resources/QuerySuggestionProducts'
import suggestionSearches from 'vtex.store-resources/QueryAutocompleteSearchSuggestions'
import topSearches from 'vtex.store-resources/QueryTopSearches'

import { getCookie } from './dom-utils'
import { ISearchProduct } from '../models/search-product'
import { prependSearchHistory, readSearchHistory } from './search-history'

export default class BiggyClient {
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
    shippingOptions?: string[],
    advertisementOptions?: AdvertisementOptions
  ): Promise<ApolloQueryResult<{ productSuggestions: IProductsOutput }>> {
    return this.client.query({
      query: suggestionProducts,
      variables: {
        simulationBehavior,
        advertisementOptions,
        hideUnavailableItems,
        orderBy,
        fullText: term,
        facetKey: attributeKey,
        facetValue: attributeValue,
        productOriginVtex: productOrigin,
        count,
        shippingOptions,
        variant: getCookie('sp-variant'),
        origin: 'autocomplete',
      },
      fetchPolicy: 'network-only',
    })
  }

  public searchHistory(): string[] {
    return readSearchHistory()
  }

  public prependSearchHistory(term: string, limit = 5) {
    prependSearchHistory(term, limit)
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
  searchId: string
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
