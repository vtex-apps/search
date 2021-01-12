import { ISearchProduct } from './search-product'

interface IResultResponsePagination {
  count: number
  current: IResultResponsePaginationItem
  before: IResultResponsePaginationItem[]
  after: IResultResponsePaginationItem[]
  next: IResultResponsePaginationItem
  previous: IResultResponsePaginationItem
  first: IResultResponsePaginationItem
  last: IResultResponsePaginationItem
}

interface IResultResponsePaginationItem {
  index: number
  proxyUrl: string
}

interface ISearchSort {
  field: string
  order: string
  active: boolean
  proxyUrl: string
}

interface ISearchOptions {
  sorts: ISearchSort[]
  counts: ISearchOptionsCount[]
}

interface ISearchOptionsCount {
  count: number
  active: boolean
  proxyUrl: string
}

export interface IAttributeResponseKey {
  key: string
  label: string
  type: string
  visible: boolean
  values: IAttributeResponseValue[]
  minValue: number
  maxValue: number
  active: boolean
  activeFrom: string
  activeTo: string
  templateUrl: string
  proxyUrl: string
}

interface IAttributeResponseValue {
  count: number
  active: boolean
  proxyUrl: string
  key: string
  label: string
  from: string
  to: string
}

interface ISuggestionSearchesOutput {
  searches: ISuggestionQueryResponseSearch[]
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

interface IPhraseSuggestion {
  text: string
  highlighted: string
  misspelled: boolean
  correction: boolean
}

export interface ISearchResult {
  query: string
  operator: string
  total: number
  products: ISearchProduct[] | any[]
  pagination: IResultResponsePagination
  options: ISearchOptions
  attributes: IAttributeResponseKey[]
  suggestion: ISuggestionSearchesOutput
  correction: IPhraseSuggestion
}
