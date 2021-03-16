import { Fragment } from 'react'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useFetchGetWithUserId } from '../../../hooks/http'
import {  PortfolioPagination } from '../types'
import PaginatedPortfolioDisplay from './PaginatedPortfolioDisplay'
import { Link } from 'react-router-dom';
import { urls } from '../../../data/urls'


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
        <Link to={urls.portfolio + '/create'}>
          Add Portfolio
        </Link>
        <PaginatedPortfolioDisplay portfolioPagination={portfolioData} />
      </Fragment>
      : null
  )
}

export default PortfolioList
