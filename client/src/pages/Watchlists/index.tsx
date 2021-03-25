import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useFetchGetWithUserId, useFetchMutationWithUserId } from '../../hooks/http' // use later. at the moment backend is not ready
import Axios from 'axios'

const url = 'http://localhost:5000/api/v1/investors/3/watch_lists'

type WatchList = { id: number; name: string; assets: Asset[] }
type Asset = {
  id: number
  ticker_symbol: string
  name: string
  current_price: number
  market_cap: number
}

const Watchlists = () => {
  const [watchlists, setWatchlists] = useState<WatchList[]>([])
  const [currentWatchlist, setCurrentWatchlist] = useState<WatchList | undefined>(undefined)
  console.log({ watchlists, currentWatchlist })

  const fetchWatchlists = async () => {
    try {
      const { data } = await Axios.get(url)
      setWatchlists(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchWatchlists()
  }, [])

  useEffect(() => {
    setCurrentWatchlist(watchlists[0])
  }, [watchlists])

  return <Table dataSource={currentWatchlist?.assets || []} columns={columns} />
}
type Column = { title: string; dataIndex: string; key: string }
const columns: Column[] = [
  { title: 'Ticker Symbol', dataIndex: 'ticker_symbol', key: 'ticker_symbol' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Current Price', dataIndex: 'current_price', key: 'current_price' },
  { title: 'Market Cap', dataIndex: 'market_cap', key: 'market_cap' }
]

export default Watchlists
