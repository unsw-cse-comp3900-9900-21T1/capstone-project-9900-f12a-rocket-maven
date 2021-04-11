import PortfolioCard from '@rocketmaven/components/PortfolioCard'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useFetchGetPublicPortfolio } from '@rocketmaven/hooks/http'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { isEmpty } from 'ramda'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'

type Params = {
  id: string
}

type PortfolioFetchInfo = {
  data: {
    portfolio: PortfolioInfo
  }
  isLoading: boolean
}

const PortfolioDetail = () => {
  const { id } = useParams<Params>()
  const [refreshFlag, setRefreshFlag] = useState(0)
  const refreshPortfolios = () => setRefreshFlag(refreshFlag + 1)

  const { data, isLoading }: PortfolioFetchInfo = useFetchGetPublicPortfolio(`${id}`)
  const content = isEmpty(data) ? (
    "Portfolio is private or doesn't exist"
  ) : (
    <PortfolioCard
      portfolio={data.portfolio}
      refreshPortfolios={refreshPortfolios}
      singleView={true}
    />
  )

  return isLoading ? null : (
    <Fragment>
      <Subtitle>Portfolio Detail</Subtitle>
      {content}
    </Fragment>
  )
}

export default PortfolioDetail
