import { Fragment } from 'react'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useParams } from 'react-router-dom'
import { useGetPortfolioInfo } from '@rocketmaven/hooks/http'
import PortfolioEditForm from '@rocketmaven/pages/Portfolio/PortfolioEditForm'
import { PortfolioInfoEdit } from '@rocketmaven/pages/Portfolio/types'

type Params = {
  id?: string
}

type PortfolioFetchInfo  = {
  data: {
    portfolio: PortfolioInfoEdit
  }
  isLoading: boolean,
}

const PortfolioEdit = () => {
  const { id } = useParams<Params>()
  const { data, isLoading }: PortfolioFetchInfo = useGetPortfolioInfo(`${id}`)

  return (
    isLoading 
    ? null
    :
      <Fragment>
        <Subtitle>
          Portfolio Edit
        </Subtitle>
        <PortfolioEditForm  portfolioInfo={data} portfolioId={id}/>
      </Fragment>
  )
}

export default PortfolioEdit