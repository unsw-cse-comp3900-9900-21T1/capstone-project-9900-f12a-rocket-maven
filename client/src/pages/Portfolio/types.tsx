export type PortfolioEventCreate = {
  add_action?: boolean,
  asset_id: string,
  fees: number,
  note?: string,
  price_per_share: number,
  units: number,
}

export type PortfolioEvent = {
  add_action?: boolean,
  asset_id: string,
  event_date?: string,
  fees: number,
  id: number,
  note?: string,
  portfolio_id?: string,
  price_per_share: number,
  units: number,
}

export type PortfolioEventPagination = {
  next: string,
  pages: number,
  prev: string,
  total: number,
  results: [PortfolioEvent]
}

export type PortfolioInfo = {
  competition_portfolio: boolean,
  // Double check if this is the right type
  creation_date: string,
  description: string,
  id: number,
  name: string,
  tax_residency: string,
  visibility: boolean
}

export type PortfolioPagination = {
  next: string,
  pages: number,
  prev: string,
  total: number,
  results: [PortfolioInfo]
}