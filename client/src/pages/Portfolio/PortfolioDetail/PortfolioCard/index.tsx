import { Card } from '@rocketmaven/componentsStyled/Card'
import { Col, Row } from '@rocketmaven/componentsStyled/Grid'
import { PublicPortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Divider, Table } from 'antd'
import { columns, valueColumns } from './tableDefinitions'

type Props = {
  portfolio: PublicPortfolioInfo
}

// Fix(Jude): Add the portfolio card here
export const PortfolioCard = ({ portfolio }: Props) => {
  if (!portfolio) {
    return null
  }

  const value = [
    {
      'Current Market': portfolio.current_value_sum.toFixed(2),
      'Purchase Cost': portfolio.purchase_value_sum.toFixed(2),
      Unrealised: (portfolio.current_value_sum - portfolio.purchase_value_sum).toFixed(2),
      Realised: portfolio.realised_sum.toFixed(2)
    }
  ]
  return (
    <Card title={portfolio.name} style={{ width: '90%', overflowX: 'auto' }}>
      <Row>
        <Col>Owner:</Col>
        <Col>{portfolio.investor.username}</Col>
      </Row>
      <Row>
        <Col>Type:</Col>
        <Col>{portfolio.competition_portfolio ? 'Competition Portfolio' : 'Regular Portfolio'}</Col>
      </Row>
      {portfolio.competition_portfolio ? (
        <Row>
          <Col>Buying Power:</Col>
          <Col>{portfolio.buying_power}</Col>
        </Row>
      ) : null}
      <Row>
        <Col>Created:</Col>
        <Col>{portfolio.creation_date.substring(0, 10)}</Col>
      </Row>
      <Row>
        <Col>Tax Residency:</Col>
        <Col>{portfolio.tax_residency}</Col>
      </Row>
      {portfolio.description && (
        <Row>
          <Col>Description:</Col>
          <Col>{portfolio.description}</Col>
        </Row>
      )}
      <Divider>Value Summary</Divider>

      <Table columns={valueColumns} dataSource={value} pagination={false} rowKey="id" />

      <Divider>Holdings</Divider>

      <Table
        columns={columns}
        dataSource={portfolio.portfolio_asset_holding.filter(
          (portfolio_asset_holding) => portfolio_asset_holding.available_units > 0
        )}
        rowKey="id"
      />
    </Card>
  )
}

export default PortfolioCard
