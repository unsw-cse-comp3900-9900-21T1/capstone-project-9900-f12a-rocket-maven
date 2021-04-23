import { Card } from '@rocketmaven/componentsStyled/Card'
import { currencyCodeToName } from '@rocketmaven/data/currency-code-to-name'
import { Col, Row, Statistic } from 'antd'
import { isEmpty } from 'ramda'

const getColorOfValue = (value: number) => {
  return value < 0 ? 'red' : 'green'
}

const AssetTableCard = ({ data }: any) => {
  if (!data || isEmpty(data) || !data.asset.asset_additional) return null

  const asset_additional = JSON.parse(data.asset.asset_additional)

  let currencyPrefix = ''
  if (data.asset.currency && data.asset.currency in currencyCodeToName) {
    Object.entries(currencyCodeToName).forEach((keyVal) => {
      if (keyVal[0] == data.asset.currency) {
        currencyPrefix = keyVal[1]['symbol']
      }
    })
  }
  let value = [['Current Market', false, data.asset.current_price, currencyPrefix]]

  let additional = [
    ['Change', true, asset_additional.regularMarketChange, currencyPrefix],
    ['Market Cap', false, asset_additional.marketCap, currencyPrefix],
    ['Volume', false, asset_additional.regularMarketVolume],
    ['PE', false, asset_additional.trailingPE],
    ['Yield', false, asset_additional.trailingAnnualDividendRate],
    ['EPS', false, asset_additional.epsTrailingTwelveMonths]
  ]
  additional.forEach(function (e: any[]) {
    if (e[2] && e[2].fmt) {
      value.push([e[0], e[1], e[2].fmt, e[3], e[4]])
    }
  })

  return (
    <Card title={data.asset.name}>
      <Row gutter={16}>
        {value.map(function (e: any[]) {
          return (
            <Col span={6}>
              <Statistic
                suffix={e[4]}
                prefix={e[3]}
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
