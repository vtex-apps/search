import { Item } from "../components/Autocomplete/components/ItemList/types"
import { ISearchProduct } from "../models/search-product"

const EVENT_NAME = 'autocomplete'

export enum EventType {
  ProductClick = 'product_click',
  SearchSuggestionClick = 'search_suggestion_click',
  TopSearchClick = 'top_search_click',
  HistoryClick = 'history_click',
  Search = 'search',
  SeeAllClick = 'see_all_click',
}

export function handleProductClick(push: (data: any) => void, page: string) {
  return (products: ISearchProduct[], id: string, position: number) =>
    push({
      page,
      event: EVENT_NAME,
      eventType: EventType.ProductClick,
      products: products[position],
      product: {
        productId: id,
        position
      }
    })
}

export function handleItemClick(
  push: (data: any) => void,
  page: string,
  type: string
) {
  return (term: string, position: number, products: Item[]) => {
    push({
      page,
      event: EVENT_NAME,
      eventType: type,
      search: {
        term,
        position,
        products
      },
    })
  }
}

export function handleSeeAllClick(push: (data: any) => void, page: string, products: ISearchProduct[]) {
  return (term: string) =>
    push({
      page,
      event: EVENT_NAME,
      eventType: EventType.SeeAllClick,
      search: {
        term,
        products
      },
    })
}

export function handleAutocompleteSearch(
  push: (data: any) => void,
  operator: string,
  misspelled: boolean,
  count: number,
  term: string,
  products: ISearchProduct[]
) {
  try {
    push({
      event: EVENT_NAME,
      eventType: EventType.Search,
      search: {
        operator,
        misspelled,
        text: decodeURI(term),
        match: count,
        products
      },
    })
  } catch (e) {
    push({
      event: EVENT_NAME,
      eventType: EventType.Search,
      search: {
        operator,
        misspelled,
        text: term,
        match: count,
        products
      },
    })
  }
}
