import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import PaginatedPortfolioDisplay from '@rocketmaven/pages/Portfolio/PortfolioList/PaginatedPortfolioDisplay'
import { PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import { Button } from 'antd'
import { Fragment, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

const PortfolioList = () => {
  const [refreshFlag, setRefreshFlag] = useState(0)
  const refreshPortfolios = () => setRefreshFlag(refreshFlag + 1)
  const { data, isLoading }: PortfolioListFetchResults = useFetchGetWithUserId(
    '/portfolios',
    refreshFlag
  )

  return data ? (
    <Fragment>
      <Subtitle>
        Portfolio List
        <Button type="primary" style={{ marginLeft: '20px' }}>
          <Link to={urls.portfolio + '/create'}><FaPlus /> New Portfolio</Link>
        </Button>
      </Subtitle>
      <PaginatedPortfolioDisplay portfolioPagination={data} refreshPortfolios={refreshPortfolios} />
    </Fragment>
  ) : null
}

export default PortfolioList
