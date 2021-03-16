
import { Fragment } from 'react'
import { isEmpty } from  'ramda'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useParams, Link } from 'react-router-dom'
import { useGetPortfolioHistory } from '../../../hooks/http'
import { PortfolioEventPagination } from './types'
import { urls } from '../../../data/urls'

type Params = {
  id: string
}

const PortfolioHistory = () => {
  const { id } = useParams<Params>()

  // Avoid call when isCreate is true
  // Might have to just make a PortfolioCreate component 
  const portfolioHistory: { portfolio: PortfolioEventPagination } = useGetPortfolioHistory(id)
  
  // TODO(Jude)
  return (
    !isEmpty(portfolioHistory) ?
    <Fragment>
      <Subtitle>
        Portfolio History
      </Subtitle>
      <Link to={urls.portfolio + `/${id}/history/asset-create`}>
        Add Asset
      </Link>
    </Fragment>
    :
      null
  )
}

export default PortfolioHistory