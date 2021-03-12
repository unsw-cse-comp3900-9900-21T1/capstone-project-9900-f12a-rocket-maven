export const endpoint = {
  createAccount: '/api/v1/investors',
  getPortfolios: (investorId: number) => `/api/v1/${investorId}/portfolios`
  
} 