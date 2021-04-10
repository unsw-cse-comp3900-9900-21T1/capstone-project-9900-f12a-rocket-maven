import AssetSearchBox from '@rocketmaven/components/AssetSearchBox'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { useAccessToken, useGetWatchlist } from '@rocketmaven/hooks/http' // use later. at the moment backend is not ready
import Page from '@rocketmaven/pages/_Page'
import { Button, Form, Table } from 'antd'
import { isEmpty } from 'ramda'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

type AssetInfo = {
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
  price_high: number
  price_low: number
}

type WatchListItem = {
  price_high: number
  price_low: number
  asset: AssetInfo
}

type WatchListPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [WatchListItem]
}

const Watchlists = () => {
  // Avoid call when isCreate is true
  const watchlist: WatchListPagination = useGetWatchlist()

  const routerObject = useHistory()
  const { accessToken, revalidateAccessToken } = useAccessToken()

  async function useDeleteWatchlist(e: any) {
    const asset_id = e.target.getAttribute('title')

    const response = await fetch(`/api/v1/watchlist/${asset_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ asset_id: asset_id })
    })
    const data = await response.json()
    if (!response.ok) {
      throw Error(`${data.msg}`)
    }
    routerObject.go(0)
  }

  let watchlistable = null
  if (!watchlist || isEmpty(watchlist)) {
    // do nothing
  } else {
    const watchlistresults: [WatchListItem] = watchlist.results
    let watchlistitems: AssetInfo[] = []

    watchlistresults.forEach(function (e) {
      e.asset.price_high = e.price_high
      e.asset.price_low = e.price_low
      watchlistitems.push(e.asset)
    })

    const columns = [
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
      {
        title: 'Notify High',
        dataIndex: 'price_high'
      },
      {
        title: 'Notify Low',
        dataIndex: 'price_low'
      },
      {
        title: 'Delete',
        dataIndex: 'ticker_symbol',
        key: 'x',
        render: (value: string) => (
          <a title={value} onClick={useDeleteWatchlist}>
            Delete
          </a>
        )
      }
    ]
    watchlistable = <Table columns={columns} dataSource={watchlistitems} rowKey="id" />
  }
  const onFinish = async (values: any) => {
    const response = await fetch(`/api/v1/watchlist/${values.asset_id.value}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    const data = await response.json()
    if (!response.ok) {
      throw Error(`${data.msg}`)
    }
    routerObject.go(0)
  }

  return !isEmpty(watchlistable) ? (
    <Page>
      <Title>Watchlist</Title>

      <Card title="Add to Watchlist">
        <Form onFinish={onFinish}>
          <Form.Item
            name="asset_id"
            label="Ticker (EXCHANGE:SYMBOL)"
            rules={[
              {
                required: true,
                message: 'Please input a ticker!'
              }
            ]}
          >
            <AssetSearchBox showSearch style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginRight: '8px',
                marginBottom: '12px'
              }}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {watchlistable}
    </Page>
  ) : null
}
type Column = { title: string; dataIndex: string; key: string }
const columns: Column[] = [
  { title: 'Ticker Symbol', dataIndex: 'ticker_symbol', key: 'ticker_symbol' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Current Price', dataIndex: 'current_price', key: 'current_price' },
  { title: 'Market Cap', dataIndex: 'market_cap', key: 'market_cap' }
]

export default Watchlists
