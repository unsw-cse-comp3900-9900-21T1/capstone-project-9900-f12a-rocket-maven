import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useGetPortfolioHistory } from '@rocketmaven/hooks/http'
import { PortfolioEvent } from '@rocketmaven/pages/Portfolio/types'
import { Button, Table, Tooltip } from 'antd'
import { isEmpty } from 'ramda'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

type Params = {
  id: string
}

const PortfolioHistory = () => {
  const { id } = useParams<Params>()

  const { isLoading, data } = useGetPortfolioHistory(id)
  let historyTable = null
  if (data && !isEmpty(data)) {
    const histories: [PortfolioEvent] = data.results

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
        dataIndex: 'event_date',
        render: (value: string) => <>{value} UTC</>
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

  return isLoading ? null : (
    <Fragment>
      <Subtitle>Portfolio History</Subtitle>
      {historyTable}
    </Fragment>
  )
}

export default PortfolioHistory
