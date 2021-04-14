import PortfolioCard from '@rocketmaven/components/PortfolioCard'
import { PortfolioInfo, PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import { isEmpty } from 'ramda'
import { Fragment } from 'react'

type Props = {
  portfolioPagination: PortfolioPagination
  refreshPortfolios: () => void
}

const PaginatedPortfolioDisplay = ({ portfolioPagination, refreshPortfolios }: Props) => {
  if (!portfolioPagination || isEmpty(portfolioPagination)) {
    return null
  }

  const portfolios: [PortfolioInfo] = portfolioPagination.results
  return (
    <Fragment>
      {portfolios.map((portfolio, index) => (
        <PortfolioCard refreshPortfolios={refreshPortfolios} portfolio={portfolio} />
      ))}
    </Fragment>
  )
}

export default PaginatedPortfolioDisplay
