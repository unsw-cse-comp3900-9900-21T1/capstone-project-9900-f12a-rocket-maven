import { Fragment, useState } from 'react'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import PaginatedPortfolioDisplay from './PaginatedPortfolioDisplay'
import { Link } from 'react-router-dom'
import { urls } from '@rocketmaven/data/urls'
import { Button, Divider } from 'antd'

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

const PortfolioList = () => {
  // FIX(Jude)
  // const [portfolio, setPortfolio] = useState<PortfolioPagination>()
  const [refreshFlag, setRefreshFlag] = useState(0)
  const refreshPortfolios = () => setRefreshFlag(refreshFlag + 1)
  const { data, isLoading }: PortfolioListFetchResults = useFetchGetWithUserId(
    '/portfolios',
    refreshFlag
  )
  console.log('********************** portfoliodata is ', data)

  return data ? (
    <Fragment>
      <Subtitle>
        Portfolio List
        <Button type="primary" style={{ marginLeft: '20px' }}>
          <Link to={urls.portfolio + '/create'}>New Portfolio</Link>
        </Button>
      </Subtitle>
      {/* TODO(Jude): Crudify routes */}

      <Divider>Portfolios</Divider>

      <PaginatedPortfolioDisplay portfolioPagination={data} refreshPortfolios={refreshPortfolios} />
    </Fragment>
  ) : null
}

export default PortfolioList
