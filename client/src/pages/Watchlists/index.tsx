import Page from '@rocketmaven/pages/_Page'
import { urls } from '@rocketmaven/data/urls'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Subtitle, Title } from '@rocketmaven/componentsStyled/Typography'
import {
  useFetchGetWithUserId,
  useFetchMutationWithUserId,
  useGetWatchlist
} from '@rocketmaven/hooks/http' // use later. at the moment backend is not ready
import { isEmpty } from 'ramda'
import { useHistory } from 'react-router-dom'
import { useAccessToken } from '@rocketmaven/hooks/http'

type WatchListItem = {
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

export type WatchListPagination = {
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
    routerObject.push('/')

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
    routerObject.push(urls.watchlists)
  }

  var watchlistable = null
  if (!watchlist || isEmpty(watchlist)) {
    // do nothing
  } else {
    const watchlistitems: [WatchListItem] = watchlist.results

    const columns = [
      {
        title: 'Ticker',
        dataIndex: 'ticker_symbol'
      },
      {
        title: 'Name',
        dataIndex: 'name'
      },
      {
        title: 'Price',
        dataIndex: 'current_price'
      },
      {
        title: 'Market Cap',
        dataIndex: 'market_cap'
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

  return !isEmpty(watchlistable) ? (
    <Page>
      <Title>Watchlist</Title>
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
