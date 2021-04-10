import { Subtitle, Text, Title } from '@rocketmaven/componentsStyled/Typography'
import { assetColumns } from '@rocketmaven/data/tableDefinitions/assets'
import { urls } from '@rocketmaven/data/urls'
import { useFetchTopAdditions } from '@rocketmaven/hooks/http'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import Page from '@rocketmaven/pages/_Page'
import { Table } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

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
    const investorRenderer = (testVal: any, record: any) => {
      console.log(testVal)
      let username = testVal.username
      if (testVal.first_name) {
        username = testVal.first_name
        if (testVal.last_name) {
          username += ' ' + testVal.last_name
        }
      }
      return {
        children: <span>{username}</span>
      }
    }

    const numberChangeRenderer = (testVal: string, record: any) => {
      const text = parseFloat(testVal).toFixed(2)
      return {
        props: {
          style: { color: parseFloat(testVal) < 0 ? 'red' : 'green' }
        },
        children: <span>{text}</span>
      }
    }

    const portfolioLinkRenderer = (testVal: string, record: any) => {
      if (testVal) {
        return <Link to={urls.portfolio + '/' + testVal}>View Portfolio</Link>
      }
      return <Text>Private Portfolio</Text>
    }

    const portfolioColumns = [
      {
        title: 'Investor',
        dataIndex: 'Investor',
        render: investorRenderer
      },
      { title: 'Buying Power', dataIndex: 'Buying Power' },
      { title: 'Purchase Cost', dataIndex: 'Purchase Cost' },
      { title: 'Current Market', dataIndex: 'Current Market' },
      {
        title: 'Unrealised (Market - Purchase)',
        dataIndex: 'Unrealised',
        render: numberChangeRenderer
      },
      {
        title: 'Realised (Sold Value)',
        dataIndex: 'Realised (Sold Value)',
        render: numberChangeRenderer
      },
      {
        title: 'Explore',
        dataIndex: 'View Portfolio',
        render: portfolioLinkRenderer
      }
    ]

    const datas: any = []
    const portfolios: [PortfolioInfo] = [data.portfolio]
    portfolios.forEach((portfolio, index) => {
      datas.push({
        Investor: portfolio.investor,
        'Buying Power': portfolio.buying_power.toFixed(2),
        'Current Market': portfolio.current_value_sum.toFixed(2),
        'Purchase Cost': portfolio.purchase_value_sum.toFixed(2),
        Unrealised: portfolio.current_value_sum - portfolio.purchase_value_sum,
        'Realised (Sold Value)': portfolio.realised_sum,
        'View Portfolio': portfolio.public_portfolio ? portfolio.id : 0
      })
    })

    // TODO(Jude)?: adjust query to add top 5 of most viewed public portfolios and holdings
    // TODO(Jude): Double check if the top holding is shown
    // TODO(Jude): Add error handling for empty cases ( there shouldn't be any though )
    content =
      <React.Fragment>
        <Subtitle>
          Top Asset
        </Subtitle>
        <Table columns={assetColumns} dataSource={assets} rowKey="id" pagination={false} style={{ marginBottom: '4rem' }} />
        <Subtitle>
          Most viewed portfolio
        </Subtitle>
        <Table columns={portfolioColumns} dataSource={datas} rowKey="id" pagination={false} />
      </React.Fragment>

  }

  return (
    <Page>
      <Title>
        Top Additions
      </Title>
      {
        isLoading
          ? null
          : content
      }
    </Page>
  )
}

export default TopAdditions
