import { Link } from 'react-router-dom';
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Tooltip, Button, Divider, Table } from 'antd';
import { EditOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';
import { Row, Col } from '@rocketmaven/componentsStyled/Grid'
import { urls } from '@rocketmaven/data/urls'
import { Card } from '@rocketmaven/componentsStyled/Card'

type Props = {
  portfolio: PortfolioInfo
}

export const PortfolioCard = ({portfolio}: Props) => {
  if (!portfolio) {
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
    ]

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
  return (
    <Card
      title={portfolio.name}
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
          Belongs to:
        </Col>
        <Col>
          Replace with username and put somewhere better
        </Col>
      </Row>
      <Row>
        <Col>
          Visibility(to remove)
        </Col>
        <Col>
          {portfolio.public_portfolio ? 'Public' : 'Private'}
        </Col>
      </Row>

      <Divider>Value Summary</Divider>

      <Table columns={valueColumns} dataSource={value} pagination={false} rowKey="id" />

      <Divider>Holdings</Divider>

      <Table columns={columns} dataSource={portfolio.portfolio_asset_holding.filter(portfolio_asset_holding => portfolio_asset_holding.available_units > 0)} rowKey="id" />
    </Card>
  )
}

export default PortfolioCard