import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useGetPortfolioHistory } from '@rocketmaven/hooks/http'
import { PortfolioEvent } from '@rocketmaven/pages/Portfolio/types'
import { Table } from 'antd'
import { isEmpty } from 'ramda'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

type Params = {
  id: string
  hid: string
}

const PortfolioHistory = () => {
  const { id, hid } = useParams<Params>()

  const { isLoading, data } = useGetPortfolioHistory(id)
  let historyTable = null
  if (data && !isEmpty(data)) {
    const histories: [PortfolioEvent] = data.results

    const assetHistories = histories.filter((item) => item.asset_id === hid)
    const columns = [
      {
        title: 'Type',
        dataIndex: 'add_action',
        render: (value: string) => (value ? 'Add' : 'Remove')
      },
      {
        title: 'Event ID',
        dataIndex: 'id'
      },
      {
        title: 'Ticker',
        dataIndex: 'asset_id'
      },
      {
        title: 'Date',
        dataIndex: 'event_date'
      },
      {
        title: 'Fees',
        dataIndex: 'fees'
      },
      {
        title: 'Units',
        dataIndex: 'units'
      },
      {
        title: 'Price Per Unit',
        dataIndex: 'price_per_share',
        render: (value: number) => value.toFixed(2)
      },
      {
        title: 'Note',
        dataIndex: 'note'
      }
    ]
    historyTable = <Table columns={columns} dataSource={assetHistories} rowKey="id" />
  }

  return (
    isLoading
      ? null
      :
      <Fragment>
        <Subtitle>
          Holding History for <Link to={`/asset/${hid}`}>{hid}</Link>
        </Subtitle>
        {historyTable}
      </Fragment>
  )
}

export default PortfolioHistory
