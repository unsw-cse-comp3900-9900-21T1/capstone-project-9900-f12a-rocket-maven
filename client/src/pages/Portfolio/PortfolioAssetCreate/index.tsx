
import { Fragment } from 'react'
import { isEmpty } from  'ramda'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useGetPortfolioInfo } from '@rocketmaven/hooks/http'
import { PortfolioEventPagination } from './types'
import PortfolioAssetEditForm from '@rocketmaven/pages/Portfolio/PortfolioAssetEditForm'
import PortfolioAssetCSVUpload from '@rocketmaven/pages/Portfolio/PortfolioAssetCSVUpload'

type Params = {
  id: string
}

const PortfolioAssetCreate = () => {
  const { id } = useParams<Params>()

  const portfolioHistory: { portfolio: PortfolioEventPagination } = useGetPortfolioInfo(id)
  
  return (
    !isEmpty(portfolioHistory) ?
    <Fragment>
      <Subtitle>
        Event Create
      </Subtitle>
      <PortfolioAssetEditForm portfolioId={id} />
      <PortfolioAssetCSVUpload portfolioId={id} />
    </Fragment>
    :
      null
  )
}

export default PortfolioAssetCreate