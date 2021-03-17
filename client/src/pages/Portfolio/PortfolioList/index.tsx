import { Fragment } from 'react'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useFetchGetWithUserId } from '../../../hooks/http'
import {  PortfolioPagination } from '../types'
import PaginatedPortfolioDisplay from './PaginatedPortfolioDisplay'
import { Link } from 'react-router-dom';
import { urls } from '../../../data/urls'
import { Button } from 'antd';

const PortfolioList = () => {
  // FIX(Jude)
  // const [portfolio, setPortfolio] = useState<PortfolioPagination>()
  const portfolioData: PortfolioPagination = useFetchGetWithUserId('/portfolios')
  console.log("********************** portfoliodata is ", portfolioData)

  return (
    portfolioData
      ?
      <Fragment>
        <Subtitle>
          Portfolio List
        </Subtitle>
        {/* TODO(Jude): Crudify routes */}
        <Button type="primary">
          <Link to={urls.portfolio + '/create'}>
          New Portfolio
          </Link>
        </Button>

        <PaginatedPortfolioDisplay portfolioPagination={portfolioData} />
      </Fragment>
      : null
  )
}

export default PortfolioList
