import { Subtitle, Title } from '@rocketmaven/componentsStyled/Typography'
import { currencyCodeToName } from '@rocketmaven/data/currency-code-to-name'
import { useFetchTopAdditions } from '@rocketmaven/hooks/http'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import Page from '@rocketmaven/pages/_Page'
import { Table } from 'antd'
import React from 'react'
import { assetColumns, portfolioColumns } from './tableDefinitions'

type Asset = {
  industry: string
  price_last_updated: Date
  asset_additional: string
  current_price: number
  currency: string
  market_cap: number
  ticker_symbol: string
  name: string
  country: string
  data_source: string
}

const TopAdditions = () => {
  const { data, isLoading } = useFetchTopAdditions()

  let content = null

  if (!isLoading) {
    const assets: [Asset] = [data.asset]

    const datas: any = []
    const portfolios: [PortfolioInfo] = [data.portfolio]
    portfolios.forEach((portfolio, index) => {
      if (portfolio) {
        let currencyPrefix = ''
        if (portfolio.currency && portfolio.currency in currencyCodeToName) {
          Object.entries(currencyCodeToName).forEach((keyVal) => {
            if (keyVal[0] == portfolio.currency) {
              currencyPrefix = keyVal[1]['symbol']
            }
          })
        }

        datas.push({
          Investor: portfolio.investor,
          'Buying Power': currencyPrefix + portfolio.buying_power.toFixed(2),
          'Current Market': currencyPrefix + portfolio.current_value_sum.toFixed(2),
          'Purchase Cost': currencyPrefix + portfolio.purchase_value_sum.toFixed(2),
          Unrealised:
            currencyPrefix +
            (portfolio.current_value_sum - portfolio.purchase_value_sum).toString(),
          Realised: (currencyPrefix + portfolio.realised_sum).toString(),
          'View Portfolio': portfolio.public_portfolio ? portfolio.id : 0
        })
      }
    })

    content = (
      <React.Fragment>
        <Subtitle>Top Asset</Subtitle>
        <Table
          columns={assetColumns}
          dataSource={assets}
          rowKey="id"
          pagination={false}
          style={{ marginBottom: '4rem' }}
        />
        <Subtitle>Most Viewed Portfolio</Subtitle>
        <Table columns={portfolioColumns} dataSource={datas} rowKey="id" pagination={false} />
      </React.Fragment>
    )
  }

  return (
    <Page>
      <Title>Top Additions</Title>
      {isLoading ? null : content}
    </Page>
  )
}

export default TopAdditions
