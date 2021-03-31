import { Fragment } from 'react'
import { isEmpty } from 'ramda'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useGetPortfolioInfo } from '@rocketmaven/hooks/http'
import PortfolioAssetEditForm from '@rocketmaven/pages/Portfolio/PortfolioAssetEditForm'
import PortfolioAssetCSVUpload from '@rocketmaven/pages/Portfolio/PortfolioAssetCSVUpload'
import { PortfolioInfo } from '../types'

type Params = {
  id: string
}

const PortfolioAssetCreate = () => {
  const { id } = useParams<Params>()

  const portfolioHistory: { portfolio: PortfolioInfo } = useGetPortfolioInfo(id)

  return !isEmpty(portfolioHistory) ? (
    <Fragment>
      <Subtitle>Event Create</Subtitle>
      <PortfolioAssetEditForm portfolioId={id} portfolioInfo={portfolioHistory.portfolio} />
      {!portfolioHistory.portfolio.competition_portfolio && (
        <PortfolioAssetCSVUpload portfolioId={id} />
      )}
    </Fragment>
  ) : null
}

export default PortfolioAssetCreate
