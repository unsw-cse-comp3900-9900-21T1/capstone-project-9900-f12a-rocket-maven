import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import { isEmpty } from 'ramda'
import { Text } from '../../../../componentsStyled/Typography'
import { Row, Col } from '../../../../componentsStyled/Grid'
import { PortfolioInfo, PortfolioPagination, PortfolioHolding } from '../../types'
// import { PortfolioWrap } from './styled'
import { urls } from '../../../../data/urls'
import { Tooltip, Button, Card, Divider, Table } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';


type Props = {
  portfolioPagination: PortfolioPagination
}

const PaginatedPortfolioDisplay = ({portfolioPagination}: Props) => {
  if (!portfolioPagination || isEmpty(portfolioPagination)) {
    return null
  }
  
    
    const columns = [
{ title: "Ticker Symbol", dataIndex: "asset_id"},
{ title: "Available Units", dataIndex: "available_units", render:  (value: number) => (value.toFixed(2)),},
/* { title: "Portfolio Id", dataIndex: "portfolio_id"}, */
{ title: "Purchase Value", dataIndex: "purchase_value", render:  (value: number) => (value.toFixed(2)),},
{ title: "Current Value", dataIndex: "current_value", render:  (value: number) => (value.toFixed(2)),},
/* { title: "Last Updated", dataIndex: "last_updated"}, */
{ title: "Average Price", dataIndex: "average_price", render:  (value: number) => (value.toFixed(2)),},
{ title: "Market Price", dataIndex: "market_price", render:  (value: number) => (value.toFixed(2)),},
{ title: "Realised Total", dataIndex: "realised_total", render:  (value: number) => (value.toFixed(2)),},
{ title: "Unrealised Units", dataIndex: "unrealised_units", render:  (value: number) => (value.toFixed(2)),},
{ title: "Latest Note", dataIndex: "latest_note"},
    ];
      
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
      width: 600,
    float: "left",
    /* display: "inline-block", */  
    margin: "20px",
    }}
    actions={[
    
    
      <Tooltip placement="topLeft" title="Add New Event" arrowPointAtCenter>
      <Link to={urls.portfolio + `/${portfolio.id}/addremove`}>
      <EditOutlined key="edit" />
      </Link>
      </Tooltip>
      
      ,
      
      
      <Tooltip placement="topLeft" title="Edit Portfolio Settings" arrowPointAtCenter>
      <Link to={urls.portfolio + `/${portfolio.id}/edit`}>
      <SettingOutlined key="setting" />
      </Link>
      </Tooltip>
      
      ,
      <Tooltip placement="topLeft" title="Portfolio Event History" arrowPointAtCenter>
      <Link to={urls.portfolio + `/${portfolio.id}/history`}>
      <EyeOutlined key="ellipsis" />
      </Link>
      </Tooltip>
      ,
    ]}>
            <Row>
              <Col>
                Type:
              </Col>
              <Col>
                {portfolio.competition_portfolio? "Competition Portfolio":"Regular Portfolio"}
              </Col>
            </Row>
            {portfolio.competition_portfolio?
            
            <Row>
              <Col>
                Buying Power:
              </Col>
              <Col>
                {portfolio.buying_power}
              </Col>
            </Row>
            : null
            
            }
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
            
            
             <Divider>Aggregation</Divider>
            
            <Row>
              <Col>
                Current Value
              </Col>
              <Col>
                {portfolio.current_value_sum.toFixed(2)}
              </Col>
            </Row>
            <Row>
              <Col>
                Purchase Value
              </Col>
              <Col>
                {portfolio.purchase_value_sum.toFixed(2)}
              </Col>
            </Row>
            
            <Row>
              <Col>
                Unrealised Value
              </Col>
              <Col>
                {(portfolio.purchase_value_sum - portfolio.current_value_sum).toFixed(2)}
              </Col>
            </Row>

            <Row>
              <Col>
                Realised Value
              </Col>
              <Col>
                {portfolio.realised_sum.toFixed(2)}
              </Col>
            </Row>
            
             <Divider>Holdings</Divider>
        
            <Table columns={columns} dataSource={portfolio.portfolio_asset_holding} rowKey="id"  />
      
      
          </Card>
        )
      }
    </Fragment>
  )
}

export default PaginatedPortfolioDisplay