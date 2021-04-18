import { Card } from '@rocketmaven/componentsStyled/Card'
import { Col, Row, Statistic } from 'antd'
import { isEmpty } from 'ramda'

const getColorOfValue = (value: number) => {
  return value < 0 ? 'red' : 'green'
}

const AssetTableCard = ({ data }: any) => {
  if (!data || isEmpty(data) || !data.asset.asset_additional)
    return null

  const asset_additional = JSON.parse(data.asset.asset_additional)

  let value = [['Current Market', false, data.asset.current_price]]

  let additional = [
    ['Change', true, asset_additional.regularMarketChange],
    ['Market Cap', false, asset_additional.marketCap],
    ['Volume', false, asset_additional.regularMarketVolume],
    ['PE', false, asset_additional.trailingPE],
    ['Yield', false, asset_additional.trailingAnnualDividendRate],
    ['EPS', false, asset_additional.epsTrailingTwelveMonths]
  ]
  additional.forEach(function (e: any[]) {
    if (e[2] && e[2].fmt) {
      value.push([e[0], e[1], e[2].fmt])
    }
  })

  return (
    <Card title={data.asset.name}>
      <Row gutter={16}>
        {value.map(function (e: any[]) {
          return (
            <Col span={6}>
              <Statistic
                title={e[0]}
                value={e[2]}
                precision={2}
                valueStyle={{
                  color: e[1] ? getColorOfValue(e[2]) : 'initial'
                }}
              />
            </Col>
          )
        })}
      </Row>
    </Card>
  )
}

export default AssetTableCard
