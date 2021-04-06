import { Fragment } from 'react'
import { isEmpty } from 'ramda'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useParams, Link } from 'react-router-dom'
import { useGetPortfolioHistory } from '@rocketmaven/hooks/http'
import { PortfolioEvent, PortfolioEventPagination } from '@rocketmaven/pages/Portfolio/types'
import { urls } from '@rocketmaven/data/urls'
import { Table, Tooltip, Button } from 'antd'

type Params = {
  id: string
}

const PortfolioHistory = () => {
  const { id } = useParams<Params>()

  // Avoid call when isCreate is true
  // Might have to just make a PortfolioCreate component
  const portfolioHistory: PortfolioEventPagination = useGetPortfolioHistory(id)
  var historyTable = null
  if (!portfolioHistory || isEmpty(portfolioHistory)) {
  } else {
    const histories: [PortfolioEvent] = portfolioHistory.results

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
        dataIndex: 'asset_id',
        render: (value: string) => (
          <span>
            <Tooltip
              placement="topLeft"
              title={`View ${value} details and graph`}
              arrowPointAtCenter
            >
              <Link
                to={`/asset/${value}`}
                style={{
                  marginRight: '8px',
                  marginBottom: '12px'
                }}
              >
                {value}
              </Link>
            </Tooltip>

            <Tooltip
              placement="topLeft"
              title={`Filter holding history by ${value}`}
              arrowPointAtCenter
            >
              <Button
                type="primary"
                style={{
                  marginRight: '8px',
                  marginBottom: '12px',
                  float: 'right'
                }}
              >
                <Link to={`/portfolio/${id}/holdings/${value}`}>Filter</Link>
              </Button>
            </Tooltip>
          </span>
        )
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
    historyTable = <Table columns={columns} dataSource={histories} rowKey="id" />
  }

  // TODO(Jude)
  return !isEmpty(portfolioHistory) ? (
    <Fragment>
      <Subtitle>Portfolio History</Subtitle>
      {historyTable}
    </Fragment>
  ) : null
}

export default PortfolioHistory
