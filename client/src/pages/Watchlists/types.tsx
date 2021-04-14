export type AssetInfo = {
  industry: string
  price_last_updated: Date
  asset_additional: string
  current_price: number
  currency: string
  market_cap: number
  ticker_symbol: string
  name: string
  country: string
  data_source: string
  price_high: number
  price_low: number
  price_high_low: [number, number]
}

export type WatchListItem = {
  price_high: number
  price_low: number
  asset: AssetInfo
}

export type WatchListPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [WatchListItem]
}
