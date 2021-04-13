export type PortfolioEvent = {
  add_action?: number
  asset_id: string
  event_date?: string
  fees: number
  id: number
  note?: string
  portfolio_id?: string
  price_per_share: number
  units: number
}

export type PortfolioEventPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [PortfolioEvent]
}
