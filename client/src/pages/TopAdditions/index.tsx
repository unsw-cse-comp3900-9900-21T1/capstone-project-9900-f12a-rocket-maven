import Page from '@rocketmaven/pages/_Page'
import { Link } from 'react-router-dom'
import React from 'react'
import { Title, Subtitle, Text } from '@rocketmaven/componentsStyled/Typography'
import { useFetchTopAdditions } from '@rocketmaven/hooks/http'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { urls } from '@rocketmaven/data/urls'
import { Table } from 'antd'

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
    const holdingColumns = [
      {
        title: 'Ticker',
        dataIndex: 'ticker_symbol',
        render: (value: string) => (
          <Link
            to={`/asset/${value}`}
            style={{
              marginRight: '8px',
              marginBottom: '12px'
            }}
          >
            {value}
          </Link>
        )
      },
      {
        title: 'Name',
        dataIndex: 'asset_additional',
        render: (value: string) => {
          console.log(JSON.parse(value))
          const asset_additional = JSON.parse(value)
          const focus = asset_additional.longName
          if (focus) {
            return <div>{focus}</div>
          }
          return null
        }
      },
      {
        title: 'Price',
        dataIndex: 'current_price'
      },
      {
        title: 'Change',
        dataIndex: 'asset_additional',
        render: (value: string) => {
          const asset_additional = JSON.parse(value)
          const focus = asset_additional.regularMarketChange
          if (focus) {
            return <div>{focus.fmt}</div>
          }
          return null
        }
      },
      {
        title: 'Market Cap',
        dataIndex: 'asset_additional',
        render: (value: string) => {
          const asset_additional = JSON.parse(value)
          const focus = asset_additional.marketCap
          if (focus) {
            return <div>{focus.fmt}</div>
          }
          return null
        }
      },
      {
        title: '52-Week High',
        dataIndex: 'asset_additional',
        render: (value: string) => {
          const asset_additional = JSON.parse(value)
          const focus = asset_additional.fiftyTwoWeekHigh
          if (focus) {
            return <div>{focus.fmt}</div>
          }
          return null
        }
      },
      {
        title: '52-Week Low',
        dataIndex: 'asset_additional',
        render: (value: string) => {
          const asset_additional = JSON.parse(value)
          const focus = asset_additional.fiftyTwoWeekLow
          if (focus) {
            return <div>{focus.fmt}</div>
          }
          return null
        }
      },
    ]

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
    const portfolios: [PortfolioInfo]= [data.portfolio]
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
    // TODO(Jude): Double check empty cases
    content = 
      <React.Fragment>
        <Subtitle>
          Top Asset
        </Subtitle>
        <Table columns={holdingColumns} dataSource={assets} rowKey="id"  pagination={false} style={{ marginBottom: '4rem' }}/>
        <Subtitle>
          Most viewed public portfolio
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
