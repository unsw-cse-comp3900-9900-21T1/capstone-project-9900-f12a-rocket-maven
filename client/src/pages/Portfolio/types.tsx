export type PortfolioEventCreate = {
  add_action?: boolean
  asset_id: string
  fees: number
  note?: string
  price_per_share: number
  exchange_rate: number
  units: number
  event_date: any
}

export type PortfolioEvent = {
  add_action?: boolean
  asset_id: string
  event_date?: string
  asset_currency?: string
  fees: number
  id: number
  note?: string
  portfolio_id?: string
  price_per_share: number
  price_per_share_in_portfolio_currency: number
  units: number
  competition_portfolio: boolean
}

export type PortfolioEventPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [PortfolioEvent]
}

export type PortfolioInfoEdit = {
  public_portfolio: boolean
  description: string
  creation_date: string
  name: string
  tax_residency: string
  competition_portfolio: boolean
  id: number
  currency: string
}

export type PortfolioHolding = {
  available_units: number
  portfolio_id: number
  purchase_value: number
  current_value: number
  latest_note: string
  last_updated: string
  average_price: number
  asset_id: string
  market_price: number
  realised_total: number
  unrealised_units: number
}

export type LeaderboardInvestor = {
  first_name: string
  last_name: string
  username: string
  id: number
}

export type PortfolioInfo = {
  public_portfolio: boolean
  buying_power: number
  competition_score: number
  currency: string
  realised_sum: number
  rank: number
  description: string
  creation_date: string
  id: number
  purchase_value_sum: number
  competition_portfolio: boolean
  current_value_sum: number
  name: string
  tax_residency: string
  username: string
  portfolio_asset_holding: [PortfolioHolding]
  investor: LeaderboardInvestor
  recommended: [string, string]
}

export type PublicPortfolioInfo = {
  public_portfolio: boolean
  buying_power: number
  realised_sum: number
  description: string
  creation_date: string
  id: number
  purchase_value_sum: number
  competition_portfolio: boolean
  current_value_sum: number
  name: string
  tax_residency: string
  portfolio_asset_holding: [PortfolioHolding]
  investor: LeaderboardInvestor
}

export type PortfolioPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [PortfolioInfo]
}
