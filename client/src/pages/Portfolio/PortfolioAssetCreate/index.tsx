import { Fragment } from 'react'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useGetPortfolioInfo } from '@rocketmaven/hooks/http'
import PortfolioAssetEditForm from '@rocketmaven/pages/Portfolio/PortfolioAssetEditForm'
import PortfolioAssetCSVUpload from '@rocketmaven/pages/Portfolio/PortfolioAssetCSVUpload'
import { PortfolioInfo } from '../types'

type Params = {
  id: string
}

type PortfolioFetchInfo = {
  data: {
    portfolio: PortfolioInfo,
  }
  isLoading: boolean
}

const PortfolioAssetCreate = () => {
  const { id } = useParams<Params>()
  const { data, isLoading }: PortfolioFetchInfo = useGetPortfolioInfo(id)

  return (
    isLoading
    ? null
    :
      <Fragment>
        <Subtitle>Event Create</Subtitle>
        <PortfolioAssetEditForm portfolioId={id} portfolioInfo={data.portfolio} />
        {!data.portfolio.competition_portfolio && (
          <PortfolioAssetCSVUpload portfolioId={id} />
        )}
      </Fragment>
  )
}

export default PortfolioAssetCreate
