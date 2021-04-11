import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useGetPortfolioInfo } from '@rocketmaven/hooks/http'
import PortfolioAssetCSVUpload from '@rocketmaven/pages/Portfolio/PortfolioAssetCSVUpload'
import PortfolioAssetEditForm from '@rocketmaven/pages/Portfolio/PortfolioAssetEditForm'
import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { PortfolioInfo } from '../types'

type Params = {
  id: string
}

type PortfolioFetchInfo = {
  data: {
    portfolio: PortfolioInfo
  }
  isLoading: boolean
}

const PortfolioAssetCreate = () => {
  const { id } = useParams<Params>()
  const { data, isLoading }: PortfolioFetchInfo = useGetPortfolioInfo(id)

  return isLoading ? null : (
    <Fragment>
      <Subtitle>Event Create for {data.portfolio.name}</Subtitle>
      <PortfolioAssetEditForm portfolioId={id} portfolioInfo={data.portfolio} />
      {!data.portfolio.competition_portfolio && <PortfolioAssetCSVUpload portfolioId={id} />}
    </Fragment>
  )
}

export default PortfolioAssetCreate
