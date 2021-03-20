import { Fragment, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { isEmpty } from 'ramda'
import { Text } from '../../../../componentsStyled/Typography'
import { useFetchMutationWithUserId } from '../../../../hooks/http'
import { Card } from '../../../../componentsStyled/Card'
import { Row, Col } from '../../../../componentsStyled/Grid'
import { PortfolioInfo, PortfolioPagination, PortfolioHolding } from '../../types'
import { useHistory } from 'react-router-dom'
// import { PortfolioWrap } from './styled'
import { urls } from '../../../../data/urls'
import { Tooltip, Button, Divider, Table } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';
import { useAccessToken } from '../../../../hooks/http'


type Props = {
  portfolioPagination: PortfolioPagination
}


const PaginatedPortfolioDisplay = ({ portfolioPagination }: Props) => {


  const routerObject = useHistory()
  const { accessToken, revalidateAccessToken } = useAccessToken()
  /* (portfolio_id: string, asset_id: string) */
  async function useDeleteAssetPortfolioHolding(e: any) {
    // Double check that the password reset works in the browser we're going to demo it in
    // Briefly read that URLSearchParams may not have extensive support
    const asset_id = e.target.getAttribute("title")
    const portfolio_id = e.target.getAttribute("aria-valuenow")
    routerObject.push('/')
    
      const response = await fetch(`/api/v1/portfolios/${portfolio_id}/holdings`, {
        method: 'DELETE',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({"asset_id": asset_id})
      })
      const data = await response.json()
      if (!response.ok) {
        throw Error(`${data.msg}`)
      } 
      routerObject.push('/')
  }

  
  if (!portfolioPagination || isEmpty(portfolioPagination)) {
    return null
  }


  const numberChangeRenderer = (testVal: string, record: any) => {
    const text = parseFloat(testVal).toFixed(2)
    return {
      props: {
        style: { color: (parseFloat(testVal) < 0) ? "red" : "green" }
      },
      children: <span>{text}</span>
    };
  }


  // FIX(Jude): portolio becomes undefined and errors out
  // looks like the trigger is the token expiring
  // I would've thought the above if statement would've taken care of it
  const portfolios: [PortfolioInfo] = portfolioPagination.results
  return (
    <Fragment>
      {
        portfolios.map((portfolio, index) => {



          const columns = [
            { title: "Ticker Symbol", dataIndex: "asset_id" },
            { title: "Available Units", dataIndex: "available_units", render: (value: number) => (value.toFixed(2)), },
            { title: "Avg. Purchase Price", dataIndex: "average_price", render: (value: number) => (value.toFixed(2)), },
            { title: "Current Market Price", dataIndex: "market_price", render: (value: number) => (value.toFixed(2)), },
            /* { title: "Portfolio Id", dataIndex: "portfolio_id"}, */
            { title: "Current Value", dataIndex: "current_value", render: (value: number) => (value.toFixed(2)), },
            /* Single portfolio view? */
            /* { title: "Purchase Value", dataIndex: "purchase_value", render:  (value: number) => (value.toFixed(2)),}, */
            /* { title: "Last Updated", dataIndex: "last_updated"}, */
            /* Single portfolio view? */
            /* { title: "Realised Total", dataIndex: "realised_total", render:  (value: number) => (value.toFixed(2)),}, */
            { title: "Unrealised Profit/Loss", dataIndex: "unrealised_units", render: numberChangeRenderer, },
            { title: "Latest Note", dataIndex: "latest_note" },/* https://ant.design/components/table/ */
            {
              title: 'Action',
              dataIndex: 'asset_id',
              key: 'x',
              render: (value: string) => <a title={value} aria-valuenow={portfolio.id} onClick={useDeleteAssetPortfolioHolding}>Delete</a>,
            }]

          const valueColumns = [
            { title: "Purchase Cost", dataIndex: "Purchase Cost" },
            { title: "Current Market", dataIndex: "Current Market" },
            { title: "Unrealised (Market - Purchase)", dataIndex: "Unrealised", render: numberChangeRenderer, },
            { title: "Realised (Sold Value)", dataIndex: "Realised (Sold Value)", render: numberChangeRenderer, },
          ]

          const value = [{
            "Current Market": portfolio.current_value_sum.toFixed(2),
            "Purchase Cost": portfolio.purchase_value_sum.toFixed(2),
            "Unrealised": (portfolio.current_value_sum - portfolio.purchase_value_sum).toFixed(2),
            "Realised (Sold Value)": portfolio.realised_sum.toFixed(2),
          }]


          return <Card
            title={portfolio.name}
            actions={[
              <Tooltip placement="topLeft" title="Add New Event" arrowPointAtCenter>
                <Link to={urls.portfolio + `/${portfolio.id}/addremove`}>
                  <EditOutlined key="edit" />
                </Link>
              </Tooltip>,

              <Tooltip placement="topLeft" title="Edit Portfolio Settings" arrowPointAtCenter>
                <Link to={urls.portfolio + `/${portfolio.id}/edit`}>
                  <SettingOutlined key="setting" />
                </Link>
              </Tooltip>,

              <Tooltip placement="topLeft" title="Portfolio Event History" arrowPointAtCenter>
                <Link to={urls.portfolio + `/${portfolio.id}/history`}>
                  <EyeOutlined key="ellipsis" />
                </Link>
              </Tooltip>,
            ]}
          >
            <Row>
              <Col>
                Type:
              </Col>
              <Col>
                {portfolio.competition_portfolio ? "Competition Portfolio" : "Regular Portfolio"}
              </Col>
            </Row>
            {portfolio.competition_portfolio ?

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


            <Divider>Value Summary</Divider>

            <Table columns={valueColumns} dataSource={value} pagination={false} rowKey="id" />

            <Divider>Holdings</Divider>

            <Table columns={columns} dataSource={portfolio.portfolio_asset_holding.filter(portfolio_asset_holding => portfolio_asset_holding.available_units > 0)} rowKey="id" />


          </Card>
        }
        )
      }
    </Fragment>
  )
}

export default PaginatedPortfolioDisplay
