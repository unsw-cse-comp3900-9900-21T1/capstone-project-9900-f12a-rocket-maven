import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import { isEmpty } from 'ramda'
import { Text } from '../../../../componentsStyled/Typography'
import { Row, Col } from '../../../../componentsStyled/Grid'
import { PortfolioInfo, PortfolioPagination } from '../../types'
// import { PortfolioWrap } from './styled'
import { urls } from '../../../../data/urls'
import { Card } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';


type Props = {
  portfolioPagination: PortfolioPagination
}

const PaginatedPortfolioDisplay = ({portfolioPagination}: Props) => {
  if (!portfolioPagination || isEmpty(portfolioPagination)) {
    return null
  }
  // FIX(Jude): portolio becomes undefined and errors out
  // looks like the trigger is the token expiring
  // I would've thought the above if statement would've taken care of it
  const portfolios:[PortfolioInfo] = portfolioPagination.results
  return (
    <Fragment>
      {
        portfolios.map((portfolio, index) => 
          <Card title={portfolio.name}  style={{
      marginTop:"20px",
      width: 600
    }}
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EyeOutlined key="ellipsis" />,
    ]}>
            <Row>
              <Col>
                Buying Power
              </Col>
              <Col>
                {portfolio.buying_power}
              </Col>
            </Row>
            <Row>
              <Col>
                Competition Portfolio
              </Col>
              <Col>
                {portfolio.competition_portfolio}
              </Col>
            </Row>
            <Row>
              <Col>
                Description:
              </Col>
              <Col>
                {portfolio.description}
              </Col>
            </Row>
            <Row>
              <Col>
                Created at:
              </Col>
              <Col>
                {portfolio.creation_date}
              </Col>
            </Row>
            <Row>
              <Col>
                Tax Residency:
              </Col>
              <Col>
               {portfolio.tax_residency}
              </Col>
            </Row>
            <Row>
              <Col>
                Visibility:
              </Col>
              <Col>
                {portfolio.visibility ? 'Public' : 'Private'}
              </Col>
            </Row>
            <Row>
              <Link to={urls.portfolio + `/${portfolio.id}/edit`}>
                Edit Portfolio
              </Link>
            </Row>
            <Row>
              <Link to={urls.portfolio + `/${portfolio.id}/history`}>
                Portfolio History
              </Link>
            </Row>
            <Row>
              <Link to={urls.portfolio + `/${portfolio.id}/holdings`}>
                Holdings
              </Link>
            </Row>
          </Card>
        )
      }
    </Fragment>
  )
}

export default PaginatedPortfolioDisplay