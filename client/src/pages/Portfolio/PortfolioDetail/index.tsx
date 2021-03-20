import { Fragment } from 'react'
import { isEmpty } from 'ramda'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useFetchGetPublicPortfolio } from '../../../hooks/http'
import { PortfolioInfo } from '../types'
import PortfolioCard from './PortfolioCard'

type Params = {
  id: string
}

type PortfolioFetchInfo  = {
  data: {
    portfolio: PortfolioInfo
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
      null // Spinner here??
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