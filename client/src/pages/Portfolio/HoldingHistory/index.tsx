import { Fragment } from 'react'
import { isEmpty } from 'ramda'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useParams, Link } from 'react-router-dom'
import { useGetPortfolioHistory } from '@rocketmaven/hooks/http'
import { PortfolioEvent, PortfolioEventPagination } from '@rocketmaven/pages/Portfolio/types'
import { Table } from 'antd'

type Params = {
  id: string
  hid: string
}

const PortfolioHistory = () => {
  const { id, hid } = useParams<Params>()

  console.log({ id, hid })

  // Might have to just make a PortfolioCreate component
  const portfolioHistory: PortfolioEventPagination = useGetPortfolioHistory(id)
  let historyTable = null
  if (!portfolioHistory || isEmpty(portfolioHistory)) {
    // do nothing
  } else {
    const histories: [PortfolioEvent] = portfolioHistory.results

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

  // TODO(Jude)
  return !isEmpty(portfolioHistory) ? (
    <Fragment>
      <Subtitle>
        Holding History for <Link to={`/asset/${hid}`}>{hid}</Link>
      </Subtitle>
      {historyTable}
    </Fragment>
  ) : null
}

export default PortfolioHistory
