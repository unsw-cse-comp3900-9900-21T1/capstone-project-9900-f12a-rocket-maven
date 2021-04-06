import { Fragment } from 'react'
import { isEmpty } from 'ramda'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useFetchGetPublicPortfolio } from '@rocketmaven/hooks/http'
import { PublicPortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import PortfolioCard from '@rocketmaven/pages/Portfolio/PortfolioDetail/PortfolioCard'

type Params = {
  id: string
}

type PortfolioFetchInfo  = {
  data: {
    portfolio: PublicPortfolioInfo
  }
  isLoading: boolean,
}

const PortfolioDetail = () => {
  const { id } = useParams<Params>()

  const { data, isLoading }: PortfolioFetchInfo = useFetchGetPublicPortfolio(`${id}`)
  const content = 
    isEmpty(data)
      ? 'Portfolio is private or doesn\'t exist'
      : <PortfolioCard portfolio={data.portfolio} />

  return (
    isLoading
    ? 
      null
    :
      <Fragment>
        <Subtitle>
          Portfolio Detail
        </Subtitle>
        {content}
      </Fragment>
  )
}

export default PortfolioDetail