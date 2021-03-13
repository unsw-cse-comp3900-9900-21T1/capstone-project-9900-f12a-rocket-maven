import { Fragment, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import Page from '../../_Page'
import { Subtitle, Title } from '../../../componentsStyled/Typography'
import { useFetchGetWithUserId } from '../../../hooks/http'
import { PortfolioInfo, PortfolioPagination } from '../types'
import PaginatedPortfolioDisplay from './PaginatedPortfolioDisplay'
import { Link } from 'react-router-dom';
import { urls } from '../../../data/urls'


const PortfolioList = () => {
  // FIX(Jude)
  // const [portfolio, setPortfolio] = useState<PortfolioPagination>()
  const portfolioData: PortfolioPagination = useFetchGetWithUserId('/portfolios')

  // Issue - portfolio being set causes infinite render
  // if (portfolioData) {
  //   setPortfolio(portfolioData)
  //   console.log("************************ setPortfolio breaks stuff")
  // }
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
          Add portfolio
        </Link>
        <PaginatedPortfolioDisplay portfolioPagination={portfolioData}/>
      </Fragment>
    : null
  )
}

export default PortfolioList
