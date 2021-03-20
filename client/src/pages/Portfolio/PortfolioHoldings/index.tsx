import { Fragment } from 'react'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useFetchGetWithUserId } from '../../../hooks/http'
import { PortfolioInfo } from '../types'

type Params = {
  id?: string
}

type PortfolioFetchInfo  = {
  data: {
    portfolio: PortfolioInfo
  }
  isLoading: boolean,
}

const PortfolioHoldings = () => {
  const { id } = useParams<Params>()

  // Avoid call when isCreate is true
  // Might have to just make a PortfolioCreate component 

  // const portfolioInfo: { portfolio: PortfolioInfo } = useGetPortfolioHoldings(`${id}`)
  const { data, isLoading }: PortfolioFetchInfo = useFetchGetWithUserId(`/portfolios/${id}`)
  console.log("************************** portfolio Info is", data)

  return (
    isLoading
    ? 
      null
    :
      <Fragment>
        <Subtitle>
          Portfolio Holdings
        </Subtitle>
      </Fragment>
  )
}

export default PortfolioHoldings