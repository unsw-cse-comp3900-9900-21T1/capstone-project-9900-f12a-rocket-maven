import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useFetchGetWithUserId, useFetchMutationWithUserId } from '../../hooks/http' // use later. at the moment backend is not ready
import Axios from 'axios'

const url = 'http://localhost:5000/api/v1/investors/3/watch_lists'

type WatchList = {
  current_price: number
  id: number
  market_cap: number
  name: string
  ticker_symbol: string
}

const Watchlists = () => {
  const [watchlists, setWatchlists] = useState<WatchList[]>([])
  const [currentWatchlist, setCurrentWatchlist] = useState<WatchList | undefined>(undefined)

  const fetchWatchlists = async () => {
    try {
      const { data } = await Axios.get(url)
      setWatchlists(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    console.log('hello page')

    fetchWatchlists()
  }, [])
  return <Table dataSource={watchlists} columns={columns} />
}
type Column = { title: string; dataIndex: string; key: string }
const columns: Column[] = [
  { title: 'current_price', dataIndex: 'current_price', key: 'current_price' },
  { title: 'id', dataIndex: 'id', key: 'id' },
  { title: 'market_cap', dataIndex: 'market_cap', key: 'market_cap' },
  { title: 'name', dataIndex: 'name', key: 'name' },
  { title: 'ticker_symbol', dataIndex: 'ticker_symbol', key: 'ticker_symbol' }
]

export default Watchlists
