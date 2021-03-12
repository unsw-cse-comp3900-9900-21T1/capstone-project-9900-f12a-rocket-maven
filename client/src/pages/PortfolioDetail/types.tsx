
export type Portfolio = {
  buying_power: number,
  competition_portfolio: string,
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
  results: [Portfolio]
}