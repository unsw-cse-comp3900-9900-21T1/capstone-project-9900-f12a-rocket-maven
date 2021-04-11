import PortfolioCard from '@rocketmaven/components/PortfolioCard'
import { PortfolioInfo, PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import { Typography } from 'antd'
import { isEmpty } from 'ramda'
import { Fragment } from 'react'

const AntText = Typography.Text

type Props = {
  portfolioPagination: PortfolioPagination
  refreshPortfolios: () => void
}

const PaginatedPortfolioDisplay = ({ portfolioPagination, refreshPortfolios }: Props) => {
  if (!portfolioPagination || isEmpty(portfolioPagination)) {
    return null
  }

  // FIX(Jude): portolio becomes undefined and errors out
  // looks like the trigger is the token expiring
  // I would've thought the above if statement would've taken care of it
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
