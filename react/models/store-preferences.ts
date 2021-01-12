export interface StorePreferences {
  priceFormatPreferences: PriceFormatPreferences
  tilePreferences: TilePreferences
  autoCompletePreferences: AutoCompletePreferences
}

export interface PriceFormatPreferences {
  prefix: string
  decimalPlaces: number
  floatIndicator: string
}

export interface TilePreferences {
  unavailableMessage: string
  oldPricePrefix: string
  pricePrefix: string
  showPrefixOnlyWhenPriceHasOldPrice?: boolean
}

export interface AutoCompletePreferences {
  productCount: number
  inputPlaceHolder: string
  topSearchedListTitle: string
  historyListTitle: string
  suggestionListTitle: string
  emptySuggestionListTitle: string
  tileListTitle: string
  subListItemPrefix: string
}
