import { Fragment } from 'react'
import { isEmpty } from  'ramda'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useFetchGetWithUserId } from '../../../hooks/http'
import { PortfolioInfo } from '../types'

type Params = {
  id?: string
}

const PortfolioHoldings = () => {
  const { id } = useParams<Params>()

  // Avoid call when isCreate is true
  // Might have to just make a PortfolioCreate component 
  const portfolioInfo: { portfolio: PortfolioInfo } = useFetchGetWithUserId(`/portfolios/${id}`)

  return (
    !isEmpty(portfolioInfo) ?
    <Fragment>
      <Subtitle>
        Portfolio Holdings
      </Subtitle>
    </Fragment>
    :
      null
  )
}

export default PortfolioHoldings