import { PriceFormatPreferences } from '../models/store-preferences'

export function formatPrice(
  price: number,
  preferences: PriceFormatPreferences
) {
  return `${preferences.prefix}${price
    .toFixed(preferences.decimalPlaces)
    .replace('.', preferences.floatIndicator)}`
}
