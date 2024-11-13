const EVENT_NAME = 'autocomplete'

export enum EventType {
  ProductClick = 'product_click',
  SearchSuggestionClick = 'search_suggestion_click',
  TopSearchClick = 'top_search_click',
  HistoryClick = 'history_click',
  Search = 'search',
  SeeAllClick = 'see_all_products_click',
}

export function handleProductClick(push: (data: any) => void, page: string) {
  return (position: number, term: string, productSummary: Product) => {
    const {
      productName,
      brand,
      categories,
      sku,
      productId,
      productReference,
    } = productSummary

    push({
      page,
      event: 'productClick',
      eventType: EventType.ProductClick,
      product: {
        productName,
        brand,
        categories,
        sku,
        productId,
        productReference,
      },
      position,
      term,
    })
  }
}

export function handleItemClick(
  push: (data: any) => void,
  page: string,
  type: string
) {
  return (term: string, position: number) => {
    push({
      page,
      event: EVENT_NAME,
      eventType: type,
      search: {
        term,
        position,
      },
    })
  }
}

export function handleSeeAllClick(push: (data: any) => void, page: string) {
  return (term: string) =>
    push({
      page,
      event: EVENT_NAME,
      eventType: EventType.SeeAllClick,
      search: {
        term,
      },
    })
}
