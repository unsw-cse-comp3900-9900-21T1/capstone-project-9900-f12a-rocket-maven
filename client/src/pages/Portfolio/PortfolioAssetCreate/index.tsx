
import { Fragment } from 'react'
import { isEmpty } from  'ramda'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useGetPortfolioHistory } from '../../../hooks/http'
import { PortfolioEventPagination } from './types'
import PortfolioAssetEditForm from '../PortfolioAssetEditForm'

type Params = {
  id: string
}

const PortfolioAssetCreate = () => {
  const { id } = useParams<Params>()

  const portfolioHistory: { portfolio: PortfolioEventPagination } = useGetPortfolioHistory(id)
  
  return (
    !isEmpty(portfolioHistory) ?
    <Fragment>
      <Subtitle>
        Event Create
      </Subtitle>
      <PortfolioAssetEditForm />
    </Fragment>
    :
      null
  )
}

export default PortfolioAssetCreate