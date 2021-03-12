import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import { useState } from 'react'
import { DummyPortfolioCard } from './DummyPortfolioCard'
import PortfolioList from '../../components/PortfolioList'
import { useFetchGetWithUserId } from '../../hooks/http'
import { Portfolio, PortfolioPagination } from './types'


const PortfolioDetail = () => {
  // FIX(Jude)
  const [portfolio, setPortfolio] = useState<Portfolio[]>();
  const portfolioData: PortfolioPagination = useFetchGetWithUserId('/portfolios')

  // Issue - portfolio being set with empty array creates infinite refresh
  if (portfolioData && portfolioData.results && portfolioData.results.length > 0) {
    setPortfolio(portfolioData.results)
  }

  return (
    <Page>
      <Title>
        Portfolio
      </Title>
      <DummyPortfolioCard portfolio={portfolio} />
      <PortfolioList />
    </Page>
  )
}

export default PortfolioDetail
