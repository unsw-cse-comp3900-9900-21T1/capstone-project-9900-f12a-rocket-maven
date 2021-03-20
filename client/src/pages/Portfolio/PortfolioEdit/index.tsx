import { Fragment } from 'react'
import { isEmpty } from  'ramda'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useFetchGetWithUserId } from '../../../hooks/http'
import PortfolioEditForm from '../PortfolioEditForm'
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

const PortfolioEdit = () => {
  const { id } = useParams<Params>()

  // Avoid call when isCreate is true
  // Might have to just make a PortfolioCreate component 
  const { data, isLoading }: PortfolioFetchInfo = useFetchGetWithUserId(`/portfolios/${id}`)

  return (
    !isEmpty(data) ?
    <Fragment>
      <Subtitle>
        Portfolio Edit
      </Subtitle>
      <PortfolioEditForm  portfolioInfo={data} portfolioId={id}/>
    </Fragment>
    :
      null
  )
}

export default PortfolioEdit