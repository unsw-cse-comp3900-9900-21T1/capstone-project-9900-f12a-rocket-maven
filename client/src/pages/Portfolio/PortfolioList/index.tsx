import { Fragment } from 'react'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useFetchGetWithUserId } from '../../../hooks/http'
import {  PortfolioPagination } from '../types'
import PaginatedPortfolioDisplay from './PaginatedPortfolioDisplay'
import { Link } from 'react-router-dom';
import { urls } from '../../../data/urls'
import { Button, Divider } from 'antd';

type PortfolioListFetchResults = {
  data: PortfolioPagination,
  isLoading: boolean,

}

const PortfolioList = () => {
  // FIX(Jude)
  // const [portfolio, setPortfolio] = useState<PortfolioPagination>()
  const { data, isLoading }: PortfolioListFetchResults = useFetchGetWithUserId('/portfolios')
  console.log("********************** portfoliodata is ", data)

  return (
    data
      ?
      <Fragment>
        <Subtitle>
          Portfolio List
          <Button type="primary" style={{marginLeft: "20px"}}>
            <Link to={urls.portfolio + '/create'}>
            New Portfolio
            </Link>
          </Button>
        </Subtitle>
        {/* TODO(Jude): Crudify routes */}

        <Divider>Portfolios</Divider>
  

        <PaginatedPortfolioDisplay portfolioPagination={data} />
      </Fragment>
      : null
  )
}

export default PortfolioList
